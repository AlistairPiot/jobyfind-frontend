import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    deleteMission,
    getMissionsByUser,
    getUserById,
} from "./../services/api";

function DashboardCompany() {
    const [missions, setMissions] = useState([]);
    const [users, setUsers] = useState({});

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            try {
                const missionsData = await getMissionsByUser(userId);
                setMissions(missionsData);

                // Chargement des utilisateurs associés aux missions
                const userPromises = missionsData.map((mission) => {
                    if (mission.user && mission.user.id) {
                        // Vérifie que 'user' et 'id' existent
                        return getUserById(mission.user.id).then(
                            (userData) => ({
                                userId: mission.user.id,
                                userData,
                            })
                        );
                    }
                    return null;
                });

                // Attendre que tous les utilisateurs soient chargés avant de mettre à jour l'état
                const userResults = await Promise.all(userPromises);
                const newUsers = userResults.reduce((acc, result) => {
                    if (result) {
                        acc[result.userId] = result.userData;
                    }
                    return acc;
                }, {});

                setUsers(newUsers);
            } catch (error) {
                console.error(
                    "Erreur lors de la récupération des missions et utilisateurs",
                    error
                );
            }
        }
    };

    const handleDelete = async (missionId) => {
        const confirmed = window.confirm(
            "Voulez-vous vraiment supprimer cette mission ?"
        );
        if (!confirmed) return;

        try {
            // Suppression de la mission via l'API
            await deleteMission(missionId);

            // Mise à jour de l'état local pour retirer la mission supprimée
            setMissions(missions.filter((mission) => mission.id !== missionId));

            alert("Mission supprimée avec succès !");
        } catch (error) {
            console.error("Erreur lors de la suppression :", error);
            alert("Erreur lors de la suppression de la mission.");
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Bienvenue sur le dashboard Entreprise
            </h1>
            <div className="mb-4">
                <Link
                    to="/create-mission"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    + Ajouter une mission
                </Link>
            </div>
            <h2 className="text-xl font-semibold mt-6 mb-2">
                Vos missions postées
            </h2>
            {missions.length === 0 ? (
                <p>Aucune mission trouvée.</p>
            ) : (
                <ul className="space-y-2">
                    {missions.map((mission) => (
                        <li
                            key={mission.id}
                            className="border p-4 rounded shadow-sm bg-white"
                        >
                            {/* Affichage de la mission */}
                            <h3 className="font-bold text-lg">
                                {mission.name}
                            </h3>
                            <p className="text-sm text-gray-700">
                                Type : {mission.type?.name || "Non spécifié"}
                            </p>
                            <p className="text-sm text-gray-600">
                                Créée par :{" "}
                                {users[mission.user.id]?.email ||
                                    "Utilisateur inconnu"}
                            </p>
                            <div className="mt-2 space-x-2">
                                <button
                                    onClick={() => handleDelete(mission.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                >
                                    Supprimer
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DashboardCompany;
