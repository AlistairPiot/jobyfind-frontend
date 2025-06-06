import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
    acceptBadgeRequest,
    getSchoolBadgeRequests,
    rejectBadgeRequest,
} from "../services/api";

function SchoolBadgeRequests() {
    const { userId, userRole } = useAuth();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            if (userId && userRole === "ROLE_SCHOOL") {
                try {
                    setLoading(true);
                    const requestsData = await getSchoolBadgeRequests(userId);
                    console.log("Données reçues de l'API:", requestsData);
                    setRequests(requestsData);
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

    const handleAccept = async (requestId) => {
        try {
            await acceptBadgeRequest(requestId);

            // Recharger les demandes de badge pour mettre à jour l'interface
            const updatedRequests = await getSchoolBadgeRequests(userId);
            setRequests(updatedRequests);

            // Rafraîchir le composant SchoolBadgedStudents s'il est disponible
            if (window.refreshBadgedStudents) {
                window.refreshBadgedStudents();
            }

            alert("La demande de badge a été acceptée avec succès !");
        } catch (err) {
            console.error("Erreur lors de l'acceptation de la demande:", err);
            setError("Erreur lors de l'acceptation de la demande de badge");
        }
    };

    const handleReject = async (requestId) => {
        try {
            await rejectBadgeRequest(requestId);

            // Recharger les demandes de badge pour mettre à jour l'interface
            const updatedRequests = await getSchoolBadgeRequests(userId);
            setRequests(updatedRequests);

            alert("La demande de badge a été refusée.");
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
                        return (
                            <div
                                key={request.id}
                                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="font-medium text-gray-800">
                                            Demande de badge
                                        </h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            {request.user &&
                                            request.user.firstName &&
                                            request.user.lastName
                                                ? `${request.user.firstName} ${request.user.lastName}`
                                                : request.user &&
                                                  request.user.email
                                                ? request.user.email
                                                : "Utilisateur inconnu"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Date de demande:{" "}
                                            {new Date(
                                                request.requestDate
                                            ).toLocaleDateString("fr-FR")}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2 ml-4">
                                        <button
                                            onClick={() =>
                                                handleAccept(request.id)
                                            }
                                            className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                                        >
                                            Accepter
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleReject(request.id)
                                            }
                                            className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                                        >
                                            Refuser
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
