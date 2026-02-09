# Data Collection

## Overview

This document describes the data sources, collection methodology, and dataset statistics for the deepfake detection project.

## Data Sources

### Primary Dataset: FaceForensics++

The project uses data from the **FaceForensics++** dataset, a large-scale benchmark for deepfake detection research.

**Citation**:
```
@inproceedings{roessler2019faceforensicspp,
  title={FaceForensics++: Learning to Detect Manipulated Facial Images},
  author={R{\"o}ssler, Andreas and Cozzolino, Davide and Verdoliva, Luisa and Riess, Christian and Thies, Justus and Nie{\ss}ner, Matthias},
  booktitle={Proceedings of the IEEE International Conference on Computer Vision},
  year={2019}
}
```

### Dataset Characteristics

- **Real Videos**: Authentic videos from YouTube
- **Fake Videos**: Generated using multiple manipulation techniques:
  - Deepfakes (face swapping)
  - Face2Face (facial reenactment)
  - FaceSwap (graphics-based face swapping)
  - NeuralTextures (texture synthesis)

## Dataset Statistics

### Raw Data

```
data/raw/
├── Total files: ~195 items
├── Format: Videos (MP4, AVI) and Images (JPG, PNG)
├── Resolution: Variable (480p to 1080p)
└── Duration: 5-30 seconds per video
```

### Processed Data

After preprocessing (face extraction and feature engineering):

```
data/processed/
├── Total records: 256 samples
│   ├── Fake: 117 samples (45.7%)
│   └── Real: 100 samples (39.1%)
│   └── Other: 39 samples (legacy processing artifacts)
├── Format: NumPy arrays (.npy)
└── Resolution: 256×256×3 (standardized)
```

### Train/Validation Split

| Split | Total | Real | Fake | Ratio |
|-------|-------|------|------|-------|
| **Training** | 71 samples | ~40 | ~31 | 80% |
| **Validation** | 18 samples | 10 | 8 | 20% |

**Note**: The split is stratified to maintain class balance.

## Data Organization

### Raw Data Structure

```
data/raw/
├── video_001.mp4
├── video_002.avi
├── image_001.jpg
├── image_002.png
└── ...
```

### Processed Data Structure

```
data/processed/
├── fake/
│   ├── 15001/
│   │   ├── face.npy      # 256×256×3 RGB face
│   │   └── srm.npy       # 256×256×3 SRM features
│   ├── 15002/
│   │   ├── face.npy
│   │   └── srm.npy
│   └── ...
└── real/
    ├── real_1/
    │   ├── face.npy
    │   └── srm.npy
    ├── real_2/
    │   ├── face.npy
    │   └── srm.npy
    └── ...
```

## Data Collection Methodology

### 1. Video Acquisition
- Downloaded from FaceForensics++ dataset
- Verified integrity using checksums
- Organized by manipulation type

### 2. Quality Control
- Removed corrupted files
- Filtered low-resolution videos (<480p)
- Ensured minimum face visibility

### 3. Preprocessing Pipeline
See [PREPROCESSING.md](PREPROCESSING.md) for detailed preprocessing steps.

## Data Characteristics

### Face Distribution
- **Single face per sample**: Each processed record contains one detected face
- **Face size**: Standardized to 256×256 pixels
- **Alignment**: Faces are aligned using facial landmarks

### Quality Metrics
- **Average resolution**: 720p (raw videos)
- **Face detection success rate**: ~85%
- **Processing time**: ~2-3 seconds per video frame

## Ethical Considerations

### Privacy
- All data is from publicly available datasets
- No personally identifiable information (PII) is stored
- Faces are used solely for research purposes

### Consent
- Original videos were collected with appropriate permissions
- Dataset creators obtained necessary consents
- Usage complies with dataset license terms

## Data Limitations

1. **Limited diversity**: Primarily Western faces
2. **Compression artifacts**: Some videos have JPEG/H.264 compression
3. **Temporal information**: Currently using single frames (not video sequences)
4. **Manipulation types**: Limited to 4 specific deepfake techniques
5. **Age of data**: Dataset from 2019, may not represent latest deepfake methods

## Future Data Collection Plans

- [ ] Expand to Celeb-DF dataset
- [ ] Include more diverse demographics
- [ ] Add recent deepfake generation methods (e.g., Stable Diffusion)
- [ ] Collect video sequences for temporal analysis
- [ ] Add audio deepfake samples

## Data Access

### Requirements
- FaceForensics++ dataset access (requires academic/research agreement)
- Sufficient storage: ~50GB for raw data, ~10GB for processed data
- GPU recommended for preprocessing

### Download Instructions
1. Request access from [FaceForensics++ website](https://github.com/ondyari/FaceForensics)
2. Download using provided scripts
3. Place in `data/raw/` directory
4. Run preprocessing pipeline

## References

- [FaceForensics++ GitHub](https://github.com/ondyari/FaceForensics)
- [FaceForensics++ Paper](https://arxiv.org/abs/1901.08971)
- [Dataset Documentation](https://github.com/ondyari/FaceForensics/blob/master/dataset/README.md)

---

**Last Updated**: February 2026
