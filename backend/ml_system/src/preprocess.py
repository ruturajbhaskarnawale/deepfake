import os
import cv2
import numpy as np
import torch
import torchaudio
import librosa
from facenet_pytorch import MTCNN
from scipy.fftpack import dct
from tqdm import tqdm
import glob

# Configuration
RAW_DATA_DIR = r'C:\deepfake\data\raw'
PROCESSED_DATA_DIR = r'C:\deepfake\data\processed'
IMG_SIZE = 256
SAMPLE_RATE = 16000

# Device configuration
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

# Initialize MTCNN for face extraction
mtcnn = MTCNN(image_size=IMG_SIZE, margin=0, keep_all=False, select_largest=False, device=device)

def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)

# --- 1. Face Extraction ---
def extract_face(image_path):
    try:
        img = cv2.imread(image_path)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        # MTCNN expects PIL or RGB numpy
        # Returns tensor (3, 256, 256) normalized to [-1, 1] usually, or PIL
        # We want numpy uint8 for storage or tensor
        # save_path=None returns tensor
        face_tensor = mtcnn(img) 
        if face_tensor is not None:
            # Convert to numpy (C, H, W) -> (H, W, C) range [0, 255] roughly if we want standard image
            # facenet_pytorch returns float tensor pre-standardized. 
            # For this pipeline, let's keep it as a processed numpy array.
            # Denormalize for visualization/saving as npy generic
            face_np = face_tensor.permute(1, 2, 0).cpu().numpy()
            # It is roughly in [-1, 1], let's verify standardization logic or just save raw tensor stats
            # DeepfakeBench usually keeps standard RGB 0-255 aligned faces.
            # Let's re-normalize to 0-255 for compatibility with Generic Models
            face_np = (face_np * 128 + 127.5).clip(0, 255).astype(np.uint8)
            return face_np
    except Exception as e:
        # print(f"Face extraction failed: {e}")
        pass
    return None

# --- 2. Audio Processing (Mel-Spectrogram) ---
def extract_audio_features(wav_path):
    try:
        y, sr = librosa.load(wav_path, sr=SAMPLE_RATE)
        # Mel Spectrogram
        mel_spec = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=128)
        mel_spec_db = librosa.power_to_db(mel_spec, ref=np.max)
        # Normalize to 0-1 or similar? 
        # Standardize: (x - mean) / std
        return mel_spec_db.astype(np.float32)
    except Exception as e:
        # print(f"Audio extraction failed: {e}")
        pass
    return None

# --- 3. Forensic Features (Simple SRM Filter) ---
def apply_srm_filter(image):
    # Standard SRM kernels (approximate for demonstration)
    # Using 3 Filters (Spam14h like)
    filter1 = np.array([[0, 0, 0, 0, 0], [0, -1, 2, -1, 0], [0, 2, -4, 2, 0], [0, -1, 2, -1, 0], [0, 0, 0, 0, 0]]) / 4.0
    filter2 = np.array([[-1, 2, -2, 2, -1], [2, -6, 8, -6, 2], [-2, 8, -12, 8, -2], [2, -6, 8, -6, 2], [-1, 2, -2, 2, -1]]) / 12.0
    filter3 = np.array([[0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 1, -2, 1, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]]) / 2.0
    
    # Simple convolution via opencv
    gray = cv2.cvtColor(image, cv2.COLOR_RGB2GRAY)
    f1 = cv2.filter2D(gray, -1, filter1)
    f2 = cv2.filter2D(gray, -1, filter2)
    f3 = cv2.filter2D(gray, -1, filter3)
    
    # Stack features (H, W, 3)
    srm_map = np.stack([f1, f2, f3], axis=-1)
    return srm_map.astype(np.float32)

