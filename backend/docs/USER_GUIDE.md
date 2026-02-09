# User Guide

## Step-by-Step Instructions

This guide walks you through the entire process from installation to prediction.

## Prerequisites

- Python 3.8 or higher
- NVIDIA GPU with CUDA support (recommended)
- 16GB RAM minimum
- 50GB free disk space

## Installation

### 1. Clone Repository

```bash
git clone <repository-url>
cd deepfake
```

### 2. Create Virtual Environment

**Windows**:
```bash
python -m venv ff_env
ff_env\Scripts\activate
```

**Linux/Mac**:
```bash
python -m venv ff_env
source ff_env/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Verify installation**:
```bash
python verify_install.py
```

## Data Preparation

### 1. Obtain Dataset

- Request access to [FaceForensics++](https://github.com/ondyari/FaceForensics)
- Download videos/images
- Place in `data/raw/` directory

### 2. Preprocess Data

```bash
python src/preprocess.py
```

**Expected output**:
```
Processing: 100%|████████████| 195/195 [03:30<00:00]
✓ Processed 256 samples
✓ Saved to data/processed/
```

### 3. Split Data

```bash
python src/split_data.py
```

**Expected output**:
```
✓ Created train_list.txt (71 samples)
✓ Created val_list.txt (18 samples)
```

## Training

### Quick Start

Train the recommended model (Hybrid Forensic):

```bash
python src/train.py --model hybrid_forensic --batch_size 8 --epochs 5
```

### Train All Models

```bash
# EfficientNet-B4
python src/train.py --model efficientnet_b4 --batch_size 16 --epochs 5

# Xception
python src/train.py --model xception --batch_size 16 --epochs 5

# Hybrid Forensic
python src/train.py --model hybrid_forensic --batch_size 8 --epochs 5

# CLIP (not recommended)
python src/train.py --model clip --batch_size 8 --epochs 5
```

### Monitor Training

Training logs are saved to `logs/training_log.txt`. View in real-time:

**Windows**:
```bash
Get-Content logs\training_log.txt -Wait
```

**Linux/Mac**:
```bash
tail -f logs/training_log.txt
```

## Evaluation

### Evaluate All Models

```bash
python src/evaluate_models.py
```

**Output files**:
- `results/predictions.csv`
- `results/confusion_matrices.png`
- `results/roc_curves.png`
- `results/evaluation_report.md`

### View Results

```bash
# View report
cat results/evaluation_report.md

# Open visualizations
start results/confusion_matrices.png  # Windows
open results/confusion_matrices.png   # Mac
xdg-open results/confusion_matrices.png  # Linux
```

## Prediction

### Single Image

```bash
python src/predict.py \
  --model hybrid_forensic \
  --checkpoint models/checkpoints/hybrid_forensic_ep5.pth \
  --image path/to/image.jpg
```

**Example output**:
```
------------------------------
Prediction: FAKE
Confidence: 99.82%
Raw Score:  0.9982
------------------------------
```

### Batch Prediction

Create a script:

```python
import glob
import subprocess

images = glob.glob("test_images/*.jpg")

for img in images:
    subprocess.run([
        "python", "src/predict.py",
        "--model", "hybrid_forensic",
        "--checkpoint", "models/checkpoints/hybrid_forensic_ep5.pth",
        "--image", img
    ])
```

## Visualization

### Generate Training Plots

```bash
python plot_comparison.py
```

**Output**:
- `training_metrics_comparison.png`
- `best_model_comparison.png`

## Troubleshooting

### Common Issues

#### 1. CUDA Out of Memory

**Error**: `RuntimeError: CUDA out of memory`

**Solutions**:
- Reduce batch size: `--batch_size 4`
- Use CPU: Set `device = torch.device('cpu')` in code
- Close other GPU applications

#### 2. No Face Detected

**Error**: `No face detected in image`

**Solutions**:
- Ensure image contains a clear face
- Check image quality (not too blurry)
- Try different image

#### 3. Import Errors

**Error**: `ModuleNotFoundError: No module named 'X'`

**Solution**:
```bash
pip install -r requirements.txt
```

#### 4. Slow Training

**Issue**: Training takes too long

**Solutions**:
- Enable GPU: Check CUDA installation
- Reduce dataset size for testing
- Use mixed precision (already enabled)

## Best Practices

### 1. Data Quality

- ✅ Use high-resolution images (>480p)
- ✅ Ensure faces are clearly visible
- ✅ Avoid heavily compressed images

### 2. Training

- ✅ Monitor training logs
- ✅ Save checkpoints frequently
- ✅ Use validation set to check overfitting

### 3. Evaluation

- ✅ Test on diverse datasets
- ✅ Check confusion matrix for error patterns
- ✅ Compare multiple models

### 4. Deployment

- ✅ Use Hybrid Forensic for critical applications
- ✅ Use EfficientNet-B4 for high-throughput
- ✅ Implement confidence thresholds

## Advanced Usage

### Custom Data Augmentation

Edit `src/train.py`:

```python
def get_transforms():
    return A.Compose([
        A.HorizontalFlip(p=0.5),
        A.GaussNoise(p=0.2),
        A.ImageCompression(quality_lower=60, quality_upper=100, p=0.3),
        # Add your custom augmentations here
        A.Rotate(limit=15, p=0.3),
        A.RandomBrightnessContrast(p=0.2),
    ])
```

### Custom Model

Create in `src/models_factory.py`:

```python
class CustomModel(nn.Module):
    def __init__(self):
        super().__init__()
        # Your architecture here
    
    def forward(self, x):
        # Your forward pass
        return logits

# Add to factory
def create_model(config):
    if config['model_name'] == 'custom':
        return CustomModel()
    # ... existing code
```

### Ensemble Prediction

```python
import torch
from models_factory import create_model

# Load models
model1 = create_model({'model_name': 'efficientnet_b4', 'device': device})
model1.load_state_dict(torch.load('models/checkpoints/efficientnet_b4_ep5.pth'))

model2 = create_model({'model_name': 'hybrid_forensic', 'device': device})
model2.load_state_dict(torch.load('models/checkpoints/hybrid_forensic_ep5.pth'))

# Predict
with torch.no_grad():
    out1 = torch.sigmoid(model1(rgb))
    out2 = torch.sigmoid(model2(rgb, x_srm=srm))
    
    # Average probabilities
    ensemble_prob = (out1 + out2) / 2
    
print(f"Ensemble prediction: {ensemble_prob.item():.4f}")
```

## Next Steps

1. ✅ Train models on your dataset
2. ✅ Evaluate performance
3. ✅ Test on external datasets
4. ✅ Deploy best model
5. ✅ Monitor performance in production

## Support

For issues or questions:
- Check [documentation](../README.md)
- Review [troubleshooting](#troubleshooting)
- Open GitHub issue

---

**Last Updated**: February 2026
