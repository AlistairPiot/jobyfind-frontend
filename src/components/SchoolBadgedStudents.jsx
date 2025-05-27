import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserById } from "../services/api";

function SchoolBadgedStudents() {
    const { userId, userRole } = useAuth();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Fonction pour forcer le rafraîchissement des données
    const refreshStudents = () => {
        setRefreshTrigger((prev) => prev + 1);
    };

    // Exposer la fonction à window pour pouvoir l'appeler depuis d'autres composants
    useEffect(() => {
        window.refreshBadgedStudents = refreshStudents;
        return () => {
            delete window.refreshBadgedStudents;
        };
    }, []);

    useEffect(() => {
        const fetchStudents = async () => {
            if (userId && userRole === "ROLE_SCHOOL") {
                try {
                    setLoading(true);

                    // Méthode alternative: Rechercher directement les utilisateurs qui ont une référence à notre école
                    // et qui ont un badge (ce qui indique que leur demande a été acceptée)
                    const usersResponse = await axios.get(
                        `http://localhost:8000/api/users?school=/api/users/${userId}`
                    );

                    console.log(
                        "Utilisateurs associés à l'école:",
                        usersResponse.data
                    );

                    // Filtrer côté client pour ne garder que les utilisateurs qui ont réellement un badge
                    if (usersResponse.data && usersResponse.data.member) {
                        const badgedUsers = usersResponse.data.member.filter(
                            (user) => user.badge
                        );
                        console.log(
                            "Utilisateurs avec badge (après filtrage):",
                            badgedUsers
                        );

                        if (badgedUsers.length > 0) {
                            console.log(
                                "Utilisation de la méthode alternative avec filtrage côté client"
                            );
                            setStudents(badgedUsers);
                            setLoading(false);
                            return;
                        }
                    }

                    // Méthode originale si la méthode alternative ne donne pas de résultats
                    console.log(
                        "Méthode alternative sans résultats, utilisation de la méthode par demandes de badge"
                    );

                    // Chercher spécifiquement les demandes de badge ACCEPTÉES
                    const badgeRequestsResponse = await axios.get(
                        `http://localhost:8000/api/request_badges?school=/api/users/${userId}&status=ACCEPTED`
                    );

                    console.log(
                        "Demandes de badge ACCEPTÉES pour l'école:",
                        badgeRequestsResponse.data
                    );

                    // Récupérer toutes les demandes acceptées
                    const acceptedRequests =
                        badgeRequestsResponse.data.member || [];

                    console.log("Demandes acceptées:", acceptedRequests);

                    // Pour chaque demande, récupérer les informations de l'étudiant
                    const badgedStudents = [];

                    for (const request of acceptedRequests) {
                        try {
                            console.log(
                                "Traitement de la demande acceptée:",
                                request
                            );

                            // Obtenir plus de détails sur la demande pour avoir l'utilisateur
                            const detailsResponse = await axios.get(
                                `http://localhost:8000/api/request_badges/${request.id}`
                            );

                            const detailedRequest = detailsResponse.data;
                            console.log(
                                `Détails de la demande ${request.id}:`,
                                detailedRequest
                            );

                            // Vérifier si l'utilisateur est présent dans la demande
                            console.log(
                                "Utilisateur dans la demande:",
                                detailedRequest.user
                            );

                            // Si nous avons un user_id, nous pouvons récupérer les détails de l'étudiant
                            if (detailedRequest.user) {
                                const path = detailedRequest.user.split("/");
                                const studentId = path[path.length - 1];

                                console.log(
                                    `Récupération des données de l'étudiant ${studentId}...`
                                );

                                const studentData = await getUserById(
                                    studentId
                                );

                                console.log(
                                    `Données de l'étudiant ${studentId}:`,
                                    studentData
                                );

                                if (studentData) {
                                    // Ajouter la date de badge à l'étudiant (date de réponse à la demande)
                                    badgedStudents.push({
                                        ...studentData,
                                        badge: detailedRequest.responseDate,
                                    });
                                    console.log(
                                        `Étudiant ${studentId} ajouté à la liste.`
                                    );
                                } else {
                                    console.log(
                                        `Aucune donnée trouvée pour l'étudiant ${studentId}.`
                                    );
                                }
                            } else if (request.user) {
                                // Si la demande a directement un champ user
                                const path = request.user.split("/");
                                const studentId = path[path.length - 1];

                                console.log(
                                    `Utilisation du champ user direct pour l'étudiant ${studentId}...`
                                );

                                const studentData = await getUserById(
                                    studentId
                                );

                                console.log(
                                    `Données de l'étudiant (direct) ${studentId}:`,
                                    studentData
                                );

                                if (studentData) {
                                    badgedStudents.push({
                                        ...studentData,
                                        badge: request.responseDate,
                                    });
                                    console.log(
                                        `Étudiant ${studentId} (direct) ajouté à la liste.`
                                    );
                                } else {
                                    console.log(
                                        `Aucune donnée trouvée pour l'étudiant ${studentId} (direct).`
                                    );
                                }
                            } else {
                                console.log(
                                    "ERREUR: La demande ne contient pas d'utilisateur associé."
                                );
                            }
                        } catch (err) {
                            console.error(
                                `Erreur lors de la récupération des détails pour la demande ${request.id}:`,
                                err
                            );
                        }
                    }

                    console.log("Étudiants badgés récupérés:", badgedStudents);
                    setStudents(badgedStudents);
                } catch (err) {
                    console.error(
                        "Erreur lors du chargement des étudiants:",
                        err
                    );
                    setError("Impossible de charger les étudiants badgés");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchStudents();
    }, [userId, userRole, refreshTrigger]);

    // Fonction pour formater la date de badge ou renvoyer une valeur par défaut
    const formatBadgeDate = (badgeDate) => {
        if (!badgeDate) return "Date inconnue";

        const date = new Date(badgeDate);
        if (isNaN(date.getTime())) return "Date non valide";

        return date.toLocaleDateString();
    };

    if (userRole !== "ROLE_SCHOOL") {
        return null; // Ce composant est uniquement pour les écoles
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Mes étudiants
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
                Mes étudiants
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {students.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                        Vous n'avez pas encore d'étudiants badgés.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-5 w-5 text-blue-600"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-800">
                                        {student.firstName || "Prénom"}{" "}
                                        {student.lastName || "Nom"}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {student.email ||
                                            "Email non disponible"}
                                    </p>
                                    <div className="mt-2 flex items-center">
                                        <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                            Badgé le{" "}
                                            {formatBadgeDate(student.badge)}
                                        </span>
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

export default SchoolBadgedStudents;
