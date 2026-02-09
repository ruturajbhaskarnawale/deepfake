# Training Documentation

## Overview

This document details the training methodology, hyperparameters, and process for all deepfake detection models.

## Training Pipeline

```
Data Loading → Augmentation → Forward Pass → Loss Calculation → Backpropagation → Weight Update → Checkpoint Saving
```

## Configuration

### Common Hyperparameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| **Loss Function** | BCEWithLogitsLoss | Binary classification with numerical stability |
| **Optimizer** | AdamW | Adaptive learning + weight decay |
| **Learning Rate** | 1e-4 | Standard for fine-tuning |
| **Epochs** | 5 | Sufficient for convergence on small dataset |
| **Mixed Precision** | Enabled (AMP) | Faster training, lower memory |
| **Device** | CUDA (GPU) | Accelerated training |

### Model-Specific Settings

| Model | Batch Size | Special Notes |
|-------|------------|---------------|
| EfficientNet-B4 | 16 | Standard batch size |
| Xception | 16 | Standard batch size |
| Hybrid Forensic | 8 | Dual inputs (RGB + SRM) |
| CLIP | 8 | Large model, memory constraints |

## Data Augmentation

Applied during training only (not validation):

```python
import albumentations as A

augmentation = A.Compose([
    A.HorizontalFlip(p=0.5),                    # Mirror flip
    A.GaussNoise(p=0.2),                        # Add noise
    A.ImageCompression(                          # JPEG compression
        quality_lower=60, 
        quality_upper=100, 
        p=0.3
    ),
    A.Normalize(                                 # ImageNet normalization
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    ),
])
```

**Rationale**:
- **Horizontal Flip**: Increases data diversity
- **Gaussian Noise**: Simulates camera sensor noise
- **JPEG Compression**: Mimics real-world image quality
- **Normalization**: Matches pre-training distribution

## Training Script Usage

### Basic Command

```bash
python src/train.py --model MODEL_NAME --epochs N --batch_size B --lr LR
```

### Examples

```bash
# Train EfficientNet-B4
python src/train.py --model efficientnet_b4 --batch_size 16 --epochs 5

# Train Hybrid Forensic
python src/train.py --model hybrid_forensic --batch_size 8 --epochs 5 --lr 1e-4

# Train with custom settings
python src/train.py --model xception --batch_size 32 --epochs 10 --lr 5e-5
```

## Training Process

### 1. Data Loading

```python
# Load train/val lists
train_dataset = DeepfakeDataset(
    record_list_file='data/train_list.txt',
    transform=get_transforms()
)

val_dataset = DeepfakeDataset(
    record_list_file='data/val_list.txt',
    transform=None  # No augmentation for validation
)

# Create data loaders
train_loader = DataLoader(
    train_dataset, 
    batch_size=args.batch_size, 
    shuffle=True
)
```

### 2. Training Loop

```python
for epoch in range(args.epochs):
    model.train()
    
    for batch in train_loader:
        rgb = batch['rgb'].to(device)
        srm = batch['srm'].to(device)
        labels = batch['label'].to(device)
        
        # Forward pass with mixed precision
        with autocast():
            if args.model == 'hybrid_forensic':
                outputs = model(rgb, x_srm=srm)
            else:
                outputs = model(rgb)
            
            loss = criterion(outputs, labels)
        
        # Backward pass
        optimizer.zero_grad()
        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()
```

### 3. Metrics Calculation

After each epoch:

```python
# Calculate metrics
accuracy = (tp + tn) / total
precision = tp / (tp + fp)
recall = tp / (tp + fn)
f1 = 2 * (precision * recall) / (precision + recall)

# Log to file
with open('logs/training_log.txt', 'a') as f:
    f.write(f"{epoch+1},{loss:.4f},{accuracy:.4f},{precision:.4f},{recall:.4f},{f1:.4f}\n")
```

### 4. Checkpoint Saving

```python
# Save after each epoch
checkpoint_path = f"models/checkpoints/{args.model}_ep{epoch+1}.pth"
torch.save(model.state_dict(), checkpoint_path)
```

## Training Logs

### Log Format

**File**: `logs/training_log.txt`

**Format**: CSV
```
Epoch,Loss,Accuracy,Precision,Recall,F1_Score
1,0.6565,0.7042,0.6389,0.7419,0.6866
2,0.4001,0.8310,0.8276,0.7742,0.8000
...
```

### Visualization

```bash
python plot_comparison.py
```

Generates:
- `training_metrics_comparison.png` - All metrics over epochs
- `best_model_comparison.png` - Final performance comparison

## Training Results

### EfficientNet-B4

| Epoch | Loss | Accuracy | Precision | Recall | F1 Score |
|-------|------|----------|-----------|--------|----------|
| 1 | 0.6565 | 70.42% | 63.89% | 74.19% | 68.66% |
| 2 | 0.4001 | 83.10% | 82.76% | 77.42% | 80.00% |
| 3 | 0.1823 | 91.55% | 96.30% | 83.87% | 89.66% |
| 4 | 0.0391 | 98.59% | 96.88% | 100% | 98.41% |
| **5** | **0.1120** | **91.55%** | **90.32%** | **90.32%** | **90.32%** |

### Hybrid Forensic

| Epoch | Loss | Accuracy | Precision | Recall | F1 Score |
|-------|------|----------|-----------|--------|----------|
| 1 | 0.2623 | 90.14% | 96.15% | 80.65% | 87.72% |
| 2 | 0.1135 | 95.77% | 96.67% | 93.55% | 95.08% |
| 3 | 0.0182 | 100% | 100% | 100% | 100% |
| 4 | 0.0147 | 100% | 100% | 100% | 100% |
| **5** | **0.0518** | **98.59%** | **100%** | **96.77%** | **98.36%** |

## Troubleshooting

### Common Issues

**Issue**: "CUDA out of memory"
- **Solution**: Reduce batch size or use CPU

**Issue**: "Loss not decreasing"
- **Solution**: Lower learning rate or check data labels

**Issue**: "Model overfitting"
- **Solution**: Add more augmentation or reduce epochs

## Best Practices

1. ✅ Monitor training logs in real-time
2. ✅ Save checkpoints frequently
3. ✅ Use validation set to check generalization
4. ✅ Experiment with learning rates
5. ✅ Enable mixed precision for faster training

---

**Last Updated**: February 2026
