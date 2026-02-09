import argparse
import os
import glob
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torch.cuda.amp import GradScaler, autocast
import albumentations as A
from models_factory import create_model
from tqdm import tqdm

# --- Dataset Definition ---
class DeepfakeDataset(Dataset):
    def __init__(self, record_list_file=None, record_list=None, transform=None):
        if record_list_file:
            with open(record_list_file, 'r') as f:
                self.record_paths = [line.strip() for line in f.readlines() if line.strip()]
        elif record_list:
             self.record_paths = record_list
        else:
             self.record_paths = []
             
        self.transform = transform
        
    def __len__(self):
        return len(self.record_paths)
    
    def __getitem__(self, idx):
        path = self.record_paths[idx]
        
        # Load Face
        try:
            face = np.load(os.path.join(path, 'face.npy'))
        except:
            face = np.zeros((256, 256, 3), dtype=np.uint8)
            
        # Load SRM
        try:
            srm = np.load(os.path.join(path, 'srm.npy'))
        except:
            srm = np.zeros((256, 256, 3), dtype=np.float32)

        # Label Logic
        # Path example: .../data/processed/real/123 or .../data/processed/fake/456
        # Check if 'fake' is in path component
        if 'fake' in path.lower().replace(os.sep, '/').split('/'):
            label = 1.0
        else:
            label = 0.0
        
        if self.transform:
            augmented = self.transform(image=face)
            face = augmented['image']
            
        # To Tensor (H, W, C) -> (C, H, W)
        face_t = torch.tensor(face).permute(2, 0, 1).float() / 255.0
        srm_t = torch.tensor(srm).permute(2, 0, 1).float()
        
        return {
            'rgb': face_t,
            'srm': srm_t,
            'label': torch.tensor(label).float()
        }

def get_transforms():
    return A.Compose([
        A.HorizontalFlip(p=0.5),
        A.GaussNoise(p=0.2),
        A.ImageCompression(quality_lower=60, quality_upper=100, p=0.3),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])

def train(args):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    
    # 1. Config
    config = {'model_name': args.model, 'device': device}
    
    # 2. Model
    model = create_model(config).to(device)
    
    # 3. Data
    # 3. Data
    processed_p = r'C:\deepfake\data'
    train_list = os.path.join(processed_p, 'train_list.txt')
    val_list = os.path.join(processed_p, 'val_list.txt')
    
    if not os.path.exists(train_list) or not os.path.exists(val_list):
        print("Error: train_list.txt or val_list.txt not found. Please run src/split_data.py first.")
        return

    train_dataset = DeepfakeDataset(record_list_file=train_list, transform=get_transforms())
    val_dataset = DeepfakeDataset(record_list_file=val_list, transform=None) # No aug for val
    
    loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=0)

    print(f"Starting training for {args.model}...")
    print(f"Train samples: {len(train_dataset)}")
    print(f"Val samples:   {len(val_dataset)}")
    
    # 4. Optimization
    criterion = nn.BCEWithLogitsLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr)
    scaler = GradScaler()
    
    print(f"Starting training for {args.model} on {len(train_dataset)} records...")
    
    for epoch in range(args.epochs):
        model.train()
        epoch_loss = 0
        all_preds = []
        all_labels = []
        pbar = tqdm(loader, desc=f"Epoch {epoch+1}/{args.epochs}")
        
        for batch in pbar:
            rgb = batch['rgb'].to(device)
            srm = batch['srm'].to(device)
            labels = batch['label'].unsqueeze(1).to(device)
            
            optimizer.zero_grad()
            
            with autocast():
                if args.model == 'hybrid_forensic':
                    outputs = model(rgb, x_srm=srm)
                else:
                    outputs = model(rgb)
                    
                loss = criterion(outputs, labels)
            
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
            
            epoch_loss += loss.item()
            pbar.set_postfix({'loss': loss.item()})
            
        # Accumulate metrics
            all_preds.extend(torch.sigmoid(outputs).detach().cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
            
        # Calculate Epoch Metrics
        all_preds = np.array(all_preds)
        all_labels = np.array(all_labels)
        predicted_labels = (all_preds > 0.5).astype(int)
        
        # Simple manual calculation to avoid sklearn dependency if not present
        tp = np.sum((predicted_labels == 1) & (all_labels == 1))
        tn = np.sum((predicted_labels == 0) & (all_labels == 0))
        fp = np.sum((predicted_labels == 1) & (all_labels == 0))
        fn = np.sum((predicted_labels == 0) & (all_labels == 1))
        
        accuracy = (tp + tn) / len(all_labels) if len(all_labels) > 0 else 0
        precision = tp / (tp + fp) if (tp + fp) > 0 else 0
        recall = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
        
        print(f"Epoch {epoch+1} Results:")
        print(f"  Loss:      {epoch_loss / len(loader):.4f}")
        print(f"  Accuracy:  {accuracy:.4f}")
        print(f"  Precision: {precision:.4f}")
        print(f"  Recall:    {recall:.4f}")
        print(f"  F1 Score:  {f1:.4f}")

        # Save metrics to log file
        log_dir = r'C:\deepfake\logs'
        os.makedirs(log_dir, exist_ok=True)
        log_path = os.path.join(log_dir, 'training_log.txt')
        
        with open(log_path, 'a') as f:
            # Write header if file is empty
            if os.path.getsize(log_path) == 0:
                f.write("Epoch,Loss,Accuracy,Precision,Recall,F1_Score\n")
            f.write(f"{epoch+1},{epoch_loss / len(loader):.4f},{accuracy:.4f},{precision:.4f},{recall:.4f},{f1:.4f}\n")
        
        # Save checkpoint
        ckpt_path = os.path.join(r'C:\deepfake\models\checkpoints', f"{args.model}_ep{epoch+1}.pth")
        torch.save(model.state_dict(), ckpt_path)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=str, default='efficientnet_b4', choices=['efficientnet_b4', 'xception', 'clip', 'hybrid_forensic'])
    parser.add_argument('--epochs', type=int, default=5)
    parser.add_argument('--batch_size', type=int, default=8)
    parser.add_argument('--lr', type=float, default=1e-4)
    args = parser.parse_args()
    
    train(args)
