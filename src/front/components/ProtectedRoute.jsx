import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ProtectedRoute = ({ children, roleRequired }) => {
    const { store } = useGlobalReducer();
    const token = localStorage.getItem("token");

    // 1. Si no hay token, no hay discusión: al login.
    if (!token) {
        return <Navigate to="/login" />;
    }

    // 2. Si hay token pero el store está vacío (está cargando el usuario del API)
    // ESTA ES LA PIEZA QUE TE FALTA:
    if (!store.user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-black italic">
                CORTEX<span className="text-green-500">APP</span>_LOADING...
            </div>
        );
    }

    const userRole = store.user?.role;

    // 3. Validación de Jerarquía/Rol
    if (roleRequired && userRole !== roleRequired) {
        if (userRole === "cashier") {
            return <Navigate to="/pos" />;
        }
        // Si ya estamos en /dashboard, no redirijas de nuevo a /dashboard
        // Solo redirige si el usuario está en una ruta que NO le corresponde
        return <Navigate to="/dashboard" />;
    }

    return children;
};