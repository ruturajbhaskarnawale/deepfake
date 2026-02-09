import numpy as np
import cv2

# Test loading one frame file
npy_path = r'C:\deepfake\data\raw\FVFA_15001_hallo.frames.npy'

print("Loading frames...")
frames = np.fromfile(npy_path, dtype=np.uint8)
print(f"Loaded {len(frames)} bytes")

# Reshape
num_frames = len(frames) // (256 * 256 * 3)
print(f"Calculated {num_frames} frames")

frames = frames.reshape(num_frames, 256, 256, 3)
print(f"Reshaped to: {frames.shape}")

# Get middle frame
middle_idx = len(frames) // 2
img = frames[middle_idx]
print(f"Middle frame shape: {img.shape}, dtype: {img.dtype}")
print(f"Min: {img.min()}, Max: {img.max()}, Mean: {img.mean():.2f}")

# Save as image to verify
cv2.imwrite('test_frame.jpg', cv2.cvtColor(img, cv2.COLOR_RGB2BGR))
print("Saved test_frame.jpg - please check if it looks like a face!")
