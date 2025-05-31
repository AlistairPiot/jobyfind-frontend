import {
    CardElement,
    Elements,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { STRIPE_CONFIG } from "../config/stripe";

// Initialiser Stripe avec la clé publique
const stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);

const CheckoutForm = ({ mission, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        if (!stripe || !elements) {
            setError("Stripe n'est pas encore chargé");
            setLoading(false);
            return;
        }

        const cardElement = elements.getElement(CardElement);

        // Créer un token de paiement
        const { error: tokenError, token } = await stripe.createToken(
            cardElement
        );

        if (tokenError) {
            setError(tokenError.message);
            setLoading(false);
            return;
        }

        // En mode test, on simule un paiement réussi
        // Dans un vrai environnement, vous enverriez le token à votre backend
        console.log("Token de paiement créé:", token);
        console.log(
            "Simulation du paiement de",
            STRIPE_CONFIG.applicationFee / 100,
            "€"
        );

        // Simuler le traitement du paiement
        setTimeout(() => {
            console.log(
                "✅ Paiement simulé réussi pour la mission:",
                mission.name
            );
            onSuccess();
            setLoading(false);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Finaliser votre candidature
                </h3>
                <p className="text-sm text-gray-600">
                    Mission :{" "}
                    <span className="font-medium">{mission.name}</span>
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium text-blue-800">
                            Frais de candidature
                        </p>
                        <p className="text-sm text-blue-600">
                            {STRIPE_CONFIG.description}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-blue-800">
                            {(STRIPE_CONFIG.applicationFee / 100).toFixed(2)} €
                        </p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Informations de carte bancaire
                    </label>
                    <div className="border border-gray-300 rounded-lg p-3 bg-white">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#374151",
                                        fontFamily: "system-ui, sans-serif",
                                        "::placeholder": {
                                            color: "#9CA3AF",
                                        },
                                    },
                                    invalid: {
                                        color: "#EF4444",
                                    },
                                },
                            }}
                        />
                    </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-start">
                        <svg
                            className="h-5 w-5 text-yellow-400 mt-0.5 mr-2 flex-shrink-0"
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
                                Mode test activé
                            </p>
                            <p className="text-xs text-yellow-700 mt-1">
                                Utilisez le numéro de carte test : 4242 4242
                                4242 4242
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
                    >
                        Retour
                    </button>
                    <button
                        type="submit"
                        disabled={!stripe || loading}
                        className="px-6 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                        {loading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                                Traitement...
                            </>
                        ) : (
                            `Payer ${(
                                STRIPE_CONFIG.applicationFee / 100
                            ).toFixed(2)} €`
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const StripePayment = ({ mission, onSuccess, onCancel }) => {
    return (
        <Elements stripe={stripePromise}>
            <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
                <CheckoutForm
                    mission={mission}
                    onSuccess={onSuccess}
                    onCancel={onCancel}
                />
            </div>
        </Elements>
    );
};

export default StripePayment;
