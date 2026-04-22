import { useParams, Link } from "react-router-dom";
import { getAllSpecies } from "@/lib/species";
import { useEffect, useState } from "react";
import type { Species } from "@/types/species";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Download,
  Leaf,
} from "lucide-react";
import { FallingLeaves } from "@/components/FallingLeaves";
import fullLogo from "@/assets/full_logo.svg";

function getStatusMeta(status: string) {
  if (status === "CR") {
    return {
      label: "Critica",
      chipClassName: "bg-red-600 text-white",
      panelClassName: "border-red-200 bg-red-50 text-red-700",
      description: "Requiere atencion inmediata por su alto nivel de riesgo.",
    };
  }

  if (status === "EN") {
    return {
      label: "En Peligro",
      chipClassName: "bg-red-500 text-white",
      panelClassName: "border-red-200 bg-red-50 text-red-700",
      description: "Presenta riesgo alto y necesita acciones de conservacion.",
    };
  }

  if (status === "VU") {
    return {
      label: "Vulnerable",
      chipClassName: "bg-[#ffb13c] text-slate-900",
      panelClassName: "border-[#ffb13c]/35 bg-[#ffb13c]/12 text-[#8a5a00]",
      description: "Debe monitorearse para evitar un aumento en su nivel de amenaza.",
    };
  }

  if (status === "NT") {
    return {
      label: "Casi Amenazada",
      chipClassName: "bg-[#ffcf70] text-slate-900",
      panelClassName: "border-[#ffcf70]/35 bg-[#ffcf70]/12 text-[#8a5a00]",
      description: "Se encuentra cercana a categorias de mayor riesgo.",
    };
  }

  return {
    label: "Normal",
    chipClassName: "bg-primary text-white",
    panelClassName: "border-primary/30 bg-primary/10 text-primary",
    description: "Se mantiene sin alertas inmediatas dentro del archivo actual.",
  };
}

