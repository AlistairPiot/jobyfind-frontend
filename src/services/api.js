import axios from "axios";

// L'URL de l'API, centralisée ici pour faciliter la gestion
const API_URL = "http://localhost:8000/api";

// Création de l'instance Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ➕ Intercepteur pour ajouter le token Authorization à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔁 Intercepteur de réponse pour détecter les erreurs 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token invalide ou expiré
            localStorage.removeItem("authToken");
            window.location.href = "/login"; // Redirection vers la page de connexion
        }
        return Promise.reject(error);
    }
);

// ✅ Exemple : Récupérer tous les skills
export const getSkills = () =>
    api.get("/skills").then((res) => {
        console.log("Réponse API :", res.data);
        return res.data || [];
    });

// ✅ Inscription d'un utilisateur
export const registerUser = (userData) =>
    api
        .post("/register", userData)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de l'inscription:",
                error.response || error
            );
            throw error;
        });

// ✅ Connexion utilisateur
export const loginUser = (userData) =>
    api.post("/login", userData).then((res) => res.data);

export default api;
