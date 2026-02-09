import argparse
import os
import torch
import cv2
import numpy as np
import warnings
from models_factory import create_model
from preprocess import apply_srm_filter # Re-use preprocessing logic if possible

# Suppress FutureWarnings for cleaner output
warnings.filterwarnings('ignore', category=FutureWarning)

def preprocess_image(image_path):
    # 1. Load
    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, (256, 256)) # Resize to match training
    
    # 2. Extract SRM
    srm = apply_srm_filter(img)
    
    # 3. To Tensor
    # RGB: (H, W, C) -> (C, H, W), [0, 1]
    rgb_t = torch.tensor(img).permute(2, 0, 1).float() / 255.0
    srm_t = torch.tensor(srm).permute(2, 0, 1).float()
    
    return rgb_t.unsqueeze(0), srm_t.unsqueeze(0) # Batch dim

def predict(args):
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # 1. Load Model
    config = {'model_name': args.model, 'device': device}
    model = create_model(config)
    
    ckpt_path = args.checkpoint
    if not os.path.exists(ckpt_path):
        print(f"Error: Checkpoint not found at {ckpt_path}")
        return

    print(f"Loading weights from {ckpt_path}...")
    model.load_state_dict(torch.load(ckpt_path, map_location=device))
    model.to(device)
    model.eval()
    
    # 2. Preprocess Data
    rgb, srm = preprocess_image(args.image)
    rgb = rgb.to(device)
    srm = srm.to(device)
    
    # 3. Predict
    with torch.no_grad():
        if args.model == 'hybrid_forensic':
             output = model(rgb, x_srm=srm)
        else:
             output = model(rgb)
             
        # Sigmoid
        prob = torch.sigmoid(output).item()
        
    # 4. Result
    label = "FAKE" if prob > 0.5 else "REAL"
    confidence = prob if prob > 0.5 else 1 - prob
    
    print("-" * 30)
    print(f"Prediction: {label}")
    print(f"Confidence: {confidence:.2%}")
    print(f"Raw Score:  {prob:.4f}")
    print("-" * 30)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--model', type=str, required=True, choices=['efficientnet_b4', 'xception', 'clip', 'hybrid_forensic'])
    parser.add_argument('--checkpoint', type=str, required=True, help='Path to .pth model checkpoint')
    parser.add_argument('--image', type=str, required=True, help='Path to image file')
    args = parser.parse_args()
    
    predict(args)
