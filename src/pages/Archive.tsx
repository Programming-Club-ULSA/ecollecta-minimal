import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenText,
  Leaf,
  Search,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllSpecies } from "@/lib/species";
import type { Species } from "@/types/species";
import { FallingLeaves } from "@/components/FallingLeaves";
import fullLogo from "@/assets/full_logo.svg";

function getStatusMeta(status: string) {
  if (status === "CR") {
    return {
      label: "Critica",
      chipClassName: "bg-red-600 text-white",
    };
  }

  if (status === "EN") {
    return {
      label: "En Peligro",
      chipClassName: "bg-red-500 text-white",
    };
  }

  if (status === "VU") {
    return {
      label: "Vulnerable",
      chipClassName: "bg-[#ffb13c] text-slate-900",
    };
  }

  if (status === "NT") {
    return {
      label: "Casi Amenazada",
      chipClassName: "bg-[#ffcf70] text-slate-900",
    };
  }

  return {
    label: "Normal",
    chipClassName: "bg-primary text-white",
  };
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

  const isFiltering = searchTerm.trim().length > 0;

  return (
    <div
      className="relative min-h-screen overflow-x-hidden bg-[#f5f8f6] pb-20 text-slate-900"
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

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-12 pt-16">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            asChild
            variant="ghost"
            className="-ml-3 rounded-full px-4 text-slate-700 hover:bg-white/70 hover:text-primary"
          >
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-[#140dbd]/25 bg-white/85 text-[#140dbd] hover:bg-[#140dbd]/5"
          >
            <Link to="/">
              Ir a portada
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

          <div className="mt-6 flex items-center justify-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
              <Leaf className="h-6 w-6" />
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
              Archivo Botanico
            </h1>
          </div>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
            Consulta las especies documentadas del campus y accede a sus fichas
            digitales con informacion cientifica validada.
          </p>

          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-primary/20 bg-white/80 p-3 text-center">
              <p className="text-2xl font-extrabold text-primary">{species.length}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Registradas
              </p>
            </div>

            <div className="rounded-2xl border border-[#140dbd]/20 bg-white/80 p-3 text-center">
              <p className="text-2xl font-extrabold text-[#140dbd]">{filteredSpecies.length}</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Resultados
              </p>
            </div>

            <div className="rounded-2xl border border-[#ffb13c]/35 bg-[#ffb13c]/12 p-3 text-center">
              <p className="text-2xl font-extrabold text-[#b87100]">
                {isFiltering ? "Activa" : "Libre"}
              </p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
                Busqueda
              </p>
            </div>
          </div>

          <div className="mx-auto mt-8 max-w-3xl rounded-3xl border border-primary/18 bg-white/90 p-4 shadow-[0_24px_50px_-35px_rgba(35,137,53,0.55)] backdrop-blur-sm">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                <Search className="h-5 w-5" />
              </div>

              <input
                type="text"
                placeholder="Buscar por nombre comun o cientifico..."
                className="block w-full rounded-2xl border border-slate-200 bg-[#f8fbf8] py-3 pl-11 pr-12 text-sm text-slate-700 placeholder-slate-400 outline-none transition focus:border-primary/35 focus:ring-2 focus:ring-primary/15"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {isFiltering && (
                <button
                  type="button"
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 transition hover:text-slate-700"
                  aria-label="Limpiar busqueda"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="relative z-10 mx-auto max-w-6xl px-6">
        <section className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#140dbd]">
              Exploracion
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Coleccion de especies</h2>
          </div>

          <p className="text-sm text-slate-600">
            {isFiltering
              ? `Resultados para \"${searchTerm}\"`
              : "Explora todas las especies disponibles."}
          </p>
        </section>

        {filteredSpecies.length === 0 ? (
          <div className="rounded-3xl border border-primary/18 bg-white/92 px-6 py-16 text-center shadow-[0_24px_50px_-35px_rgba(35,137,53,0.5)]">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-5 text-2xl font-bold text-slate-900">
              No se encontraron especies
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              No hay coincidencias para "{searchTerm}". Intenta con otro nombre o
              limpia la busqueda para ver el archivo completo.
            </p>
            <Button
              onClick={() => setSearchTerm("")}
              className="mt-6 rounded-full bg-primary px-6 text-white hover:bg-primary/90"
            >
              Limpiar busqueda
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {filteredSpecies.map((tree) => {
              const statusMeta = getStatusMeta(tree.conservationStatus);

              return (
                <Card
                  key={tree.id}
                  className="group relative isolate gap-0 overflow-hidden border border-primary/20 bg-white p-0 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_65px_-30px_rgba(20,13,189,0.45)]"
                >
                  <span
                    className={`status-chip pointer-events-none absolute right-4 top-4 z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-md transition-transform duration-300 group-hover:-translate-y-0.5 ${statusMeta.chipClassName}`}
                  >
                    {statusMeta.label}
                  </span>

                  <div className="relative h-64 w-full overflow-hidden">
                    <img
                      src={tree.imageUrl}
                      alt={tree.commonName}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/85 via-[#0f172a]/25 to-transparent" />

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-xl font-bold leading-tight">{tree.commonName}</p>
                      <p className="mt-1 text-sm italic text-white/90">{tree.scientificName}</p>
                    </div>
                  </div>

                  <CardContent className="space-y-4 bg-white p-5">
                    <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
                      <div className="rounded-2xl border border-slate-200 bg-[#f8fbf8] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#140dbd]">
                          Genero
                        </p>
                        <p className="mt-1 font-medium text-slate-800">{tree.taxonomy.genus}</p>
                      </div>

                      <div className="rounded-2xl border border-slate-200 bg-[#f8fbf8] px-4 py-3">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#140dbd]">
                          Familia
                        </p>
                        <p className="mt-1 font-medium text-slate-800">{tree.taxonomy.family}</p>
                      </div>
                    </div>

                    <Button
                      asChild
                      className="h-10 w-full rounded-full bg-primary text-white transition-all duration-300 group-hover:bg-[#140dbd]"
                    >
                      <Link to={`/species/${tree.id}`}>
                        <BookOpenText className="mr-2 h-4 w-4" />
                        Ver ficha
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}