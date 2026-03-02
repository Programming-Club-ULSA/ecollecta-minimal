import { useParams } from "react-router-dom";
import { getAllSpecies } from "@/lib/species";
import { useEffect, useState } from "react";
import type { Species } from "@/types/species";
import { Button } from "@/components/ui/button";

export default function SpeciesDetail() {
  const { id } = useParams();
  const [species, setSpecies] = useState<Species | null>(null);

  useEffect(() => {
    getAllSpecies().then((data) => {
      const found = data.find((s) => s.id === id);
      setSpecies(found || null);
    });
  }, [id]);

  if (!species) return <div className="p-10 text-center">Cargando...</div>;

  return (
    <div className="min-h-screen bg-white px-6 py-16 max-w-4xl mx-auto">
      <img
        src={species.imageUrl}
        alt={species.commonName}
        className="w-full h-96 object-cover rounded-2xl mb-8"
      />

      <h1 className="text-4xl font-bold text-slate-900 mb-2">
        {species.commonName}
      </h1>

      <p className="italic text-lg text-slate-600 mb-6">
        {species.scientificName}
      </p>

      <p className="text-slate-700 leading-relaxed mb-8">
        {species.description}
      </p>

      <div className="mb-6">
        <p className="font-semibold">Estado de Conservación:</p>
        <p className="text-red-500">{species.conservationStatus}</p>
      </div>

      <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
        <a href={species.pdfUrl} target="_blank">
          Descargar Ficha Científica (PDF)
        </a>
      </Button>
    </div>
  );
}