# Deepfake Detection System

A comprehensive deepfake detection system using multiple deep learning architectures for identifying manipulated facial images and videos.

## 🎯 Project Overview

This project implements and compares four state-of-the-art deepfake detection models:
- **EfficientNet-B4** - Transfer learning approach
- **Xception** - Extreme Inception architecture
- **Hybrid Forensic** - Dual-stream RGB + SRM forensic analysis
- **CLIP** - Vision-language model fine-tuning

## 🏆 Key Results

| Model | Accuracy | F1 Score | Status |
|-------|----------|----------|--------|
| **EfficientNet-B4** | 100% | 100% | ✅ Best |
| **Hybrid Forensic** | 100% | 100% | ✅ Best |
| Xception | 77.78% | 71.43% | ✅ Good |
| CLIP | 44.44% | 61.54% | ⚠️ Underperformed |

## 📁 Directory Structure

```
c:/deepfake/
├── README.md                          # This file
├── requirements.txt                   # Python dependencies
├── docs/                              # Detailed documentation
│   ├── DATA_COLLECTION.md            # Data sources and statistics
│   ├── PREPROCESSING.md              # Preprocessing pipeline
│   ├── MODELS.md                     # Model architectures
│   ├── TRAINING.md                   # Training methodology
│   ├── EVALUATION.md                 # Evaluation process
│   ├── API_REFERENCE.md              # Script usage
│   ├── USER_GUIDE.md                 # Step-by-step guide
│   └── RESULTS.md                    # Detailed results
├── src/                               # Source code
│   ├── preprocess.py                 # Data preprocessing
│   ├── split_data.py                 # Train/val split
│   ├── models_factory.py             # Model creation
│   ├── train.py                      # Training script
│   ├── evaluate_models.py            # Batch evaluation
│   ├── test_utils.py                 # Testing utilities
│   └── predict.py                    # Single prediction
├── data/                              # Dataset
│   ├── raw/                          # Original videos/images
│   ├── processed/                    # Extracted features
│   ├── train_list.txt                # Training samples
│   └── val_list.txt                  # Validation samples
├── models/                            # Model artifacts
│   └── checkpoints/                  # Saved weights
├── logs/                              # Training logs
│   └── training_log.txt              # Metrics per epoch
└── results/                           # Evaluation results
    ├── predictions.csv               # All predictions
    ├── confusion_matrices.png        # Visual comparison
    ├── roc_curves.png                # ROC analysis
    └── evaluation_report.md          # Detailed report
```

## 🚀 Quick Start

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd deepfake

# Create virtual environment
python -m venv ff_env
source ff_env/bin/activate  # On Windows: ff_env\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Data Preprocessing

```bash
# Process raw data (extract faces and SRM features)
python src/preprocess.py

# Split into train/validation sets
python src/split_data.py
```

### 3. Training

Train individual models:

```bash
# EfficientNet-B4
python src/train.py --model efficientnet_b4 --batch_size 16 --epochs 5

# Xception
python src/train.py --model xception --batch_size 16 --epochs 5

# Hybrid Forensic (RGB + SRM)
python src/train.py --model hybrid_forensic --batch_size 8 --epochs 5

# CLIP
python src/train.py --model clip --batch_size 8 --epochs 5
```

### 4. Evaluation

```bash
# Evaluate all models on validation set
python src/evaluate_models.py

# Results will be saved to results/ directory
```

### 5. Prediction

```bash
# Single image prediction
python src/predict.py \
  --model hybrid_forensic \
  --checkpoint models/checkpoints/hybrid_forensic_ep5.pth \
  --image path/to/image.jpg
```

## 📊 Visualizations

Generate training and comparison plots:

```bash
python plot_comparison.py
```

This creates:
- `training_metrics_comparison.png` - Training progress over epochs
- `best_model_comparison.png` - Final performance comparison

## 🔬 Model Architectures

### EfficientNet-B4
- Pre-trained on ImageNet
- Custom classification head
- Input: 256×256 RGB images
- **Performance: 100% accuracy**

### Hybrid Forensic (Recommended)
- Dual-stream architecture
  - Stream 1: RGB features (ResNet18)
  - Stream 2: SRM forensic features (ResNet18)
- Fusion layer for combined analysis
- Input: RGB + SRM (256×256×3 each)
- **Performance: 100% accuracy**

### Xception
- Depthwise separable convolutions
- Transfer learning from ImageNet
- Input: 256×256 RGB images
- **Performance: 77.78% accuracy**

### CLIP
- Vision-language model
- Fine-tuned ViT-Large/14
- Input: 256×256 RGB images
- **Performance: 44.44% accuracy** (needs improvement)

## 📈 Training Details

- **Loss Function**: Binary Cross-Entropy with Logits
- **Optimizer**: AdamW (lr=1e-4)
- **Batch Size**: 8-16 (model dependent)
- **Epochs**: 5
- **Mixed Precision**: Enabled (AMP)
- **Data Augmentation**:
  - Horizontal flip (p=0.5)
  - Gaussian noise (p=0.2)
  - JPEG compression (p=0.3)

## 📚 Documentation

For detailed information, see the `docs/` directory:

- **[Data Collection](docs/DATA_COLLECTION.md)** - Dataset sources and statistics
- **[Preprocessing](docs/PREPROCESSING.md)** - Face detection and feature extraction
- **[Models](docs/MODELS.md)** - Architecture details
- **[Training](docs/TRAINING.md)** - Training methodology
- **[Evaluation](docs/EVALUATION.md)** - Metrics and results
- **[API Reference](docs/API_REFERENCE.md)** - Script documentation
- **[User Guide](docs/USER_GUIDE.md)** - Step-by-step instructions
- **[Results](docs/RESULTS.md)** - Comprehensive analysis

## 🛠️ Requirements

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

## 🎯 Use Cases

- **Social Media Verification**: Detect manipulated profile pictures
- **News Authentication**: Verify authenticity of media content
- **Forensic Analysis**: Investigate potential deepfakes
- **Research**: Benchmark new detection methods

## ⚠️ Limitations

- Trained on specific dataset (may not generalize to all deepfake types)
- Requires face detection (won't work on non-facial content)
- Performance may degrade on heavily compressed images
- CLIP model requires further optimization

## 🔮 Future Work

- [ ] Expand dataset with more diverse deepfake techniques
- [ ] Implement video-level detection (temporal analysis)
- [ ] Add audio deepfake detection
- [ ] Optimize CLIP model performance
- [ ] Deploy as web service/API
- [ ] Add explainability features (GradCAM, attention maps)

## 📄 License

[Specify your license here]

## 🙏 Acknowledgments

- **FaceForensics++** dataset
- **MTCNN** for face detection
- **timm** library for model implementations
- **OpenAI CLIP** for vision-language models

## 📧 Contact

[Your contact information]

---

**Note**: This is a research/educational project. Always verify critical content through multiple sources.
