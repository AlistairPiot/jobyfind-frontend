// Configuration Stripe pour le mode test
export const STRIPE_CONFIG = {
    // Clé publique de test Stripe (valide pour les tests)
    // ⚠️ Pour la production, remplacez par votre propre clé depuis https://dashboard.stripe.com/test/apikeys
    publishableKey: "pk_test_TYooMQauvdEDq54NiTphI7jx",

    // Montant en centimes (2€ = 200 centimes)
    applicationFee: 200,

    // Devise
    currency: "eur",

    // Description du paiement
    description: "Frais de candidature JobyFind",
};

// 📝 Instructions pour obtenir votre propre clé :
// 1. Créez un compte sur https://stripe.com (gratuit)
// 2. Allez dans Dashboard > Developers > API keys
// 3. Copiez votre clé publique de test (pk_test_...)
// 4. Remplacez la valeur ci-dessus

// ✅ Cette clé de test fonctionne pour les démonstrations
