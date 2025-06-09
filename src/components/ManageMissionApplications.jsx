import { useEffect, useState } from "react";
import {
    getMissionApplications,
    updateJobApplicationStatus,
} from "../services/api";

function ManageMissionApplications({ mission, onClose, onStatusUpdate }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMissionApplications(mission.id);
                console.log("Données reçues:", data);

                // Filtrer les candidatures pour n'inclure que celles liées à la mission sélectionnée
                const filteredApplications = data.filter(
                    (application) =>
                        application.missions &&
                        application.missions.some((m) => m.id === mission.id)
                );

                console.log(
                    "Candidatures filtrées pour la mission:",
                    filteredApplications
                );
                setApplications(filteredApplications);
            } catch (err) {
                console.error("Erreur lors de la récupération:", err);
                setError("Erreur lors de la récupération des candidatures");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [mission.id]);

    const handleUpdateStatus = async (applicationId, newStatus) => {
        setUpdatingId(applicationId);
        try {
            await updateJobApplicationStatus(applicationId, newStatus);

            // Mettre à jour l'état local
            setApplications(
                applications.map((app) =>
                    app.id === applicationId
                        ? { ...app, status: newStatus }
                        : app
                )
            );

            const statusText =
                newStatus === "ACCEPTED" ? "acceptée" : "refusée";
            alert(`Candidature ${statusText} avec succès !`);

            // Notifier le composant parent pour rafraîchir les missions acceptées
            if (onStatusUpdate) {
                onStatusUpdate();
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour:", error);
            alert("Erreur lors de la mise à jour de la candidature");
        } finally {
            setUpdatingId(null);
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

    return (
        <>
            {/* En-tête fixe */}
            <div className="border-b p-6 flex-shrink-0">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Candidatures pour la mission
                        </h2>
                        <h3 className="text-lg text-gray-600 mt-1">
                            {mission.name}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Zone de contenu avec scroll */}
            <div className="flex-1 overflow-y-auto p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">
                            Chargement des candidatures...
                        </p>
                    </div>
                ) : error ? (
                    <p className="text-red-600 text-center py-4">{error}</p>
                ) : applications.length === 0 ? (
                    <p className="text-gray-600 text-center py-8">
                        Aucune candidature reçue pour cette mission.
                    </p>
                ) : (
                    <div className="space-y-4">
                        {applications.map((application) => (
                            <div
                                key={application.id}
                                className="border rounded-lg p-4 shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {application.user.firstName}{" "}
                                            {application.user.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Email : {application.user.email}
                                        </p>
                                        {application.user.contactEmail && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                Email de contact :{" "}
                                                {application.user.contactEmail}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600 mt-1">
                                            Postulé le{" "}
                                            {formatDate(
                                                application.DateApplied
                                            )}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end space-y-2">
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
                                                : "Refusée"}
                                        </span>

                                        {/* Boutons d'action pour les candidatures en attente */}
                                        {application.status === "PENDING" && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            application.id,
                                                            "ACCEPTED"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                        updatingId ===
                                                        application.id
                                                            ? "bg-gray-200 cursor-not-allowed"
                                                            : "bg-green-100 text-green-700 hover:bg-green-200"
                                                    }`}
                                                >
                                                    {updatingId ===
                                                    application.id
                                                        ? "..."
                                                        : "Valider la candidature"}
                                                </button>
                                                <button
                                                    onClick={() =>
                                                        handleUpdateStatus(
                                                            application.id,
                                                            "REJECTED"
                                                        )
                                                    }
                                                    disabled={
                                                        updatingId ===
                                                        application.id
                                                    }
                                                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                                                        updatingId ===
                                                        application.id
                                                            ? "bg-gray-200 cursor-not-allowed"
                                                            : "bg-red-100 text-red-700 hover:bg-red-200"
                                                    }`}
                                                >
                                                    {updatingId ===
                                                    application.id
                                                        ? "..."
                                                        : "Refuser"}
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

export default ManageMissionApplications;
