import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deleteJobApplication, getUserApplications } from "../services/api";

function MyApplications({ onClose, refreshApplications }) {
    const { userId } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getUserApplications(userId);
                console.log("Candidatures avec groupes mission:read:", data);
                if (data.length > 0 && data[1]) {
                    console.log("Candidature 2 (mission 21):", data[1]);
                    if (data[1].missions && data[1].missions[0]) {
                        console.log("Mission 21:", data[1].missions[0]);
                        if (data[1].missions[0].user) {
                            console.log(
                                "Utilisateur mission 21:",
                                data[1].missions[0].user
                            );
                        }
                    }
                }
                setApplications(data);
            } catch {
                setError("Erreur lors de la récupération de vos candidatures");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [userId]);

    const handleDeleteApplication = async (applicationId, missionName) => {
        // Demander confirmation
        const confirmDelete = window.confirm(
            `Êtes-vous sûr de vouloir supprimer votre candidature pour la mission "${missionName}" ?\n\nCette action est irréversible.`
        );

        if (!confirmDelete) return;

        setDeletingId(applicationId);

        try {
            await deleteJobApplication(applicationId);

            // Mettre à jour la liste des candidatures localement
            setApplications((prevApplications) =>
                prevApplications.filter((app) => app.id !== applicationId)
            );

            // Rafraîchir les candidatures dans le composant parent pour synchroniser l'affichage
            if (refreshApplications) {
                await refreshApplications();
            }

            // Afficher un message de succès
            alert("Votre candidature a été supprimée avec succès.");
        } catch (error) {
            console.error("Erreur lors de la suppression:", error);

            // Gérer différents types d'erreurs
            let errorMessage =
                "Erreur lors de la suppression de votre candidature.";

            if (error.response) {
                switch (error.response.status) {
                    case 403:
                        errorMessage =
                            "Vous n'êtes pas autorisé à supprimer cette candidature.";
                        break;
                    case 404:
                        errorMessage = "Cette candidature n'existe plus.";
                        break;
                    case 409:
                        errorMessage =
                            "Cette candidature ne peut pas être supprimée car elle a déjà été traitée.";
                        break;
                    default:
                        errorMessage =
                            error.response.data?.message || errorMessage;
                }
            }

            setError(errorMessage);

            // Effacer l'erreur après 5 secondes
            setTimeout(() => setError(null), 5000);
        } finally {
            setDeletingId(null);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "ACCEPTED":
                return "bg-green-100 text-green-800";
            case "REJECTED":
                return "bg-red-100 text-red-800";
            case "CANCELLED":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    // Vérifier si une candidature peut être supprimée (seulement si en attente)
    const canDeleteApplication = (status) => {
        return status === "PENDING";
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">
                    Chargement de vos candidatures...
                </p>
            </div>
        );
    }

    return (
        <div className="absolute inset-x-0 top-0 bg-white rounded-lg shadow-lg p-6 mb-8 mt-8 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Mes candidatures
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <div className="flex items-center">
                        <svg
                            className="h-5 w-5 text-red-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {applications.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                    Vous n'avez pas encore postulé à des missions.
                </p>
            ) : (
                <div className="space-y-4">
                    {applications.map((application) => {
                        const missionName =
                            application.missions &&
                            application.missions.length > 0
                                ? application.missions[0].name
                                : "Mission non disponible";

                        return (
                            <div
                                key={application.id}
                                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-grow">
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {missionName}
                                        </h3>

                                        {/* Nom de l'entreprise - seulement si la mission et l'utilisateur existent */}
                                        {application.missions &&
                                            application.missions.length > 0 &&
                                            application.missions[0].user
                                                ?.nameCompany && (
                                                <p className="text-sm text-gray-700 font-medium mt-1">
                                                    {
                                                        application.missions[0]
                                                            .user.nameCompany
                                                    }
                                                </p>
                                            )}

                                        <p className="text-sm text-gray-600 mt-1">
                                            Postulé le{" "}
                                            {formatDate(
                                                application.DateApplied
                                            )}
                                        </p>

                                        {application.missions &&
                                            application.missions.length > 0 &&
                                            application.missions[0].type && (
                                                <p className="text-sm text-gray-600 mt-2">
                                                    Type :{" "}
                                                    {
                                                        application.missions[0]
                                                            .type.name
                                                    }
                                                </p>
                                            )}
                                    </div>

                                    <div className="flex items-center space-x-3">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                                                application.status
                                            )}`}
                                        >
                                            {application.status === "PENDING"
                                                ? "En attente"
                                                : application.status ===
                                                  "ACCEPTED"
                                                ? "Acceptée"
                                                : application.status ===
                                                  "REJECTED"
                                                ? "Refusée"
                                                : "Annulée"}
                                        </span>

                                        {/* Bouton de suppression - seulement pour les candidatures en attente */}
                                        {canDeleteApplication(
                                            application.status
                                        ) && (
                                            <button
                                                onClick={() =>
                                                    handleDeleteApplication(
                                                        application.id,
                                                        missionName
                                                    )
                                                }
                                                disabled={
                                                    deletingId ===
                                                    application.id
                                                }
                                                className={`p-2 rounded-lg transition-colors ${
                                                    deletingId ===
                                                    application.id
                                                        ? "bg-gray-200 cursor-not-allowed"
                                                        : "bg-red-100 hover:bg-red-200 text-red-600"
                                                }`}
                                                title="Supprimer cette candidature"
                                            >
                                                {deletingId ===
                                                application.id ? (
                                                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-400"></div>
                                                ) : (
                                                    <svg
                                                        className="h-4 w-4"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Message d'information pour les candidatures qui ne peuvent pas être supprimées */}
                                {!canDeleteApplication(application.status) && (
                                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                                        <svg
                                            className="h-3 w-3 inline mr-1"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        Cette candidature ne peut plus être
                                        supprimée car elle a été traitée.
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MyApplications;
