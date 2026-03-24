import React from "react";
import { Navbar } from "../components/Navbar";
import { Calculator } from 'lucide-react';

export const Home = () => {
	return (
		<div>
			<Navbar />
			<main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{/* Aquí van tus secciones */}
				{/* Hero */}
				<section className="bg-slate-50 py-16 md:py-24">
					<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

						{/* Columna Izquierda: Mensaje y Acción */}
						<div className="space-y-8">
							<h1 className="text-5xl md:text-6xl font-black text-slate-900 leading-tight">
								Controla tu flota, <br />
								<span className="text-blue-600">optimiza tu logística.</span>
							</h1>
							<p className="text-lg text-slate-600 max-w-lg">
								La plataforma integral para gestionar conductores, rutas y stock en tiempo real.
								Potencia tu operación con datos precisos.
							</p>

							{/* Formulario de Registro Rápido */}
							<div className="flex flex-col sm:flex-row gap-3">
								<input
									type="email"
									placeholder="Tu correo empresarial"
									className="px-4 py-3 rounded-xl border border-slate-200 flex-grow focus:outline-blue-600"
								/>
								<button className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
									Empezar Ahora
								</button>
							</div>

							{/* Logos de Confianza (Opcional) */}
							<div className="pt-8 flex gap-8 items-center opacity-50 grayscale">
								<span className="font-bold text-slate-400">AWS Partner</span>
								<span className="font-bold text-slate-400">LogiTech</span>
							</div>
						</div>

						{/* Columna Derecha: Elemento Visual */}
						<div className="relative">
							{/* Aquí puedes poner una imagen de tu app o un "Mockup" creado con CSS */}
							<div className="bg-white p-4 rounded-3xl shadow-2xl border border-slate-100 relative z-10">
								<div className="bg-slate-50 rounded-2xl h-80 flex items-center justify-center">
									<span className="text-slate-300 font-medium italic">Visual de la App / Mapa</span>
								</div>
							</div>
							{/* Adorno decorativo (como los círculos en tu captura) */}
							<div className="absolute -top-10 -right-10 h-64 w-64 bg-blue-100 rounded-full blur-3xl opacity-50 -z-0"></div>
						</div>

					</div>
				</section>
				<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
					{/* Tarjeta de Ejemplo */}
					<div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:scale-105 transition-all">
						<div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
							<Calculator className="text-blue-600" />
						</div>
						<h3 className="text-xl font-bold mb-2">Monitoreo Real</h3>
						<p className="text-slate-600">Sigue la ubicación de tu flota en tiempo real con precisión satelital.</p>
					</div>

					{/* Agrega más tarjetas aquí... */}
				</section>
				<section className="grid grid-cols-1 lg:grid-cols-2 items-center gap-16 py-20">
					<div>
						<span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">Escalabilidad</span>
						<h2 className="text-4xl font-black mt-4 mb-6 leading-tight">
							Experiencia que crece con tu operación logística.
						</h2>
						<p className="text-lg text-slate-600">
							CortexApp se adapta desde pequeñas flotas locales hasta operaciones internacionales complejas.
						</p>
					</div>

					<div className="bg-slate-50 rounded-3xl p-8 aspect-square flex items-center justify-center border border-dashed border-slate-300">
						{/* Aquí podrías colocar una imagen o un componente de gráfico */}
						<span className="text-slate-400">Espacio para Visualización de Datos</span>
					</div>
				</section>
			</main>
		</div >
	);
};