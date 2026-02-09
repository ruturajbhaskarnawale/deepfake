# API Reference

## Overview

Complete reference for all scripts and commands in the deepfake detection system.

## Scripts

### 1. preprocess.py

**Purpose**: Extract faces and SRM features from raw data

**Location**: `src/preprocess.py`

**Usage**:
```bash
python src/preprocess.py
```

**Process**:
1. Scans `data/raw/` for videos/images
2. Detects faces using MTCNN
3. Extracts 256×256 RGB faces
4. Applies SRM filters
5. Saves to `data/processed/`

**Output**:
- `data/processed/{label}/{id}/face.npy`
- `data/processed/{label}/{id}/srm.npy`

---

### 2. split_data.py

**Purpose**: Split processed data into train/validation sets

**Location**: `src/split_data.py`

**Usage**:
```bash
python src/split_data.py
```

**Parameters**:
- Split ratio: 80/20 (hardcoded)
- Stratification: Maintains class balance
- Random seed: 42

**Output**:
- `data/train_list.txt` - Training sample paths
- `data/val_list.txt` - Validation sample paths

---

### 3. train.py

**Purpose**: Train deepfake detection models

**Location**: `src/train.py`

**Usage**:
```bash
python src/train.py [OPTIONS]
```

**Arguments**:

| Argument | Type | Default | Choices | Description |
|----------|------|---------|---------|-------------|
| `--model` | str | efficientnet_b4 | efficientnet_b4, xception, clip, hybrid_forensic | Model architecture |
| `--epochs` | int | 5 | - | Number of training epochs |
| `--batch_size` | int | 8 | - | Batch size |
| `--lr` | float | 1e-4 | - | Learning rate |

**Examples**:
```bash
# Train EfficientNet-B4
python src/train.py --model efficientnet_b4 --batch_size 16 --epochs 5

# Train Hybrid Forensic
python src/train.py --model hybrid_forensic --batch_size 8 --epochs 5

# Custom learning rate
python src/train.py --model xception --lr 5e-5 --epochs 10
```

**Output**:
- Checkpoints: `models/checkpoints/{model}_ep{N}.pth`
- Training log: `logs/training_log.txt`

---

### 4. evaluate_models.py

**Purpose**: Evaluate all models on validation set

**Location**: `src/evaluate_models.py`

**Usage**:
```bash
python src/evaluate_models.py [OPTIONS]
```

**Arguments**:

| Argument | Type | Default | Description |
|----------|------|---------|-------------|
| `--output` | str | C:\deepfake\results | Output directory |

**Example**:
```bash
python src/evaluate_models.py --output results/
```

**Output**:
- `results/predictions.csv` - All predictions
- `results/confusion_matrices.png` - Visual comparison
- `results/roc_curves.png` - ROC curves
- `results/evaluation_report.md` - Markdown report

---

### 5. predict.py

**Purpose**: Single image prediction

**Location**: `src/predict.py`

**Usage**:
```bash
python src/predict.py --model MODEL --checkpoint PATH --image IMAGE
```

**Arguments**:

| Argument | Type | Required | Description |
|----------|------|----------|-------------|
| `--model` | str | Yes | Model name (efficientnet_b4, xception, clip, hybrid_forensic) |
| `--checkpoint` | str | Yes | Path to .pth checkpoint file |
| `--image` | str | Yes | Path to input image |

**Example**:
```bash
python src/predict.py \
  --model hybrid_forensic \
  --checkpoint models/checkpoints/hybrid_forensic_ep5.pth \
  --image test_image.jpg
```

**Output**:
```
------------------------------
Prediction: FAKE
Confidence: 99.82%
Raw Score:  0.9982
------------------------------
```

---

### 6. plot_comparison.py

**Purpose**: Generate training and comparison visualizations

**Location**: `plot_comparison.py`

**Usage**:
```bash
python plot_comparison.py
```

**Output**:
- `training_metrics_comparison.png` - Training progress
- `best_model_comparison.png` - Final performance comparison

---

## Utility Modules

### models_factory.py

**Purpose**: Model creation factory

**Location**: `src/models_factory.py`

