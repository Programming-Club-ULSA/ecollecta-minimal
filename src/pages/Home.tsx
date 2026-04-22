import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  Landmark,
  Leaf,
  QrCode,
  ShieldCheck,
  Trees,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  getEndangeredSpeciesCount,
  getFeaturedSpecies,
  getSpeciesCount,
  getVulnerableSpeciesCount,
} from "@/lib/species";
import type { IUCNStatus, Species } from "@/types/species";
import { FallingLeaves } from "@/components/FallingLeaves";
import fullLogo from "@/assets/full_logo.svg";

type StatusStyle = {
  label: string;
  chipClassName: string;
};

const lasallianValues = [
  {
    title: "Fe",
    description:
      "Promovemos una mirada humanista que reconoce el valor de la naturaleza como parte de la creacion.",
    icon: Landmark,
  },
  {
    title: "Fraternidad",
    description:
      "La comunidad universitaria aprende y protege su patrimonio biologico mediante colaboracion y respeto.",
    icon: GraduationCap,
  },
  {
    title: "Servicio",
    description:
      "Convertimos el conocimiento botanico en acciones de educacion ambiental para toda la comunidad.",
    icon: ShieldCheck,
  },
];

const institutionalHighlights = [
  {
    title: "Compromiso Ambiental",
    description:
      "Integramos ciencia, tecnologia y conciencia ecologica para proteger el patrimonio natural del campus.",
    icon: Leaf,
  },
  {
    title: "Educacion Transformadora",
    description:
      "Cada ficha digital conecta a estudiantes y visitantes con informacion valida y practicas responsables.",
    icon: BookOpen,
  },
  {
    title: "Innovacion con Identidad",
    description:
      "Aplicamos herramientas digitales desde una vision lasallista orientada al desarrollo social sustentable.",
    icon: QrCode,
  },
];

const qrSteps = [
  "Ubica el codigo QR en la especie dentro del campus.",
  "Escanealo con tu celular para abrir su ficha botanica digital.",
  "Explora informacion cientifica, imagenes y estado de conservacion.",
];

function getStatusStyle(status: IUCNStatus): StatusStyle {
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

  return {
    label: "Normal",
    chipClassName: "bg-primary text-white",
  };
}

