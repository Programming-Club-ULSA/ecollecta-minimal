# Ecollecta - Minimal ULSA

Repositorio del Club de Programación ULSA para el archivo botánico del campus. Versión minimalista estática enfocada en la gestión de especies, generación de fichas PDF y QR, y despliegue en GitHub Pages.

El proyecto tiene dos partes:
- **Frontend web estático** (React + Vite): muestra especies, detalle y fichas PDF.
- **Panel admin local** (PySide6): permite gestionar especies y regenerar QR/PDF.

---

## 1) Requisitos

### Frontend
- Node.js LTS
- npm

### Admin panel (Python)
- Python 3.11+ (recomendado)
- Chrome/Chromium instalado (requerido por `pyhtml2pdf`)

---

## 2) Estructura clave

- [src/data/species.json](src/data/species.json): fuente de datos principal del frontend.
- [public/images](public/images): imágenes usadas por fichas y cards.
- [public/pdfs](public/pdfs): fichas PDF finales.
- [public/qrs](public/qrs): QR generados por el panel admin.
- [src/pages/Home.tsx](src/pages/Home.tsx): landing principal.
- [src/pages/SpeciesDetail.tsx](src/pages/SpeciesDetail.tsx): detalle con render de Markdown.
- [run_admin.py](run_admin.py): entrada del panel admin en GUI.
- [admin_panel/gui.py](admin_panel/gui.py): lógica principal de UI admin.

---

## 3) Setup rápido

### Frontend
```bash
npm install
```

### Python (admin panel)
```bash
python -m venv .venv
# Windows PowerShell
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

## 4) Comandos de trabajo

### Frontend
```bash
npm run dev      # servidor local Vite
npm run build    # build producción
npm run preview  # previsualizar build
npm run lint     # lint del proyecto
```

### Admin panel
```bash
python run_admin.py
```

---

## 5) Flujo recomendado para agregar/editar especies

1. Abrir panel admin (`python run_admin.py`).
2. Crear o editar especie desde GUI.
3. Verificar que se actualizaron:
   - [src/data/species.json](src/data/species.json)
   - [public/images](public/images)
   - [public/pdfs](public/pdfs)
   - [public/qrs](public/qrs)
4. Ejecutar `npm run build` para validar frontend.
5. Hacer commit con datos/activos sincronizados.

---

## 6) Markdown en descripciones (detalle de especie)

El detalle renderiza Markdown con `react-markdown` + `remark-gfm` en [src/pages/SpeciesDetail.tsx](src/pages/SpeciesDetail.tsx).

Se soporta:
- Encabezados (`#`, `##`, ...)
- Negritas/cursivas
- Listas
- Tablas (GFM)
- Saltos de línea y enlaces

Si el Markdown “se ve como texto plano”, revisar:
1. que `react-markdown` y `remark-gfm` estén instalados,
2. que la clase `prose` siga aplicada en el contenedor,
3. que Tailwind Typography esté habilitado en [src/index.css](src/index.css).

---

## 7) Routing y GitHub Pages

- El proyecto usa `HashRouter` en [src/App.tsx](src/App.tsx) para funcionar bien en Pages.
- La URL base de producción está en `homepage` dentro de [package.json](package.json).

---

## 8) Deploy

Deploy automático por GitHub Actions en [.github/workflows/deploy.yml](.github/workflows/deploy.yml).

Se dispara al crear un tag con formato `v*`:
```bash
git tag v1.0.0
git push origin v1.0.0
```

También puede ejecutarse manualmente con `workflow_dispatch`.

---

## 9) Troubleshooting común

### El admin tarda o se traba al generar PDF
- La generación usa Chrome headless (`pyhtml2pdf`), puede ser lenta.
- Esperar a que termine la tarea y verificar que Chrome esté instalado.

### Imagen o PDF no aparecen en web
- Confirmar rutas en `species.json` (`/images/...`, `/pdfs/...`).
- Confirmar que el archivo existe en `public/`.

### El detalle no encuentra especie
- Revisar que el `id` en URL coincida exactamente con `id` en `species.json`.

### Build local falla
- Reinstalar paquetes: `npm ci`.
- Revisar versión Node LTS.

---

## 10) Convenciones del Club

- No editar manualmente QR/PDF en `public/` si provienen del flujo admin.
- Mantener nombres de assets consistentes con lo generado por admin.
- Antes de PR: correr `npm run build` y validar vista Home + SpeciesDetail.
- Commits sugeridos:
  - `feat(species): add <nombre comun>`
  - `fix(markdown): adjust detail rendering`
  - `chore(deploy): update pages workflow`

---

## 11) Stack técnico

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + shadcn/ui
- React Router
- react-markdown + remark-gfm
- Python + PySide6 + pyhtml2pdf + qrcode

---

## 12) Contacto interno

Para dudas de operación, priorizar issues y PRs en este repo con contexto mínimo:
- qué intentaste,
- comando ejecutado,
- error exacto,
- screenshot/log cuando aplique.


## Fuentes Consultadas
Aca se pueden ver las fuentes que se consultaron para la redacción de las fichas técnicas.
- https://tropicos.org/
- http://tiangue-biodiversidad.com
- https://www.iucnredlist.org
- https://ticorico.org
- https://enciclovida.mx