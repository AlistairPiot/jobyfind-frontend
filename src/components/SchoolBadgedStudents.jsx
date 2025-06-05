import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getSchoolBadgedStudents, removeBadge } from "../services/api";

function SchoolBadgedStudents() {
    const { userId, userRole } = useAuth();
    const [badgedStudents, setBadgedStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fonction pour rafraîchir les données
    const refreshBadgedStudents = async () => {
        if (userId && userRole === "ROLE_SCHOOL") {
            try {
                setLoading(true);
                const studentsData = await getSchoolBadgedStudents(userId);
                console.log("Étudiants badgés reçus:", studentsData);
                setBadgedStudents(studentsData);
            } catch (err) {
                console.error(
                    "Erreur lors du chargement des étudiants badgés:",
                    err
                );
                setError("Impossible de charger les étudiants badgés");
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        refreshBadgedStudents();
    }, [userId, userRole]);

    // Exposer la fonction de rafraîchissement globalement
    useEffect(() => {
        window.refreshBadgedStudents = refreshBadgedStudents;
        return () => {
            delete window.refreshBadgedStudents;
        };
    }, [userId, userRole]);

    const handleRemoveBadge = async (studentId, requestId) => {
        if (
            window.confirm(
                "Êtes-vous sûr de vouloir retirer le badge de cet étudiant ?"
            )
        ) {
            try {
                await removeBadge(studentId, requestId);
                // Rafraîchir la liste des étudiants badgés après suppression
                await refreshBadgedStudents();

                // Afficher le message de confirmation et rafraîchir les recommandations après le clic
                alert(
                    "Le badge a été retiré avec succès. Les recommandations de missions pour cet étudiant ont également été supprimées."
                );

                console.log("🔍 Envoi d'événements de rafraîchissement...");
                console.log("🎯 Événement 1: refreshSchoolRecommendations");
                console.log("🎯 Événement 2: refreshRecommendedMissions");

                // Envoyer des événements personnalisés pour rafraîchir les composants
                window.dispatchEvent(
                    new CustomEvent("refreshSchoolRecommendations")
                );
                window.dispatchEvent(
                    new CustomEvent("refreshRecommendedMissions")
                );

                console.log(
                    "✅ Événements envoyés - Vérifiez si les composants les reçoivent"
                );

                // Petit délai pour s'assurer que les événements sont traités
                setTimeout(() => {
                    console.log(
                        "🕐 Délai terminé - Les composants auraient dû se rafraîchir"
                    );
                }, 1000);
            } catch (error) {
                console.error("Erreur lors de la suppression du badge:", error);
                setError(
                    "Impossible de retirer le badge. Veuillez réessayer plus tard."
                );
            }
        }
    };

    if (userRole !== "ROLE_SCHOOL") {
        return null; // Ce composant est uniquement pour les écoles
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Mes étudiants badgés
                </h2>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="ml-4 text-gray-600">
                        Chargement des étudiants...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Mes étudiants badgés
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {badgedStudents.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                        Aucun étudiant badgé pour le moment.
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {badgedStudents.map((student) => (
                        <div
                            key={student.id}
                            className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800">
                                        {student.firstName} {student.lastName}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {student.email}
                                    </p>
                                    <div className="mt-2">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            ✓ Badgé
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        Badge obtenu le:{" "}
                                        {new Date(
                                            student.badge
                                        ).toLocaleDateString("fr-FR")}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        handleRemoveBadge(
                                            student.id,
                                            student.requestId
                                        )
                                    }
                                    className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded"
                                    title="Retirer le badge"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default SchoolBadgedStudents;