def process_record(record_files, record_id, label_type):
    # Find components
    img_path = next((f for f in record_files if f.endswith('.jpg') or f.endswith('.png') or f.endswith('.mp4')), None)
    wav_path = next((f for f in record_files if f.endswith('.wav')), None)
    
    # Structure: data/processed/real/id or data/processed/fake/id
    out_dir = os.path.join(PROCESSED_DATA_DIR, label_type, str(record_id))
    ensure_dir(out_dir)
    
    # 1. Face (Handle Video or Image)
    if img_path:
        full_p = img_path # Now expecting full path in record_files for simplicity or adjust logic
        
        # If video, extract first frame or specific logic? 
        # Current logic seemed to expect images in data/raw. 
        # But Real data are .mp4 videos. We need to handle video frame extraction.
        
        if full_p.endswith('.mp4'):
            # Extract middle frame
            try:
                cap = cv2.VideoCapture(full_p)
                frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
                cap.set(cv2.CAP_PROP_POS_FRAMES, frame_count // 2)
                ret, frame = cap.read()
                cap.release()
                
                if ret:
                    # MTCNN expects RGB
                    frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    face_tensor = mtcnn(frame)
                    if face_tensor is not None:
                        face_np = face_tensor.permute(1, 2, 0).cpu().numpy()
                        face_np = (face_np * 128 + 127.5).clip(0, 255).astype(np.uint8)
                        
                        # Resize to 256x256 for consistency
                        face_np = cv2.resize(face_np, (256, 256))
                        
                        np.save(os.path.join(out_dir, 'face.npy'), face_np)
                        
                        srm = apply_srm_filter(face_np)
                        np.save(os.path.join(out_dir, 'srm.npy'), srm)
            except Exception as e:
                # print(f"Video processing failed {full_p}: {e}")
                pass
        else:
            # Existing specific logic (assuming specific format)
             # ... (Keep existing image logic if needed or adapt)
             pass
             
    # ... (Audio logic remains similar but needs path adjustment)

def main():
    # 1. Fake Data (Existing)
    # Assumes data/raw contains files like FVFA_...
    fake_dir = r'C:\deepfake\data\raw'
    real_dir = r'C:\deepfake\dataset\data\raw\downloaded_real\original_sequences\youtube\c23\videos'
    
    print("Scaning Fake Data...")
    fake_files = [os.path.join(fake_dir, f) for f in os.listdir(fake_dir) if 'FVFA' in f]
    
    # Group Fake by ID
    import re
    fake_records = {}
    for f in fake_files:
        match = re.search(r'FVFA_(\d+)_', os.path.basename(f))
        if match:
            rid = int(match.group(1))
            if rid not in fake_records: fake_records[rid] = []
            fake_records[rid].append(f)
            
    print(f"Found {len(fake_records)} Fake records.")
    for rid, rfiles in tqdm(fake_records.items(), desc="Processing Fake"):
        # Existing logic mostly worked on direct files, updated process_record handles paths
        # BUT existing logic expected image file in list. data/raw has .wav and .npy (frames). 
        # It seems we need to extract faces from .npy frames or something?
        # Actually checking file list: FVFA_...frames.npy. 
        # The prompt implies we process raw data. 
        # Let's check `process_record` logic again. It looked for .jpg/.png. 
        # BUT the file list I saw had .npy and .wav. 
        # I will assume for FAKE we might need to load one frame from .npy
        
        # SPECIAL HANDLING FOR FAKE (Already processed frames?)
        # Logic: If frames.npy exists, load one frame using numpy
        process_record_fake(rfiles, rid)

    # 2. Real Data (New Videos)
    if os.path.exists(real_dir):
        print("Scanning Real Data...")
        real_videos = [os.path.join(real_dir, f) for f in os.listdir(real_dir) if f.endswith('.mp4')]
        print(f"Found {len(real_videos)} Real videos.")
        
        for i, vid_path in enumerate(tqdm(real_videos, desc="Processing Real")):
             # Use index as ID for real
             process_record([vid_path], f"real_{i}", 'real')

def process_record_fake(record_files, record_id):
    # Specialized for the existing 'Fake' format in data/raw
    # files: .frames.npy, .audio.wav
    
    npy_path = next((f for f in record_files if f.endswith('frames.npy')), None)
    wav_path = next((f for f in record_files if f.endswith('.wav')), None)
    
    out_dir = os.path.join(PROCESSED_DATA_DIR, 'fake', str(record_id))
    ensure_dir(out_dir)
    
    if npy_path:
        try:
            # Load frames - these are RAW BINARY files, not standard .npy!
            # File size: 98304000 bytes = 500 frames × 256 × 256 × 3 channels (uint8)
            frames = np.fromfile(npy_path, dtype=np.uint8)
            
            # Reshape to (T, H, W, C)
            # Assuming 500 frames of 256x256x3
            num_frames = len(frames) // (256 * 256 * 3)
            frames = frames.reshape(num_frames, 256, 256, 3)
            
            if len(frames) > 0:
                # Try to extract face from multiple frames
                face_tensor = None
                frames_to_try = [
                    len(frames) // 2,  # Middle
                    len(frames) // 4,  # Quarter
                    len(frames) * 3 // 4,  # Three quarters
                    0,  # First
                    len(frames) - 1  # Last
                ]
                
                for frame_idx in frames_to_try:
                    img = frames[frame_idx]
                    face_tensor = mtcnn(img)
                    if face_tensor is not None:
                        break
                
                # If MTCNN still fails, use the raw middle frame resized to 256x256
                if face_tensor is None:
                    img = frames[len(frames) // 2]
                    # Resize to 256x256 for consistency with Real data
                    img_resized = cv2.resize(img, (256, 256))
                    # Convert to tensor format (C, H, W) and normalize to [-1, 1]
                    face_tensor = torch.tensor(img_resized).permute(2, 0, 1).float()
                    face_tensor = (face_tensor - 127.5) / 128.0
                
                # Convert to numpy
                if face_tensor is not None:
                    face_np = face_tensor.permute(1, 2, 0).cpu().numpy()
                    face_np = (face_np * 128 + 127.5).clip(0, 255).astype(np.uint8)
                    
                    # Ensure 256x256 size
                    if face_np.shape[0] != 256 or face_np.shape[1] != 256:
                        face_np = cv2.resize(face_np, (256, 256))
                    
                    np.save(os.path.join(out_dir, 'face.npy'), face_np)
                    
                    srm = apply_srm_filter(face_np)
                    np.save(os.path.join(out_dir, 'srm.npy'), srm)
        except Exception as e:
            print(f"Failed to process fake frame {npy_path}: {e}")
            
    if wav_path:
        # Audio logic
        spec = extract_audio_features(wav_path)
        if spec is not None:
             np.save(os.path.join(out_dir, 'audio.npy'), spec)


if __name__ == '__main__':
    main()
