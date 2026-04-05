import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, Users, Clock } from 'lucide-react';

export const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);

    // Mañana llenaremos esto con los endpoints de analítica
    useEffect(() => {
        // fetchCompanyDetails(id);
    }, [id]);

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            {/* Botón para volver al Dashboard General */}
            <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-bold mb-8 transition-colors"
            >
                <ArrowLeft size={20} /> Volver al Resumen Global
            </button>

            <header className="mb-10">
                <h2 className="text-4xl font-black text-slate-900 italic">
                    Analítica: <span className="text-green-600">Sede #{id}</span>
                </h2>
                <p className="text-slate-500">Monitoreo de rendimiento y flujo de caja local.</p>
            </header>

            {/* Espacio para los gráficos que haremos mañana */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-64 flex items-center justify-center">
                    <p className="text-slate-400 italic">Próximamente: Gráfico de Ventas por Hora</p>
                </div>
                <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-64 flex items-center justify-center">
                    <p className="text-slate-400 italic">Próximamente: Top Cajeros del Mes</p>
                </div>
            </div>
        </div>
    );
};