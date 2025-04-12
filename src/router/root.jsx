import { Navigate, Route, Routes } from "react-router-dom"; // Vérifie que tu utilises bien la v6 de react-router
import { useAuth } from "../context/AuthContext"; // Pour vérifier l'authentification
import Dashboard from "../pages/Dashboard"; // Import du Dashboard
import Home from "../pages/Home";
import LoginForm from "../pages/LoginForm";
import SignUpForm from "../pages/SignUpForm";

function Root() {
    const { isAuthenticated } = useAuth(); // Vérifie l'état d'authentification

    return (
        <Routes>
            {/* Si l'utilisateur est authentifié, redirige-le vers le Dashboard au lieu de la Home */}
            <Route
                path="/"
                element={
                    isAuthenticated ? <Navigate to="/dashboard" /> : <Home />
                }
            />
            <Route path="/signup" element={<SignUpForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route
                path="/dashboard"
                element={
                    isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
                }
            />
        </Routes>
    );
}

export default Root;
