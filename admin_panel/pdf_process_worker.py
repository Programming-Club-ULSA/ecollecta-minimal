from admin_panel.dbmanager import DatabaseManager
from admin_panel.pdf_generator import PDFGenerator
from admin_panel.species import Species, Taxonomy


def _reconstruct_species(species_data: dict) -> Species:
	taxonomy_data = species_data.get("taxonomy", {})
	taxonomy = Taxonomy(
		kingdom=taxonomy_data.get("kingdom", ""),
		phylum=taxonomy_data.get("phylum", ""),
		class_=taxonomy_data.get("class_", taxonomy_data.get("class", "")),
		order=taxonomy_data.get("order", ""),
		family=taxonomy_data.get("family", ""),
		genus=taxonomy_data.get("genus", ""),
		species=taxonomy_data.get("species", ""),
		authority=taxonomy_data.get("authority", ""),
	)

	species = Species(
		common_name=species_data.get("commonName", ""),
		description=species_data.get("description", ""),
		taxonomy=taxonomy,
		conservation_status=species_data.get("conservationStatus", ""),
		image_source="",

	)
	species.id = str(species_data.get("id", species.id))
	species.image_url = species_data.get("imageUrl", species.image_url)
	species.pdf_url = species_data.get("pdfUrl", species.pdf_url)
	return species


def generate_pdf_for_species_process(species_data: dict, pdf_dir: str) -> bool:
	species = _reconstruct_species(species_data)
	generator = PDFGenerator(pdf_dir=pdf_dir)
	generator.generate(species)
	return True


def save_species_process(
	db_path: str,
	pdf_dir: str,
	qr_dir: str,
	deployment_url: str,
	species_data: dict,
) -> bool:
	species = _reconstruct_species(species_data)
	manager = DatabaseManager(
		db_path=db_path,
		pdf_dir=pdf_dir,
		qr_dir=qr_dir,
		deployment_url=deployment_url,
	)
	return manager.save_species(species)


def update_species_process(
	db_path: str,
	pdf_dir: str,
	qr_dir: str,
	deployment_url: str,
	original_id: str,
	updated_species_data: dict,
) -> bool:
	updated_species = _reconstruct_species(updated_species_data)
	manager = DatabaseManager(
		db_path=db_path,
		pdf_dir=pdf_dir,
		qr_dir=qr_dir,
		deployment_url=deployment_url,
	)
	return manager.update_species(original_id, updated_species)
