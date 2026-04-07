import React, { useState } from "react";
import { Wallet2, Menu, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

export const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const navLinks = ["Products", "Customers", "Pricing", "Learn"];
    const authButtons = [
        { name: "Log in", primary: false, path: "/login" },
        { name: "Sign up", primary: true, path: "/signup" }
    ]
    const navigate = useNavigate()

    const handleNavigation = (path) => {
        navigate(path);
        setIsOpen(false);
    };

    return (
        <nav className="p-3 px-6 lg:px-30 shadow bg-white relative">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
                    <Wallet2 className="h-8 w-8 text-gray-900" />
                    <span className="font-bold text-xl tracking-tight">CortexApp</span>
                </div>

                {/* Botón Hamburguesa */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>

                {/* Navegación Desktop */}
                <ul className="hidden md:flex items-center gap-8 text-slate-700 font-medium m-0">
                    {navLinks.map((link, index) => (
                        <li key={index} className="hover:text-green-300 cursor-pointer transition-colors">{link}</li>
                    ))}
                </ul>

                {/* Botones de Auth (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {authButtons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={() => navigate(btn.path)}
                            className={`px-8 py-2 rounded-full font-medium transition-all ${btn.primary ? "bg-green-800 hover:bg-green-950 text-white" : "text-green-900 border hover:text-green-400 hover:border-green-400"}`}
                        >
                            {btn.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menú Desplegable Mobile */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg z-50 animate-in fade-in slide-in-from-top-5">
                    <ul className="flex flex-col p-4 gap-4 text-slate-700 font-medium">
                        {navLinks.map((link, index) => (
                            <li key={index} className="border-b pb-2 cursor-pointer">{link}</li>
                        ))}
                        <div className="flex flex-col gap-2 pt-2">
                            {authButtons.map((btn, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleNavigation(btn.path)} // <--- FIX AQUÍ
                                    className={`w-full py-2 rounded-full font-medium ${btn.primary ? "bg-green-900 text-white" : "border text-green-900"}`}
                                >
                                    {btn.name}
                                </button>
                            ))}
                        </div>
                    </ul>
                </div>
            )}
        </nav>
    );
};