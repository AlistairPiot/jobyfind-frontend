import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    getSchools,
    getUserBadgeRequests,
    getUserById,
    removeBadge,
} from "../services/api";
import BadgeRequestModal from "./BadgeRequestModal";

function UserBadge() {
    const { userId, userRole } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [removingBadge, setRemovingBadge] = useState(false);
    const [badgeRequestId, setBadgeRequestId] = useState(null);
    const [badgeStatus, setBadgeStatus] = useState({
        hasBadge: false,
        hasPendingRequest: false,
        schoolName: "Votre école",
    });
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fonction pour forcer le rafraîchissement des données
    const refreshBadge = () => {
        console.log("Rafraîchissement du composant UserBadge");
        setRefreshTrigger((prev) => prev + 1);
    };

    // Exposer la fonction de rafraîchissement à window pour permettre son appel depuis d'autres composants
    useEffect(() => {
        window.refreshUserBadge = refreshBadge;
        return () => {
            delete window.refreshUserBadge;
        };
    }, []);

    useEffect(() => {
        const fetchUserData = async () => {
            if (userId) {
                try {
                    setLoading(true);
                    const data = await getUserById(userId);

                    console.log("Données de l'utilisateur connecté:", data);

                    // Vérifier d'abord directement si l'utilisateur a un badge
                    const userHasBadge = !!data.badge;
                    console.log("L'utilisateur a-t-il un badge?", userHasBadge);

                    // Vérifier s'il y a des demandes en cours pour cet utilisateur
                    try {
                        const requests = await getUserBadgeRequests(userId);

                        console.log(
                            "Vérification des demandes de badge:",
                            requests
                        );

                        // Chercher une demande sans responseDate (en attente)
                        const pendingRequest = requests.find(
                            (req) => !req.responseDate
                        );

                        if (pendingRequest) {
                            console.log(
                                "Demande en attente trouvée:",
                                pendingRequest
                            );
                            setBadgeRequestId(pendingRequest.id);

                            // Récupérer le nom de l'école pour la demande en attente
                            let pendingSchoolName = "Votre école";
                            try {
                                if (pendingRequest.school) {
                                    const schoolId = pendingRequest.school
                                        .split("/")
                                        .pop();
                                    const schools = await getSchools();
                                    const school = schools.find(
                                        (s) => s.id == schoolId
                                    );

                                    if (school) {
                                        // Utiliser le nom de l'école si disponible, sinon l'email
                                        pendingSchoolName =
                                            school.nameSchool &&
                                            school.nameSchool.trim() !== ""
                                                ? school.nameSchool
                                                : school.email;
                                    }
                                }
                            } catch (schoolErr) {
                                console.error(
                                    "Erreur lors de la récupération de l'école pour la demande en attente:",
                                    schoolErr
                                );
                            }

                            setBadgeStatus({
                                hasBadge: userHasBadge,
                                hasPendingRequest: true,
                                schoolName: pendingSchoolName,
                            });
                            setLoading(false);
                            return;
                        }
                    } catch (err) {
                        console.error(
                            "Erreur lors de la vérification des demandes:",
                            err
                        );
                        // Continue avec la logique normale si cette vérification échoue
                    }

                    // S'il n'a pas de badge ni de demande, rien à afficher
                    if (!userHasBadge) {
                        setBadgeStatus({
                            hasBadge: false,
                            hasPendingRequest: false,
                            schoolName: "Votre école",
                        });
                        setLoading(false);
                        return;
                    }

                    // Récupérer le nom de l'école si l'utilisateur a un badge
                    let schoolName = "Votre école";

                    if (userHasBadge) {
                        // Chercher dans les demandes acceptées pour trouver l'école
                        try {
                            const allRequests = await getUserBadgeRequests(
                                userId
                            );
                            const acceptedRequest = allRequests.find(
                                (req) => req.status === "ACCEPTED"
                            );

                            if (acceptedRequest && acceptedRequest.school) {
                                const schoolId = acceptedRequest.school
                                    .split("/")
                                    .pop();
                                const schools = await getSchools();
                                const school = schools.find(
                                    (s) => s.id == schoolId
                                );

                                if (school) {
                                    // Utiliser le nom de l'école si disponible, sinon l'email
                                    schoolName =
                                        school.nameSchool &&
                                        school.nameSchool.trim() !== ""
                                            ? school.nameSchool
                                            : school.email;
                                }
                            }
                        } catch (schoolErr) {
                            console.error(
                                "Erreur lors de la récupération de l'école:",
                                schoolErr
                            );
                        }
                    }

                    // Mettre à jour le statut du badge
                    setBadgeStatus({
                        hasBadge: userHasBadge,
                        hasPendingRequest: false,
                        schoolName: schoolName,
                    });
                } catch (err) {
                    console.error("Erreur lors du chargement du profil:", err);
                    setError("Impossible de charger les informations du badge");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchUserData();
    }, [userId, showRequestModal, removingBadge, refreshTrigger]);

    const handleRemoveBadge = async () => {
        // Demander confirmation avant de supprimer
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir supprimer votre badge ? Cette action est irréversible."
            )
        ) {
            try {
                setRemovingBadge(true);
                await removeBadge(userId, badgeRequestId);

                // Mettre à jour l'affichage
                setBadgeStatus({
                    hasBadge: false,
                    hasPendingRequest: false,
                    schoolName: "Votre école",
                });

                // Effacer l'ID de la demande
                setBadgeRequestId(null);

                alert("Votre badge a été supprimé avec succès.");

                console.log(
                    "🔍 Badge supprimé par l'étudiant - Envoi d'événements de rafraîchissement..."
                );
                console.log("🎯 Événement: refreshRecommendedMissions");

                // Envoyer un événement pour rafraîchir les missions recommandées dans le dashboard
                window.dispatchEvent(
                    new CustomEvent("refreshRecommendedMissions")
                );

                console.log(
                    "✅ Événement envoyé - Les tags des missions devraient disparaître"
                );
            } catch (error) {
                console.error("Erreur lors de la suppression du badge:", error);
                setError(
                    "Impossible de supprimer le badge. Veuillez réessayer plus tard."
                );
            } finally {
                setRemovingBadge(false);
            }
        }
    };

    if (userRole !== "ROLE_FREELANCE") {
        return null; // Le badge ne concerne que les freelances
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-600"></div>
                <p className="ml-3 text-gray-600 text-sm">Chargement...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Badge étudiant
            </h3>

            {badgeStatus.hasBadge ? (
                <div>
                    <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-blue-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                />
                            </svg>
                        </div>
                        <div>
                            <p className="text-gray-700">
                                Vous êtes certifié(e) par
                            </p>
                            <p className="font-medium text-blue-600">
                                {badgeStatus.schoolName}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                        <button
                            onClick={handleRemoveBadge}
                            disabled={removingBadge}
                            className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs"
                        >
                            {removingBadge
                                ? "Suppression..."
                                : "Supprimer mon badge"}
                        </button>
                    </div>
                </div>
            ) : badgeStatus.hasPendingRequest ? (
                <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-yellow-700">
                        Votre demande de badge est en cours de traitement.
                    </p>
                </div>
            ) : (
                <div>
                    <p className="text-gray-600 mb-4">
                        Vous n'avez pas encore de badge étudiant. Un badge vous
                        permet d'être certifié par votre école.
                    </p>
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                    >
                        Demander un badge
                    </button>
                </div>
            )}

            {showRequestModal && (
                <BadgeRequestModal onClose={() => setShowRequestModal(false)} />
            )}
        </div>
    );
}

export default UserBadge;
