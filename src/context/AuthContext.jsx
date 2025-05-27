import { createContext, useContext, useEffect, useState } from "react";
import { getUserById } from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [userId, setUserId] = useState(null);
    const [profileName, setProfileName] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const token = localStorage.getItem("authToken");
            const role = localStorage.getItem("userRole");
            const id = localStorage.getItem("userId");

            if (token && role && id) {
                setIsAuthenticated(true);
                setUserRole(role);
                setUserId(id);

                try {
                    // Charger les informations du profil depuis l'API
                    const userData = await getUserById(id);
                    if (userData) {
                        let displayName = "";
                        switch (role) {
                            case "ROLE_SCHOOL":
                                displayName = userData.nameSchool || "";
                                break;
                            case "ROLE_COMPANY":
                                displayName = userData.nameCompany || "";
                                break;
                            case "ROLE_FREELANCE":
                                displayName = `${userData.firstName || ""} ${
                                    userData.lastName || ""
                                }`.trim();
                                break;
                            default:
                                break;
                        }
                        setProfileName(displayName);
                    }
                } catch (error) {
                    console.error(
                        "Erreur lors du chargement du profil:",
                        error
                    );
                }
            } else {
                setIsAuthenticated(false);
                setUserRole(null);
                setUserId(null);
                setProfileName(null);
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (token, roles, userId) => {
        localStorage.setItem("authToken", token);
        localStorage.setItem("userRole", roles[0]);
        localStorage.setItem("userId", userId);
        setIsAuthenticated(true);
        setUserRole(roles[0]);
        setUserId(userId);

        try {
            // Charger les informations du profil depuis l'API après connexion
            const userData = await getUserById(userId);
            if (userData) {
                let displayName = "";
                switch (roles[0]) {
                    case "ROLE_SCHOOL":
                        displayName = userData.nameSchool || "";
                        break;
                    case "ROLE_COMPANY":
                        displayName = userData.nameCompany || "";
                        break;
                    case "ROLE_FREELANCE":
                        displayName = `${userData.firstName || ""} ${
                            userData.lastName || ""
                        }`.trim();
                        break;
                    default:
                        break;
                }
                setProfileName(displayName);
            }
        } catch (error) {
            console.error(
                "Erreur lors du chargement du profil après connexion:",
                error
            );
        }
    };

    const logout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userId");
        setIsAuthenticated(false);
        setUserRole(null);
        setUserId(null);
        setProfileName(null);
    };

    const updateUserProfile = (displayName) => {
        console.log("Mise à jour du profil dans le contexte:", displayName);
        setProfileName(displayName);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                userRole,
                userId,
                profileName,
                loading,
                login,
                logout,
                updateUserProfile,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
