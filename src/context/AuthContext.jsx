// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        const role = localStorage.getItem("userRole");

        if (token && role) {
            setIsAuthenticated(true);
            setUserRole(role);
        }
    }, []);

    const login = (token, roles) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", roles[0]); // On prend le premier rôle
        setIsAuthenticated(true);
        setUserRole(roles[0]);
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        setIsAuthenticated(false);
        setUserRole(null);
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, userRole, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
