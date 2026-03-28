import React from "react";

export const ProtectedRoute = ({ children }) => {
    // Verificamos si existe el token en el almacenamiento local
    const token = localStorage.getItem("token");

    // Si no hay token, lo mandamos de patitas a la calle (al login)
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Si hay token, lo dejamos pasar al contenido protegido
    return children;
};