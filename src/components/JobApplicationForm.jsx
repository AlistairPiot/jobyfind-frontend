import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createJobApplication, getUserById } from "../services/api";
import ProfileModal from "./ProfileModal";
import StripePayment from "./StripePayment";

function JobApplicationForm({
    mission,
    onClose,
    onSuccess,
    isRecommended = false,
}) {
    const { userId } = useAuth();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showPayment, setShowPayment] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [applicationSent, setApplicationSent] = useState(false);

    useEffect(() => {
        const checkUserProfile = async () => {
            try {
                const userData = await getUserById(userId);
                setUser(userData);

                // Vérifier si le profil est complet (prénom et nom)
                if (userData.firstName && userData.lastName) {
                    if (isRecommended) {
                        // Mission recommandée : afficher la confirmation
                        setShowConfirmation(true);
                    } else {
                        // Mission normale : aller au paiement
                        setShowPayment(true);
                    }
                } else {
                    // Profil incomplet, afficher un message d'erreur
                    setError(
                        "Votre profil est incomplet. Vous devez renseigner votre prénom et nom pour postuler."
                    );
                }
            } catch {
                setError("Erreur lors de la vérification de votre profil.");
            } finally {
                setLoading(false);
            }
        };

        if (!applicationSent) {
            checkUserProfile();
        }
    }, [userId, isRecommended, applicationSent]);

    const handleDirectApplication = async () => {
        if (applicationSent) return; // Empêcher l'envoi multiple

        setApplicationSent(true);
        setLoading(true);
        setError(null);

        try {
            await createJobApplication({
                user: `/api/users/${userId}`,
                missions: [`/api/missions/${mission.id}`],
                firstName: user.firstName,
                lastName: user.lastName,
                contactEmail: user.email,
            });
            onSuccess();
            onClose();
        } catch {
            setError(
                "Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer."
            );
            setApplicationSent(false); // Permettre de réessayer en cas d'erreur
            setLoading(false);
        }
    };

    const handleConfirmApplication = () => {
        setShowConfirmation(false);
        handleDirectApplication();
    };

    const handlePaymentSuccess = async () => {
        if (applicationSent) return; // Empêcher l'envoi multiple

        setApplicationSent(true);
        setLoading(true);
        setError(null);

        try {
            await createJobApplication({
                user: `/api/users/${userId}`,
                missions: [`/api/missions/${mission.id}`],
                firstName: user.firstName,
                lastName: user.lastName,
                contactEmail: user.email,
            });
            onSuccess();
            onClose();
        } catch {
            setError(
                "Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer."
            );
            setApplicationSent(false); // Permettre de réessayer en cas d'erreur
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentCancel = () => {
        onClose();
    };

    const handleProfileUpdate = () => {
        // Fermer le modal de profil et revérifier le profil utilisateur
        setShowProfileModal(false);
        setLoading(true);

        // Relancer la vérification du profil
        const recheckProfile = async () => {
            try {
                const userData = await getUserById(userId);
                setUser(userData);

                if (userData.firstName && userData.lastName) {
                    setError(null);
                    if (isRecommended) {
                        // Mission recommandée : afficher la confirmation
                        setShowConfirmation(true);
                    } else {
                        // Mission normale : aller au paiement
                        setShowPayment(true);
                    }
                } else {
                    setError(
                        "Votre profil est toujours incomplet. Veuillez renseigner votre prénom et nom."
                    );
                }
            } catch {
                setError("Erreur lors de la vérification de votre profil.");
            } finally {
                setLoading(false);
            }
        };

        recheckProfile();
    };

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto">
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600"></div>
                        <p className="ml-4 text-gray-600">
                            {applicationSent
                                ? "Envoi de votre candidature..."
                                : "Vérification du profil..."}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (showProfileModal) {
        return <ProfileModal onClose={handleProfileUpdate} />;
    }

    if (showConfirmation && isRecommended) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto m-4 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">
                                Confirmer votre candidature
                            </h2>
                            <p className="text-sm text-purple-600 font-medium mt-1">
                                ⭐ Mission recommandée - Candidature gratuite
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg mb-4">
                            <h3 className="font-medium text-blue-800 mb-2">
                                Mission : {mission.name}
                            </h3>
                            {mission.user?.nameCompany && (
                                <p className="text-sm text-blue-700">
                                    Entreprise : {mission.user.nameCompany}
                                </p>
                            )}
                        </div>

                        <div className="bg-green-50 p-4 rounded-lg mb-4">
                            <div className="flex items-center">
                                <svg
                                    className="h-5 w-5 text-green-400 mr-2"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p className="text-sm font-medium text-green-800">
                                        Mission recommandée par votre école
                                    </p>
                                    <p className="text-sm text-green-700">
                                        Aucun frais de candidature ne vous sera
                                        facturé
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-gray-700 text-sm">
                            Êtes-vous sûr(e) de vouloir postuler à cette mission
                            ? Votre candidature sera envoyée immédiatement.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleConfirmApplication}
                            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                        >
                            Confirmer ma candidature
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showPayment) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto m-4 max-h-[90vh] overflow-y-auto">
                    <StripePayment
                        mission={mission}
                        onSuccess={handlePaymentSuccess}
                        onCancel={handlePaymentCancel}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-md mx-auto m-4 max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">
                            Postuler à la mission : {mission.name}
                        </h2>
                        {isRecommended && (
                            <p className="text-sm text-purple-600 font-medium mt-1">
                                ⭐ Mission recommandée - Candidature gratuite
                            </p>
                        )}
                    </div>
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
                            <div>
                                <p className="text-sm font-medium text-red-800">
                                    Profil incomplet
                                </p>
                                <p className="text-sm text-red-700 mt-1">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Fermer
                    </button>
                    {error && (
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Compléter mon profil
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default JobApplicationForm;
