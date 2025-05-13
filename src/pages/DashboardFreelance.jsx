import { useState } from "react";
import { getAllMissions } from "../services/api";

function DashboardFreelance() {
    const [missions, setMissions] = useState([]);
    const [showMissions, setShowMissions] = useState(false);

    const handleShowMissions = async () => {
        try {
            const missionsData = await getAllMissions();
            setMissions(missionsData);
            setShowMissions(true);
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des missions:",
                error
            );
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Bienvenue sur le dashboard Freelance
            </h1>

            <button
                onClick={handleShowMissions}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
            >
                Voir les missions
            </button>

            {showMissions && (
                <div>
                    <h2 className="text-xl font-semibold mt-6 mb-2">
                        Liste des missions disponibles
                    </h2>
                    {missions.length === 0 ? (
                        <p>Aucune mission disponible pour le moment.</p>
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
                                        Type :{" "}
                                        {mission.type?.name || "Non spécifié"}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        {mission.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}

export default DashboardFreelance;
