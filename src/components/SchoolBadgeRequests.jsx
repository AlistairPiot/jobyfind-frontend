import axios from "axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    acceptBadgeRequest,
    getSchoolBadgeRequests,
    getUserById,
    rejectBadgeRequest,
} from "../services/api";

function SchoolBadgeRequests() {
    const { userId, userRole } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [students, setStudents] = useState({});

    useEffect(() => {
        const fetchRequests = async () => {
            if (userId && userRole === "ROLE_SCHOOL") {
                try {
                    setLoading(true);
                    const requestsData = await getSchoolBadgeRequests(userId);
                    console.log("Données reçues de l'API:", requestsData);

                    // Si nous avons des demandes mais pas d'information utilisateur, essayons de les obtenir directement
                    if (requestsData.length > 0) {
                        const studentsData = {};
                        const requestsWithUsers = [];

                        for (const request of requestsData) {
                            try {
                                // Essayer d'obtenir plus de détails sur la demande
                                const detailedRequest = await axios.get(
                                    `http://localhost:8000/api/request_badges/${request.id}`
                                );
                                console.log(
                                    `Détails de la demande ${request.id}:`,
                                    detailedRequest.data
                                );

                                // Si nous n'avons pas d'information utilisateur, utilisons un ID par défaut pour le moment
                                // En supposant que les demandes sont associées à l'utilisateur avec l'ID 8 (à adapter)
                                const studentId = "8"; // ID par défaut à modifier selon votre base de données

                                if (!studentsData[studentId]) {
                                    const studentData = await getUserById(
                                        studentId
                                    );
                                    studentsData[studentId] = studentData;
                                }

                                // Ajouter l'information utilisateur à la demande
                                requestsWithUsers.push({
                                    ...request,
                                    user: `/api/users/${studentId}`,
                                });
                            } catch (err) {
                                console.error(
                                    `Erreur lors de la récupération des détails de la demande ${request.id}:`,
                                    err
                                );
                                // Ajouter quand même la demande sans info utilisateur
                                requestsWithUsers.push(request);
                            }
                        }

                        setStudents(studentsData);
                        setRequests(requestsWithUsers);
                    } else {
                        setRequests(requestsData);
                    }
                } catch (err) {
                    console.error(
                        "Erreur lors du chargement des demandes:",
                        err
                    );
                    setError("Impossible de charger les demandes de badge");
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchRequests();
    }, [userId, userRole]);

    const handleAccept = async (requestId, studentId) => {
        try {
            await acceptBadgeRequest(requestId, studentId);

            // Attendre un peu pour que les modifications soient prises en compte par l'API
            setTimeout(async () => {
                // Recharger les demandes de badge pour mettre à jour l'interface
                const updatedRequests = await getSchoolBadgeRequests(userId);
                setRequests(updatedRequests);

                // Rafraîchir le composant SchoolBadgedStudents s'il est disponible
                if (window.refreshBadgedStudents) {
                    window.refreshBadgedStudents();
                }

                // Afficher un message de confirmation
                alert("La demande de badge a été acceptée avec succès !");
            }, 1000);
        } catch (err) {
            console.error("Erreur lors de l'acceptation de la demande:", err);
            setError("Erreur lors de l'acceptation de la demande de badge");
        }
    };

    const handleReject = async (requestId) => {
        try {
            await rejectBadgeRequest(requestId);

            // Attendre un peu pour que les modifications soient prises en compte par l'API
            setTimeout(async () => {
                // Recharger les demandes de badge pour mettre à jour l'interface
                const updatedRequests = await getSchoolBadgeRequests(userId);

                // Le filtrage est maintenant fait dans getSchoolBadgeRequests basé sur responseDate
                setRequests(updatedRequests);

                // Afficher un message de confirmation
                alert("La demande de badge a été refusée.");
            }, 1000);
        } catch (err) {
            console.error("Erreur lors du refus de la demande:", err);
            setError("Erreur lors du refus de la demande de badge");
        }
    };

    if (userRole !== "ROLE_SCHOOL") {
        return null; // Ce composant est uniquement pour les écoles
    }

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Demandes de badge
                </h2>
                <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                    <p className="ml-4 text-gray-600">
                        Chargement des demandes...
                    </p>
                </div>
            </div>
        );
    }

    const getStudentData = (requestUserId) => {
        if (!requestUserId) return {}; // Retourner un objet vide si requestUserId est undefined

        const path = requestUserId.split("/");
        const id = path[path.length - 1];
        return students[id] || {};
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Demandes de badge
            </h2>

            {error && (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {requests.length === 0 ? (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <p className="text-gray-600">
                        Aucune demande de badge en attente.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map((request) => {
                        const student = getStudentData(request.user);
                        const studentId = request.user
                            ? request.user.split("/").pop()
                            : "8"; // ID par défaut à modifier

                        return (
                            <div
                                key={request.id}
                                className="border rounded-lg p-4 shadow-sm"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">
                                            {student.firstName || "Prénom"}{" "}
                                            {student.lastName || "Nom"}
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Email :{" "}
                                            {student.email || "Non disponible"}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Demande reçue le :{" "}
                                            {new Date(
                                                request.requestDate
                                            ).toLocaleDateString()}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1">
                                            ID de la demande : {request.id}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() =>
                                                handleAccept(
                                                    request.id,
                                                    studentId
                                                )
                                            }
                                            className="p-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                            title="Accepter"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleReject(request.id)
                                            }
                                            className="p-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                            title="Refuser"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5"
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
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default SchoolBadgeRequests;
