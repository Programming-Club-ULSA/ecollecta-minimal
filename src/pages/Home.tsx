import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Leaf, QrCode, BookOpen, Trees } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllSpecies } from "@/lib/species";
import type { Species } from "@/types/species";
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
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans relative">

      <FallingLeaves />

      {/* HERO */}
      <section className="relative z-10 text-center py-24 px-6">
        <div className="flex justify-center items-center gap-3 mb-6">
          <Leaf className="h-12 w-12 text-green-600" />
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900">
            Ecollecta ULSA
          </h1>
        </div>

        <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Explora el patrimonio botánico del campus escaneando los códigos QR 
          ubicados en cada especie. Accede a información científica validada 
          y promueve la conservación ambiental.
        </p>

        <div className="flex justify-center gap-4 flex-wrap">
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() =>
              document.getElementById("qr-info")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <QrCode className="mr-2 h-4 w-4" />
            ¿Cómo Escanear?
          </Button>

          <Button
            variant="outline"
            onClick={() =>
              document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Nuestras Especies
          </Button>
        </div>
      </section>

      {/* STATS */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 mb-20 grid grid-cols-1 md:grid-cols-3 gap-6">
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
            <CardTitle>Especies en Riesgo</CardTitle>
          </CardHeader>
          <CardContent className="text-4xl font-bold text-red-500">
            {endangeredCount}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compromiso Ambiental</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 leading-relaxed">
            Documentación científica, educación ecológica y preservación 
            del patrimonio natural universitario.
          </CardContent>
        </Card>
      </section>

      {/* FEATURED */}
      <section id="featured" className="relative z-10 max-w-6xl mx-auto px-6 mb-24">
        <h2 className="text-3xl font-bold mb-10 text-slate-800 text-center">
          Especies Destacadas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((tree) => (
            <Card key={tree.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
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
                  <Link to={`/species/${tree.id}`}>
                    Ver Ficha Completa
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button asChild variant="outline">
            <Link to="/archive">
                <BookOpen className="mr-2 h-4 w-4" />
                Explorar Especies
            </Link>
        </Button>
      </section>

      {/* BIODIVERSITY IMPORTANCE */}
      <section className="relative z-10 bg-green-100 py-20 px-6 text-center">
        <Trees className="mx-auto mb-6 h-10 w-10 text-green-700" />
        <h3 className="text-2xl font-bold mb-6">
          Importancia de la Flora y Fauna
        </h3>

        <p className="max-w-3xl mx-auto text-slate-700 leading-relaxed mb-6">
          La biodiversidad es fundamental para el equilibrio ecológico. 
          Las especies vegetales no solo producen oxígeno y capturan carbono, 
          sino que también proporcionan hábitat y alimento para la fauna local.
        </p>

        <p className="max-w-3xl mx-auto text-slate-700 leading-relaxed">
          Documentar y preservar nuestro patrimonio natural universitario 
          fortalece la educación ambiental y fomenta una cultura de respeto 
          hacia los ecosistemas que sostienen la vida.
        </p>
      </section>

      {/* QR INFO SECTION */}
      <section id="qr-info" className="relative z-10 py-20 px-6 text-center max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold mb-6 text-slate-800">
          ¿Cómo funciona el sistema QR?
        </h3>

        <p className="text-slate-600 leading-relaxed">
          Cada especie del campus cuenta con un código QR único. 
          Al escanearlo con tu dispositivo móvil, accederás 
          directamente a su ficha técnica digital en formato PDF.
        </p>
      </section>

      <footer className="relative z-10 text-center py-8 text-sm text-slate-500">
        © {new Date().getFullYear()} Club de Programación ULSA — Ecollecta ULSA
      </footer>
    </div>
  );
}

export default Home;