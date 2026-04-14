import React, { useEffect, useState, useContext } from "react";
import { Context } from "../store/appContext"; // Importa tu contexto

const DailyTotalsRow = () => {
    const { store, actions } = useContext(Context);
    const [dailyData, setDailyData] = useState([]);

    useEffect(() => {
        const loadSummary = async () => {
            // Asegúrate de usar la URL completa de tu backend (Render o Local)
            const resp = await fetch(process.env.VITE_BACKEND_URL + "/api/shifts/weekly-summary", {
                headers: {
                    "Authorization": "Bearer " + store.token // Tu JWT para el organization_id
                }
            });
            if (resp.ok) {
                const data = await resp.json();
                setDailyData(data);
            }
        };
        if (store.token) loadSummary();
    }, [store.token]);

    return (
        <div className="d-flex overflow-auto mb-4 pb-2" style={{ gap: "1rem" }}>
            {dailyData.length > 0 ? dailyData.map((item, index) => (
                <div key={index} className="card shadow-sm border-0 bg-light" style={{ minWidth: "140px" }}>
                    <div className="card-body p-2 text-center">
                        <small className="text-muted d-block">{item.date}</small>
                        <span className="h6 text-success font-weight-bold">${item.total}</span>
                    </div>
                </div>
            )) : <p className="text-muted">No hay cierres recientes...</p>}
        </div>
    );
};