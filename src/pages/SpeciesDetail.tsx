import { useParams, Link } from "react-router-dom";
import { getAllSpecies } from "@/lib/species";
import { useEffect, useState } from "react";
import type { Species } from "@/types/species";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";

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
    return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-white px-6 py-16 max-w-4xl mx-auto">

      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-12">
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Inicio
          </Link>
        </Button>

        <h1 className="text-2xl font-semibold text-slate-700 tracking-tight">
          Ecollecta ULSA
        </h1>

        <div className="w-[100px]" /> {/* Spacer to balance layout */}
      </div>

      <img
        src={species.imageUrl}
        alt={species.commonName}
        className="w-full h-96 object-cover rounded-2xl mb-8"
      />

      <h2 className="text-4xl font-bold text-slate-900 mb-2">
        {species.commonName}
      </h2>

      <p className="italic text-lg text-slate-600 mb-6">
        {species.scientificName}
      </p>

      {/* Markdown renderer */}
      <div className="prose prose-slate prose-headings:text-slate-800 prose-a:text-green-600 max-w-none mb-10">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {species.description}
        </ReactMarkdown>
      </div>

      <div className="mb-8">
        <p className="font-semibold">Estado de Conservación:</p>
        <p className="text-red-500">{species.conservationStatus}</p>
      </div>

      <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
        <a href={species.pdfUrl} target="_blank" rel="noopener noreferrer">
          Descargar Ficha Científica (PDF)
        </a>
      </Button>
    </div>
  );
}