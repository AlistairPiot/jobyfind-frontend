import { useCallback, useState } from "react";
import { getAvailableMissions } from "../services/api";

export const useAvailableMissions = () => {
    const [missions, setMissions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadMissions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const missionsData = await getAvailableMissions();
            setMissions(missionsData);
        } catch (err) {
            console.error("Erreur lors de la récupération des missions:", err);
            setError("Erreur lors de la récupération des missions");
        } finally {
            setLoading(false);
        }
    }, []);

    const removeMission = useCallback((missionId) => {
        setMissions((prev) =>
            prev.filter((mission) => mission.id !== missionId)
        );
    }, []);

    const refreshMissions = useCallback(() => {
        loadMissions();
    }, [loadMissions]);

    return {
        missions,
        loading,
        error,
        loadMissions,
        removeMission,
        refreshMissions,
    };
};
