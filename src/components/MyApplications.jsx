import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserApplications } from "../services/api";

function MyApplications({ onClose }) {
    const { userId } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

            {error ? (
                <p className="text-red-600 text-center py-4">{error}</p>
            ) : applications.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                    Vous n'avez pas encore postulé à des missions.
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
                                        {application.missions &&
                                        application.missions.length > 0
                                            ? application.missions[0].name
                                            : "Mission non disponible"}
                                    </h3>

                                    {/* Nom de l'entreprise - seulement si la mission et l'utilisateur existent */}
                                    {application.missions &&
                                        application.missions.length > 0 &&
                                        application.missions[0].user
                                            ?.nameCompany && (
                                            <p className="text-sm text-gray-700 font-medium mt-1">
                                                {
                                                    application.missions[0].user
                                                        .nameCompany
                                                }
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
                            {application.missions &&
                                application.missions.length > 0 &&
                                application.missions[0].type && (
                                    <p className="text-sm text-gray-600 mt-2">
                                        Type :{" "}
                                        {application.missions[0].type.name}
                                    </p>
                                )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyApplications;
