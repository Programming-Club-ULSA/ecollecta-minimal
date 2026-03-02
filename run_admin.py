import sys
import os

from PySide6.QtWidgets import QApplication
from admin_panel.gui import GUIAdminPanel

PUBLIC_PATH = os.path.join(os.path.dirname(__file__), 'public')
IMAGES_PATH = os.path.join(PUBLIC_PATH, 'images')
PDFS_PATH = os.path.join(PUBLIC_PATH, 'pdfs')
QRS_PATH = os.path.join(PUBLIC_PATH, 'qrs')
DATA_FILE = os.path.join(os.path.dirname(__file__), 'src', 'data', 'species.json')
DEPLOYMENT_URL = "https://programming-club-ulsa.github.io/ecollecta-minimal"


def validate_paths():
    if not os.path.exists(PUBLIC_PATH):
        print(f"Error: Could not find the 'public' directory at {PUBLIC_PATH}.")
        sys.exit(1)


def main():
    validate_paths()
    qt_app = QApplication(sys.argv)
    window = GUIAdminPanel(data_path=DATA_FILE, images_path=IMAGES_PATH, pdfs_path=PDFS_PATH, qrs_path=QRS_PATH, deployment_url=DEPLOYMENT_URL)
    window.show()
    sys.exit(qt_app.exec())

if __name__ == "__main__":
    main()