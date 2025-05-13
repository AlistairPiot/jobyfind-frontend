// src/pages/AllMissions.jsx
import { useEffect, useState } from "react";
import { getAllMissions } from "../services/api";

function AllMissions() {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const data = await getAllMissions();
                setMissions(data);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des missions :",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMissions();
    }, []);

    if (loading) return <p>Chargement des missions...</p>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Toutes les missions</h1>
            {missions.length === 0 ? (
                <p>Aucune mission disponible.</p>
            ) : (
                <ul className="space-y-4">
                    {missions.map((mission) => (
                        <li
                            key={mission.id}
                            className="border p-4 rounded shadow-sm bg-white"
                        >
                            <h2 className="text-lg font-bold">
                                {mission.name}
                            </h2>
                            <p>{mission.description}</p>
                            <p className="text-sm text-gray-600">
                                Type : {mission.type?.name || "Non spécifié"}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AllMissions;