function Home() {
  const [featuredSpecies, setFeaturedSpecies] = useState<Species[]>([]);
  const [totalSpecies, setTotalSpecies] = useState<number>(0);
  const [vulnerableCount, setVulnerableCount] = useState<number>(0);
  const [endangeredCount, setEndangeredCount] = useState<number>(0);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    getFeaturedSpecies().then(setFeaturedSpecies);
    getSpeciesCount().then(setTotalSpecies);
    getVulnerableSpeciesCount().then(setVulnerableCount);
    getEndangeredSpeciesCount().then(setEndangeredCount);
  }, []);

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
        <div className="absolute right-[-80px] top-[90px] h-[300px] w-[300px] rounded-full bg-[#140dbd]/16 blur-3xl" />
        <div className="absolute bottom-[-140px] left-1/2 h-[320px] w-[320px] -translate-x-1/2 rounded-full bg-[#ffb13c]/18 blur-3xl" />
      </div>

      <section className="relative z-10 mx-auto max-w-5xl px-6 pb-14 pt-16 text-center">
        <img
          src={fullLogo}
          alt="Universidad Tecnologica La Salle"
          className="mx-auto h-16 w-auto md:h-20"
        />

        <div className="mt-7 flex items-center justify-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
            <Leaf className="h-6 w-6" />
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
            Ecollecta ULSA
          </h1>
        </div>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-700 md:text-lg">
          Explora el patrimonio botanico del campus escaneando los codigos QR en
          cada especie.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button
            className="h-11 rounded-full bg-primary px-6 text-white hover:bg-primary/90"
            onClick={() => scrollToSection("qr-info")}
          >
            <QrCode className="mr-1 h-4 w-4" />
            Como Escanear
          </Button>

          <Button
            variant="outline"
            className="h-11 rounded-full border-[#140dbd]/35 bg-white px-6 text-[#140dbd] hover:bg-[#140dbd]/5"
            onClick={() => scrollToSection("featured")}
          >
            <BookOpen className="mr-1 h-4 w-4" />
            Explorar Especies
          </Button>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-primary/20 bg-white/80 p-3 text-center">
            <p className="text-2xl font-extrabold text-primary">{totalSpecies}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              Especies
            </p>
          </div>

          <div className="rounded-2xl border border-[#ffb13c]/40 bg-[#ffb13c]/12 p-3 text-center">
            <p className="text-2xl font-extrabold text-[#b87100]">{vulnerableCount}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              Vulnerables
            </p>
          </div>

          <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-center">
            <p className="text-2xl font-extrabold text-red-600">{endangeredCount}</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-600">
              En Riesgo
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-14">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#140dbd]">
              Proposito
            </p>
            <h3 className="mt-2 text-3xl font-bold text-slate-900">
              Educacion ambiental con impacto real
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {institutionalHighlights.map((item) => {
            const Icon = item.icon;

            return (
              <Card
                key={item.title}
                className="border-primary/20 bg-white/90 py-5 shadow-[0_20px_45px_-35px_rgba(35,137,53,0.55)]"
              >
                <CardHeader className="px-5">
                  <div className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg leading-tight text-slate-900">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 border-y border-[#140dff]/15 bg-[#8899cc] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#140dbd]">
            Identidad Lasallista
          </p>

          <h3 className="mx-auto mt-3 max-w-2xl text-center text-3xl font-bold text-slate-900">
            Fe, Fraternidad y Servicio como base de la cultura ecologica universitaria
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
            {lasallianValues.map((value) => {
              const Icon = value.icon;

              return (
                <Card
                  key={value.title}
                  className="border-[#140dbd]/50 bg-white/90 py-5 shadow-[0_20px_40px_-35px_rgba(20,13,189,0.55)]"
                >
                  <CardHeader className="px-5">
                    <div className="mb-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#140dbd]/10 text-[#0000bb]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg text-slate-900">{value.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="px-5 text-sm leading-relaxed text-slate-600">
                    {value.description}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="featured"
        className="relative z-10 mx-auto max-w-6xl scroll-mt-24 px-6 py-16"
      >
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#140dbd]">
              Archivo Vivo
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Especies Destacadas</h2>
          </div>

          <Button
            asChild
            variant="outline"
            className="rounded-full border-primary/30 bg-white text-primary hover:bg-primary/5"
          >
            <Link to="/archive">
              Ver Coleccion Completa
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredSpecies.map((tree) => {
            const statusStyle = getStatusStyle(tree.conservationStatus);

            return (
              <Card
                key={tree.id}
                className="group relative isolate gap-0 overflow-hidden border border-primary/20 bg-white p-0 shadow-[0_20px_55px_-35px_rgba(15,23,42,0.45)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_65px_-30px_rgba(20,13,189,0.45)]"
              >
                <span
                  className={`pointer-events-none absolute right-4 top-4 z-20 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] shadow-md transition-transform duration-300 group-hover:-translate-y-0.5 ${statusStyle.chipClassName}`}
                >
                  {statusStyle.label}
                </span>

                <div className="relative h-64 w-full overflow-hidden">
                  <img
                    src={tree.imageUrl}
                    alt={tree.commonName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 transform-gpu"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/25 to-transparent" />

                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-lg font-bold leading-tight">{tree.commonName}</p>
                    <p className="mt-1 text-sm italic text-white/90">{tree.scientificName}</p>
                  </div>
                </div>

                <CardContent className="bg-white p-5">
                  <Button
                    asChild
                    className="h-10 w-full rounded-full bg-primary text-white transition-all duration-300 group-hover:bg-[#140dbd]"
                  >
                    <Link to={`/species/${tree.id}`}>
                      Explorar Ficha
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-6 pb-10">
        <div className="rounded-3xl bg-gradient-to-r from-primary via-primary/90 to-[#0000bb] px-8 py-10 text-center text-white shadow-[0_30px_70px_-35px_rgba(20,13,189,0.55)] md:px-10">
          <Trees className="mx-auto mb-5 h-10 w-10" />

          <h3 className="text-2xl font-bold md:text-3xl">
            Importancia de la Flora y Fauna Universitaria
          </h3>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/90">
            La biodiversidad mantiene el equilibrio ecologico del campus. Cada
            especie documentada representa una oportunidad para investigar,
            aprender y actuar en favor de una sociedad mas sostenible.
          </p>

          <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/90">
            Preservar este patrimonio fortalece la educacion ambiental y proyecta
            el compromiso institucional de ULSA con el desarrollo cientifico,
            tecnologico y humano.
          </p>
        </div>
      </section>

      <section
        id="qr-info"
        className="relative z-10 mx-auto max-w-5xl scroll-mt-24 px-6 pb-20 pt-8"
      >
        <div className="rounded-3xl border border-primary/20 bg-white/92 p-8 shadow-[0_24px_60px_-35px_rgba(35,137,53,0.5)] md:p-10">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-[#140dbd]">
            Experiencia Digital
          </p>

          <h3 className="mt-3 text-center text-2xl font-bold text-slate-900 md:text-3xl">
            Como funciona el sistema QR
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {qrSteps.map((step, index) => (
              <div
                key={step}
                className="rounded-2xl border border-[#140dbd]/20 bg-[#f8f8ff] p-5"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#140dbd] text-sm font-bold text-white">
                  {index + 1}
                </span>
                <p className="mt-3 text-sm leading-relaxed text-slate-700">{step}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Button
              asChild
              className="h-11 rounded-full bg-primary px-7 text-white hover:bg-primary/90"
            >
              <Link to="/archive">
                Iniciar Recorrido Botanico
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-primary/15 bg-white/80">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-6 py-8 text-center sm:flex-row sm:text-left">
          <p className="text-sm font-semibold text-primary">
            Club de Programacion ULSA | Ecollecta ULSA
          </p>

          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} Universidad Tecnologica La Salle, Nicaragua
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;