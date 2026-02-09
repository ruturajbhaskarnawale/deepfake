import sys
import subprocess
import importlib

# Mapping: import_name -> pip_name
REQUIREMENTS = {
    "torch": "torch",
    "torchvision": "torchvision",
    "torchaudio": "torchaudio",
    "timm": "timm",
    "transformers": "transformers",
    "albumentations": "albumentations",
    "facenet_pytorch": "facenet-pytorch",
    "librosa": "librosa",
    "cv2": "opencv-python",
    "PIL": "Pillow",
}

def install_package(package_name):
    print(f"Installing {package_name} ...")
    subprocess.check_call([
        sys.executable, "-m", "pip", "install", package_name
    ])

def verify_and_install():
    failed = []

    print("🔍 Verifying required libraries...\n")

    for import_name, pip_name in REQUIREMENTS.items():
        try:
            importlib.import_module(import_name)
            print(f"[OK] {import_name}")
        except ImportError:
            print(f"[MISSING] {import_name}")
            failed.append((import_name, pip_name))

    if failed:
        print("\n📦 Installing missing libraries...\n")
        for _, pip_name in failed:
            install_package(pip_name)

        print("\n🔁 Re-verifying after installation...\n")
        for import_name, _ in failed:
            try:
                importlib.import_module(import_name)
                print(f"[OK] {import_name}")
            except ImportError as e:
                print(f"[FAIL] {import_name}: {e}")
                sys.exit(1)

    print("\n✅ All required libraries are installed and importable.")
    sys.exit(0)

if __name__ == "__main__":
    verify_and_install()
