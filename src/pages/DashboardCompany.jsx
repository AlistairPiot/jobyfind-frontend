import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ManageCompanyMissions from "../components/ManageCompanyMissions";
import { deleteMission, getMissionsByUser, getUserById } from "../services/api";

function DashboardCompany() {
    const [missions, setMissions] = useState([]);
    const [users, setUsers] = useState({});
    const [showManageMissions, setShowManageMissions] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMissions();
    }, []);

    const fetchMissions = async () => {
        setLoading(true);
        const userId = localStorage.getItem("userId");
        if (userId) {
            try {
                const missionsData = await getMissionsByUser(userId);
                console.log("Missions récupérées:", missionsData);
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
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
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

    const handleShowManageMissions = () => {
        console.log("Ouverture du modal de gestion des missions");
        console.log("Missions disponibles:", missions);
        setShowManageMissions(true);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">
                    Dashboard Entreprise
                </h1>
                <div className="flex flex-wrap justify-center gap-4">
                    <Link
                        to="/create-mission"
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Ajouter une mission
                    </Link>
                    <button
                        onClick={handleShowManageMissions}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
                    >
                        Gérer mes missions
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-center">
                    Vos missions publiées
                </h2>

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">Chargement...</p>
                    </div>
                ) : missions.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-4">
                            Vous n'avez pas encore publié de missions.
                        </p>
                        <Link
                            to="/create-mission"
                            className="text-blue-600 hover:underline"
                        >
                            Créer votre première mission
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {missions.map((mission) => (
                            <div
                                key={mission.id}
                                className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                            >
                                <div className="h-2 bg-blue-600"></div>
                                <div className="p-5 flex-grow">
                                    <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">
                                        {mission.name}
                                    </h3>
                                    <div className="flex justify-center mb-3">
                                        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                                            {mission.type?.name ||
                                                "Non spécifié"}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                        {mission.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mb-2 text-center">
                                        Créée par :{" "}
                                        {users[mission.user.id]?.email ||
                                            "Utilisateur inconnu"}
                                    </p>
                                </div>
                                <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-center">
                                    <button
                                        onClick={() => handleDelete(mission.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-1.5 rounded-md transition-colors"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {showManageMissions && (
                <ManageCompanyMissions
                    missions={missions}
                    onClose={() => {
                        console.log("Fermeture du modal");
                        setShowManageMissions(false);
                    }}
                />
            )}
        </div>
    );
}

export default DashboardCompany;
