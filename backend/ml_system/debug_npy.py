import numpy as np
import os

path = r'C:\deepfake\data\raw\FVFA_15001_hallo.frames.npy'

print(f"Inspecting {path}...")
try:
    # Try different loading strategies
    print("-" * 20)
    print("Attempt 1: load(allow_pickle=True)")
    data = np.load(path, allow_pickle=True)
    print(f"Type: {type(data)}")
    if isinstance(data, np.ndarray):
        print(f"Shape: {data.shape}")
        print(f"Dtype: {data.dtype}")
        if data.size > 0:
            sample = data.flatten()[0]
            print(f"Sample element type: {type(sample)}")
            # check if it's an array of objects/bytes
    else:
        print(f"Loaded data is not an array: {data}")

    print("Success!")
except Exception as e:
    print(f"Attempt 1 Failed: {e}")

print("-" * 20)
