import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TrendingUp, DollarSign, Clock, Building2, ArrowLeft } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// --- SUB-COMPONENTE: Tarjeta de Métrica ---
const MetricCard = ({ title, value, icon, color }) => (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-${color}-50 text-${color}-600`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{title}</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{value}</p>
        </div>
    </div>
);

// --- COMPONENTE PRINCIPAL ---
export const CompanyDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [company, setCompany] = useState(null);
    const [stats, setStats] = useState({ total_ventas_usd: 0, total_turnos: 0, ticket_promedio: 0, ranking: [] });
    const [trends, setTrends] = useState([]); // <--- NUEVO: Estado para la gráfica
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = { "Authorization": `Bearer ${localStorage.getItem("token")}` };

                // 1. Datos de la Empresa
                const resComp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/company/${id}`, { headers });
                if (resComp.ok) setCompany(await resComp.ok ? await resComp.json() : null);

                // 2. Estadísticas Generales
                const resStats = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/company-stats/${id}`, { headers });
                if (resStats.ok) setStats(await resStats.json());

                // 3. Tendencias para la Gráfica
                const resTrends = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/company-trends/${id}`, { headers });
                if (resTrends.ok) setTrends(await resTrends.json());

            } catch (error) {
                console.error("Error cargando datos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) return <div className="p-20 font-black text-slate-400 italic animate-pulse text-center">Analizando datos de la sede...</div>;

    return (
        <div className="flex flex-col min-h-screen bg-slate-50 p-6 md:p-12 pb-24">
            {/* Cabecera */}
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-8 transition-colors">
                <ArrowLeft size={18} /> <span className="text-xs font-bold uppercase tracking-widest">Volver</span>
            </button>

            <header className="mb-12">
                <div className="flex items-center gap-3 mb-2">
                    <Building2 className="text-green-600" size={24} />
                    <span className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Análisis de Sede</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight italic">
                    Detalle de <span className="text-green-700">{company?.name || "Sede"}</span>
                </h2>
                <p className="text-slate-400 mt-2 font-mono">ID de Registro: #00{id}</p>
            </header>

            {/* Grid de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <MetricCard title="Venta Histórica" value={`$${stats.total_ventas_usd}`} icon={<TrendingUp size={20} />} color="green" />
                <MetricCard title="Ticket Promedio" value={`$${stats.ticket_promedio}`} icon={<DollarSign size={20} />} color="blue" />
                <MetricCard title="Turnos Totales" value={stats.total_turnos} icon={<Clock size={20} />} color="purple" />
            </div>

            {/* SECCIÓN DE LA GRÁFICA */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 min-h-[450px]">
                    <h3 className="text-slate-900 font-black italic mb-8 uppercase tracking-widest text-sm flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-ping"></div> Tendencia de Ventas (7 días)
                    </h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trends}>
                                <defs>
                                    <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis hide={true} domain={['auto', 'auto']} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#065f46', fontWeight: '900' }}
                                />
                                <Area type="monotone" dataKey="ventas" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorVentas)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Top de Actividad (Movido a la derecha) */}
                <div className="bg-slate-900 p-10 rounded-[3rem] shadow-xl text-white">
                    <h4 className="font-black text-xl mb-8 italic text-green-400 uppercase tracking-tighter">Top Actividad</h4>
                    <div className="space-y-8">
                        {stats.ranking.map((cajero, index) => (
                            <div key={index} className="flex items-center justify-between border-b border-slate-800 pb-4">
                                <div>
                                    <p className="font-bold text-slate-100 text-lg">{cajero.name}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">Responsable</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-green-500 font-black text-xl">{cajero.count}</p>
                                    <p className="text-[10px] text-slate-500 uppercase">Cierres</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};