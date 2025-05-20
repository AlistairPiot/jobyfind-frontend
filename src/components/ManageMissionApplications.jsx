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
            <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-600">
                    Chargement des candidatures...
                </p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
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
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            {error ? (
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
                                        {formatDate(application.DateApplied)}
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
    );
}

export default ManageMissionApplications;
