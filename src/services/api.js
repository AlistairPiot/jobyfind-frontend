import axios from "axios";

// L'URL de l'API, centralisée ici pour faciliter la gestion
const API_URL = "http://localhost:8000/api";

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Exemple : Récupérer tous les skills
export const getSkills = () =>
    api.get("/skills").then((res) => {
        console.log("Réponse API :", res.data);
        return res.data || [];
    });

// Inscription d'un utilisateur
export const registerUser = (userData) =>
    api
        .post("/register", userData)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de l'inscription:",
                error.response || error
            );
            throw error; // Lancer l'erreur pour être capturée par handleSubmit
        });

// Fonction de connexion utilisateur
export const loginUser = (userData) =>
    api.post("/login", userData).then((res) => res.data);

export default api;
