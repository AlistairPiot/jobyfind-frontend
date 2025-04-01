import axios from "axios";

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
    api.post("/register", userData).then((res) => res.data);

export default api;
