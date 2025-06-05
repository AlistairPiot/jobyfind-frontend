import { useEffect, useState } from "react";
import JobApplicationForm from "../components/JobApplicationForm";
import MyApplications from "../components/MyApplications";
import UserBadge from "../components/UserBadge";
import { useAuth } from "../context/AuthContext";
import {
    getAllMissions,
    getRecommendedMissions,
    getTypes,
    getUserApplications,
} from "../services/api";

function DashboardFreelance() {
    const { userId } = useAuth();
    const [missions, setMissions] = useState([]);
    const [filteredMissions, setFilteredMissions] = useState([]);
    const [types, setTypes] = useState([]);
    const [userApplications, setUserApplications] = useState([]);
    const [recommendedMissionIds, setRecommendedMissionIds] = useState([]);
    const [selectedTypeFilter, setSelectedTypeFilter] = useState("");
    const [showMissions, setShowMissions] = useState(false);
    const [selectedMission, setSelectedMission] = useState(null);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showMyApplications, setShowMyApplications] = useState(false);
    const [loading, setLoading] = useState(false);
    const [typesLoading, setTypesLoading] = useState(false);

    // Charger les types de contrat au montage du composant
    useEffect(() => {
        const loadTypes = async () => {
            setTypesLoading(true);
            try {
                const typesData = await getTypes();
                setTypes(typesData);
            } catch (error) {
                console.error("Erreur lors du chargement des types:", error);
            } finally {
                setTypesLoading(false);
            }
        };

        loadTypes();
    }, []);

    // Charger les candidatures utilisateur au montage
    useEffect(() => {
        const loadUserApplications = async () => {
            try {
                const applications = await getUserApplications(userId);
                setUserApplications(applications);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des candidatures:",
                    error
                );
            }
        };

        if (userId) {
            loadUserApplications();
        }
    }, [userId]);

    // Charger les missions recommandées au montage
    useEffect(() => {
        const loadRecommendedMissions = async () => {
            try {
                const recommendedIds = await getRecommendedMissions(userId);
                setRecommendedMissionIds(recommendedIds);
            } catch (error) {
                console.error(
                    "Erreur lors du chargement des missions recommandées:",
                    error
                );
            }
        };

        if (userId) {
            loadRecommendedMissions();
        }
    }, [userId]);

    // Fonction pour rafraîchir les missions recommandées
    const refreshRecommendedMissions = async () => {
        console.log("🔄 refreshRecommendedMissions appelée");
        console.log("showMissions:", showMissions);
        console.log("userId:", userId);

        try {
            const recommendedIds = await getRecommendedMissions(userId);
            console.log("📋 Nouveaux IDs recommandés:", recommendedIds);
            setRecommendedMissionIds(recommendedIds);

            // Toujours recharger les missions pour avoir les données à jour
            console.log(
                "🔄 Rechargement des missions pour mise à jour des tags"
            );
            const missionsData = await getAllMissions();
            console.log(
                "📋 Missions rechargées:",
                missionsData.length,
                "missions"
            );
            setMissions(missionsData);
        } catch (error) {
            console.error(
                "Erreur lors du rafraîchissement des missions recommandées:",
                error
            );
        }
    };

    // Exposer la fonction de rafraîchissement globalement
    useEffect(() => {
        window.refreshRecommendedMissions = refreshRecommendedMissions;

        // Écouter les événements personnalisés de rafraîchissement
        const handleRefreshEvent = () => {
            console.log("📡 Événement refreshRecommendedMissions reçu");
            refreshRecommendedMissions();
        };

        window.addEventListener(
            "refreshRecommendedMissions",
            handleRefreshEvent
        );

        return () => {
            delete window.refreshRecommendedMissions;
            window.removeEventListener(
                "refreshRecommendedMissions",
                handleRefreshEvent
            );
        };
    }, [userId]);

    // Fonction pour vérifier si l'utilisateur a déjà postulé à une mission
    const hasUserApplied = (missionId) => {
        return userApplications.some(
            (application) =>
                application.missions &&
                application.missions.some((mission) => mission.id === missionId)
        );
    };

    // Fonction pour vérifier si une mission est recommandée
    const isMissionRecommended = (missionId) => {
        return recommendedMissionIds.includes(missionId);
    };

    // Filtrer les missions quand le filtre ou les missions changent
    useEffect(() => {
        if (!selectedTypeFilter) {
            setFilteredMissions(missions);
        } else {
            const filtered = missions.filter((mission) => {
                return (
                    mission.type &&
                    mission.type.id === parseInt(selectedTypeFilter)
                );
            });
            setFilteredMissions(filtered);
        }
    }, [missions, selectedTypeFilter]);

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

    const handleApplicationSuccess = async () => {
        alert("Votre candidature a été envoyée avec succès !");
        setShowApplicationForm(false);
        // Recharger les candidatures pour mettre à jour l'état
        try {
            const applications = await getUserApplications(userId);
            setUserApplications(applications);
        } catch (error) {
            console.error(
                "Erreur lors du rechargement des candidatures:",
                error
            );
        }
        // Ne pas fermer selectedMission pour que l'utilisateur voit "Candidature envoyée"
    };

    const handleFilterChange = (typeId) => {
        setSelectedTypeFilter(typeId);
    };

    const clearFilter = () => {
        setSelectedTypeFilter("");
    };

    // Fonction pour recharger les candidatures (après suppression)
    const refreshUserApplications = async () => {
        try {
            const applications = await getUserApplications(userId);
            setUserApplications(applications);
        } catch (error) {
            console.error(
                "Erreur lors du rechargement des candidatures:",
                error
            );
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-blue-800 mb-6">
                    Dashboard Etudiant
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

                    {/* Section de filtrage */}
                    <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 text-gray-600"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <label className="text-sm font-medium text-gray-700">
                                    Filtrer par type :
                                </label>
                            </div>

                            <div className="flex-1 min-w-48">
                                <select
                                    value={selectedTypeFilter}
                                    onChange={(e) =>
                                        handleFilterChange(e.target.value)
                                    }
                                    disabled={typesLoading}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                >
                                    <option value="">Tous les types</option>
                                    {types.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {selectedTypeFilter && (
                                <button
                                    onClick={clearFilter}
                                    className="px-3 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center gap-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Effacer
                                </button>
                            )}
                        </div>

                        {/* Affichage du nombre de résultats */}
                        <div className="mt-3 text-sm text-gray-600">
                            {selectedTypeFilter ? (
                                <>
                                    {filteredMissions.length} mission(s)
                                    trouvée(s) pour le type "
                                    {
                                        types.find(
                                            (t) =>
                                                t.id ===
                                                parseInt(selectedTypeFilter)
                                        )?.name
                                    }
                                    "
                                </>
                            ) : (
                                <>{missions.length} mission(s) au total</>
                            )}
                        </div>
                    </div>

                    {filteredMissions.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                {selectedTypeFilter
                                    ? "Aucune mission trouvée pour ce type de contrat."
                                    : "Aucune mission disponible pour le moment."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredMissions.map((mission) => (
                                <div
                                    key={mission.id}
                                    onClick={() => handleMissionClick(mission)}
                                    className={`border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow cursor-pointer ${
                                        hasUserApplied(mission.id)
                                            ? "bg-green-50 border-green-200"
                                            : ""
                                    }`}
                                >
                                    <div
                                        className={`h-2 ${
                                            hasUserApplied(mission.id)
                                                ? "bg-green-600"
                                                : "bg-blue-600"
                                        }`}
                                    ></div>
                                    <div className="p-5 flex-grow">
                                        <h3 className="font-bold text-lg text-gray-800 mb-2 text-center">
                                            {mission.name}
                                        </h3>

                                        {/* Nom de l'entreprise */}
                                        {mission.user?.nameCompany && (
                                            <div className="text-center mb-2">
                                                <span className="text-sm text-gray-700 font-medium">
                                                    {mission.user.nameCompany}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex justify-center mb-3 gap-2">
                                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full">
                                                {mission.type?.name ||
                                                    "Non spécifié"}
                                            </span>
                                            {isMissionRecommended(
                                                mission.id
                                            ) && (
                                                <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded-full">
                                                    ⭐ Mission conseillée
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                                            {mission.description}
                                        </p>
                                        <div className="flex justify-center">
                                            {hasUserApplied(mission.id) ? (
                                                <span className="text-green-600 text-sm font-medium">
                                                    ✓ Candidature envoyée
                                                </span>
                                            ) : (
                                                <span className="text-blue-600 text-sm font-medium hover:underline">
                                                    Voir les détails →
                                                </span>
                                            )}
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

                        {/* Nom de l'entreprise dans la vue détaillée */}
                        {selectedMission.user?.nameCompany && (
                            <div className="text-center mb-3">
                                <span className="text-lg text-gray-700 font-medium">
                                    {selectedMission.user.nameCompany}
                                </span>
                            </div>
                        )}

                        <div className="flex justify-center">
                            <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                                {selectedMission.type?.name || "Non spécifié"}
                            </span>
                        </div>

                        {isMissionRecommended(selectedMission.id) && (
                            <div className="flex justify-center mt-3">
                                <span className="inline-block bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                                    ⭐ Mission conseillée par votre école
                                </span>
                            </div>
                        )}
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
                        {hasUserApplied(selectedMission.id) ? (
                            <div className="flex items-center bg-green-100 text-green-800 px-6 py-3 rounded-md">
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
                                <span className="font-medium">
                                    Candidature envoyée
                                </span>
                            </div>
                        ) : (
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
                        )}
                    </div>
                </div>
            )}

            {showApplicationForm && (
                <JobApplicationForm
                    mission={selectedMission}
                    onClose={() => setShowApplicationForm(false)}
                    onSuccess={handleApplicationSuccess}
                    isRecommended={isMissionRecommended(selectedMission.id)}
                />
            )}

            {showMyApplications && (
                <MyApplications
                    onClose={() => setShowMyApplications(false)}
                    refreshApplications={refreshUserApplications}
                />
            )}
        </div>
    );
}

export default DashboardFreelance;
