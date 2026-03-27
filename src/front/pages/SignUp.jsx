import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { ArrowUpRight, ShieldCheck } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export const SignUp = () => {


    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        organizationName: "" // Nombre de la organización/empresa master
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";
            const response = await fetch(`${baseUrl}/api/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                console.log("Registro exitoso:", data);

                // 2. Guardamos un mensaje de bienvenida en el store global
                dispatch({
                    type: "set_hello",
                    payload: `¡Bienvenido ${data.user.fullName}! Tu organización ${data.user.organization} ha sido creada.`
                });

                // 3. Redirigimos al login para que entre con sus nuevas credenciales
                alert("Cuenta creada con éxito. Ahora puedes iniciar sesión.");
                navigate("/login");
            } else {
                // Manejo de errores del backend (ej: email ya existe)
                console.error("Error en el registro:", data.msg);
                alert(`Error: ${data.msg}`);
            }

        } catch (error) {
            console.error("Error de red:", error);
            alert("No se pudo conectar con el servidor. Verifica que Flask esté corriendo.");
        }
    };

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
                    <form className="space-y-5" onSubmit={handleSubmit}>
                        {/* Campo: Nombre de la Organización */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre de tu Negocio / Organización</label>
                            <input
                                type="text"
                                name="organizationName"
                                value={formData.organizationName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all"
                                placeholder="Ej: Inversiones Villarreal C.A."
                            />
                        </div>

                        {/* Campo: Nombre Completo */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Tu Nombre (Administrador Master)</label>
                            <input
                                type="text"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all"
                                placeholder="Antonio Villarreal"
                            />
                        </div>

                        {/* Campo: Email */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all"
                                placeholder="admin@tuempresa.com"
                            />
                        </div>

                        {/* Campo: Password */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1">Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="w-full bg-green-800 text-white py-4 rounded-xl font-bold hover:bg-green-950 transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                            Crear Organización Master <ArrowUpRight size={20} />
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
            <div className="hidden lg:flex items-center justify-center p-12 bg-slate-800 relative overflow-hidden animate-gradient-slow">
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
                    <div className="bg-slate-700/20 p-2 rounded-3xl shadow-2xl border border-slate-600/50 relative mt-12 mx-auto lg:mx-0 backdrop-blur-sm">
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

                            {/* Overlay con efecto Blur en Hover */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500">

                                {/* Icono de Seguridad */}
                                <div className="bg-green-500 p-4 rounded-full shadow-2xl shadow-green-900/40 transform scale-75 group-hover:scale-100 transition-transform duration-500 mb-4">
                                    <ShieldCheck className="text-white" size={32} />
                                </div>

                                {/* Texto Informativo */}
                                <div className="text-center px-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-white font-bold text-lg">Tus finanzas seguras</p>
                                    <p className="text-slate-300 text-xs mt-1">
                                        Infraestructura auditada y respaldada por AWS Cloud.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}