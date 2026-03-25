import React from "react";
import { Navbar } from "../components/Navbar";
import { Calculator, ArrowUpRight } from 'lucide-react';

export const Home = () => {
	return (
		<div>
			<Navbar />
			<main>
				{/* Aquí van tus secciones */}
				{/* Hero */}
				<section className="w-full bg-slate-50 py-12 md:py-24 overflow-hidden">
					<div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

						{/* Columna Izquierda: Mensaje y Acción */}
						<div className="space-y-6">
							{/* Badge superior */}
							<div className="flex items-center gap-2 bg-green-50 border border-green-100 text-green-800 py-1 rounded-full w-fit mb-6 animate-pulse">
								<span className="relative flex h-2 w-2">
									<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
									<span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
								</span>
								<span className="text-xs font-bold tracking-wide uppercase">
									Nuevo: Integración con AWS Cloud
								</span>
							</div>
							<h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
								Controla tu flujo, <br />
								<span className="text-green-800">optimiza tu logística.</span>
							</h1>
							<p className="text-sm font-extralight text-slate-600 max-w-lg">
								La plataforma integral para gestionar flujo de caja, entradas y salidas en tiempo real.
								Potencia tu operación con datos precisos.
							</p>

							{/* Formulario de Registro Rápido */}
							<div className="flex flex-col sm:flex-row items-center p-1.5 bg-white border border-slate-200 rounded-2xl !sm:rounded-full shadow-sm max-w-md w-full focus-within:border-blue-400 transition-all gap-2 sm:gap-0">
								{/* Input: Quitamos bordes y fondos para que use los del padre */}
								<input
									type="email"
									placeholder="Tu correo empresarial"
									className="w-full sm:flex-grow px-4 py-3 sm:py-0 bg-transparent outline-none text-slate-600 placeholder:text-slate-400 text-sm md:text-base"
								/>

								{/* Botón: Con padding y el icono de la flechita */}
								<button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-800 text-white px-6 py-3 rounded-xl !sm:rounded-full font-bold hover:bg-green-950 transition-all whitespace-nowrap text-sm md:text-base">
									Get Started <ArrowUpRight size={20} />
								</button>
							</div>

							{/* Logos de Confianza (Opcional) */}
							{/* Logos etcnologias */}
							<section className="mt-12 sm:px-6 mx-auto z-10 relative">

								<div className="flex justify-center md:justify-start gap-4 md:gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
									{/* Python */}
									<div className="group relative">
										<img src="https://cdn.simpleicons.org/python/gray" alt="Python" className="h-8 w-auto transition-transform group-hover:scale-200" title="Python" />
									</div>

									{/* Flask */}
									<div className="group relative">
										<img src="https://cdn.simpleicons.org/flask/gray" alt="Flask" className="h-8 w-auto transition-transform group-hover:scale-200" title="Flask" />
									</div>

									{/* React */}
									<div className="group relative">
										<img src="https://cdn.simpleicons.org/react/gray" alt="React" className="h-8 w-auto transition-transform group-hover:scale-200" title="React" />
									</div>

									{/* Tailwind */}
									<div className="group relative">
										<img src="https://cdn.simpleicons.org/tailwindcss/gray" alt="Tailwind" className="h-8 w-auto transition-transform group-hover:scale-200" title="Tailwind CSS" />
									</div>

									{/* SQLAlchemy (Usamos SQL por ser más icónico) */}
									<div className="group relative">
										<img src="https://cdn.simpleicons.org/sqlite/gray" alt="SQL" className="h-8 w-auto transition-transform group-hover:scale-200" title="SQLAlchemy" />
									</div>

									{/* Node.js */}
									<div className="group relative">
										<img src="https://cdn.simpleicons.org/nodedotjs/gray" alt="Node" className="h-8 w-auto transition-transform group-hover:scale-200" title="Node.js" />
									</div>
								</div>
							</section>
						</div>

						{/* Columna Derecha: Elemento Visual */}
						<div className="hidden lg:block relative">
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
				<section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-20">
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