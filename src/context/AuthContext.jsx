import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null); // Ajouter userId ici

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole");
        const id = localStorage.getItem("userId"); // Récupérer userId

        if (token && role && id) {
            setIsAuthenticated(true);
            setUserRole(role);
            setUserId(id); // Initialiser userId
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    const login = (token, roles, userId) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", roles[0]); // Stocker uniquement le 1er rôle
        localStorage.setItem("userId", userId); // Stocker l'id de l'utilisateur
        setIsAuthenticated(true);
        setUserRole(roles[0]);
        setUserId(userId); // Mettre à jour l'id de l'utilisateur
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null); // Reset userId
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, userRole, userId, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
