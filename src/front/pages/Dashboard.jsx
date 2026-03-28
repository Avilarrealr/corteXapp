import React from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
        // Nota: El alert es útil, pero podrías usar un toast después para mejor UX
    }

    return (
        // Cambiamos justify-start por justify-center para centrar verticalmente
        // Cambiamos min-h-full por min-h-screen para ocupar toda la pantalla
        <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 gap-6">

            {/* Contenedor de texto con alineación centralizada */}
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-black text-slate-900">
                    Panel de Control <span className="text-green-800">CortexApp</span> 🤫
                </h2>
                <p className="text-slate-500">
                    Tu sesión es válida y tienes acceso total a la ruta privada.
                </p>
            </div>

            {/* Botón de Logout */}
            <div className="flex justify-center">
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 text-sm font-bold text-red-600 bg-transparent border-2 border-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all duration-300 flex items-center gap-2 shadow-sm"
                >
                    Cerrar Sesión Segura
                </button>
            </div>
        </div>
    );
};