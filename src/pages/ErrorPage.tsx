import { Link } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FallingLeaves } from "@/components/FallingLeaves";

type ErrorPageProps = {
	code?: number;
};

function getErrorMeta(code: number) {
	switch (code) {
		case 403:
			return {
				title: "Acceso denegado",
				description:
					"No tienes permisos para acceder a este recurso en este momento.",
			};
		case 404:
			return {
				title: "Página no encontrada",
				description:
					"La ruta que intentas abrir no existe o fue movida a otra ubicación. Regresa al inicio para explorar nuestras especies.",
			};
		case 500:
			return {
				title: "Error interno del servidor",
				description:
					"Ocurrió un problema inesperado al procesar tu solicitud. Inténtalo nuevamente.",
			};
		default:
			return {
				title: "Ocurrió un error",
				description:
					"Se produjo un problema inesperado. Regresa al inicio o vuelve a intentarlo.",
			};
	}
}

export default function ErrorPage({ code = 500 }: ErrorPageProps) {
	const { title, description } = getErrorMeta(code);

	return (
		<div className="min-h-screen bg-gradient-to-b from-green-50 to-white font-sans relative">
			<FallingLeaves />

			<main className="relative z-10 max-w-3xl mx-auto px-6 py-20">
				<Card className="border-slate-200 bg-white/95 shadow-sm">
					<CardHeader className="text-center pb-4">
						<div className="mx-auto mb-4 h-14 w-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
							<AlertTriangle className="h-7 w-7" />
						</div>
						<p className="text-sm uppercase tracking-widest text-slate-500 font-semibold">
							Código de error {code}
						</p>
						<CardTitle className="text-3xl text-slate-900 mt-2">{title}</CardTitle>
					</CardHeader>

					<CardContent className="text-center">
						<p className="text-slate-600 text-lg leading-relaxed max-w-xl mx-auto">
							{description}
						</p>

						<div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
							<Button asChild className="bg-green-600 hover:bg-green-700 text-white">
								<Link to="/">
									<Home className="mr-2 h-4 w-4" />
									Ir al inicio
								</Link>
							</Button>

							<Button asChild variant="outline" className="border-slate-300 text-slate-700">
								<Link to="/archive">
									<ArrowLeft className="mr-2 h-4 w-4" />
									Ir al archivo
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
