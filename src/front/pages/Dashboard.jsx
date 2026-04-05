import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Building2, Users, ReceiptIndianRupee,
    Settings, LogOut, UserCircle, Menu, X, Calendar, DollarSign, ClipboardCheck, AlertCircle
} from 'lucide-react';
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Dashboard = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    // Estado para controlar el Sidebar en móviles
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Estados del sub-empresa
    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);

    const [cashiers, setCashiers] = useState([]);

    // 1. Estados para el resumen y las fechas
    const [summary, setSummary] = useState({
        totals: { usd_cash: 0, bs_cash: 0, zelle: 0, pagomovil: 0, biopago: 0, punto: 0 },
        total_shifts: 0,
        grand_total_usd: 0
    });

    // Por defecto: hoy
    const [dateFilter, setDateFilter] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);

    const [tasa, setTasa] = useState(36.50); // Valor inicial por defecto
    const [isSavingTasa, setIsSavingTasa] = useState(false);

    // Extraemos el nombre del usuario
    const userName = store.user?.full_name || "Antonio";

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };


    // Función para enviar la tasa al backend
    const handleSaveTasa = async () => {
        setIsSavingTasa(true);
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/exchange-rate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    rate: parseFloat(tasa),
                    date: dateFilter // Se guarda para la fecha que estás auditando
                })
            });
            if (resp.ok) {
                alert("Tasa actualizada y auditoría recalculada");
                fetchAuditData(); // Refrescamos los números del dashboard
            }
        } catch (error) {
            console.error("Error guardando tasa:", error);
        } finally {
            setIsSavingTasa(false);
        }
    };

    // 2. Función para obtener la auditoría
    const fetchAuditData = async () => {
        setLoading(true);
        try {
            // PASAMOS LA TASA POR URL
            const resp = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/admin/audit-summary?start_date=${dateFilter}&end_date=${dateFilter}&tasa=${tasa}`,
                {
                    headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
                }
            );
            if (resp.ok) {
                const data = await resp.json();
                setSummary(data);
            }
        } catch (error) {
            console.error("Error cargando auditoría:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCompany = async (id, name) => {
        if (!confirm(`¿Estás seguro de eliminar la sede "${name}"? Esto borrará también sus registros.`)) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/company/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });

            if (response.ok) {
                alert("Sede eliminada");
                fetchCompanies(); // Refrescamos la lista
                if (selectedCompany?.id === id) setSelectedCompany(null);
            }
        } catch (error) {
            console.error("Error eliminando sede:", error);
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleCreateCompany = async () => {
        const companyName = prompt("Nombre de la nueva sede (ej: Pizzería Centro):");
        if (!companyName) return;

        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${baseUrl}/api/company`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Aquí enviamos el token de seguridad
                },
                body: JSON.stringify({ name: companyName })
            });

            if (response.ok) {
                alert("¡Sede creada con éxito!");
                fetchCompanies()
                // Aquí podrías disparar una función para refrescar la lista
            } else {
                alert("Error al crear la sede");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const handleAddCashier = async () => {
        if (!selectedCompany) return alert("Por favor, selecciona una sede primero.");

        const name = prompt(`Nombre del cajero para ${selectedCompany.name}:`);
        const email = prompt("Correo electrónico del cajero:");
        const pass = prompt("Asigna una contraseña temporal:");

        if (!name || !email || !pass) return;

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cashier`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    full_name: name,
                    email: email,
                    password: pass,
                    company_id: selectedCompany.id
                })
            });

            if (response.ok) alert("Cajero registrado y vinculado a la sede.");
            else alert("Error al registrar cajero. Revisa si el correo ya existe.");
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const fetchCashiers = async (companyId) => {
        const token = localStorage.getItem("token");
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/company/${companyId}/cashiers`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCashiers(data);
            }
        } catch (error) {
            console.error("Error cargando cajeros:", error);
        }
    };

    const fetchCompanies = async () => {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        try {
            const response = await fetch(`${baseUrl}/api/companies`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCompanies(data);
            }
        } catch (error) {
            console.error("Error cargando empresas:", error);
        }
    }

    // Función para obtener la tasa de una fecha específica
    const fetchTodayRate = async () => {
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/get-rate?date=${dateFilter}`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                setTasa(data.rate); // Actualiza el input con lo que hay en DB
            } else {
                setTasa(36.50); // Valor de respaldo si no hay nada en DB para ese día
            }
        } catch (error) {
            console.error("Error obteniendo tasa:", error);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []); // Se ejecuta una sola vez al montar el componente

    // Efecto 2: Cargar cajeros cuando se selecciona una empresa
    useEffect(() => {
        if (selectedCompany) {
            fetchCashiers(selectedCompany.id);
        }
    }, [selectedCompany]);

    useEffect(() => { fetchAuditData(); }, [dateFilter]);

    useEffect(() => {
        fetchTodayRate();
    }, [dateFilter]);

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-slate-50">

            {/* HEADER SUPERIOR (Mobile Only) */}
            <header className="flex md:hidden items-center justify-between p-4 bg-slate-900 sticky top-0 z-50 shadow-md">
                <h1 className="text-xl font-black text-white italic">
                    Cortex<span className="text-green-500">App</span>
                </h1>
                <button onClick={toggleSidebar} className="p-2 text-white bg-slate-800 rounded-lg">
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </header>

            {/* SIDEBAR VERTICAL */}
            <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 z-40
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                absolute md:relative inset-y-0 left-0 md:translate-x-0 
                h-full md:min-h-screen`
            }>
                <div className="hidden md:block p-6">
                    <h1 className="text-2xl font-black text-white italic">Cortex<span className="text-green-500">App</span></h1>
                </div>

                <nav className="flex-1 px-4 mt-8 md:mt-0 space-y-2 overflow-y-auto">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Resumen" active />
                    <NavItem icon={<Building2 size={20} />} label="Sub-Empresas" onClick={handleCreateCompany} />
                    <NavItem icon={<Users size={20} />} label="Cajeros" onClick={() => { handleCreateCompany() }} />
                    <NavItem icon={<ReceiptIndianRupee size={20} />} label="Cortes de Caja" />
                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <NavItem icon={<Settings size={20} />} label="Configuración" />
                    </div>
                </nav>

                <div className="p-4 border-t border-slate-800 bg-slate-900/50 mt-auto">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-500">
                            <UserCircle size={24} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{userName}</p>
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">Admin Master</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/20">
                        <LogOut size={14} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {isSidebarOpen && <div onClick={toggleSidebar} className="fixed inset-0 bg-black/50 z-30 md:hidden" />}

            {/* CONTENIDO PRINCIPAL */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full md:w-auto">
                <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                            ¡Bienvenido, <span className="text-green-700">{userName.split(' ')[0]}</span>!
                        </h2>
                        <p className="text-slate-500 mt-2 text-lg">Resumen de actividad para tu organización.</p>
                    </div>

                    {/* SELECTOR DE FECHA */}
                    <div className="flex flex-col items-start md:items-end gap-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Auditar Fecha:</label>
                        <div className="relative group">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-green-600 transition-colors" size={16} />
                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500 transition-all cursor-pointer shadow-sm"
                            />
                        </div>
                    </div>
                </header>

                {/* PANEL DE TASA DE CAMBIO */}
                <div className="bg-slate-900 p-6 rounded-[2rem] mb-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-blue-900/10 border border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-black text-lg">Tasa Oficial BCV</h4>
                            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Configuración bimoneda activa</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 bg-slate-800 p-2 rounded-2xl border border-slate-700">
                        <span className="pl-4 text-slate-500 font-bold text-sm">Bs.</span>
                        <input
                            type="number"
                            value={tasa}
                            onChange={(e) => setTasa(e.target.value)}
                            className="w-24 bg-transparent text-white font-black text-xl outline-none"
                            placeholder="0.00"
                        />
                        <button
                            onClick={handleSaveTasa}
                            disabled={isSavingTasa}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {isSavingTasa ? "..." : "ACTUALIZAR"}
                        </button>
                    </div>
                </div>

                {/* GRID DE ESTADÍSTICAS PRINCIPALES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <StatCard
                        title="Ingresos Totales"
                        value={`$${summary.grand_total_usd.toFixed(2)}`}
                        icon={<DollarSign className="text-green-600" />}
                        loading={loading}
                    />
                    <StatCard
                        title="Cortes Realizados"
                        value={summary.total_shifts}
                        icon={<ClipboardCheck className="text-blue-600" />}
                        loading={loading}
                    />
                    <StatCard
                        title="Alertas de Caja"
                        value="0"
                        icon={<AlertCircle className="text-amber-500" />}
                        loading={loading}
                    />
                </div>

                {/* DESGLOSE POR MÉTODO (La nueva sección) */}
                <section className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm mb-12">
                    <div className="flex items-center gap-2 mb-8">
                        <div className="h-1 w-8 bg-green-500 rounded-full"></div>
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Flujo de Efectivo Detallado</h3>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <MiniStat label="Efectivo $" value={summary.totals.usd_cash} color="text-green-600" bg="bg-green-50" />
                        <MiniStat label="Efectivo Bs" value={summary.totals.bs_cash} color="text-blue-600" bg="bg-blue-50" />
                        <MiniStat label="Zelle" value={summary.totals.zelle} color="text-purple-600" bg="bg-purple-50" />
                        <MiniStat label="Pago Móvil" value={summary.totals.pagomovil} color="text-orange-600" bg="bg-orange-50" />
                        <MiniStat label="Biopago" value={summary.totals.biopago} color="text-teal-600" bg="bg-teal-50" />
                        <MiniStat label="Punto" value={summary.totals.punto} color="text-yellow-600" bg="bg-yellow-50" />
                    </div>
                </section>

                {/* SECCIÓN DE SELECCIÓN DE SEDE */}
                <section className="mt-10">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-2xl font-black text-slate-800 italic">Sedes Registradas</h3>
                        <div className="h-px flex-1 bg-slate-100 mx-6"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {companies.map((company) => (
                            <div key={company.id} className="relative group">
                                <div
                                    onClick={() => navigate(`/dashboard/company/${company.id}`)} // <--- CAMBIO AQUÍ
                                    className="p-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 border-slate-100 bg-white hover:border-green-400 hover:shadow-xl hover:shadow-green-900/5 -translate-y-1 group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                            <Building2 size={24} />
                                        </div>
                                        {/* Badge de "Ver Detalle" que aparece al pasar el mouse */}
                                        <span className="opacity-0 group-hover:opacity-100 text-[10px] bg-green-600 text-white px-3 py-1 rounded-full font-black uppercase tracking-tighter transition-opacity">
                                            Analizar Sede
                                        </span>
                                    </div>
                                    <h4 className="mt-6 font-black text-slate-900 text-xl group-hover:text-green-700 transition-colors">{company.name}</h4>
                                    <p className="text-slate-500 text-sm mt-1">{company.address || "Boconó, Venezuela"}</p>
                                </div>

                                {/* Botón de eliminar (se mantiene igual) */}
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDeleteCompany(company.id, company.name); }}
                                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        ))}

                        <button
                            onClick={handleCreateCompany}
                            className="flex flex-col items-center justify-center p-8 rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50 text-slate-400 hover:border-green-400 hover:text-green-600 hover:bg-green-50/50 transition-all group"
                        >
                            <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                <Building2 size={32} className="text-slate-300 group-hover:text-green-500" />
                            </div>
                            <span className="mt-4 text-sm font-bold tracking-tight">+ Añadir Nueva Sede</span>
                        </button>
                    </div>
                </section>

                {/* GESTIÓN DE CAJEROS (Sólo si hay sede seleccionada) */}
                {selectedCompany && (
                    <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                        <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <p className="text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">Gestión de Personal</p>
                                <h3 className="text-3xl font-black">
                                    Sede: <span className="italic">{selectedCompany.name}</span>
                                </h3>
                            </div>
                            <button
                                onClick={handleAddCashier}
                                className="w-full md:w-auto flex items-center justify-center gap-2 bg-green-500 text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-green-400 transition-all"
                            >
                                <Users size={20} /> REGISTRAR CAJERO
                            </button>
                        </div>

                        <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
                            <div className="p-6 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2 uppercase text-xs tracking-widest">
                                    Personal en Nómina
                                </h4>
                                <span className="text-xs font-bold text-slate-400">{cashiers.length} usuarios</span>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {cashiers.length > 0 ? (
                                    cashiers.map(cashier => (
                                        <div key={cashier.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-900 font-black text-xl">
                                                    {cashier.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900">{cashier.full_name}</p>
                                                    <p className="text-xs text-slate-400 font-medium">{cashier.email}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black uppercase px-3 py-1.5 bg-green-100 text-green-700 rounded-lg">
                                                    {cashier.role}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-12 text-center">
                                        <p className="text-slate-400 font-medium italic">No hay cajeros asignados a esta ubicación.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

// Componentes internos (No necesitan cambios)
const NavItem = ({ icon, label, active = false, onClick }) => ( // Añadimos onClick aquí
    <div
        onClick={onClick} // Se lo asignamos al div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all ${active ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' : 'hover:bg-slate-800 hover:text-white'
            }`}
    >
        {icon}
        <span className="font-semibold text-sm">{label}</span>
    </div>
);

const StatCard = ({ title, value, icon, loading }) => (
    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:border-green-100 group">
        <div className="flex justify-between items-start mb-6">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">{title}</p>
            <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-green-50 transition-colors">
                {icon}
            </div>
        </div>
        {loading ? (
            <div className="h-10 w-2/3 bg-slate-100 animate-pulse rounded-xl"></div>
        ) : (
            <p className="text-4xl font-black text-slate-900 tracking-tighter">{value}</p>
        )}
    </div>
);

const MiniStat = ({ label, value, color, bg }) => (
    <div className={`${bg} p-5 rounded-[1.5rem] border border-white transition-transform hover:scale-105`}>
        <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">{label}</p>
        <p className={`text-xl font-black ${color}`}>${value.toFixed(2)}</p>
    </div>
);