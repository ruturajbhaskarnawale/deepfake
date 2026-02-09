import tarfile
import os

tar_path = r'C:\deepfake\dataset\digifake_data\FVFA_with_audio\DigiFakeAV_hallo_15001_15500.tar'
output_file = r'C:\deepfake\tar_content.txt'

try:
    with tarfile.open(tar_path, 'r') as t:
        names = t.getnames()
        with open(output_file, 'w') as f:
            f.write(f"Total files: {len(names)}\n")
            for name in names[:10]:
                f.write(name + "\n")
    print("Done")
except Exception as e:
    with open(output_file, 'w') as f:
        f.write(f"Error: {e}")
