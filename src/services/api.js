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

// ✅ Création d'une mission
export const createMission = (missionData) =>
    api
        .post("/missions", missionData)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la création de la mission:",
                error.response || error
            );
            throw error;
        });

// ✅ Récupération des types de contrat (CDI, CDD, etc.)
export const getTypes = () =>
    api
        .get("/types")
        .then((res) => res.data["member"] || res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des types:",
                error.response || error
            );
            return [];
        });

// ✅ Récupération des missions d'un user
export const getMissionsByUser = (userId) =>
    api
        .get(`/missions?createdBy.id=${userId}`)
        .then((res) => {
            console.log(res.data); // Ajoute cette ligne pour inspecter la réponse
            return res.data["member"] || [];
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des missions:",
                error
            );
            return [];
        });

export const getUserById = (userId) =>
    api
        .get(`/users/${userId}`)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération de l'utilisateur:",
                error
            );
            return null;
        });

// Supprimer une mission
export const deleteMission = (missionId) => {
    return api
        .delete(`/missions/${missionId}`)
        .then(() => {
            return true;
        })
        .catch((error) => {
            console.error("Erreur lors de la suppression :", error);
            throw error;
        });
};

export const getMissionById = async (id) => {
    const response = await axios.get(`/api/missions/${id}`);
    return response.data;
};

export const updateMission = async (id, missionData) => {
    const response = await axios.put(`/api/missions/${id}`, missionData);
    return response.data;
};
