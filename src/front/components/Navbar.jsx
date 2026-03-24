import React, { useState } from "react";
import { Wallet2, Menu, X } from 'lucide-react';

export const Navbar = () => {

    const [isOpen, setIsOpen] = useState(false)
    const navLinks = ["Products", "Customers", "Pricing", "Learn"];
    const authButtons = [
        { name: "Log in", primary: false },
        { name: "Sign up", primary: true }
    ]

    return (
        <nav className="p-3 px-5 shadow bg-white relative">
            <div className="flex items-center justify-between">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Wallet2 className="h-8 w-8 text-gray-900" />
                    <span className="font-bold text-xl tracking-tight">CortexApp</span>
                </div>

                {/* Botón Hamburguesa (Solo visible en mobile) */}
                <button
                    className="md:hidden p-2"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X /> : <Menu />}
                </button>

                {/* Navegación Desktop */}
                <ul className="hidden md:flex items-center gap-8 text-slate-700 font-medium m-0">
                    {navLinks.map((link, index) => (
                        <li key={index} className="hover:text-blue-600 cursor-pointer transition-colors">{link}</li>
                    ))}
                </ul>

                {/* Botones de Auth (Desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {authButtons.map((btn, index) => (
                        <button key={index} className={`px-4 py-2 rounded-pill font-medium transition-all ${btn.primary ? "bg-gray-800 hover:bg-gray-950 text-white" : "border hover:scale-105"}`}>
                            {btn.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Menú Desplegable Mobile (Se muestra si isOpen es true) */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b shadow-lg z-50 animate-in fade-in slide-in-from-top-5">
                    <ul className="flex flex-col p-4 gap-4 text-slate-700 font-medium">
                        {navLinks.map((link, index) => (
                            <li key={index} className="border-b pb-2">{link}</li>
                        ))}
                        <div className="flex flex-col gap-2 pt-2">
                            {authButtons.map((btn, index) => (
                                <button key={index} className={`w-full py-2 rounded-pill ${btn.primary ? "bg-gray-800 text-white" : "border"}`}>
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