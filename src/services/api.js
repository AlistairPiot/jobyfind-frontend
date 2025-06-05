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
        .then((res) => {
            const types = res.data["member"] || res.data;
            // Extraire l'ID numérique de l'@id pour chaque type
            return types.map((type) => ({
                ...type,
                id: parseInt(type["@id"].split("/").pop()),
            }));
        })
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
        .get(`/missions?user.id=${userId}`)
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

// ✅ Récupération de toutes les missions
export const getAllMissions = () =>
    api
        .get("/missions")
        .then((res) => {
            return res.data["member"] || [];
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des missions:",
                error
            );
            return [];
        });

// ✅ Création d'une candidature
export const createJobApplication = (applicationData) =>
    api
        .post("/job_applications", {
            ...applicationData,
            status: "PENDING",
            DateApplied: new Date().toISOString(),
        })
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la création de la candidature:",
                error.response || error
            );
            throw error;
        });

// ✅ Récupération des candidatures d'un utilisateur
export const getUserApplications = (userId) =>
    api
        .get(
            `/job_applications?user.id=${userId}&groups[]=job_application:read&groups[]=user:read&groups[]=mission:read`
        )
        .then((res) => {
            return res.data["member"] || [];
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des candidatures:",
                error
            );
            return [];
        });

// ✅ Récupération des candidatures pour une mission spécifique
export const getMissionApplications = (missionId) =>
    api
        .get(
            `/job_applications?missions.id=${missionId}&groups[]=job_application:read&groups[]=user:read`
        )
        .then((res) => {
            console.log("Réponse API complète:", res.data);
            return res.data["member"] || [];
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des candidatures de la mission:",
                error
            );
            return [];
        });

// Mise à jour du profil utilisateur
export const updateUserProfile = (userId, profileData) => {
    console.log("Envoi de la requête PATCH à", `/users/${userId}`);
    console.log("Données envoyées:", profileData);

    return api
        .patch(`/users/${userId}`, profileData, {
            headers: {
                "Content-Type": "application/merge-patch+json",
            },
        })
        .then((res) => {
            console.log("Réponse brute de l'API:", res);
            return res.data;
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la mise à jour du profil:",
                error.response || error
            );
            throw error;
        });
};

// Récupérer toutes les écoles
export const getSchools = () =>
    api
        .get(`/schools`)
        .then((res) => res.data || [])
        .catch((error) => {
            console.error("Erreur lors de la récupération des écoles:", error);
            return [];
        });

// Créer une demande de badge
export const createBadgeRequest = (userId, requestData) =>
    api
        .post(
            `/request_badges`,
            {
                user: `/api/users/${userId}`,
                school: requestData.school,
                requestDate: new Date().toISOString(),
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la création de la demande de badge:",
                error.response || error
            );
            throw error;
        });

// Récupérer les demandes de badge pour une école
export const getSchoolBadgeRequests = (schoolId) =>
    api
        .get(`/request_badges/school/${schoolId}`)
        .then((res) => {
            console.log(
                "Réponse brute de l'API (demandes de badge):",
                res.data
            );
            return res.data;
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des demandes de badge:",
                error
            );
            return [];
        });

// Récupérer les demandes de badge pour un utilisateur
export const getUserBadgeRequests = (userId) =>
    api
        .get(`/request_badges/user/${userId}`)
        .then((res) => {
            console.log(
                "Réponse brute de l'API (demandes de badge utilisateur):",
                res.data
            );
            return res.data;
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des demandes de badge:",
                error
            );
            return [];
        });

// Accepter une demande de badge
export const acceptBadgeRequest = (requestId) => {
    console.log(`Acceptation de la demande de badge ${requestId}`);

    return api
        .patch(`/request_badges/${requestId}/accept`)
        .then((res) => {
            console.log(`Demande ${requestId} acceptée:`, res.data);
            return res.data;
        })
        .catch((error) => {
            console.error(
                "Erreur lors de l'acceptation de la demande de badge:",
                error.response || error
            );
            throw error;
        });
};

// Refuser une demande de badge
export const rejectBadgeRequest = (requestId) =>
    api
        .patch(`/request_badges/${requestId}/reject`)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors du refus de la demande de badge:",
                error.response || error
            );
            throw error;
        });

// Récupérer les étudiants badgés d'une école
export const getSchoolBadgedStudents = (schoolId) =>
    api
        .get(`/badged_students/school/${schoolId}`)
        .then((res) => {
            console.log("Réponse brute de l'API (étudiants badgés):", res.data);
            return res.data;
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des étudiants badgés:",
                error
            );
            return [];
        });

// Retirer le badge d'un étudiant
export const removeBadge = (userId) =>
    api
        .delete(`/remove_badge/${userId}`)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la suppression du badge:",
                error.response || error
            );
            throw error;
        });

// ===== FONCTIONS POUR LES RECOMMANDATIONS DE MISSIONS =====

// ✅ Récupération des étudiants badgés par une école
export const getSchoolStudents = (schoolId) =>
    api
        .get(`/school/${schoolId}/students`)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des étudiants:",
                error.response || error
            );
            throw error;
        });

// ✅ Recommander une mission à des étudiants
export const recommendMission = (missionId, schoolId, studentIds) =>
    api
        .post(`/missions/${missionId}/recommend`, {
            schoolId: schoolId,
            students: studentIds,
        })
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la recommandation:",
                error.response || error
            );
            throw error;
        });

// ✅ Récupération des missions recommandées pour un étudiant
export const getRecommendedMissions = (studentId) =>
    api
        .get(`/students/${studentId}/recommended-missions`)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des missions recommandées:",
                error.response || error
            );
            return [];
        });

// ✅ Récupération des recommandations faites par une école
export const getSchoolRecommendations = (schoolId) =>
    api
        .get(`/school/${schoolId}/recommendations`)
        .then((res) => res.data)
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des recommandations de l'école:",
                error.response || error
            );
            return [];
        });

// Exemple d'utilisation du gestionnaire d'erreur :
//
// import useErrorHandler from '../hooks/useErrorHandler';
//
// Dans votre composant :
// const { handleError } = useErrorHandler();
//
// Dans votre appel API :
// try {
//     const data = await getUserApplications(userId);
//     return data;
// } catch (error) {
//     handleError(error, 'Impossible de charger vos candidatures');
//     throw error; // Re-throw si nécessaire
// }
