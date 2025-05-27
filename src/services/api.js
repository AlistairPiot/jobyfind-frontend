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
        .get(`/job_applications?user.id=${userId}`)
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
        .get(`/users?roles=ROLE_SCHOOL`)
        .then((res) => res.data["member"] || [])
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
                ...requestData,
                requestDate: new Date().toISOString(),
                user: `/api/users/${userId}`,
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
        .get(`/request_badges?school=/api/users/${schoolId}`)
        .then((res) => {
            console.log(
                "Réponse brute de l'API (demandes de badge):",
                res.data
            );

            // Filtrer pour ne garder que les demandes sans responseDate (= en attente)
            const allRequests = res.data["member"] || [];
            const pendingRequests = allRequests.filter(
                (req) => !req.responseDate
            );

            console.log("Demandes en attente:", pendingRequests);
            return pendingRequests;
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des demandes de badge:",
                error
            );
            return [];
        });

// Accepter une demande de badge
export const acceptBadgeRequest = (requestId, studentId) => {
    console.log(
        `Acceptation de la demande de badge ${requestId} pour l'étudiant ${studentId}`
    );

    // Récupérer l'ID de l'école depuis le token
    const schoolId = localStorage.getItem("userId");
    console.log(`École qui accepte la demande (ID): ${schoolId}`);

    if (!schoolId) {
        return Promise.reject(new Error("ID d'école non disponible"));
    }

    // Mettre à jour la demande
    return api
        .patch(
            `/request_badges/${requestId}`,
            {
                responseDate: new Date().toISOString(),
                status: "ACCEPTED",
                user: `/api/users/${studentId}`, // Assurons-nous que l'utilisateur est bien associé
                school: `/api/users/${schoolId}`, // Associer explicitement l'école
            },
            {
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
            }
        )
        .then((res) => {
            console.log(`Demande ${requestId} mise à jour:`, res.data);

            // Vérifier si la demande a bien été mise à jour avec le statut ACCEPTED
            if (res.data.status !== "ACCEPTED") {
                console.warn(
                    `Avertissement: La demande ${requestId} n'a pas le statut ACCEPTED après mise à jour.`
                );
            }

            // Mettre à jour l'utilisateur avec l'école et le badge
            return axios.patch(
                `http://localhost:8000/api/users/${studentId}`,
                {
                    badge: new Date().toISOString(),
                    requestBadge: `/api/request_badges/${requestId}`, // Lier la demande à l'utilisateur
                    school: `/api/users/${schoolId}`, // Ajouter la référence à l'école qui a accepté
                    roles: ["ROLE_FREELANCE"], // Conserver le rôle actuel
                },
                {
                    headers: {
                        "Content-Type": "application/merge-patch+json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "authToken"
                        )}`,
                    },
                }
            );
        })
        .then((res) => {
            console.log(
                `Utilisateur ${studentId} mis à jour avec badge:`,
                res.data
            );
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
        .patch(
            `/request_badges/${requestId}`,
            {
                responseDate: new Date().toISOString(),
                status: "REJECTED",
            },
            {
                headers: {
                    "Content-Type": "application/merge-patch+json",
                },
            }
        )
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
        .get(`/users?badge=true&school=/api/users/${schoolId}`)
        .then((res) => {
            console.log("Réponse brute API (étudiants badgés):", res.data);
            return res.data["member"] || [];
        })
        .catch((error) => {
            console.error(
                "Erreur lors de la récupération des étudiants badgés:",
                error
            );
            return [];
        });

// Supprimer le badge d'un utilisateur
export const removeBadge = async (userId, requestBadgeId) => {
    console.log(`Suppression du badge pour l'utilisateur ${userId}`);

    try {
        // 1. D'abord, mettre à jour l'utilisateur pour supprimer le badge
        const userResponse = await axios.patch(
            `http://localhost:8000/api/users/${userId}`,
            {
                badge: null,
                requestBadge: null,
            },
            {
                headers: {
                    "Content-Type": "application/merge-patch+json",
                    Authorization: `Bearer ${localStorage.getItem(
                        "authToken"
                    )}`,
                },
            }
        );

        console.log(
            `Badge supprimé pour l'utilisateur ${userId}:`,
            userResponse.data
        );

        // 2. Ensuite, supprimer la demande de badge si un ID est fourni
        if (requestBadgeId) {
            const requestIdNumber =
                typeof requestBadgeId === "string" &&
                requestBadgeId.includes("/")
                    ? requestBadgeId.split("/").pop()
                    : requestBadgeId;

            const deleteResponse = await api.delete(
                `/request_badges/${requestIdNumber}`
            );
            console.log(
                `Demande de badge ${requestIdNumber} supprimée:`,
                deleteResponse.data
            );
        }

        return userResponse.data;
    } catch (error) {
        console.error(
            "Erreur lors de la suppression du badge:",
            error.response || error
        );
        throw error;
    }
};
