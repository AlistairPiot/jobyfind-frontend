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

        try {
            // Étape 1 : Créer un PaymentIntent via le backend
            console.log("🚀 Création du PaymentIntent via le backend...");

            const paymentIntentResponse = await fetch(
                "http://localhost:8000/api/payment/create-payment-intent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        amount: STRIPE_CONFIG.applicationFee,
                        mission_name: mission.name,
                        mission_id: mission.id || "unknown",
                        name: `Candidat pour ${mission.name}`,
                        email: "candidat@jobyfind.com",
                    }),
                }
            );

            if (!paymentIntentResponse.ok) {
                const errorData = await paymentIntentResponse.json();
                throw new Error(
                    errorData.error ||
                        "Erreur lors de la création du PaymentIntent"
                );
            }

            const { client_secret, customer_id, payment_intent_id } =
                await paymentIntentResponse.json();
            console.log("✅ PaymentIntent créé:", payment_intent_id);
            console.log("✅ Customer créé:", customer_id);

            // Étape 2 : Confirmer le paiement avec Stripe
            console.log("💳 Confirmation du paiement...");

            const { error: confirmError, paymentIntent } =
                await stripe.confirmCardPayment(client_secret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: `Candidat pour ${mission.name}`,
                            email: "candidat@jobyfind.com",
                        },
                    },
                });

            if (confirmError) {
                setError(confirmError.message);
                setLoading(false);
                return;
            }

            // Étape 3 : Vérifier le statut final
            if (paymentIntent.status === "succeeded") {
                console.log("🎉 Paiement réussi !");
                console.log(
                    "💰 Montant payé:",
                    paymentIntent.amount / 100,
                    "€"
                );
                console.log("🎯 Mission:", mission.name);
                console.log("👤 Customer ID:", customer_id);
                console.log("🆔 PaymentIntent ID:", paymentIntent.id);

                // Afficher un message de succès
                alert(`🎉 Paiement réussi !

💰 Montant: ${paymentIntent.amount / 100}€
🎯 Mission: ${mission.name}
🆔 Transaction ID: ${paymentIntent.id}
👤 Customer ID: ${customer_id}

✅ MAINTENANT VISIBLE DANS VOTRE DASHBOARD STRIPE :
1. Dashboard > Payments (transaction complète)
2. Dashboard > Customers (nouveau customer)
3. Developers > Events (événements de paiement)
4. Developers > Logs (toutes les requêtes API)

Allez vérifier votre dashboard Stripe ! 🚀`);

                onSuccess();
            } else {
                setError(
                    `Paiement non confirmé. Statut: ${paymentIntent.status}`
                );
            }
        } catch (error) {
            console.error("❌ Erreur lors du paiement:", error);
            setError(
                error.message ||
                    "Une erreur est survenue lors du traitement du paiement"
            );
        } finally {
            setLoading(false);
        }
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

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start">
                    <svg
                        className="h-5 w-5 text-green-400 mt-0.5 mr-2 flex-shrink-0"
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
                            Paiement complet via backend !
                        </p>
                        <p className="text-xs text-green-700 mt-1">
                            Ce paiement sera visible dans toutes les sections de
                            votre dashboard Stripe ! Carte de test : 4242 4242
                            4242 4242
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
                                Traitement du paiement...
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
