import React, { useState } from "react";
import { ArrowRight, Wallet, TrendingUp, ShieldCheck, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {

    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:3001";

        try {
            const response = await fetch(`${baseUrl}/api/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData) // formData debe tener email y password
            });

            const data = await response.json();

            if (response.ok) {

                localStorage.setItem("token", data.token);
                dispatch({
                    type: "login_user",
                    payload: data.user
                });
                if (data.user.role === "admin") {
                    navigate("/dashboard");
                } else if (data.user.role === "cajero") {
                    navigate("/pos");
                }

            } else {
                alert(data.msg);
            }
        } catch (error) {
            console.error("Error en el login:", error);
        }
    };

    return (
        /* Contenedor Principal: Grid de 2 columnas con alto total */
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen w-full bg-slate-50">

            {/* LADO IZQUIERDO: Formulario Centrado */}
            <div className="flex items-center justify-center p-8 lg:p-20 bg-white">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-left">
                        <h1 className="text-4xl font-black text-slate-900 leading-tight">
                            Ingresa a <span className="text-green-800">CortexApp</span>
                        </h1>
                        <p className="text-slate-500 mt-2">Gestiona tus ingresos y cortes de caja con precisión.</p>
                    </div>

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Correo Electrónico</label>
                            <input
                                type="email"
                                name="email" // 6. Importante: debe coincidir con la llave del state
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all placeholder:text-slate-400"
                                placeholder="tu@correo.com"
                            />
                        </div>

                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-semibold text-slate-700">Contraseña</label>
                                <button type="button" className="text-xs text-green-800 hover:underline font-bold">¿Olvidaste tu contraseña?</button>
                            </div>
                            <input
                                type="password"
                                name="password" // 7. Importante: debe coincidir con la llave del state
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-green-700/20 focus:border-green-700 outline-none transition-all placeholder:text-slate-400"
                                placeholder="••••••••"
                            />
                        </div>

                        <button type="submit" className="w-full bg-green-800 text-white py-4 rounded-xl font-bold hover:bg-green-950 transition-all shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                            Entrar al Panel <ArrowRight size={20} />
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-600">
                        ¿No tienes cuenta? <span onClick={() => navigate("/signup")} className="text-green-800 font-bold cursor-pointer hover:underline">Regístrate aquí</span>
                    </p>
                </div>
            </div>

            {/* LADO DERECHO: Visual de Finanzas (Solo visible en Desktop) */}
            <div className="hidden lg:flex flex-col items-center justify-center p-12 relative overflow-hidden animate-gradient-slow">
                {/* Capa de Partículas (Puntos) */}
                <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: `radial-gradient(circle, #4ade80 1px, transparent 1px)`, backgroundSize: '32px 32px' }}>
                </div>

                <div className="relative z-10 max-w-lg w-full text-center lg:text-left">
                    <h2 className="text-5xl font-black text-white leading-tight mb-6">
                        Transparencia en <br />
                        <span className="text-green-400">cada centavo.</span>
                    </h2>

                    {/* Dashboard de Finanzas Minimalista */}
                    <div className="bg-slate-700/20 p-2 rounded-3xl shadow-2xl border border-slate-600/50 relative mt-12 mx-auto lg:mx-0 backdrop-blur-sm">
                        <div className="relative group bg-slate-900 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden h-60">

                            {/* Header Mac unificado */}
                            <div className="flex gap-1.5 p-4 border-b border-slate-800">
                                <div className="w-2 h-2 rounded-full bg-red-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2 h-2 rounded-full bg-green-500/50"></div>
                            </div>

                            {/* Contenido con Padding p-6 consistente */}
                            <div className="p-6 space-y-5">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-500/20 rounded-2xl">
                                        <TrendingUp className="text-green-400" size={24} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Balance del Día</div>
                                        <div className="text-xl font-bold text-white">$2,450.00</div>
                                    </div>
                                </div>

                                <div className="h-px bg-slate-800 w-full"></div>

                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-widest">
                                        <span className="text-slate-500">Corte de Caja #42</span>
                                        <span className="text-green-400">Completado</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-full"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Overlay Blur (Corregido el doble div que tenías) */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500">
                                <div className="bg-green-500 p-4 rounded-full shadow-2xl shadow-green-900/40 transform scale-75 group-hover:scale-100 transition-transform duration-500 mb-4">
                                    <CheckCircle className="text-white" size={32} />
                                </div>
                                <div className="text-center px-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                    <p className="text-white font-bold text-lg">Centraliza tus cierres</p>
                                    <p className="text-slate-300 text-xs mt-1">Obtén todos tus ingresos del día en un solo lugar.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};