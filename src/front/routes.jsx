import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { SignUp } from "./pages/SignUp";
import { Dashboard } from "./pages/Dashboard"; // Asumiendo que tienes esta página
import { ProtectedRoute } from "./components/ProtectedRoute";
import { CashierPanel } from "./pages/CashierPanel";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>} >

      {/* Rutas Públicas: Cualquiera puede verlas */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Ruta para el Dueño/Admin */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute roleRequired="admin">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Ruta para el Operativo/Cajero */}
      <Route
        path="/pos"
        element={
          <ProtectedRoute roleRequired="cajero">
            <CashierPanel />
          </ProtectedRoute>
        }
      />

    </Route>
  )
);