**Function**:
```python
def create_model(config):
    """
    Create a model instance
    
    Args:
        config (dict): {
            'model_name': str,  # Model architecture
            'device': torch.device  # CPU or CUDA
        }
    
    Returns:
        torch.nn.Module: Model instance
    """
```

**Example**:
```python
from models_factory import create_model

config = {
    'model_name': 'hybrid_forensic',
    'device': torch.device('cuda')
}

model = create_model(config)
```

---

### test_utils.py

**Purpose**: Testing and evaluation utilities

**Location**: `src/test_utils.py`

**Functions**:

#### load_validation_data()
```python
def load_validation_data(val_list_path):
    """
    Load validation data from val_list.txt
    
    Args:
        val_list_path (str): Path to validation list file
    
    Returns:
        list: List of dicts with keys: 'rgb', 'srm', 'label', 'path'
    """
```

#### calculate_metrics()
```python
def calculate_metrics(y_true, y_pred, y_prob):
    """
    Calculate comprehensive metrics
    
    Args:
        y_true (list): Ground truth labels (0 or 1)
        y_pred (list): Predicted labels (0 or 1)
        y_prob (list): Predicted probabilities (0.0 to 1.0)
    
    Returns:
        dict: {
            'accuracy': float,
            'precision': float,
            'recall': float,
            'f1_score': float,
            'auc_roc': float
        }
    """
```

#### plot_confusion_matrix()
```python
def plot_confusion_matrix(y_true, y_pred, model_name, save_path):
    """
    Plot and save confusion matrix
    
    Args:
        y_true (list): Ground truth labels
        y_pred (list): Predicted labels
        model_name (str): Model name for title
        save_path (str): Output file path
    """
```

#### plot_roc_curves()
```python
def plot_roc_curves(results_dict, save_path):
    """
    Plot ROC curves for all models
    
    Args:
        results_dict (dict): {
            model_name: {
                'y_true': list,
                'y_prob': list
            }
        }
        save_path (str): Output file path
    """
```

---

## Data Formats

### Training List Files

**Format**: Plain text, one path per line

**Example** (`data/train_list.txt`):
```
C:\deepfake\data\processed\fake\15001
C:\deepfake\data\processed\real\real_1
C:\deepfake\data\processed\fake\15002
...
```

### Training Log

**Format**: CSV

**Example** (`logs/training_log.txt`):
```csv
Epoch,Loss,Accuracy,Precision,Recall,F1_Score
1,0.6565,0.7042,0.6389,0.7419,0.6866
2,0.4001,0.8310,0.8276,0.7742,0.8000
...
```

### Predictions CSV

**Format**: CSV

**Example** (`results/predictions.csv`):
```csv
path,true_label,predicted_label,probability,correct,model
C:\deepfake\data\processed\fake\15013,Fake,Fake,0.9937,True,EfficientNet-B4
...
```

---

## Python API Usage

### Training Example

```python
import torch
from models_factory import create_model
from train import train

# Configuration
config = {
    'model_name': 'hybrid_forensic',
    'device': torch.device('cuda')
}

# Create model
model = create_model(config)

# Train (simplified)
# See src/train.py for full implementation
```

### Prediction Example

```python
import torch
from models_factory import create_model
from predict import preprocess_image

# Load model
device = torch.device('cuda')
config = {'model_name': 'hybrid_forensic', 'device': device}
model = create_model(config)
model.load_state_dict(torch.load('models/checkpoints/hybrid_forensic_ep5.pth'))
model.eval()

# Preprocess image
rgb, srm = preprocess_image('test.jpg')
rgb, srm = rgb.to(device), srm.to(device)

# Predict
with torch.no_grad():
    output = model(rgb, x_srm=srm)
    prob = torch.sigmoid(output).item()
    
print(f"Probability of fake: {prob:.4f}")
```

---

## Environment Variables

None currently used. All paths are hardcoded or passed as arguments.

## Dependencies

See `requirements.txt`:
```
torch>=2.0.0
torchvision>=0.15.0
timm>=0.9.0
transformers>=4.30.0
albumentations>=1.3.0
facenet-pytorch>=2.5.0
opencv-python>=4.8.0
scikit-learn>=1.3.0
seaborn>=0.12.0
pandas>=2.0.0
numpy>=1.24.0
matplotlib>=3.7.0
```

---

**Last Updated**: February 2026
