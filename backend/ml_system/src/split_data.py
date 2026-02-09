import os
import random
import glob

# Paths
PROCESSED_DIR = r'C:\deepfake\data\processed'
OUTPUT_DIR = r'C:\deepfake\data'

def main():
    print("Scanning processed data...")
    
    # scan for real and fake
    # Structure: data/processed/real/id and data/processed/fake/id
    real_ids = glob.glob(os.path.join(PROCESSED_DIR, 'real', '*'))
    fake_ids = glob.glob(os.path.join(PROCESSED_DIR, 'fake', '*'))
    
    # Filter only those with features extracted (face.npy)
    real_ids = [rio for rio in real_ids if os.path.exists(os.path.join(rio, 'face.npy'))]
    fake_ids = [fio for fio in fake_ids if os.path.exists(os.path.join(fio, 'face.npy'))]
    
    print(f"Found {len(real_ids)} valid Real records.")
    print(f"Found {len(fake_ids)} valid Fake records.")
    
    # Shuffle
    random.seed(42)
    random.shuffle(real_ids)
    random.shuffle(fake_ids)
    
    # Split 80/20
    def split(data, ratio=0.8):
        k = int(len(data) * ratio)
        return data[:k], data[k:]
        
    real_train, real_val = split(real_ids)
    fake_train, fake_val = split(fake_ids)
    
    train_set = real_train + fake_train
    val_set = real_val + fake_val
    
    random.shuffle(train_set)
    random.shuffle(val_set)
    
    print(f"Train Set: {len(train_set)} (Real: {len(real_train)}, Fake: {len(fake_train)})")
    print(f"Val Set:   {len(val_set)} (Real: {len(real_val)}, Fake: {len(fake_val)})")
    
    # Save absolute paths to txt
    with open(os.path.join(OUTPUT_DIR, 'train_list.txt'), 'w') as f:
        f.write('\n'.join(train_set))
        
    with open(os.path.join(OUTPUT_DIR, 'val_list.txt'), 'w') as f:
        f.write('\n'.join(val_set))
        
    print(f"Saved splits to {OUTPUT_DIR}")

if __name__ == '__main__':
    main()
