import React from "react";
import { Navbar } from "../components/Navbar";
import { Calculator, ArrowUpRight } from 'lucide-react';
import { FeaturesSection } from "../components/FeaturesSection";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

export const Home = () => {
	const navigate = useNavigate()
	const data = [
		{ month: 'Ene', valor: 400000 },
		{ month: 'Feb', valor: 600000 },
		{ month: 'Mar', valor: 900000 },
		{ month: 'Abr', valor: 1100000 },
		{ month: 'May', valor: 1400000 },
		{ month: 'Jun', valor: 1876580 },
	];

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

							{/* Botón: Con padding y el icono de la flechita */}
							<button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-800 text-white px-6 py-3 rounded-xl !sm:rounded-full font-bold hover:bg-green-950 transition-all whitespace-nowrap text-sm md:text-base"
								onClick={() => { navigate("/login") }}>
								Comienza ya! <ArrowUpRight size={20} />
							</button>

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

						{/* Columna Derecha: Elemento Visual - Mejorado */}
						<div className="hidden lg:block relative w-full h-[550px] mt-10"> {/* h-[550px] para dar más espacio vertical */}

							{/* Imagen Desktop (La base) - Nítida y limpia */}
							<div className="absolute top-0 left-0 w-[125%] z-10 transition-transform hover:-translate-y-2 duration-500">
								<div className="relative overflow-hidden rounded-2xl shadow-2xl border border-slate-100 bg-white">
									<img
										src="/desktopView.png"  // <--- Tu imagen de public
										alt="Desktop Dashboard"
										className="w-full object-top" // <--- Eliminado el mask-image
									/>
								</div>
							</div>

							{/* Imagen Mobile (Superpuesta) - Pulida con marco de teléfono */}
							<div className="absolute top-32 -right-24 w-[45%] z-20 transition-transform hover:scale-105 duration-500"> {/* w-[40%] un poco más grande */}
								<div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl border-slate-300"> {/* Marco más definido */}
									<div className="relative overflow-hidden rounded-[2rem] bg-white">
										<img
											src="/mobileView.png"   // <--- Tu imagen de public
											alt="Mobile View"
											className="w-full h-auto object-top" // <--- Eliminado el mask-image
										/>
									</div>
								</div>
							</div>

							{/* Adornos de fondo (Blur) - Suavizados */}
							<div className="absolute -top-10 -right-10 h-64 w-64 bg-green-100 rounded-full blur-3xl opacity-30 -z-0"></div>
							<div className="absolute bottom-20 left-10 h-48 w-48 bg-blue-100 rounded-full blur-3xl opacity-20 -z-0"></div>
						</div>

					</div>
				</section>
				<FeaturesSection />
				<section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 items-center gap-16 py-20">
					<div>
						<span className="text-green-600 font-semibold uppercase tracking-wider text-sm">Escalabilidad</span>
						<h2 className="text-4xl font-black mt-4 mb-6 leading-tight">
							Experiencia que crece con tu operación logística.
						</h2>
						<p className="text-lg text-slate-600">
							CortexApp se adapta desde pequeñas empresas locales hasta operaciones internacionales complejas.
						</p>
					</div>

					<div className="">
						{/* Aquí podrías colocar una imagen o un componente de gráfico */}
						{/* Columna Derecha del Home */}
						<div className="hidden lg:block bg-white rounded-3xl p-6 shadow-inner border border-slate-100 flex flex-col">
							<div className="mb-4">
								<span className="text-xs font-bold text-slate-400 uppercase tracking-tight">Resumen de Flujo</span>
								<h4 className="text-3xl font-black text-slate-900 leading-none">$1,876,580</h4>
							</div>

							<div className="h-64 w-full">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart data={data}>
										<defs>
											<linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
												<stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1} />
												<stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
											</linearGradient>
										</defs>
										<XAxis
											dataKey="month"
											axisLine={false}
											tickLine={false}
											tick={{ fill: '#94a3b8', fontSize: 12 }}
											dy={10}
										/>
										<Tooltip
											contentStyle={{ borderRadius: '15px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
										/>
										<Area
											type="monotone"
											dataKey="valor"
											stroke="#0ea5e9"
											strokeWidth={3}
											fillOpacity={1}
											fill="url(#colorVal)"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>

							<div className="mt-4 pt-4 border-t border-slate-50 flex justify-between items-center text-[10px] font-bold text-slate-400 uppercase">
								<span>6 Meses</span>
								<span className="text-green-500">+24% Este mes</span>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div >
	);
};