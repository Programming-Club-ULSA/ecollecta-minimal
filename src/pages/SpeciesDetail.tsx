import { useParams, Link } from "react-router-dom";
import { getAllSpecies } from "@/lib/species";
import { useEffect, useState } from "react";
import type { Species } from "@/types/species";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, BookOpenText } from "lucide-react";
import { FallingLeaves } from "@/components/FallingLeaves";

export default function SpeciesDetail() {
  const { id } = useParams();
  const [species, setSpecies] = useState<Species | null>(null);

  useEffect(() => {
    getAllSpecies().then((data) => {
      const found = data.find((s) => s.id === id);
      setSpecies(found || null);
    });
  }, [id]);

  if (!species)
    return <div className="p-10 text-center">Cargando ficha botánica...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans relative">
      <FallingLeaves />

      <header className="relative z-20 bg-white/90 border-b border-slate-200 sticky top-0 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between gap-3">
          <Button asChild variant="ghost" className="text-slate-700 hover:text-green-700 -ml-3">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
            <Link to="/archive">Archivo de especies</Link>
          </Button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        <article className="rounded-2xl border border-slate-200 bg-white/95 shadow-sm overflow-hidden">
          <img
            src={species.imageUrl}
            alt={species.commonName}
            className="w-full h-80 md:h-96 object-cover"
          />

          <div className="p-6 md:p-10">
            <p className="text-xs uppercase tracking-widest text-green-700 font-semibold mb-3">
              Ficha botánica oficial
            </p>

            <h1 className="text-4xl font-bold text-slate-900 mb-2">{species.commonName}</h1>

            <p className="italic text-lg text-slate-600 mb-6">{species.scientificName}</p>

            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-red-50 text-red-700 px-3 py-1.5 text-sm font-semibold">
              Estado de Conservación: {species.conservationStatus}
            </div>

            <div className="prose prose-slate prose-headings:text-slate-800 prose-a:text-green-700 max-w-none mb-10">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {species.description}
              </ReactMarkdown>
            </div>

            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <a href={species.pdfUrl} target="_blank" rel="noopener noreferrer">
                <BookOpenText className="mr-2 h-4 w-4" />
                Descargar Ficha Científica (PDF)
              </a>
            </Button>
          </div>
        </article>
      </main>
    </div>
  );
}