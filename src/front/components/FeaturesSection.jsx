import { Calculator, Truck, ShieldCheck, BarChart3, Clock, Globe } from 'lucide-react';

export const FeaturesSection = () => {
    // Definimos los datos de las tarjetas
    const services = [
        {
            title: "Cálculo de Flujo",
            desc: "Gestiona entradas y salidas de capital con reportes automatizados.",
            icon: <Calculator className="text-green-700" />,
            bgColor: "bg-green-100"
        },
        {
            title: "Monitoreo Real",
            desc: "Sigue la ubicación de tu flota en tiempo real con precisión satelital.",
            icon: <Truck className="text-blue-600" />,
            bgColor: "bg-blue-100"
        },
        {
            title: "Seguridad AWS",
            desc: "Tus datos están protegidos bajo la infraestructura más robusta de la nube.",
            icon: <ShieldCheck className="text-purple-600" />,
            bgColor: "bg-purple-100"
        },
        {
            title: "Análisis de Datos",
            desc: "Visualiza métricas clave para optimizar tus rutas y reducir costos.",
            icon: <BarChart3 className="text-orange-600" />,
            bgColor: "bg-orange-100"
        },
        {
            title: "Optimización 24/7",
            desc: "Sistema siempre activo para garantizar que tu logística nunca se detenga.",
            icon: <Clock className="text-red-600" />,
            bgColor: "bg-red-100"
        },
        {
            title: "Alcance Global",
            desc: "Gestiona operaciones internacionales con soporte multi-moneda.",
            icon: <Globe className="text-cyan-600" />,
            bgColor: "bg-cyan-100"
        }
    ];

    return (
        <section className="
    /* Mobile: Scroll lateral */
    flex overflow-x-auto snap-x snap-mandatory scrollbar-hide 
    gap-6 px-6 pb-10 mt-20
    /* Desktop: Volvemos al Grid original */
    md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-visible md:snap-none md:px-0 md:max-w-7xl md:mx-auto
">
            {services.map((service, index) => (
                <div
                    key={index}
                    className="
                /* Mobile: Ancho fijo para que se vea el inicio de la siguiente card */
                min-w-[85vw] sm:min-w-[350px] snap-center
                /* Desktop: Ancho automático dentro del grid */
                md:min-w-0
                p-8 bg-white rounded-3xl shadow-sm border border-slate-100 
                hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group
            "
                >
                    {/* Contenido de tu tarjeta igual que antes */}
                    <div className={`h-14 w-14 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                        {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{service.title}</h3>
                    <p className="text-slate-600 leading-relaxed text-sm">
                        {service.desc}
                    </p>
                </div>
            ))}
        </section>
    );
};