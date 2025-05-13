import { useState } from "react";
import JobApplicationForm from "../components/JobApplicationForm";
import MyApplications from "../components/MyApplications";
import { getAllMissions } from "../services/api";

function DashboardFreelance() {
    const [missions, setMissions] = useState([]);
    const [showMissions, setShowMissions] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showMyApplications, setShowMyApplications] = useState(false);

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

    const handleMissionClick = (mission) => {
        setSelectedMission(mission);
    };

    const handleApply = () => {
        setShowApplicationForm(true);
    };

    const handleApplicationSuccess = () => {
        alert("Votre candidature a été envoyée avec succès !");
        setShowApplicationForm(false);
        setSelectedMission(null);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Bienvenue sur le dashboard Freelance
                </h1>
                <button
                    onClick={() => setShowMyApplications(true)}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    Gérer mes demandes
                </button>
            </div>

            {!showMissions && (
                <button
                    onClick={handleShowMissions}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
                >
                    Voir les missions
                </button>
            )}

            {showMissions && !selectedMission && (
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
                                    className="border p-4 rounded shadow-sm bg-white hover:shadow-md cursor-pointer transition-shadow"
                                    onClick={() => handleMissionClick(mission)}
                                >
                                    <h3 className="font-bold text-lg">
                                        {mission.name}
                                    </h3>
                                    <p className="text-sm text-gray-700">
                                        Type :{" "}
                                        {mission.type?.name || "Non spécifié"}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                                        {mission.description}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {selectedMission && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <button
                        onClick={() => setSelectedMission(null)}
                        className="text-gray-600 mb-4 hover:text-gray-800"
                    >
                        ← Retour à la liste
                    </button>
                    <h2 className="text-2xl font-bold mb-4">
                        {selectedMission.name}
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold">Type</h3>
                            <p>
                                {selectedMission.type?.name || "Non spécifié"}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">
                                Description
                            </h3>
                            <p className="whitespace-pre-wrap">
                                {selectedMission.description}
                            </p>
                        </div>
                        <button
                            onClick={handleApply}
                            className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                        >
                            Postuler à cette mission
                        </button>
                    </div>
                </div>
            )}

            {showApplicationForm && (
                <JobApplicationForm
                    mission={selectedMission}
                    onClose={() => setShowApplicationForm(false)}
                    onSuccess={handleApplicationSuccess}
                />
            )}

            {showMyApplications && (
                <MyApplications onClose={() => setShowMyApplications(false)} />
            )}
        </div>
    );
}

export default DashboardFreelance;
