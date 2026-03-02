import os
from concurrent.futures import ProcessPoolExecutor
from functools import partial

from PySide6.QtCore import QTimer, Qt
from PySide6.QtWidgets import (
    QApplication,
    QAbstractItemView,
    QDialog,
    QHBoxLayout,
    QLabel,
    QMainWindow,
    QMessageBox,
    QProgressBar,
    QPushButton,
    QTableWidget,
    QTableWidgetItem,
    QVBoxLayout,
    QWidget,
)

from admin_panel.dbmanager import DatabaseManager
from admin_panel.gui_components import SpeciesDialog
from admin_panel.pdf_process_worker import (
    generate_pdf_for_species_process,
    save_species_process,
    update_species_process,
)
from admin_panel.species import Species, Taxonomy


class GUIAdminPanel(QMainWindow):
    def __init__(
        self,
        data_path,
        images_path,
        pdfs_path,
        qrs_path,
        deployment_url="https://programming-club-ulsa.github.io/ecollecta-minimal",
    ):
        super().__init__()
        self.setWindowTitle("Ecollecta-Minimal Admin Panel")
        self.resize(1080, 560)
        self._db_config = {
            "db_path": data_path,
            "pdf_dir": pdfs_path,
            "qr_dir": qrs_path,
            "deployment_url": deployment_url,
        }
        self._process_executor = ProcessPoolExecutor(max_workers=1)
        self._process_tasks: dict[int, dict] = {}
        self._process_timer = QTimer(self)
        self._process_timer.setInterval(100)
        self._process_timer.timeout.connect(self._poll_process_tasks)

        self.images_path = images_path
        self.db = DatabaseManager(
            db_path=data_path,
            pdf_dir=pdfs_path,
            qr_dir=qrs_path,
            deployment_url=deployment_url,
        )

        self.table = QTableWidget(0, 4)
        self.table.setHorizontalHeaderLabels(["QR ID", "Scientific Name", "Common Name", "Conservation"])
        self.table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SelectionMode.SingleSelection)
        self.table.horizontalHeader().setStretchLastSection(True)
        self.table.setEditTriggers(QAbstractItemView.EditTrigger.NoEditTriggers)
        self.table.verticalHeader().setVisible(False)

        title = QLabel("Registered Species")
        title.setStyleSheet("font-size: 18px; font-weight: 600;")

        self.btn_regen_qr = QPushButton("Regenerate QR")
        self.btn_regen_pdf = QPushButton("Regenerate PDF")
        self.btn_edit = QPushButton("Edit Species")
        self.btn_delete = QPushButton("Delete Species")
        self.btn_delete.setStyleSheet("background-color: #c0392b; color: white; font-weight: bold;")
        
        self.btn_regen_qr.clicked.connect(self.regenerate_qr_action)
        self.btn_regen_pdf.clicked.connect(self.regenerate_pdf_action)
        self.btn_edit.clicked.connect(self.edit_species_action)
        self.btn_delete.clicked.connect(self.delete_action)

        add_button = QPushButton("+ Add New Species")
        add_button.setStyleSheet("background-color: #27ae60; color: white; font-weight: bold;")
        add_button.clicked.connect(self.open_add_dialog)

        top_bar = QHBoxLayout()
        top_bar.addWidget(title)
        top_bar.addStretch()
        top_bar.addWidget(self.btn_regen_qr)
        top_bar.addWidget(self.btn_regen_pdf)
        top_bar.addWidget(self.btn_edit)
        top_bar.addWidget(self.btn_delete)
        top_bar.addWidget(add_button)

        container = QWidget()
        main_layout = QVBoxLayout()
        main_layout.addLayout(top_bar)
        main_layout.addWidget(self.table)
        container.setLayout(main_layout)
        self.setCentralWidget(container)

        self.refresh_list()

    def refresh_list(self):
        species_list = self.db.load_species()
        self.table.setRowCount(len(species_list))

        for row_index, item in enumerate(species_list):
            row_values = [
                item.get("id", ""),
                item.get("scientificName", ""),
                item.get("commonName", ""),
                item.get("conservationStatus", ""),
            ]
            for col_index, value in enumerate(row_values):
                table_item = QTableWidgetItem(str(value))
                table_item.setFlags(table_item.flags() & ~Qt.ItemFlag.ItemIsEditable)
                self.table.setItem(row_index, col_index, table_item)

    def _create_loading_dialog(self, title: str, message: str) -> QDialog:
        dialog = QDialog(self)
        dialog.setWindowTitle(title)
        dialog.setWindowModality(Qt.WindowModality.ApplicationModal)
        dialog.setWindowFlag(Qt.WindowType.WindowContextHelpButtonHint, False)
        dialog.setMinimumWidth(420)

        layout = QVBoxLayout(dialog)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)
        label = QLabel(message)
        label.setWordWrap(True)

        progress = QProgressBar()
        progress.setRange(0, 0)
        progress.setTextVisible(False)

        layout.addWidget(label)
        layout.addWidget(progress)

        dialog.setStyleSheet(
            "QLabel { font-size: 13px; }"
            "QProgressBar { border: 1px solid #d1d5db; border-radius: 5px; height: 14px; }"
            "QProgressBar::chunk { background: #16a34a; border-radius: 4px; }"
        )
        return dialog

    def _start_process_task(self, title: str, message: str, process_target, process_args: tuple, on_success):
        """
        This literally saved my life, always remember to use subprocesses for heavy tasks since it doesnt bloock the gui application
        """
        loading = self._create_loading_dialog(title, message)
        loading.show()
        QApplication.processEvents()

        future = self._process_executor.submit(process_target, *process_args)
        self._process_tasks[id(future)] = {
            "future": future,
            "loading": loading,
            "on_success": on_success,
        }

        if not self._process_timer.isActive():
            self._process_timer.start()

    def _poll_process_tasks(self):
        finished_ids = []
        for task_id, context in self._process_tasks.items():
            future = context["future"]
            if not future.done():
                continue

            context["loading"].close()
            try:
                result = future.result()
                context["on_success"](result)
            except Exception as error:
                QMessageBox.critical(self, "Operation Error", str(error))
            finished_ids.append(task_id)

        for task_id in finished_ids:
            self._process_tasks.pop(task_id, None)

        if not self._process_tasks and self._process_timer.isActive():
            self._process_timer.stop()

    def closeEvent(self, event):
        if self._process_timer.isActive():
            self._process_timer.stop()

        for context in self._process_tasks.values():
            context["loading"].close()
        self._process_tasks.clear()

        self._process_executor.shutdown(wait=False, cancel_futures=True)
        super().closeEvent(event)
    
    def _get_selected_species_dict(self):
        """
        Returns the data adictiony of the currently selected species
        """
        row = self.table.currentRow()
        if row < 0:
            QMessageBox.warning(self, "No Selection", "Please select a species from the table first.")
            return None

        id_item = self.table.item(row, 0)
        if id_item is None:
            QMessageBox.warning(self, "No Selection", "Selected row is invalid. Please select another species.")
            return None

        species_id = id_item.text()
        species_list = self.db.load_species()
        for s in species_list:
            if s.get("id") == species_id:
                return s
        return None

    def _reconstruct_species_object(self, data: dict, image_source: str = "") -> Species:
        tax_data = data.get("taxonomy", {})

        taxo = Taxonomy(
            tax_data.get("kingdom", ""),
            tax_data.get("phylum", ""),
            tax_data.get("class_", tax_data.get("class", "")),
            tax_data.get("order", ""),
            tax_data.get("family", ""),
            tax_data.get("genus", ""),
            tax_data.get("species", ""),
            tax_data.get("authority", ""),
        )

        species = Species(
            common_name=data.get("commonName", ""),
            description=data.get("description", ""),
            taxonomy=taxo,
            conservation_status=data.get("conservationStatus", ""),
            image_source=image_source,
        )

        species.id = str(data.get("id", species.id))

        if not image_source:
            species.image_url = data.get("imageUrl", "")

        species.pdf_url = data.get("pdfUrl", species.pdf_url)

        return species

    def _build_species_from_payload(self, payload: dict) -> Species:
        # print("Building species from payload:", payload)
        taxo = Taxonomy(
            kingdom=payload["kingdom"],
            phylum=payload["phylum"],
            class_=payload["class_"],
            order=payload["order"],
            family=payload["family"],
            genus=payload["genus"],
            species=payload["species"],
            authority=payload.get("authority", ""),
        )

        return Species(
            common_name=payload["common_name"],
            description=payload["description"],
            taxonomy=taxo,
            conservation_status=payload["conservation"],
            image_source=payload["image_source"],
        )

    def _copy_species_image(self, species: Species, image_source: str):
        if not image_source or not os.path.exists(image_source):
            raise FileNotFoundError(f"Image file was not found: {image_source}")

        os.makedirs(self.images_path, exist_ok=True)
        target_filename = os.path.basename(species.image_url)
        target_path = os.path.join(self.images_path, target_filename)
        source_abs = os.path.abspath(image_source)
        target_abs = os.path.abspath(target_path)
        if source_abs != target_abs:
            from shutil import copy2
            copy2(image_source, target_path)

    def _get_qr_impact_changes(self, original: dict, payload: dict) -> list[str]:
        taxonomy = original.get("taxonomy", {})

        comparisons = [
            ("Common Name", original.get("commonName", ""), payload["common_name"]),
            ("Kingdom", taxonomy.get("kingdom", ""), payload["kingdom"]),
            ("Phylum", taxonomy.get("phylum", ""), payload["phylum"]),
            ("Class", taxonomy.get("class_", taxonomy.get("class", "")), payload["class_"]),
            ("Order", taxonomy.get("order", ""), payload["order"]),
            ("Family", taxonomy.get("family", ""), payload["family"]),
            ("Genus", taxonomy.get("genus", ""), payload["genus"]),
            ("Species", taxonomy.get("species", ""), payload["species"]),
        ]

        return [
            label
            for label, old, new in comparisons
            if (old or "").strip() != (new or "").strip()
        ]

    def regenerate_qr_action(self):
        data = self._get_selected_species_dict()

        if not data:
            return
        
        species = self._reconstruct_species_object(data)
        
        try:
            self.db.generate_qr(species)
            QMessageBox.information(self, "Success", f"QR code for {species.scientific_name} regenerated successfully.")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to regenerate QR:\n{str(e)}")

    def regenerate_pdf_action(self):
        data = self._get_selected_species_dict()
        if not data:
            return
        scientific_name = data.get("scientificName", "Unknown")

        self._start_process_task(
            "Generating PDF",
            "Generating PDF, please wait...",
            generate_pdf_for_species_process,
            (data, self._db_config["pdf_dir"]),
            partial(self._on_pdf_regenerated, scientific_name),
        )

    def _on_pdf_regenerated(self, scientific_name: str, _result):
        QMessageBox.information(self, "Success", f"PDF for {scientific_name} regenerated successfully.")

    def edit_species_action(self):
        data = self._get_selected_species_dict()
        if not data:
            return

        dialog = SpeciesDialog(self, mode="edit", initial_data=data, images_path=self.images_path)
        if dialog.exec() != dialog.DialogCode.Accepted:
            return

        payload = dialog.get_payload()
        qr_impact_changes = self._get_qr_impact_changes(data, payload)
        if qr_impact_changes:
            changed_fields = "\n- " + "\n- ".join(qr_impact_changes)
            answer = QMessageBox.warning(
                self,
                "QR Update Warning",
                "You modified fields that affect QR values:" + changed_fields + "\n\nQR and PDF will be regenerated. Continue?",
                QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.Cancel,
                QMessageBox.StandardButton.Cancel,
            )
            if answer != QMessageBox.StandardButton.Yes:
                return

        try:
            updated_species = self._build_species_from_payload(payload)
            self._copy_species_image(updated_species, payload["image_source"])
        except Exception as error:
            QMessageBox.critical(self, "Validation Error", str(error))
            return

        original_id = str(data.get("id", ""))

        self._start_process_task(
            "Updating Species",
            "Updating species, regenerating QR/PDF as needed...",
            update_species_process,
            (
                self._db_config["db_path"],
                self._db_config["pdf_dir"],
                self._db_config["qr_dir"],
                self._db_config["deployment_url"],
                original_id,
                updated_species.to_dict(),
            ),
            partial(self._on_species_updated, updated_species.scientific_name),
        )

    def _on_species_updated(self, scientific_name: str, updated: bool):
        if updated:
            self.refresh_list()
            QMessageBox.information(self, "Updated", f"Species '{scientific_name}' updated successfully.")
            return

        QMessageBox.critical(
            self,
            "Update Failed",
            "Could not update species. It may not exist or conflicts with another scientific name.",
        )

    def delete_action(self):
        data = self._get_selected_species_dict()
        if not data:
            return

        scientific_name = data.get("scientificName", "Unknown")
        species_id = data.get("id", "")

        msg = QMessageBox(self)
        msg.setIcon(QMessageBox.Icon.Critical)
        msg.setWindowTitle("URGENT: Delete Species")
        msg.setText(f"Are you sure you want to permanently delete <b>{scientific_name}</b>?")
        msg.setInformativeText(
            "<span style='color: red; font-weight: bold;'>WARNING:</span> "
            "Deleting this species will instantly break the physical QR codes already placed on the campus trees! "
            "<br><br>"
            "You <b>MUST</b> physically remove or update the QRs from the site in real life to prevent broken links."
        )
        msg.setStandardButtons(QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.Cancel)
        msg.setDefaultButton(QMessageBox.StandardButton.Cancel)

        if msg.exec() == QMessageBox.StandardButton.Yes:
            deleted = self.db.delete_species(species_id)
            if deleted:
                self.refresh_list()
                QMessageBox.information(self, "Deleted", f"{scientific_name} has been removed from the database.")
            else:
                QMessageBox.critical(self, "Delete Failed", "The selected species could not be deleted.")


    def open_add_dialog(self):
        dialog = SpeciesDialog(self, mode="add", images_path=self.images_path)
        if dialog.exec() != dialog.DialogCode.Accepted:
            return

        payload = dialog.get_payload()

        try:
            species = self._build_species_from_payload(payload)
            self._copy_species_image(species, payload["image_source"])
        except Exception as error:
            QMessageBox.critical(self, "Validation Error", str(error))
            return

        self._start_process_task(
            "Saving Species",
            "Saving species and generating PDF, please wait...",
            save_species_process,
            (
                self._db_config["db_path"],
                self._db_config["pdf_dir"],
                self._db_config["qr_dir"],
                self._db_config["deployment_url"],
                species.to_dict(),
            ),
            partial(self._on_species_saved, species.id),
        )

    def _on_species_saved(self, species_id: str, saved: bool):
        if saved:
            QMessageBox.information(self, "Success", f"Species saved successfully.\nID: {species_id}")
            self.refresh_list()
            return

        QMessageBox.critical(self, "Duplicate Species", "A species with that scientific name already exists.")