from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import os


ROOT = Path(__file__).resolve().parents[1] / "sandbox"


class CleanUrlHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        raw_path = path.split("?", 1)[0].split("#", 1)[0]
        translated = Path(super().translate_path(path))

        if raw_path != "/" and not translated.exists() and "." not in Path(raw_path).name:
            html_path = ROOT / f"{raw_path.lstrip('/')}.html"
            if html_path.exists():
                return str(html_path)

        return str(translated)


if __name__ == "__main__":
    os.chdir(ROOT)
    server = ThreadingHTTPServer(("127.0.0.1", 8081), CleanUrlHandler)
    print("Serving sandbox on http://127.0.0.1:8081/")
    server.serve_forever()