export default function SpeciesDetail() {
  const { id } = useParams();
  const [species, setSpecies] = useState<Species | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getAllSpecies().then((data) => {
      const found = data.find((s) => s.id === id);
      setSpecies(found || null);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-6 text-slate-700"
        style={{
          fontFamily: '"Jost", "Segoe UI", "Helvetica Neue", sans-serif',
        }}
      >
        Cargando ficha botanica...
      </div>
    );
  }

  if (!species) {
    return (
      <div
        className="flex min-h-screen items-center justify-center bg-[#f5f8f6] px-6"
        style={{
          fontFamily: '"Jost", "Segoe UI", "Helvetica Neue", sans-serif',
        }}
      >
        <div className="w-full max-w-xl rounded-3xl border border-primary/18 bg-white/92 px-8 py-12 text-center shadow-[0_24px_50px_-35px_rgba(35,137,53,0.5)]">
          <h1 className="text-3xl font-bold text-slate-900">Especie no encontrada</h1>
          <p className="mt-3 text-slate-600">
            La ficha que intentas abrir no esta disponible en el archivo actual.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-full bg-primary px-6 text-white hover:bg-primary/90">
              <Link to="/archive">Volver al archivo</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#140dbd]/25 bg-white text-[#140dbd] hover:bg-[#140dbd]/5"
            >
              <Link to="/">Ir al inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const statusMeta = getStatusMeta(species.conservationStatus);
  const taxonomyItems = [
    ["Reino", species.taxonomy.kingdom],
    ["Filo", species.taxonomy.phylum],
    ["Clase", species.taxonomy.class_],
    ["Orden", species.taxonomy.order],
    ["Familia", species.taxonomy.family],
    ["Genero", species.taxonomy.genus],
    ["Especie", species.taxonomy.species],
    ["Autoridad", species.taxonomy.authority || "No especificada"],
  ];

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#f5f8f6] text-slate-900"
      style={{
        fontFamily: '"Jost", "Segoe UI", "Helvetica Neue", sans-serif',
      }}
    >
      <FallingLeaves />

      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-28 top-[-140px] h-[340px] w-[340px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute right-[-80px] top-[100px] h-[300px] w-[300px] rounded-full bg-[#140dbd]/16 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#ffb13c]/18 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10 pt-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            asChild
            variant="ghost"
            className="-ml-3 rounded-full px-4 text-slate-700 hover:bg-white/70 hover:text-primary"
          >
            <Link to="/archive">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al archivo
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#140dbd]/25 bg-white/85 text-[#140dbd] hover:bg-[#140dbd]/5"
          >
            <Link to="/">
              Ir al inicio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8 text-center">
          <img
            src={fullLogo}
            alt="Universidad Tecnologica La Salle"
            className="mx-auto h-14 w-auto md:h-16"
          />
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-6 pb-20">
        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div className="overflow-hidden rounded-3xl border border-primary/18 bg-white shadow-[0_24px_55px_-35px_rgba(15,23,42,0.45)]">
            <img
              src={species.imageUrl}
              alt={species.commonName}
              className="h-80 w-full object-cover md:h-[28rem]"
            />
          </div>

          <div className="rounded-3xl border border-primary/18 bg-white/95 p-7 shadow-[0_24px_55px_-35px_rgba(20,13,189,0.38)] backdrop-blur-sm md:p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              <Leaf className="h-4 w-4" />
              Ficha botanica oficial
            </div>

            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              {species.commonName}
            </h1>

            <p className="mt-3 text-lg italic text-slate-600">{species.fullScientificName}</p>

            <div
              className={`mt-6 rounded-2xl border px-4 py-4 ${statusMeta.panelClassName}`}
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`status-chip inline-flex rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-md ${statusMeta.chipClassName}`}
                >
                  {statusMeta.label}
                </span>
                <span className="text-sm font-semibold">
                  Estado de conservacion: {species.conservationStatus}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed opacity-90">{statusMeta.description}</p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-slate-200 bg-[#f8fbf8] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#140dbd]">
                  Orden
                </p>
                <p className="mt-1 font-medium text-slate-800">{species.taxonomy.order}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-[#f8fbf8] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#140dbd]">
                  Familia
                </p>
                <p className="mt-1 font-medium text-slate-800">{species.taxonomy.family}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f8fbf8] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#140dbd]">
                  Genero
                </p>
                <p className="mt-1 font-medium text-slate-800">{species.taxonomy.genus}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#f8fbf8] px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#140dbd]">
                  Especie
                </p>
                <p className="mt-1 font-medium text-slate-800">{species.taxonomy.species}</p>
              </div>

              {/* CENTERED BUTTONS: col-span-2 is key here */}
              <div className="col-span-2 mt-4 flex flex-wrap justify-center gap-3">
                <Button
                  asChild
                  className="rounded-full bg-primary px-8 text-white hover:bg-primary/90 shadow-lg transition-all"
                >
                  <a href={species.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[#140dbd]/25 bg-white text-[#140dbd] hover:bg-[#140dbd]/5 px-8 transition-all"
                >
                  <Link to="/archive">
                    <BookOpenText className="mr-2 h-4 w-4" />
                    Ver archivo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-3xl border border-primary/18 bg-white/95 p-7 shadow-[0_24px_55px_-35px_rgba(35,137,53,0.4)] md:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#140dbd]">
              Descripcion
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Perfil botanico</h2>

            <div className="prose prose-slate prose-headings:text-slate-900 prose-a:text-primary prose-strong:text-slate-900 mt-6 max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {species.description}
              </ReactMarkdown>
            </div>
          </article>

          <aside className="space-y-6">
            <div className="rounded-3xl border border-[#140dbd]/18 bg-white/95 p-7 shadow-[0_24px_55px_-35px_rgba(20,13,189,0.35)] md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#140dbd]">
                Taxonomia
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Clasificacion cientifica</h3>

              <div className="mt-6 space-y-3">
                {taxonomyItems.map(([label, value]) => (
                  <div
                    key={label}
                    className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-[#f8f8ff] px-4 py-3"
                  >
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#140dbd]">
                      {label}
                    </span>
                    <span className="text-right text-sm font-medium text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-primary/18 bg-white/95 p-7 shadow-[0_24px_55px_-35px_rgba(35,137,53,0.35)] md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#140dbd]">
                Consulta rapida
              </p>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">Acciones disponibles</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                Descarga la ficha cientifica o regresa al archivo para continuar
                explorando otras especies del campus.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <Button
                  asChild
                  className="rounded-full bg-primary text-white hover:bg-primary/90"
                >
                  <a href={species.pdfUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="mr-2 h-4 w-4" />
                    Descargar ficha cientifica
                  </a>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="rounded-full border-[#140dbd]/25 bg-white text-[#140dbd] hover:bg-[#140dbd]/5"
                >
                  <Link to="/archive">
                    Continuar en el archivo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}