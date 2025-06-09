import { useEffect, useState } from "react";
import ManageMissionApplications from "./ManageMissionApplications";

function ManageCompanyMissions({ missions, onClose }) {
    const [selectedMission, setSelectedMission] = useState(null);

    useEffect(() => {
        console.log("ManageCompanyMissions monté avec les missions:", missions);
    }, [missions]);

    const handleMissionClick = (mission) => {
        console.log("Mission sélectionnée:", mission);
        setSelectedMission(mission);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-gray-300">
                {!selectedMission ? (
                    <>
                        <div className="border-b p-6 flex-shrink-0">
                            <div className="flex justify-between items-center">
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
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {missions.length === 0 ? (
                                <p className="text-gray-600 text-center py-8">
                                    Vous n'avez pas encore créé de missions.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {missions.map((mission) => (
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
                    />
                )}
            </div>
        </div>
    );
}

export default ManageCompanyMissions;
