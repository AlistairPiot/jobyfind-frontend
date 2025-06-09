import { useEffect, useState } from "react";
import { getMissionApplications } from "../services/api";
import ManageMissionApplications from "./ManageMissionApplications";

function ManageCompanyMissions({ missions, onClose }) {
    const [selectedMission, setSelectedMission] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // "all" ou "accepted"
    const [acceptedMissions, setAcceptedMissions] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        console.log("ManageCompanyMissions monté avec les missions:", missions);
        loadAcceptedMissions();
    }, [missions]);

    const loadAcceptedMissions = async () => {
        setLoading(true);
        try {
            const missionsWithAcceptedApplications = [];

            for (const mission of missions) {
                try {
                    const applications = await getMissionApplications(
                        mission.id
                    );
                    const hasAcceptedApplications = applications.some(
                        (app) =>
                            app.status === "ACCEPTED" &&
                            app.missions &&
                            app.missions.some((m) => m.id === mission.id)
                    );

                    if (hasAcceptedApplications) {
                        missionsWithAcceptedApplications.push(mission);
                    }
                } catch (error) {
                    console.error(
                        `Erreur lors du chargement des candidatures pour la mission ${mission.id}:`,
                        error
                    );
                }
            }

            setAcceptedMissions(missionsWithAcceptedApplications);
        } catch (error) {
            console.error(
                "Erreur lors du chargement des missions acceptées:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleMissionClick = (mission) => {
        console.log("Mission sélectionnée:", mission);
        setSelectedMission(mission);
    };

    const handleMissionUnavailable = (missionId) => {
        console.log(`Mission ${missionId} devient indisponible`);
        // Optionnel : afficher une notification
        // Vous pouvez ajouter ici une logique pour notifier d'autres composants
    };

    const currentMissions = activeTab === "all" ? missions : acceptedMissions;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-300">
                {!selectedMission ? (
                    <>
                        <div className="border-b p-6 flex-shrink-0">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-bold text-gray-800">
                                    Gérer mes missions
                                </h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Onglets */}
                            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                                <button
                                    onClick={() => setActiveTab("all")}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        activeTab === "all"
                                            ? "bg-white text-blue-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-800"
                                    }`}
                                >
                                    Mes missions ({missions.length})
                                </button>
                                <button
                                    onClick={() => setActiveTab("accepted")}
                                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                                        activeTab === "accepted"
                                            ? "bg-white text-green-600 shadow-sm"
                                            : "text-gray-600 hover:text-gray-800"
                                    }`}
                                >
                                    Mes missions acceptées (
                                    {acceptedMissions.length})
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {loading ? (
                                <div className="flex justify-center items-center h-32">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                                    <p className="ml-4 text-gray-600">
                                        Chargement des missions...
                                    </p>
                                </div>
                            ) : currentMissions.length === 0 ? (
                                <p className="text-gray-600 text-center py-8">
                                    {activeTab === "all"
                                        ? "Vous n'avez pas encore créé de missions."
                                        : "Aucune mission avec des candidatures acceptées."}
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {currentMissions.map((mission) => (
                                        <div
                                            key={mission.id}
                                            onClick={() =>
                                                handleMissionClick(mission)
                                            }
                                            className="border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer transition-shadow duration-200"
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold text-lg text-gray-800">
                                                        {mission.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-700 mt-1">
                                                        Type :{" "}
                                                        {mission.type?.name ||
                                                            "Non spécifié"}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMissionClick(
                                                            mission
                                                        );
                                                    }}
                                                    className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                                                >
                                                    Voir les candidatures
                                                </button>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                                {mission.description}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <ManageMissionApplications
                        mission={selectedMission}
                        onClose={() => setSelectedMission(null)}
                        onStatusUpdate={loadAcceptedMissions}
                        onMissionUnavailable={handleMissionUnavailable}
                        showOnlyAccepted={activeTab === "accepted"}
                    />
                )}
            </div>
        </div>
    );
}

export default ManageCompanyMissions;
