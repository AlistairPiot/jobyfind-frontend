import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createJobApplication } from "../services/api";
import StripePayment from "./StripePayment";

function JobApplicationForm({ mission, onClose, onSuccess }) {
    const { userId } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        contactEmail: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPayment, setShowPayment] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        // Valider le formulaire avant de passer au paiement
        if (
            !formData.firstName ||
            !formData.lastName ||
            !formData.contactEmail
        ) {
            setError("Veuillez remplir tous les champs");
            return;
        }
        setError(null);
        setShowPayment(true);
    };

    const handlePaymentSuccess = async () => {
        setLoading(true);
        setError(null);

        try {
            await createJobApplication({
                user: `/api/users/${userId}`,
                missions: [`/api/missions/${mission.id}`],
                ...formData,
            });
            onSuccess();
            onClose();
        } catch {
            setError(
                "Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer."
            );
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentCancel = () => {
        setShowPayment(false);
    };

    if (showPayment) {
        return (
            <div className="absolute inset-x-0 top-0 bg-white rounded-lg shadow-lg p-6 mb-8 mt-8 max-w-md mx-auto">
                <StripePayment
                    mission={mission}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                />
            </div>
        );
    }

    return (
        <div className="absolute inset-x-0 top-0 bg-white rounded-lg shadow-lg p-6 mb-8 mt-8 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Postuler à la mission : {mission.name}
                </h2>
                <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
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
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Nom
                    </label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
                <div>
                    <label
                        htmlFor="contactEmail"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email de contact
                    </label>
                    <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                        className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center">
                        <svg
                            className="h-5 w-5 text-yellow-400 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <div>
                            <p className="text-sm font-medium text-yellow-800">
                                Paiement requis
                            </p>
                            <p className="text-sm text-yellow-700">
                                Un paiement de 2,00 € sera requis pour finaliser
                                votre candidature.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 p-3 rounded-lg">
                        <p className="text-sm text-red-600 text-center">
                            {error}
                        </p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    >
                        Annuler
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading
                            ? "Envoi en cours..."
                            : "Continuer vers le paiement"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default JobApplicationForm;
