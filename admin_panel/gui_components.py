import os

from PySide6.QtCore import QObject, Signal, Slot
from PySide6.QtWidgets import (
    QComboBox,
    QDialog,
    QFileDialog,
    QFormLayout,
    QHBoxLayout,
    QLabel,
    QLineEdit,
    QMessageBox,
    QPushButton,
    QTextEdit,
    QVBoxLayout,
    QWidget,
)

from admin_panel.species import IUCNStatus


class BackgroundWorker(QObject):
    succeeded = Signal(object)
    failed = Signal(str)
    finished = Signal()

    def __init__(self, task):
        super().__init__()
        self.task = task

    @Slot()
    def run(self):
        try:
            result = self.task()
            self.succeeded.emit(result)
        except Exception as error:
            self.failed.emit(str(error))
        finally:
            self.finished.emit()


class SpeciesDialog(QDialog):
    def __init__(
        self,
        parent: QWidget | None = None,
        mode: str = "add",
        initial_data: dict | None = None,
        images_path: str = "",
    ):
        super().__init__(parent)

        self.mode = mode
        self.initial_data = initial_data or {}
        self.images_path = images_path

        self.setWindowTitle(
            "Add New Species" if self.mode == "add" else "Edit Species"
        )
        self.resize(640, 650)

        # Core fields
        self.common_name_input = QLineEdit()
        self.description_input = QTextEdit()
        self.description_input.setMinimumHeight(120)

        # Taxonomy fields
        self.kingdom_input = QLineEdit()
        self.phylum_input = QLineEdit()
        self.class_input = QLineEdit()
        self.order_input = QLineEdit()
        self.family_input = QLineEdit()
        self.genus_input = QLineEdit()
        self.species_input = QLineEdit()  
        self.authority_input = QLineEdit(placeholderText="Linnaeus, 1758 (optional)")

        # Conservation
        self.conservation_input = QComboBox()
        self.conservation_input.addItem("Select IUCN category", "")
        for label, code in IUCNStatus.choices():
            self.conservation_input.addItem(label, code)

        # Image
        self.image_path_input = QLineEdit()
        self.image_path_input.setReadOnly(True)

        self._build_ui()

        if self.initial_data:
            self._fill_initial_values()

    def _build_ui(self):
        form = QFormLayout()

        form.addRow("Common Name *", self.common_name_input)

        form.addRow("Kingdom", self.kingdom_input)
        form.addRow("Phylum", self.phylum_input)
        form.addRow("Class", self.class_input)
        form.addRow("Order", self.order_input)
        form.addRow("Family *", self.family_input)
        form.addRow("Genus *", self.genus_input)
        form.addRow("Species (epithet) *", self.species_input)

        form.addRow("Authority", self.authority_input)

        form.addRow("Conservation Status *", self.conservation_input)

        form.addRow("Description", self.description_input)

        browse_button = QPushButton("Browse...")
        browse_button.clicked.connect(self.select_image)

        image_row = QHBoxLayout()
        image_row.addWidget(self.image_path_input)
        image_row.addWidget(browse_button)

        wrapper = QWidget()
        wrapper.setLayout(image_row)

        form.addRow("Image *", wrapper)

        cancel_button = QPushButton("Cancel")
        action_button = QPushButton(
            "Save Species" if self.mode == "add" else "Update Species"
        )

        cancel_button.clicked.connect(self.reject)
        action_button.clicked.connect(self.validate_and_accept)

        buttons = QHBoxLayout()
        buttons.addStretch()
        buttons.addWidget(cancel_button)
        buttons.addWidget(action_button)

        layout = QVBoxLayout()
        layout.addLayout(form)
        layout.addLayout(buttons)

        self.setLayout(layout)

    def _fill_initial_values(self):
        taxonomy = self.initial_data.get("taxonomy", {})

        self.common_name_input.setText(
            self.initial_data.get("commonName", "")
        )
        self.description_input.setPlainText(
            self.initial_data.get("description", "")
        )

        self.kingdom_input.setText(taxonomy.get("kingdom", ""))
        self.phylum_input.setText(taxonomy.get("phylum", ""))
        self.class_input.setText(taxonomy.get("class_", ""))
        self.order_input.setText(taxonomy.get("order", ""))
        self.family_input.setText(taxonomy.get("family", ""))
        self.genus_input.setText(taxonomy.get("genus", ""))
        self.species_input.setText(taxonomy.get("species", ""))
        self.authority_input.setText(taxonomy.get("authority", ""))

        status = self.initial_data.get("conservationStatus", "")
        index = self.conservation_input.findData(status)
        if index >= 0:
            self.conservation_input.setCurrentIndex(index)

    def select_image(self):
        file_path, _ = QFileDialog.getOpenFileName(
            self,
            "Select species image",
            "",
            "Image files (*.jpg *.jpeg *.png)",
        )
        if file_path:
            self.image_path_input.setText(file_path)

    def validate_and_accept(self):
        required_fields = {
            "Common Name": self.common_name_input.text(),
            "Family": self.family_input.text(),
            "Genus": self.genus_input.text(),
            "Species": self.species_input.text(),
            "Conservation Status": self.conservation_input.currentData(),
            "Image": self.image_path_input.text(),
        }

        missing = [name for name, value in required_fields.items() if not str(value).strip()]

        if missing:
            QMessageBox.critical(
                self,
                "Validation Error",
                "Please fill the following required fields:\n\n- "
                + "\n- ".join(missing),
            )
            return

        self.accept()

    def get_payload(self) -> dict:
        return {
            "common_name": self.common_name_input.text().strip(),
            "description": self.description_input.toPlainText().strip(),
            "kingdom": self.kingdom_input.text().strip(),
            "phylum": self.phylum_input.text().strip(),
            "class_": self.class_input.text().strip(),
            "order": self.order_input.text().strip(),
            "family": self.family_input.text().strip(),
            "genus": self.genus_input.text().strip(),
            "species": self.species_input.text().strip(),
            "conservation": self.conservation_input.currentData(),
            "image_source": self.image_path_input.text().strip(),
            "authority": self.authority_input.text().strip(),
        }
