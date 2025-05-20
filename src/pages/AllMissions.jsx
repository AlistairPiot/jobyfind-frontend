// src/pages/AllMissions.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllMissions } from "../services/api";

function AllMissions() {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMissions = async () => {
            try {
                const data = await getAllMissions();
                setMissions(data);
                setLoading(false);
            } catch (err) {
                console.error("Error fetching missions:", err);
                setError("Impossible de charger les missions");
                setLoading(false);
            }
        };

        fetchMissions();
    }, []);

    if (loading) {
        return (
            <div>
                <div></div>
                <p>Chargement des missions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <h1>Toutes les missions</h1>
                <div>
                    <p>{error}</p>
                    <Link to="/">Retour à l'accueil</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1>Découvrez toutes les missions disponibles</h1>
            </div>

            {missions.length === 0 ? (
                <div>
                    <p>
                        Aucune mission disponible pour le moment. Revenez plus
                        tard !
                    </p>
                </div>
            ) : (
                <div>
                    <div>
                        {missions.map((mission) => (
                            <div key={mission.id}>
                                <div></div>
                                <div>
                                    <h2>{mission.name}</h2>
                                    <p>{mission.description}</p>
                                    <div>
                                        <span>
                                            {mission.type?.name ||
                                                "Non spécifié"}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <button>Voir les détails</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default AllMissions;
