import os
import re
import math

DATASET_DIR = r'C:\deepfake\dataset\final_10k_records'

def check_resolution(rid, record_files):
    # Check for height.txt and width.txt
    h_file = None
    w_file = None
    for f in record_files:
        if 'height.txt' in f: h_file = f
        if 'width.txt' in f: w_file = f
    
    if h_file and w_file:
        try:
            with open(os.path.join(DATASET_DIR, h_file), 'r') as f:
                h = int(f.read().strip())
            with open(os.path.join(DATASET_DIR, w_file), 'r') as f:
                w = int(f.read().strip())
            return h, w
        except:
            return 0, 0
    return 0, 0

def audit_dataset():
    if not os.path.exists(DATASET_DIR):
        print(f"Dataset directory not found: {DATASET_DIR}")
        return

    files = os.listdir(DATASET_DIR)
    
    # Group by ID
    records = {} # ID -> [files]
    file_types = {
        '.jpg': 0, '.mp4': 0, '.wav': 0, '.json': 0, '.npy': 0
    }
    
    for f in files:
        ext = os.path.splitext(f)[1].lower()
        if ext in file_types:
            file_types[ext] += 1
            
        match = re.search(r'FVFA_(\d+)_', f)
        if match:
            rid = int(match.group(1))
            if rid not in records:
                records[rid] = []
            records[rid].append(f)

    total_records = len(records)
    print(f"Total Records: {total_records}")
    print(f"File Type Inventory: {file_types}")
    
    # Readiness Counters
    ready_cnn = 0
    ready_hybrid = 0
    ready_vlm = 0
    ready_wong = 0
    
    gaps = {
        'missing_frames_npy': 0,
        'missing_wav': 0,
        'missing_json': 0,
        'low_res': 0
    }
    
    for rid, rfiles in records.items():
        has_npy = any(f.endswith('.npy') for f in rfiles)
        has_wav = any(f.endswith('.wav') for f in rfiles)
        has_json = any(f.endswith('.json') for f in rfiles)
        has_vis = has_npy # Assuming npy contains extracted frames as per previous context
        
        # Resolution check
        h, w = check_resolution(rid, rfiles)
        is_high_res = (h >= 256 and w >= 256)
        
        # 1. Baseline CNNs (Need Frames)
        if has_vis:
            ready_cnn += 1
        else:
            gaps['missing_frames_npy'] += 1
            
        # 2. Hybrid (Frames + NPY) - Assuming .npy IS the frames+residuals or compatible wrapper
        # The prompt says "Raw frames + Noise residuals/NPY".
        # If we have .npy, we likely have the tensor data.
        if has_npy:
            ready_hybrid += 1
            
        # 3. VLMs (Visual + Audio/Text)
        # Check for Audio OR JSON (Prompt: "Verify if corresponding .json metadata or .wav audio files exist")
        if has_vis and (has_wav or has_json):
            ready_vlm += 1
        else:
            if not has_wav and not has_json:
                gaps['missing_wav'] += 1 # Tracking just one for simplicity, but meaning audio/text missing
        
        # 4. Wong 2020 (Images + Min Res)
        if has_vis and is_high_res:
            ready_wong += 1
        if not is_high_res and has_vis:
            gaps['low_res'] += 1

    # --- Report Generation ---
    print("\n" + "="*50)
    print("MODEL READINESS REPORT")
    print("="*50)
    
    # Calculations
    pct_cnn = (ready_cnn / total_records) * 100 if total_records else 0
    pct_hybrid = (ready_hybrid / total_records) * 100 if total_records else 0
    pct_vlm = (ready_vlm / total_records) * 100 if total_records else 0
    pct_wong = (ready_wong / total_records) * 100 if total_records else 0
    
    print(f"{'Model Family':<30} | {'Readiness':<10} | {'Status'}")
    print("-" * 55)
    print(f"{'Baseline CNNs (Xception/EffNet)':<30} | {pct_cnn:.1f}%     | {'READY' if pct_cnn > 90 else 'NOT READY'}")
    print(f"{'Hybrid Forensics':<30} | {pct_hybrid:.1f}%     | {'READY' if pct_hybrid > 90 else 'NOT READY'}")
    print(f"{'VLMs (Intern/Qwen)':<30} | {pct_vlm:.1f}%     | {'READY' if pct_vlm > 90 else 'NOT READY'}")
    print(f"{'Specialized (Wong 2020)':<30} | {pct_wong:.1f}%     | {'READY' if pct_wong > 90 else 'NOT READY'}")
    
    print("\n" + "="*50)
    print("GAP ANALYSIS")
    print("="*50)
    if gaps['missing_frames_npy'] > 0:
        print(f"- Missing Visual Data (NPY): {gaps['missing_frames_npy']} records")
    if gaps['missing_wav'] > 0:
        print(f"- Missing Audio/Metadata: {gaps['missing_wav']} records (Impacts VLMs)")
    if gaps['low_res'] > 0:
        print(f"- Low Resolution (<256x256): {gaps['low_res']} records (Impacts Wong 2020)")
    
    if total_records == 0:
        print("CRITICAL: No records found!")

    print("\n" + "="*50)
    print("GO/NO-GO RECOMMENDATION")
    print("="*50)
    
    all_ready = (pct_cnn > 90 and pct_hybrid > 90 and pct_vlm > 90 and pct_wong > 90)
    if all_ready:
        print("Recommendation: GO. Dataset is ready for full training pipeline.")
    else:
        print("Recommendation: NO-GO. Address gaps before training.")

if __name__ == "__main__":
    audit_dataset()
