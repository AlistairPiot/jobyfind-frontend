import React, { useEffect, useState } from "react";
import CreateMissionForm from "./../components/CreateMissionForm";
import { getMissionsByUser, getUserById } from "./../services/api";

function DashboardCompany() {
    const [missions, setMissions] = useState([]);
    const [users, setUsers] = useState({});

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if (userId) {
            getMissionsByUser(userId).then((missionsData) => {
                setMissions(missionsData);
                // Récupérer les informations de chaque utilisateur associé aux missions
                missionsData.forEach((mission) => {
                    if (mission.user && mission.user.id) {
                        // Vérifie que mission.user.id existe
                        getUserById(mission.user.id).then((userData) => {
                            setUsers((prevUsers) => ({
                                ...prevUsers,
                                [mission.user.id]: userData, // Stocker l'email de l'utilisateur dans le state
                            }));
                        });
                    } else {
                        console.log(
                            `Utilisateur non trouvé pour la mission ${mission.id}`
                        );
                    }
                });
            });
        }
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Bienvenue sur le dashboard Entreprise
            </h1>

            <h2 className="text-xl font-semibold mb-2">
                Créer une nouvelle mission
            </h2>
            <CreateMissionForm />

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
                            <h3 className="font-bold text-lg">
                                {mission.name}
                            </h3>
                            <p className="text-sm text-gray-700">
                                Type : {mission.type?.name || "Non spécifié"}
                            </p>
                            <p className="text-sm text-gray-600">
                                Créée par :{" "}
                                {users[mission.user.id]?.email ||
                                    users[mission.user.id]?.id ||
                                    "Utilisateur inconnu"}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DashboardCompany;
