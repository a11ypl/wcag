from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
SANDBOX = ROOT / "sandbox"
PUBLIC = ROOT / "public"


def main():
    if not SANDBOX.exists():
        raise SystemExit("Missing sandbox directory")

    if PUBLIC.exists():
        shutil.rmtree(PUBLIC)

    shutil.copytree(SANDBOX, PUBLIC)
    print(f"Built static preview from {SANDBOX} to {PUBLIC}")


if __name__ == "__main__":
    main()
