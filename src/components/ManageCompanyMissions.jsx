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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto">
                {!selectedMission ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">
                                Gérer mes missions
                            </h2>
                            <button
                                onClick={onClose}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                ✕
                            </button>
                        </div>

                        {missions.length === 0 ? (
                            <p className="text-gray-600">
                                Vous n'avez pas encore créé de missions.
                            </p>
                        ) : (
                            <div className="space-y-4">
                                {missions.map((mission) => (
                                    <div
                                        key={mission.id}
                                        className="border rounded-lg p-4 shadow-sm hover:shadow-md cursor-pointer"
                                        onClick={() =>
                                            handleMissionClick(mission)
                                        }
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-semibold text-lg">
                                                    {mission.name}
                                                </h3>
                                                <p className="text-sm text-gray-700">
                                                    Type :{" "}
                                                    {mission.type?.name ||
                                                        "Non spécifié"}
                                                </p>
                                            </div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleMissionClick(mission);
                                                }}
                                                className="px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200"
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
