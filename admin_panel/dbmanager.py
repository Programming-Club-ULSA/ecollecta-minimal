import json
import os
from io import BytesIO
from PIL import Image, ImageDraw
import qrcode
from qrcode.constants import ERROR_CORRECT_H

from admin_panel.pdf_generator import PDFGenerator
from admin_panel.species import Species

LEAF_PATH = os.path.join(os.path.dirname(__file__), "templates", "eco_256.png")

class DatabaseManager:
    """
    JSON persistence and asset management (QRs, PDFs)
    """
    def __init__(self, 
                 db_path, 
                 pdf_dir,
                 qr_dir, 
                 deployment_url
                 ):
        self.deployment_url = deployment_url
        self.db_path = db_path
        self.pdf_dir = pdf_dir
        self.qr_dir = qr_dir
        self.pdf_generator = PDFGenerator(pdf_dir=self.pdf_dir)
        
        os.makedirs(os.path.dirname(self.db_path), exist_ok=True)
        os.makedirs(self.pdf_dir, exist_ok=True)
        os.makedirs(self.qr_dir, exist_ok=True)

    def load_species(self) -> list:
        if os.path.exists(self.db_path):
            with open(self.db_path, 'r', encoding='utf-8') as f:
                try:
                    return json.load(f)
                except json.JSONDecodeError:
                    return []
        return []

    def _save_species_data(self, data: list):
        with open(self.db_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    def save_species(self, species: Species) -> bool:
        data = self.load_species()

        scientific_name = species.taxonomy.scientific_name

        if any(
            s.get('scientificName', '').lower() == scientific_name.lower()
            for s in data
        ):
            return False

        self.generate_qr(species)
        self.generate_pdf(species)

        data.append(species.to_dict())
        self._save_species_data(data)

        return True
    
    def update_species(self, original_id: str, updated_species: Species) -> bool:
        data = self.load_species()

        index = next(
            (i for i, item in enumerate(data) if item.get('id') == original_id),
            -1
        )
        if index < 0:
            return False

        new_scientific_name = updated_species.taxonomy.scientific_name

        duplicate = any(
            item.get('scientificName', '').lower() == new_scientific_name.lower()
            and item.get('id') != original_id
            for item in data
        )

        if duplicate:
            return False

        previous = data[index]
        data[index] = updated_species.to_dict()
        self._save_species_data(data)

        old_qr_path = os.path.join(self.qr_dir, f"{previous.get('id', '')}.png")
        old_pdf_path = os.path.join(
            self.pdf_dir,
            os.path.basename(previous.get('pdfUrl', ''))
        )

        new_qr_path = os.path.join(self.qr_dir, f"{updated_species.id}.png")
        new_pdf_path = os.path.join(
            self.pdf_dir,
            os.path.basename(updated_species.pdf_url)
        )

        if old_qr_path != new_qr_path and os.path.exists(old_qr_path):
            os.remove(old_qr_path)

        if old_pdf_path != new_pdf_path and os.path.exists(old_pdf_path):
            os.remove(old_pdf_path)

        self.generate_qr(updated_species)
        self.generate_pdf(updated_species)

        return True

    def delete_species(self, species_id: str) -> bool:
        data = self.load_species()
        match = next((item for item in data if item.get('id') == species_id), None)
        if not match:
            return False

        filtered = [item for item in data if item.get('id') != species_id]
        self._save_species_data(filtered)

        qr_path = os.path.join(self.qr_dir, f"{species_id}.png")
        pdf_path = os.path.join(self.pdf_dir, os.path.basename(match.get('pdfUrl', '')))
        if os.path.exists(qr_path):
            os.remove(qr_path)
        if os.path.exists(pdf_path):
            os.remove(pdf_path)

        return True

    def generate_qr(self, species: Species):
        full_url = f"{self.deployment_url}{species.pdf_url}"
        qr = qrcode.QRCode(
            version=2,                   # more modules
            error_correction=ERROR_CORRECT_H,
            box_size=16,                 # larger module pixels
            border=4,
        )   
        qr.add_data(full_url)
        qr.make(fit=True)

        qr_img = qr.make_image(
            fill_color="#2A9D8F",
            back_color="white"
        ).get_image().convert("RGBA")

        leaf_path = LEAF_PATH

        if leaf_path and os.path.exists(leaf_path):
            leaf = Image.open(leaf_path).convert("RGBA")

            qr_w, qr_h = qr_img.size
            icon_size = qr_w // 5

            leaf = leaf.resize((icon_size, icon_size), Image.Resampling.LANCZOS)

            bg_size = int(icon_size * 1.25)  # Background slightly bigger than icon
            bg = Image.new("RGBA", (bg_size, bg_size), (0, 0, 0, 0))

            draw = ImageDraw.Draw(bg)
            # draw a rectangle with rounded corners
            radius = bg_size // 4
            draw.rounded_rectangle((0, 0, bg_size, bg_size), fill="white", radius=radius)
            
            # Paste leaf centered over white background
            leaf_x = (bg_size - icon_size) // 2
            leaf_y = (bg_size - icon_size) // 2
            bg.paste(leaf, (leaf_x, leaf_y), leaf)

            final_x = (qr_w - bg_size) // 2
            final_y = (qr_h - bg_size) // 2
            qr_img.paste(bg, (final_x, final_y), bg)

        buffer = BytesIO()
        
        qr_img = qr_img.resize(
            (qr_img.width * 2, qr_img.height * 2),
            Image.Resampling.NEAREST # nearest preserves the sharp edges of the QR code when scaling up
        )
        qr_img.save(buffer, format="PNG")
        
        qr_path = os.path.join(self.qr_dir, f"{species.id}.png")
        with open(qr_path, 'wb') as f:
            f.write(buffer.getvalue())
            
    def generate_pdf(self, species: Species):
        self.pdf_generator.generate(species)