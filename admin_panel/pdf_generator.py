import os
import html
import time

from jinja2 import Environment, FileSystemLoader
import markdown as md
from pyhtml2pdf import converter

from admin_panel.species import Species, IUCNStatus

class PDFGenerator:
    def __init__(self, pdf_dir: str, template_dir: str = "admin_panel/templates"):
        self.pdf_dir = pdf_dir
        self.template_dir = template_dir
        os.makedirs(self.pdf_dir, exist_ok=True)
        # make sure the template directory exists
        os.makedirs(self.template_dir, exist_ok=True) 

    def _resolve_output_path(self, species: Species) -> str:
        """
        Resolve for the output path
        """
        file_name = os.path.basename(species.pdf_url)
        return os.path.join(self.pdf_dir, file_name)

    def _resolve_image_path(self, species: Species) -> str:
        """
        Find the image path based on the image URL and return a file URI for pyhtml2pdf
        """
        image_file = os.path.basename(species.image_url)
        
        images_dir = os.path.abspath(os.path.join(self.pdf_dir, os.pardir, "images"))
        abs_path = os.path.join(images_dir, image_file)
        
        # URI format required by pyhtml2pdf, also handle Windows path separators
        return f"file:///{abs_path.replace(os.sep, '/')}"

    def _description_markdown_to_html(self, text: str) -> str:
        source = (text or "").strip()
        if not source:
            return "<p>No description provided.</p>"

        try:
            return md.markdown(
                source,
                extensions=["extra", "sane_lists", "nl2br"],
                output_format="html",
            )
        except Exception:
            safe = html.escape(source).replace("\n", "<br>")
            return f"<p>{safe}</p>"

    def _get_conservation_status_long(self, species: Species) -> str:
        try:
            status = IUCNStatus(species.conservation_status)
            return status.label_es()
        except ValueError:
            return "Not Evaluated"

    def generate(self, species: Species):
        env = Environment(loader=FileSystemLoader(self.template_dir))
        try:
            template = env.get_template('template.html')
        except Exception:
            print(f"[-] Error: Didnt find template 'template.html' at {self.template_dir}")
            return

        taxonomy = vars(species.taxonomy) if getattr(species, "taxonomy", None) else {}
        html_content = template.render(
            species=species,
            taxonomy=taxonomy,
            scientific_name=species.scientific_name,
            full_scientific_name=species.full_scientific_name,
            formatted_scientific_name=species.formatted_scientific_name,
            common_name=species.common_name,
            description=species.description,
            description_html=self._description_markdown_to_html(species.description),
            conservation_code=species.conservation_status,
            conservation_status=self._get_conservation_status_long(species),
            image_absolute_path=self._resolve_image_path(species),
            generation_date=time.strftime("%Y-%m-%d %H:%M:%S"),
        )

        # temporal html file is needed because pyhtml2pdf only accepts file paths, not raw HTML strings.
        temp_html_path = os.path.abspath(f"temp_{species.id}.html")
        with open(temp_html_path, 'w', encoding='utf-8') as f:
            f.write(html_content)

        output_path = self._resolve_output_path(species)
        
        try:
            target_uri = f"file:///{temp_html_path.replace(os.sep, '/')}"
            converter.convert(target_uri, output_path)
            print(f"[+] PDF generated: {output_path}")
        except Exception as e:
            print(f"[-] Error from pyhtml: {e}")
        finally:
            if os.path.exists(temp_html_path):
                try:
                    os.remove(temp_html_path)
                except PermissionError:
                    # if windows is still locking the file, we can try again after a short delay
                    time.sleep(0.5)
                    try:
                        os.remove(temp_html_path)
                    except Exception as e:
                        print(f"[-] Warning: Could not delete temp HTML file: {e}")