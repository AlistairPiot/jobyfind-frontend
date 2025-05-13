import { useEffect, useState } from "react";
import { getMissionApplications } from "../services/api";

function ManageMissionApplications({ mission, onClose }) {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getMissionApplications(mission.id);
                console.log("Données reçues:", data);
                setApplications(data);
            } catch (err) {
                console.error("Erreur lors de la récupération:", err);
                setError("Erreur lors de la récupération des candidatures");
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [mission.id]);

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

    if (loading) {
        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-6">
                    <p>Chargement des candidatures...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">
                            Candidatures pour la mission
                        </h2>
                        <h3 className="text-lg text-gray-600">
                            {mission.name}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {error ? (
                    <p className="text-red-600">{error}</p>
                ) : applications.length === 0 ? (
                    <p className="text-gray-600">
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
                                        <h3 className="font-semibold text-lg">
                                            {application.user.firstName}{" "}
                                            {application.user.lastName}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Email : {application.user.email}
                                        </p>
                                        {application.user.contactEmail && (
                                            <p className="text-sm text-gray-600">
                                                Email de contact :{" "}
                                                {application.user.contactEmail}
                                            </p>
                                        )}
                                        <p className="text-sm text-gray-600">
                                            Postulé le{" "}
                                            {formatDate(
                                                application.DateApplied
                                            )}
                                        </p>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-sm ${getStatusColor(
                                            application.status
                                        )}`}
                                    >
                                        {application.status === "PENDING"
                                            ? "En attente"
                                            : application.status === "ACCEPTED"
                                            ? "Acceptée"
                                            : "Refusée"}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageMissionApplications;
