import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSchoolRecommendations } from "../services/api";

function SchoolRecommendations() {
    const { userId, userRole } = useAuth();
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction pour rafraîchir les données
    const refreshRecommendations = async () => {
        if (userId && userRole === "ROLE_SCHOOL") {
            try {
                setLoading(true);
                const recommendationsData = await getSchoolRecommendations(
                    userId
                );
                console.log("Recommandations reçues:", recommendationsData);
                setRecommendations(recommendationsData);
            } catch (err) {
                console.error(
                    "Erreur lors du chargement des recommandations:",
                    err
                );
                setError("Impossible de charger les recommandations");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        refreshRecommendations();
    }, [userId, userRole]);

    // Exposer la fonction de rafraîchissement globalement
    useEffect(() => {
        window.refreshSchoolRecommendations = refreshRecommendations;
        return () => {
            delete window.refreshSchoolRecommendations;
        };
    }, [userId, userRole]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStudentName = (student) => {
        if (student.firstName && student.lastName) {
            return `${student.firstName} ${student.lastName}`;
        }
        return student.email;
    };

    if (userRole !== "ROLE_SCHOOL") {
        return null; // Ce composant est uniquement pour les écoles
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Mes recommandations
                </h2>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="ml-4 text-gray-600">
                        Chargement des recommandations...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Mes recommandations
                </h2>
                <div className="text-center py-8">
                    <p className="text-red-600">{error}</p>
                    <button
                        onClick={refreshRecommendations}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">
                    Mes recommandations ({recommendations.length})
                </h2>
                <button
                    onClick={refreshRecommendations}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                    Actualiser
                </button>
            </div>

            {recommendations.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-gray-400 mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 mx-auto"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="1"
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Aucune recommandation pour le moment
                    </p>
                    <p className="text-gray-500 text-sm mt-2">
                        Consultez les missions disponibles et recommandez-les à
                        vos étudiants badgés.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {recommendations.map((recommendation) => (
                        <div
                            key={recommendation.id}
                            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex items-center">
                                            <span className="inline-block w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                                            <h3 className="font-medium text-gray-800">
                                                {recommendation.mission.name}
                                            </h3>
                                        </div>
                                        {recommendation.mission.type && (
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                                                {recommendation.mission.type}
                                            </span>
                                        )}
                                    </div>

                                    {recommendation.mission.company && (
                                        <p className="text-sm text-gray-600 mb-2">
                                            <span className="font-medium">
                                                Entreprise:
                                            </span>{" "}
                                            {recommendation.mission.company}
                                        </p>
                                    )}

                                    <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                />
                                            </svg>
                                            <span className="font-medium">
                                                Recommandé à:
                                            </span>
                                            <span className="ml-1">
                                                {getStudentName(
                                                    recommendation.student
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-4 w-4 mr-1"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>
                                                {formatDate(
                                                    recommendation.recommendedAt
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SchoolRecommendations;
