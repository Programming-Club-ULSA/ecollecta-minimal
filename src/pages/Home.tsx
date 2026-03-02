import { useEffect, useState } from "react";
import { Leaf, QrCode, BookOpen, Trees } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllSpecies } from "@/lib/species.ts";
import type { Species } from "@/types/species.ts";
import { FallingLeaves } from "@/components/FallingLeaves";

function Home() {
  const [species, setSpecies] = useState<Species[]>([]);

  useEffect(() => {
    getAllSpecies().then(setSpecies);
  }, []);

  const totalSpecies = species.length;
  const endangeredCount = species.filter(
    (s) => s.conservationStatus === "EN" || s.conservationStatus === "CR"
  ).length;

  const featured = species.slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans">

        <FallingLeaves />

      <section className="text-center py-20 px-6">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Leaf className="h-12 w-12 text-green-600" />
          <h1 className="text-5xl font-extrabold text-slate-900">
            Ecollecta ULSA
          </h1>
        </div>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
          Escanea los códigos QR en nuestro campus y descubre las fichas
          botánicas oficiales de cada especie.
        </p>

        <div className="flex justify-center gap-4">
          <Button className="bg-green-600 hover:bg-green-700 text-white">
            <QrCode className="mr-2 h-4 w-4" />
            Escanear QR
          </Button>

          <Button variant="outline">
            <BookOpen className="mr-2 h-4 w-4" />
            Explorar Especies
          </Button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 mb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total de Especies</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-green-600">
            {totalSpecies}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>En Riesgo</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-red-500">
            {endangeredCount}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Conservación Activa</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600">
            Educación ambiental y documentación digital del patrimonio vegetal.
          </CardContent>
        </Card>
      </section>

      <section className="max-w-6xl mx-auto px-6 mb-20">
        <h2 className="text-3xl font-bold mb-8 text-slate-800 text-center">
          Especies Destacadas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((tree) => (
            <Card key={tree.id} className="overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className="h-52 w-full overflow-hidden">
                <img
                  src={tree.imageUrl}
                  alt={tree.commonName}
                  className="w-full h-full object-cover"
                />
              </div>

              <CardHeader>
                <CardTitle>{tree.commonName}</CardTitle>
                <p className="italic text-slate-500">
                  {tree.scientificName}
                </p>
              </CardHeader>

              <CardContent>
                <Button asChild className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <a href={tree.pdfUrl} target="_blank" rel="noopener noreferrer">
                    Ver Ficha Completa
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-green-100 py-16 px-6 text-center">
        <Trees className="mx-auto mb-4 h-10 w-10 text-green-700" />
        <h3 className="text-2xl font-bold mb-4">
          Patrimonio Botánico Universitario
        </h3>
        <p className="max-w-3xl mx-auto text-slate-700">
          Este proyecto digitaliza la información científica de las especies
          presentes en el campus, promoviendo la educación ambiental y la
          conservación.
        </p>
      </section>

      <footer className="text-center py-8 text-sm text-slate-500">
        © {new Date().getFullYear()} Club de Programación ULSA — Ecollecta ULSA
      </footer>
    </div>
  );
}

export default Home;