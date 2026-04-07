import React, { useEffect } from "react"; // Añadimos useEffect
import { Outlet } from "react-router-dom/dist";
import ScrollToTop from "../components/ScrollToTop";
import useGlobalReducer from "../hooks/useGlobalReducer"; // Importamos el hook global

export const Layout = () => {
    const { store, dispatch } = useGlobalReducer();

    useEffect(() => {
        const token = localStorage.getItem("token");
        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        // Si hay un token pero el store está vacío (típico tras un F5),
        // consultamos al backend para saber quién es este usuario.
        if (token && !store.user) {
            fetch(`${baseUrl}/api/profile`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.ok) return response.json();
                    throw new Error("Token inválido o expirado");
                })
                .then(data => {
                    // Devolvemos la información al store global
                    dispatch({
                        type: "login_user",
                        payload: data // 'data' debe contener el objeto con id, email, role, etc.
                    });
                })
                .catch(error => {
                    console.error("Error al recuperar sesión:", error);
                    // Si el token falló, lo mejor es limpiar para que no intente de nuevo
                    localStorage.removeItem("token");
                });
        }
    }, []); // Se ejecuta solo una vez al montar la App

    return (
        <ScrollToTop>
            <Outlet />
        </ScrollToTop>
    );
};