import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserById, updateUserProfile } from "../services/api";
import UserBadge from "./UserBadge";

function ProfileModal({ onClose }) {
    const {
        userId,
        userRole,
        updateUserProfile: updateAuthProfile,
    } = useAuth();
    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        nameCompany: "",
        nameSchool: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const userData = await getUserById(userId);
                if (userData) {
                    setProfileData({
                        firstName: userData.firstName || "",
                        lastName: userData.lastName || "",
                        nameCompany: userData.nameCompany || "",
                        nameSchool: userData.nameSchool || "",
                    });
                }
            } catch (err) {
                console.error("Erreur lors du chargement du profil:", err);
                setError("Impossible de charger vos informations de profil");
            } finally {
                setLoading(false);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]);

    // Définir le libellé et les champs en fonction du rôle utilisateur
    const getRoleSpecificFields = () => {
        switch (userRole) {
            case "ROLE_SCHOOL":
                return (
                    <div>
                        <label
                            htmlFor="nameSchool"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nom de l'école
                        </label>
                        <input
                            type="text"
                            id="nameSchool"
                            value={profileData.nameSchool}
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    nameSchool: e.target.value,
                                })
                            }
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Entrez le nom de l'école"
                        />
                    </div>
                );
            case "ROLE_COMPANY":
                return (
                    <div>
                        <label
                            htmlFor="nameCompany"
                            className="block text-sm font-medium text-gray-700 mb-1"
                        >
                            Nom de l'entreprise
                        </label>
                        <input
                            type="text"
                            id="nameCompany"
                            value={profileData.nameCompany}
                            onChange={(e) =>
                                setProfileData({
                                    ...profileData,
                                    nameCompany: e.target.value,
                                })
                            }
                            required
                            className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Entrez le nom de l'entreprise"
                        />
                    </div>
                );
            case "ROLE_FREELANCE":
                return (
                    <>
                        <div>
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Prénom
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={profileData.firstName}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        firstName: e.target.value,
                                    })
                                }
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Entrez votre prénom"
                            />
                        </div>
                        <div className="mt-4">
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Nom
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={profileData.lastName}
                                onChange={(e) =>
                                    setProfileData({
                                        ...profileData,
                                        lastName: e.target.value,
                                    })
                                }
                                required
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Entrez votre nom"
                            />
                        </div>
                    </>
                );
            default:
                return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);

        try {
            // Préparer les données à envoyer en fonction du rôle
            let dataToUpdate = {};
            let displayName = "";

            switch (userRole) {
                case "ROLE_SCHOOL":
                    dataToUpdate = { nameSchool: profileData.nameSchool };
                    displayName = profileData.nameSchool;
                    // Solution temporaire en attendant la mise à jour du backend
                    localStorage.setItem(
                        "userNameSchool",
                        profileData.nameSchool
                    );
                    break;
                case "ROLE_COMPANY":
                    dataToUpdate = { nameCompany: profileData.nameCompany };
                    displayName = profileData.nameCompany;
                    // Solution temporaire en attendant la mise à jour du backend
                    localStorage.setItem(
                        "userNameCompany",
                        profileData.nameCompany
                    );
                    break;
                case "ROLE_FREELANCE":
                    dataToUpdate = {
                        firstName: profileData.firstName,
                        lastName: profileData.lastName,
                    };
                    displayName =
                        `${profileData.firstName} ${profileData.lastName}`.trim();
                    // Solution temporaire en attendant la mise à jour du backend
                    localStorage.setItem(
                        "userFirstName",
                        profileData.firstName
                    );
                    localStorage.setItem("userLastName", profileData.lastName);
                    break;
                default:
                    break;
            }

            console.log("Données envoyées à l'API:", dataToUpdate);

            try {
                // Tenter de mettre à jour le profil utilisateur via l'API
                const response = await updateUserProfile(userId, dataToUpdate);
                console.log("Réponse de l'API:", response);
            } catch (apiError) {
                console.warn(
                    "La mise à jour via l'API a échoué, mais les données sont sauvegardées localement:",
                    apiError
                );
                // On continue car on a une solution de secours avec localStorage
            }

            // Mettre à jour le contexte d'authentification
            updateAuthProfile(displayName);

            onClose();
        } catch (err) {
            setError("Erreur lors de la mise à jour du profil");
            console.error("Erreur profil:", err);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">
                            Chargement du profil...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Modifier votre profil
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <p className="text-red-600 text-center mb-4">{error}</p>
                )}

                {loading ? (
                    <div className="flex justify-center items-center h-40">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">
                            Chargement du profil...
                        </p>
                    </div>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {getRoleSpecificFields()}

                            <div className="flex justify-center mt-6">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md disabled:opacity-50"
                                >
                                    {saving
                                        ? "Enregistrement..."
                                        : "Enregistrer"}
                                </button>
                            </div>
                        </form>

                        {/* Afficher le composant de badge pour les freelances */}
                        {userRole === "ROLE_FREELANCE" && (
                            <div className="mt-8 pt-6 border-t border-gray-200">
                                <UserBadge />
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default ProfileModal;
