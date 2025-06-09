import React, { createContext, useCallback, useContext, useState } from "react";
import { getAvailableMissions } from "../services/api";

const MissionsContext = createContext();

export const useMissions = () => {
    const context = useContext(MissionsContext);
    if (!context) {
        throw new Error("useMissions must be used within a MissionsProvider");
    }
    return context;
};

export const MissionsProvider = ({ children }) => {
    const [availableMissions, setAvailableMissions] = useState([]);
    const [loading, setLoading] = useState(false);

    const loadAvailableMissions = useCallback(async () => {
        setLoading(true);
        try {
            const missions = await getAvailableMissions();
            setAvailableMissions(missions);
        } catch (error) {
            console.error("Erreur lors du chargement des missions:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    const removeMissionFromAvailable = useCallback((missionId) => {
        setAvailableMissions((prev) =>
            prev.filter((mission) => mission.id !== missionId)
        );
    }, []);

    const addMissionToAvailable = useCallback((mission) => {
        setAvailableMissions((prev) => {
            // Éviter les doublons
            if (prev.some((m) => m.id === mission.id)) {
                return prev;
            }
            return [...prev, mission];
        });
    }, []);

    const value = {
        availableMissions,
        loading,
        loadAvailableMissions,
        removeMissionFromAvailable,
        addMissionToAvailable,
    };

    return (
        <MissionsContext.Provider value={value}>
            {children}
        </MissionsContext.Provider>
    );
};
