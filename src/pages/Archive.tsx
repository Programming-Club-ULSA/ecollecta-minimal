import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, BookOpenText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllSpecies } from "@/lib/species";
import type { Species } from "@/types/species";
import { FallingLeaves } from "@/components/FallingLeaves";

function statusBadgeClass(status: string) {
  if (status === "CR" || status === "EN") {
    return "bg-red-100 text-red-700";
  }
  if (status === "VU" || status === "NT") {
    return "bg-amber-100 text-amber-700";
  }
  return "bg-emerald-100 text-emerald-700";
}

export default function Archive() {
  const [species, setSpecies] = useState<Species[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getAllSpecies().then(setSpecies);
  }, []);

  const filteredSpecies = species.filter(
    (s) =>
      s.commonName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.scientificName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans pb-20 relative">
      <FallingLeaves />

      <header className="relative z-20 bg-white/90 border-b border-slate-200 sticky top-0 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <Button asChild variant="ghost" className="text-slate-700 hover:text-green-700 -ml-4">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
            </Link>
          </Button>

          <div className="relative w-full lg:w-[26rem]">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por nombre común o científico..."
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-md leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 text-sm transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-10">
        <section className="mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Archivo de Especies</h1>
          <p className="text-lg text-slate-600 mt-2">
            Mostrando {filteredSpecies.length} especies documentadas del campus.
          </p>
        </section>

        {filteredSpecies.length === 0 ? (
          <div className="text-center py-20 border border-slate-200 rounded-2xl bg-white/80 shadow-sm">
            <p className="text-xl text-slate-500">No se encontraron especies para "{searchTerm}"</p>
            <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2 text-green-600">
              Limpiar búsqueda
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSpecies.map((tree) => (
              <Card key={tree.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col border-slate-200 bg-white/90">
                <div className="h-48 w-full bg-slate-200 overflow-hidden">
                  <img
                    src={tree.imageUrl}
                    alt={tree.commonName}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg leading-tight">{tree.commonName}</CardTitle>
                    {tree.conservationStatus && (
                      <span className={`shrink-0 text-[10px] font-bold px-2 py-1 rounded-full ${statusBadgeClass(tree.conservationStatus)}`}>
                        {tree.conservationStatus}
                      </span>
                    )}
                  </div>
                  <p className="italic text-slate-500 text-sm mt-1">{tree.scientificName}</p>
                </CardHeader>

                <CardContent className="mt-auto pt-0">
                  <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                    <Link to={`/species/${tree.id}`}>
                      <BookOpenText className="mr-2 h-4 w-4" />
                      Ver ficha
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}