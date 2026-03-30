import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard, Building2, Users, ReceiptIndianRupee,
    Settings, LogOut, UserCircle, Menu, X
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

    // Extraemos el nombre del usuario
    const userName = store.user?.full_name || "Antonio";

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
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

    useEffect(() => {
        fetchCompanies();
    }, []); // Se ejecuta una sola vez al montar el componente

    // Efecto 2: Cargar cajeros cuando se selecciona una empresa
    useEffect(() => {
        if (selectedCompany) {
            fetchCashiers(selectedCompany.id);
        }
    }, [selectedCompany]);

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

            {/* SIDEBAR VERTICAL (Responsive) */}
            <aside className={`w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 z-40
                transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
                absolute md:relative inset-y-0 left-0 md:translate-x-0 
                h-full md:min-h-screen`
            }>
                {/* Logo (Oculto en móvil ya que está en el header) */}
                <div className="hidden md:block p-6">
                    <h1 className="text-2xl font-black text-white italic">Cortex<span className="text-green-500">App</span></h1>
                </div>

                {/* Navegación (Se ajusta para móvil y tablet) */}
                <nav className="flex-1 px-4 mt-8 md:mt-0 space-y-2 overflow-y-auto">
                    <NavItem icon={<LayoutDashboard size={20} />} label="Resumen" active />

                    {/* Ahora le pasamos la función directamente a Sub-Empresas */}
                    <NavItem
                        icon={<Building2 size={20} />}
                        label="Sub-Empresas"
                        onClick={handleCreateCompany}
                    />

                    <NavItem icon={<Users size={20} />} label="Cajeros" onClick={() => { handleCreateCompany() }} />
                    <NavItem icon={<ReceiptIndianRupee size={20} />} label="Cortes de Caja" />

                    <div className="pt-4 mt-4 border-t border-slate-800">
                        <NavItem icon={<Settings size={20} />} label="Configuración" />
                    </div>
                </nav>

                {/* Perfil (Siempre abajo) */}
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
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-lg transition-all border border-red-500/20"
                    >
                        <LogOut size={14} /> Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* OVERLAY para cerrar el menú en móvil al tocar fuera */}
            {isSidebarOpen && (
                <div
                    onClick={toggleSidebar}
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                />
            )}

            {/* CONTENIDO PRINCIPAL (Centrado y Responsive) */}
            <main className="flex-1 p-6 md:p-12 overflow-y-auto w-full md:w-auto">
                <header className="mb-12 text-left md:text-left">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                        ¡Bienvenido de nuevo, <span className="text-green-700">{userName.split(' ')[0]}</span>!
                    </h2>
                    <p className="text-slate-500 mt-2 text-lg md:text-xl max-w-xl">
                        Aquí tienes un resumen de la actividad de hoy para tu organización.
                    </p>
                </header>

                {/* GRID DE ESTADÍSTICAS (Ajustado para móvil) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard title="Ingresos Totales" value="$0.00" color="green" />
                    <StatCard title="Cortes Realizados" value="0" color="blue" />
                    <StatCard title="Alertas de Caja" value="Sin novedades" color="amber" />
                </div>
                {/* SECCIÓN DE SELECCIÓN DE EMPRESA */}
                <section className="mt-10">
                    <h3 className="text-xl font-bold text-slate-800 mb-6">Selecciona una Sede para gestionar:</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {companies.map((company) => (
                            <div key={company.id} className="relative group">
                                <div
                                    onClick={(e) => {
                                        e.stopPropagation(); // Evita que el clic llegue al fondo del Dashboard
                                        setSelectedCompany(company);
                                    }}
                                    className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${selectedCompany?.id === company.id
                                        ? "border-green-500 bg-green-50 shadow-md"
                                        : "border-slate-200 bg-white hover:border-slate-300"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <Building2 className={selectedCompany?.id === company.id ? "text-green-600" : "text-slate-400"} />

                                        {/* Badge de 'Activa' movido a la izquierda para no chocar con la X */}
                                        {selectedCompany?.id === company.id && (
                                            <span className="mr-6 text-[10px] bg-green-600 text-white px-2 py-1 rounded-full font-bold uppercase animate-in zoom-in">
                                                Activa
                                            </span>
                                        )}
                                    </div>
                                    <h4 className="mt-4 font-black text-slate-900 text-lg">{company.name}</h4>
                                    <p className="text-slate-500 text-sm">{company.address || "Sin dirección registrada"}</p>
                                </div>

                                {/* Botón X con mejor contraste y área de clic */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteCompany(company.id, company.name);
                                    }}
                                    className="absolute top-2 right-2 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-all z-20"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}

                        {/* Botón rápido para añadir más desde el grid */}
                        <button
                            onClick={() => {
                                handleCreateCompany();
                            }}
                            className="flex flex-col items-center justify-center text-center p-6 min-h-[160px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-green-400 hover:text-green-600 hover:bg-green-50 transition-all shadow-inner group"
                        >
                            {/* Ícono grande y centrado */}
                            <div className="p-3 bg-white rounded-full border border-slate-200 group-hover:border-green-100 transition-colors">
                                <Building2 size={32} className="text-slate-300 group-hover:text-green-500 transition-colors" />
                            </div>

                            {/* Texto de Acción */}
                            <span className="mt-4 text-sm font-bold block">+ Añadir Sede</span>
                            <span className="text-xs text-slate-400 block group-hover:text-green-500/80 transition-colors">Crea una nueva ubicación</span>
                        </button>
                    </div>
                </section>
                {selectedCompany && (
                    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        {/* Header de Gestión */}
                        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
                            <div>
                                <h3 className="text-2xl font-black text-slate-900 italic">
                                    Sede: <span className="text-green-600">{selectedCompany.name}</span>
                                </h3>
                                <p className="text-slate-500 text-sm">Control de personal y operaciones activas.</p>
                            </div>
                            <button
                                onClick={handleAddCashier}
                                className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-900/10"
                            >
                                <Users size={18} /> + Nuevo Cajero
                            </button>
                        </div>

                        {/* Lista de Cajeros */}
                        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="p-4 bg-slate-50 border-b border-slate-200">
                                <h4 className="font-bold text-slate-700 flex items-center gap-2">
                                    <UserCircle size={18} className="text-slate-400" /> Personal Asignado
                                </h4>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {cashiers.length > 0 ? (
                                    cashiers.map(cashier => (
                                        <div key={cashier.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                                    {cashier.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-900">{cashier.full_name}</p>
                                                    <p className="text-xs text-slate-500">{cashier.email}</p>
                                                </div>
                                            </div>
                                            <span className="text-[10px] font-black uppercase px-2 py-1 bg-slate-100 text-slate-500 rounded-md">
                                                {cashier.role}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400 italic text-sm">
                                        No hay cajeros registrados en esta sede aún.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div >
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

const StatCard = ({ title, value, color }) => (
    <div className="bg-white p-6 md:p-8 rounded-3xl border border-slate-200 shadow-sm transition-all hover:border-green-100 hover:shadow-lg">
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">{title}</p>
        <p className="text-4xl md:text-5xl font-black text-slate-900">{value}</p>
    </div>
);