import { useState } from "react";
import JobApplicationForm from "../components/JobApplicationForm";
import MyApplications from "../components/MyApplications";
import UserBadge from "../components/UserBadge";
import { getAllMissions } from "../services/api";

function DashboardFreelance() {
    const [missions, setMissions] = useState([]);
    const [showMissions, setShowMissions] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showMyApplications, setShowMyApplications] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleShowMissions = async () => {
        setLoading(true);
        try {
            const missionsData = await getAllMissions();
            setMissions(missionsData);
            setShowMissions(true);
        } catch (error) {
            console.error(
                "Erreur lors de la récupération des missions:",
                error
            );
        } finally {
            setLoading(false);
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
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">
                    Dashboard Freelance
                </h1>
                <div className="flex flex-wrap justify-center gap-4">
                    <button
                        onClick={handleShowMissions}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md"
                    >
                        Voir les missions
                    </button>
                    <button
                        onClick={() => {
                            setShowMyApplications(true);
                            setShowMissions(false);
                            setSelectedMission(null);
                        }}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors shadow-md"
                    >
                        Mes candidatures
                    </button>
                </div>
            </div>

            {/* Composant pour afficher le badge étudiant */}
            <UserBadge />

            {!showMissions && (
                <div className="text-center bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-4">
                        Trouvez votre prochaine opportunité
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Découvrez les missions disponibles et postulez
                        directement sur la plateforme.
                    </p>
                    <button
                        onClick={handleShowMissions}
                        disabled={loading}
                        className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="inline-block animate-spin h-5 w-5 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>Chargement...</span>
                            </>
                        ) : (
                            <span>Voir les missions disponibles</span>
                        )}
                    </button>
                </div>
            )}

            {showMissions && !selectedMission && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-semibold mb-6 border-b pb-2 text-center">
                        Missions disponibles
                    </h2>
                    {missions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                Aucune mission disponible pour le moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {missions.map((mission) => (
                                <div
                                    key={mission.id}
                                    onClick={() => handleMissionClick(mission)}
                                    className="border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer"
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
                                        <div className="flex justify-center">
                                            <span className="text-blue-600 text-sm font-medium hover:underline">
                                                Voir les détails →
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {selectedMission && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <button
                        onClick={() => setSelectedMission(null)}
                        className="flex items-center text-gray-600 mb-6 hover:text-blue-600 transition-colors"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Retour à la liste
                    </button>

                    <div className="border-b pb-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                            {selectedMission.name}
                        </h2>
                        <div className="flex justify-center">
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                {selectedMission.type?.name || "Non spécifié"}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-6 mb-8">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700">
                                Description
                            </h3>
                            <p className="mt-2 text-gray-600 whitespace-pre-wrap">
                                {selectedMission.description}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={handleApply}
                            className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors shadow-md flex items-center"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 mr-2"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
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
