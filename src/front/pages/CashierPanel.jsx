import React, { useState, useEffect } from "react";
import { Wallet, LogOut, Clock, ArrowRightCircle } from 'lucide-react';
import useGlobalReducer from "../hooks/useGlobalReducer";
import { useNavigate } from "react-router-dom";

export const CashierPanel = () => {
    const { store } = useGlobalReducer();
    const navigate = useNavigate();

    const [activeShift, setActiveShift] = useState(null);
    const [openUsd, setOpenUsd] = useState("");
    const [openBs, setOpenBs] = useState("");
    const [loading, setLoading] = useState(true);
    const [isClosing, setIsClosing] = useState(false);
    const [closeData, setCloseData] = useState({
        close_cash_usd: "",
        close_cash_bs: "",
        close_zelle: "",
        close_pagomovil: "",
        close_biopago: "",
        close_punto: ""
    });

    const checkActiveShift = async () => {
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cash-shift/active`, {
                headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
            });
            if (resp.ok) {
                const data = await resp.json();
                setActiveShift(data);
            }
        } catch (error) {
            console.error("Error verificando turno:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { checkActiveShift(); }, []);

    const handleOpenShift = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cash-shift/open`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    open_amount_usd: parseFloat(openUsd) || 0,
                    open_amount_bs: parseFloat(openBs) || 0,
                    company_id: store.user.company_id
                })
            });

            if (resp.ok) {
                const data = await resp.json();
                // Importante: aquí podrías necesitar recargar el shift activo
                checkActiveShift();
                alert("Turno iniciado. ¡A vender!");
            }
        } catch (error) {
            console.error("Error al abrir turno:", error);
        }
    };

    const handleCloseShift = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cash-shift/close`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify({
                    close_cash_usd: parseFloat(closeData.close_cash_usd) || 0,
                    close_cash_bs: parseFloat(closeData.close_cash_bs) || 0,
                    close_zelle: parseFloat(closeData.close_zelle) || 0,
                    close_pagomovil: parseFloat(closeData.close_pagomovil) || 0,
                    close_biopago: parseFloat(closeData.close_biopago) || 0,
                    close_punto: parseFloat(closeData.close_punto) || 0,
                })
            });

            if (resp.ok) {
                alert("Corte realizado con éxito. Sesión finalizada.");
                setActiveShift(null);
                setIsClosing(false);
                localStorage.removeItem("token");
                navigate("/login");
            }
        } catch (error) {
            console.error("Error al cerrar turno:", error);
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-900 text-white">Cargando panel operativo...</div>;

    return (
        <div className="min-h-screen bg-slate-900 text-white p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h1 className="text-xl font-black italic">Cortex<span className="text-green-500">POS</span></h1>
                    <p className="text-slate-400 text-[10px] uppercase tracking-widest">{store.user?.full_name}</p>
                </div>
                <button onClick={() => { localStorage.removeItem("token"); navigate("/login"); }} className="text-slate-500 hover:text-red-400">
                    <LogOut size={20} />
                </button>
            </div>

            <main className="max-w-md mx-auto mt-10">
                {!activeShift ? (
                    /* --- VISTA 1: FORMULARIO APERTURA --- */
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl animate-in fade-in zoom-in">
                        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6 mx-auto">
                            <Wallet size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-center mb-2">Apertura de Caja</h2>
                        <p className="text-slate-400 text-center text-sm mb-8">Ingresa el efectivo inicial.</p>

                        <form onSubmit={handleOpenShift} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Efectivo $</label>
                                    <input type="number" step="0.01" value={openUsd} onChange={(e) => setOpenUsd(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-xl font-black text-green-500 outline-none focus:border-green-500" placeholder="0.00" />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Efectivo Bs</label>
                                    <input type="number" step="0.01" value={openBs} onChange={(e) => setOpenBs(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 px-4 text-xl font-black text-blue-400 outline-none focus:border-blue-400" placeholder="0.00" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all">
                                Iniciar Turno <ArrowRightCircle size={20} />
                            </button>
                        </form>
                    </div>
                ) : isClosing ? (
                    /* --- VISTA 2: FORMULARIO CIERRE (CORTE) --- */
                    <div className="bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl animate-in fade-in zoom-in">
                        <h2 className="text-2xl font-bold mb-2">Corte de Caja</h2>
                        <p className="text-slate-400 text-sm mb-6">Declara los montos físicos totales al cierre.</p>

                        <form onSubmit={handleCloseShift} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <InputClose label="Efectivo $" name="close_cash_usd" value={closeData} set={setCloseData} color="text-green-400" />
                                <InputClose label="Efectivo Bs" name="close_cash_bs" value={closeData} set={setCloseData} color="text-blue-400" />
                                <InputClose label="Zelle" name="close_zelle" value={closeData} set={setCloseData} color="text-purple-400" />
                                <InputClose label="Pago Móvil" name="close_pagomovil" value={closeData} set={setCloseData} color="text-orange-400" />
                                <InputClose label="Biopago" name="close_biopago" value={closeData} set={setCloseData} color="text-teal-400" />
                                <InputClose label="Punto de Venta" name="close_punto" value={closeData} set={setCloseData} color="text-yellow-400" />
                            </div>

                            <div className="pt-6 flex gap-3">
                                <button type="button" onClick={() => setIsClosing(false)} className="flex-1 py-4 text-slate-400 font-bold hover:bg-slate-700 rounded-2xl transition-all">
                                    Volver
                                </button>
                                <button type="submit" className="flex-[2] bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-red-900/20 transition-all">
                                    Cerrar Caja
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    /* --- VISTA 3: DASHBOARD OPERATIVO --- */
                    <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="bg-green-600 p-6 rounded-3xl shadow-lg">
                            <div className="flex items-center gap-2 text-green-100 text-xs font-bold uppercase tracking-tighter mb-1">
                                <Clock size={14} /> Turno en curso
                            </div>
                            <p className="text-3xl font-black italic">Caja Abierta</p>
                            <div className="flex gap-4 mt-2">
                                <p className="text-green-100/80 text-sm font-bold">Base $: {activeShift.open_amount_usd}</p>
                                <p className="text-green-100/80 text-sm font-bold">Base Bs: {activeShift.open_amount_bs}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                                <p className="text-slate-500 text-[10px] font-bold uppercase">Ventas (Sistema)</p>
                                <p className="text-xl font-bold text-white">$0.00</p>
                            </div>
                            <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700">
                                <p className="text-slate-500 text-[10px] font-bold uppercase">Gastos</p>
                                <p className="text-xl font-bold text-red-400">$0.00</p>
                            </div>
                        </div>

                        <button
                            onClick={() => setIsClosing(true)}
                            className="w-full py-5 rounded-2xl border-2 border-red-500/20 text-red-400 font-bold hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"
                        >
                            Realizar Corte de Caja <ArrowRightCircle size={18} />
                        </button>
                    </div>
                )}
            </main>
        </div>
    );
};

// Sub-componente de ayuda para los inputs
const InputClose = ({ label, name, value, set, color }) => (
    <div className="space-y-1">
        <label className="block text-[9px] font-bold text-slate-500 uppercase ml-1">{label}</label>
        <input
            type="number"
            step="0.01"
            value={value[name]}
            onChange={(e) => set({ ...value, [name]: e.target.value })}
            placeholder="0.00"
            className={`w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-lg font-bold ${color} outline-none focus:border-slate-500 transition-colors`}
        />
    </div>
);