import sys

try:
    with open(r'C:\deepfake\audit_report.txt', 'r', encoding='utf-16') as f:
        print(f.read())
except Exception as e:
    # Try utf-8 if utf-16 fails
    try:
        with open(r'C:\deepfake\audit_report.txt', 'r', encoding='utf-8') as f:
            print(f.read())
    except Exception as e2:
        print(f"Error reading file: {e} | {e2}")
