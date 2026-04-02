import React from "react";
import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const ProtectedRoute = ({ children, roleRequired }) => {
    const { store } = useGlobalReducer();
    const token = localStorage.getItem("token");

    // 1. Si no hay token, al login de cabeza
    if (!token) {
        return <Navigate to="/login" />;
    }

    // 2. Si hay token pero el store aún no tiene el usuario (por carga lenta), 
    // podrías mostrar un loading, pero aquí validaremos el rol si ya existe.
    const userRole = store.user?.role;

    // 3. Validación de Jerarquía/Rol
    if (roleRequired && userRole !== roleRequired) {
        // Si es un cajero intentando entrar al dashboard de admin, lo mandamos a su panel
        if (userRole === "cajero") {
            return <Navigate to="/pos" />;
        }
        // Si es un admin en una ruta de cajero, podrías permitirlo o mandarlo al dashboard
        return <Navigate to="/dashboard" />;
    }

    return children;
};