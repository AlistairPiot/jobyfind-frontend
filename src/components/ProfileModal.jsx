import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import useErrorHandler from "../hooks/useErrorHandler";
import useValidation from "../hooks/useValidation";
import { getUserById, updateUserProfile } from "../services/api";
import InputField from "./InputField";
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
    const [touchedFields, setTouchedFields] = useState(new Set());

    // Hook de validation
    const { validateRealTime, validateAll, getError, clearErrors } =
        useValidation();

    // Hook de gestion d'erreurs
    const { handleError } = useErrorHandler();

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

                    // Effacer toutes les erreurs après le chargement des données
                    clearErrors();
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
    }, [userId, clearErrors]);

    // Gérer les changements avec validation en temps réel
    const handleInputChange = (fieldName, value) => {
        setProfileData((prev) => ({
            ...prev,
            [fieldName]: value,
        }));

        // Marquer le champ comme touché
        setTouchedFields((prev) => new Set(prev).add(fieldName));

        // Validation en temps réel seulement pour les champs touchés
        validateRealTime(fieldName, value);
    };

    // Gérer le blur (perte de focus) avec validation
    const handleFieldBlur = (fieldName, value) => {
        // Marquer le champ comme touché
        setTouchedFields((prev) => new Set(prev).add(fieldName));

        // Valider le champ
        validateRealTime(fieldName, value);
    };

    // Vérifier si on a des erreurs sur les champs touchés uniquement
    const hasRelevantErrors = () => {
        const errors = {};
        touchedFields.forEach((fieldName) => {
            const error = getError(fieldName);
            if (error) {
                errors[fieldName] = error;
            }
        });
        return Object.keys(errors).length > 0;
    };

    // Définir le libellé et les champs en fonction du rôle utilisateur
    const getRoleSpecificFields = () => {
        switch (userRole) {
            case "ROLE_SCHOOL":
                return (
                    <InputField
                        id="nameSchool"
                        label="Nom de l'école"
                        value={profileData.nameSchool}
                        onChange={(e) =>
                            handleInputChange("nameSchool", e.target.value)
                        }
                        onBlur={(e) =>
                            handleFieldBlur("nameSchool", e.target.value)
                        }
                        placeholder="Entrez le nom de l'école"
                        required
                        error={getError("nameSchool")}
                    />
                );

            case "ROLE_COMPANY":
                return (
                    <InputField
                        id="nameCompany"
                        label="Nom de l'entreprise"
                        value={profileData.nameCompany}
                        onChange={(e) =>
                            handleInputChange("nameCompany", e.target.value)
                        }
                        onBlur={(e) =>
                            handleFieldBlur("nameCompany", e.target.value)
                        }
                        placeholder="Entrez le nom de l'entreprise"
                        required
                        error={getError("nameCompany")}
                    />
                );

            case "ROLE_FREELANCE":
                return (
                    <>
                        <InputField
                            id="firstName"
                            label="Prénom"
                            value={profileData.firstName}
                            onChange={(e) =>
                                handleInputChange("firstName", e.target.value)
                            }
                            onBlur={(e) =>
                                handleFieldBlur("firstName", e.target.value)
                            }
                            placeholder="Entrez votre prénom"
                            required
                            error={getError("firstName")}
                        />

                        <div className="mt-4">
                            <InputField
                                id="lastName"
                                label="Nom"
                                value={profileData.lastName}
                                onChange={(e) =>
                                    handleInputChange(
                                        "lastName",
                                        e.target.value
                                    )
                                }
                                onBlur={(e) =>
                                    handleFieldBlur("lastName", e.target.value)
                                }
                                placeholder="Entrez votre nom"
                                required
                                error={getError("lastName")}
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
                    break;
                case "ROLE_COMPANY":
                    dataToUpdate = { nameCompany: profileData.nameCompany };
                    displayName = profileData.nameCompany;
                    break;
                case "ROLE_FREELANCE":
                    dataToUpdate = {
                        firstName: profileData.firstName,
                        lastName: profileData.lastName,
                    };
                    displayName =
                        `${profileData.firstName} ${profileData.lastName}`.trim();
                    break;
                default:
                    break;
            }

            // Valider toutes les données avant envoi
            const isValid = validateAll(dataToUpdate);
            if (!isValid) {
                setError("Veuillez corriger les erreurs avant de continuer.");
                setSaving(false);
                return;
            }

            console.log("Données envoyées à l'API:", dataToUpdate);

            try {
                // Tenter de mettre à jour le profil utilisateur via l'API
                const response = await updateUserProfile(userId, dataToUpdate);
                console.log("Réponse de l'API:", response);

                // Effacer les erreurs de validation après succès
                clearErrors();

                // Mettre à jour le contexte d'authentification
                updateAuthProfile(displayName);

                onClose();
            } catch (apiError) {
                console.error("Erreur API:", apiError);
                // Utiliser le gestionnaire d'erreurs pour traiter l'erreur API
                handleError(
                    apiError,
                    "Erreur lors de la mise à jour du profil"
                );
            }
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
                    <div className="bg-red-50 p-4 rounded-lg mb-4">
                        <div className="flex items-center">
                            <svg
                                className="h-5 w-5 text-red-400 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-red-600 text-sm">{error}</p>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {getRoleSpecificFields()}

                    <div className="flex justify-center mt-6">
                        <button
                            type="submit"
                            disabled={saving || hasRelevantErrors()}
                            className={`px-6 py-3 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 shadow-md ${
                                saving || hasRelevantErrors()
                                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                                    : "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
                            }`}
                        >
                            {saving ? "Enregistrement..." : "Enregistrer"}
                        </button>
                    </div>
                </form>

                {/* Message d'aide pour les validations */}
                {hasRelevantErrors() && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm flex items-center">
                            <svg
                                className="h-4 w-4 mr-2"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Veuillez corriger les erreurs ci-dessus avant de
                            continuer.
                        </p>
                    </div>
                )}

                {/* Afficher le composant de badge pour les freelances */}
                {userRole === "ROLE_FREELANCE" && (
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <UserBadge />
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProfileModal;
