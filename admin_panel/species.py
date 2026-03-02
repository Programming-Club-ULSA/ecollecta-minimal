import hashlib
import os
from enum import Enum

from admin_panel.utils import slugify


class IUCNStatus(str, Enum):
    EXTINCT = "EX"
    EXTINCT_IN_THE_WILD = "EW"
    CRITICALLY_ENDANGERED = "CR"
    ENDANGERED = "EN"
    VULNERABLE = "VU"
    NEAR_THREATENED = "NT"
    LEAST_CONCERN = "LC"
    DATA_DEFICIENT = "DD"
    NOT_EVALUATED = "NE"

    @classmethod
    def choices(cls) -> list[tuple[str, str]]:
        return [
            ("Extinct (EX)", cls.EXTINCT.value),
            ("Extinct in the Wild (EW)", cls.EXTINCT_IN_THE_WILD.value),
            ("Critically Endangered (CR)", cls.CRITICALLY_ENDANGERED.value),
            ("Endangered (EN)", cls.ENDANGERED.value),
            ("Vulnerable (VU)", cls.VULNERABLE.value),
            ("Near Threatened (NT)", cls.NEAR_THREATENED.value),
            ("Least Concern (LC)", cls.LEAST_CONCERN.value),
            ("Data Deficient (DD)", cls.DATA_DEFICIENT.value),
            ("Not Evaluated (NE)", cls.NOT_EVALUATED.value),
        ]
    
    def label_en(self) -> str:
        return {
            self.EXTINCT: "Extinct",
            self.EXTINCT_IN_THE_WILD: "Extinct in the Wild",
            self.CRITICALLY_ENDANGERED: "Critically Endangered",
            self.ENDANGERED: "Endangered",
            self.VULNERABLE: "Vulnerable",
            self.NEAR_THREATENED: "Near Threatened",
            self.LEAST_CONCERN: "Least Concern",
            self.DATA_DEFICIENT: "Data Deficient",
            self.NOT_EVALUATED: "Not Evaluated",
        }[self]
    
    def label_es(self) -> str:
        return {
            self.EXTINCT: "Extinto",
            self.EXTINCT_IN_THE_WILD: "Extinto en estado silvestre",
            self.CRITICALLY_ENDANGERED: "En peligro crítico",
            self.ENDANGERED: "En peligro",
            self.VULNERABLE: "Vulnerable",
            self.NEAR_THREATENED: "Casi amenazado",
            self.LEAST_CONCERN: "Preocupación menor",
            self.DATA_DEFICIENT: "Datos insuficientes",
            self.NOT_EVALUATED: "No evaluado",
        }[self]

class Taxonomy:
    def __init__(self, kingdom: str, phylum: str, class_: str, order: str, family: str, genus: str, species: str, authority=""):
        self.kingdom = kingdom
        self.phylum = phylum
        self.class_ = class_
        self.order = order
        self.family = family
        self.genus = genus
        self.species = species
        self.authority = authority

    @property
    def scientific_name(self):
        if self.genus and self.species:
            return f"{self.genus} {self.species}"
        return ""
    
    @property
    def full_scientific_name(self):
        if self.scientific_name:
            if self.authority:
                return f"{self.scientific_name} {self.authority}"
            return self.scientific_name
        return ""
    
    @property
    def formatted_scientific_name(self):
        """
        Formatted for html display, with italics and authority
        """
        if self.scientific_name:
            if self.authority:
                return f"<i>{self.scientific_name}</i> {self.authority}"
            return f"<i>{self.scientific_name}</i>"
        return ""

class Species:
    def __init__(
        self,
        common_name: str,
        description: str,
        taxonomy: Taxonomy,
        conservation_status: str,
        image_source: str = "",
    ):
        if not taxonomy or not taxonomy.scientific_name:
            raise ValueError("Valid taxonomy with genus and species is required.")

        self.taxonomy = taxonomy
        self.common_name = common_name
        self.description = description
        self.conservation_status = self._normalize_conservation_status(conservation_status)

        self.id = self._generate_id()

        slug_name = slugify(self.common_name or self.scientific_name)

        ext = os.path.splitext(image_source)[1].lower() if image_source else ".jpg"
        if not ext:
            ext = ".jpg"

        self.image_url = f"/ecollecta-minimal/images/{slug_name}-thumb{ext}"
        self.pdf_url = f"/ecollecta-minimal/pdfs/{slug_name}.pdf"

    @property
    def scientific_name(self):
        return self.taxonomy.scientific_name

    @property
    def full_scientific_name(self):
        return self.taxonomy.full_scientific_name
    
    @property
    def formatted_scientific_name(self):
        return self.taxonomy.formatted_scientific_name

    @staticmethod
    def _normalize_conservation_status(conservation_status: str) -> str:
        status = (conservation_status or "").strip().upper()
        valid_values = {item.value for item in IUCNStatus}
        if status not in valid_values:
            raise ValueError(f"Invalid IUCN status '{conservation_status}'. Allowed values: {', '.join(sorted(valid_values))}")
        return status

    def _generate_id(self) -> str:
        initials = [
            slugify(self.taxonomy.kingdom)[:3],
            slugify(self.taxonomy.phylum)[:3],
            slugify(self.taxonomy.class_)[:3],
            slugify(self.taxonomy.order)[:3],
            slugify(self.taxonomy.family)[:3],
            slugify(self.taxonomy.genus)[:3],
            slugify(self.taxonomy.species)[:3],
        ]
        base_code = "QR-" + "_".join(i.upper() for i in initials)

        hash_part = hashlib.sha1(self.scientific_name.encode("utf-8")).hexdigest()[:6].upper()
        
        return f"{base_code}-{hash_part}"

    def to_dict(self):
        return {
            "id": self.id,
            "scientificName": self.taxonomy.scientific_name,
            "fullScientificName": self.taxonomy.full_scientific_name,
            "commonName": self.common_name,
            "description": self.description,
            "taxonomy": {
                **vars(self.taxonomy),
                "scientificName": self.taxonomy.scientific_name,
            },
            "conservationStatus": self.conservation_status,
            "imageUrl": self.image_url,
            "pdfUrl": self.pdf_url,
        }
    