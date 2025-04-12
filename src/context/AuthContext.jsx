// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Vérifie si un token existe dans localStorage lors du chargement de la page
        const token = localStorage.getItem("authToken");

        // Si le token est valide (présent et non expiré), l'utilisateur est authentifié
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (token) => {
        if (token) {
            // On sauvegarde le token dans localStorage uniquement lors du login
            localStorage.setItem("authToken", token);
            setIsAuthenticated(true);
        }
    };

    const logout = () => {
        // Supprime le token du localStorage lors de la déconnexion
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
