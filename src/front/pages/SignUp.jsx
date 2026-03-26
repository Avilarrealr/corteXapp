import React from "react";
import { ArrowUpRight, UserPlus } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export const SignUp = () => {

    const navigate = useNavigate()

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full font-sans bg-slate-50">

            {/* Lado Izquierdo: Formulario (Clint-Focused) */}
            <div className="flex flex-col items-center justify-center p-8 lg:p-12 xl:p-24 bg-white">
                <div className="max-w-md w-full space-y-10">

                    {/* Título de la Sección de Registro (Inspirado en AWS) */}

                    <h1 className="text-3xl font-extrabold text-slate-900">
                        Crea tu cuenta, <span className="text-green-800">CortexApp</span>
                    </h1>


                    {/* Formulario de Registro */}
                    <form className="space-y-6">

                        {/* Input de Nombre Completo */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                placeholder="Juan Pérez"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-green-700/50 focus:border-green-700 transition-all text-sm"
                            />
                        </div>

                        {/* Input de Correo Empresarial */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                                Tu correo empresarial
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="tuempresa@correo.com"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-green-700/50 focus:border-green-700 transition-all text-sm"
                            />
                        </div>

                        {/* Input de Contraseña */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                placeholder="••••••••"
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-1 focus:ring-green-700/50 focus:border-green-700 transition-all text-sm"
                            />
                        </div>

                        {/* Botón Principal de Sign Up (Estilo CortexApp) */}
                        <button className="w-full flex items-center justify-center gap-2 bg-green-800 text-white px-8 py-3 rounded-xl sm:!rounded-full font-bold hover:bg-green-950 transition-all whitespace-nowrap shadow-lg shadow-cyan-900/20 text-sm md:text-base mb-6">
                            Crear cuenta gratuita <ArrowUpRight size={20} />
                        </button>
                    </form>

                    {/* Divisor "O" (Como AWS) */}
                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-slate-200" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-2 text-sm text-slate-500">O</span>
                        </div>
                    </div>

                    {/* Botón Alternativo de Login (Estilo CortexApp, secundario) */}
                    <button onClick={() => { navigate("/login") }} className="w-full flex items-center justify-center gap-2 bg-white text-green-900 px-8 py-3 rounded-xl sm:rounded-full border border-slate-200 font-bold hover:border-green-400 hover:text-green-700 transition-all whitespace-nowrap shadow-sm text-sm md:text-base">
                        Iniciar sesión
                    </button>

                    {/* Pie de página de Login (Términos) */}
                    <p className="text-xs text-slate-500 text-center max-w-sm">
                        Al continuar, aceptas el Acuerdo de cliente de CortexApp y las políticas de privacidad.
                    </p>
                </div>
            </div>

            {/* Lado Derecho: Imagen y Mensaje (Inspirado en AWS, Oculto en móviles) */}
            <div className="hidden lg:flex items-center justify-center p-12 bg-slate-800 relative overflow-hidden">
                {/* Capa de Partículas (Puntos) */}
                <div className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `radial-gradient(circle, #4ade80 1px, transparent 1px)`,
                        backgroundSize: '32px 32px'
                    }}>
                </div>
                {/* Titulo lado derecho */}
                <div className="relative z-10 max-w-lg space-y-6 text-center lg:text-left">
                    <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight">
                        Logística Inteligente <span className="text-green-400">para tu Negocio</span>
                    </h2>
                    <p className="text-lg text-slate-200 max-w-md">
                        CortexApp te ayuda a optimizar tus entradas y gestionar flujos de caja en tiempo real, todo desde una plataforma segura y escalable.
                    </p>

                    {/* Elemento Visual Sutil (Como el Mockup del Hero, pero adaptado) */}
                    <div className="bg-slate-700/50 p-4 rounded-3xl shadow-2xl border border-slate-600/50 relative mt-12 mx-auto lg:mx-0 backdrop-blur-sm">
                        <div className="bg-slate-900 rounded-2xl h-80 overflow-hidden relative group">

                            {/* Header del Mockup (Simula una ventana de App) */}
                            <div className="flex gap-1.5 p-4 border-b border-slate-800">
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                            </div>

                            {/* Contenido Simulado: Gráficos y Actividad */}
                            <div className="p-6 space-y-4">
                                {/* Barra de Progreso / Flujo (Animada) */}
                                <div className="space-y-2">
                                    <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                        <span>Progreso de la meta</span>
                                        <span className="text-green-400">94%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 rounded-full w-[94%] animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Mini Tarjetas de Estado */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                                        <div className="text-[10px] text-slate-500 mb-1">Negocios activos</div>
                                        <div className="text-xl font-bold text-white">12</div>
                                    </div>
                                    <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700">
                                        <div className="text-[10px] text-slate-500 mb-1">Cajas cerradas</div>
                                        <div className="text-xl font-bold text-white">142</div>
                                    </div>
                                </div>

                                {/* Lista de Actividad Reciente */}
                                <div className="space-y-2 opacity-60">
                                    <div className="h-8 w-full bg-slate-800/40 rounded-lg border border-slate-700/50 flex items-center px-3 gap-2">
                                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping"></div>
                                        <div className="h-2 w-24 bg-slate-700 rounded"></div>
                                    </div>
                                    <div className="h-8 w-full bg-slate-800/40 rounded-lg border border-slate-700/50 flex items-center px-3 gap-2">
                                        <div className="w-2 h-2 rounded-full bg-slate-600"></div>
                                        <div className="h-2 w-32 bg-slate-700 rounded"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Overlay con Icono Central (Tu idea original pero más integrada) */}
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="bg-green-800 p-4 rounded-full shadow-lg shadow-green-900/40 transform scale-75 group-hover:scale-100 transition-transform duration-500">
                                    <UserPlus className="text-white" size={32} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}