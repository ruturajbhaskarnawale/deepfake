import os

path = r'C:\deepfake\data\raw\FVFA_15001_hallo.frames.npy'
file_size = os.path.getsize(path)
print(f"File size: {file_size} bytes")

with open(path, 'rb') as f:
    header = f.read(128)

print(f"First 128 bytes: {header}")

if b'\x93NUMPY' in header:
    print("Detected Standard Numpy Header")
else:
    print("No Numpy Header detected! Likely raw binary.")

# Check if size matches explicit dimensions
# 500 frames * 256 * 256 * 3 channels (uint8)
expected_raw = 500 * 256 * 256 * 3
print(f"Expected size for 500x256x256x3 (uint8): {expected_raw}")

if file_size == expected_raw:
    print("MATCH! This is likely a raw binary file (use np.fromfile)")
