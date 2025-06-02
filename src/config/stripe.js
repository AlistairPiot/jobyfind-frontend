// Configuration Stripe pour le mode test
export const STRIPE_CONFIG = {
    // 🔑 REMPLACEZ CETTE CLÉ PAR VOTRE PROPRE CLÉ PUBLIQUE DE TEST
    // Allez sur https://dashboard.stripe.com/test/apikeys
    // Copiez votre "Publishable key" (pk_test_...)
    publishableKey:
        "pk_test_51RVTDzFwCbijPuE52MMCs2HoMTKud1IvgouN5ccHd7sBd5I4b2O7TsPFZU1I1bGTfdBYOjoxtDkjDRE15p3xWlqp000t61Y2nz",

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
// 4. Remplacez "VOTRE_CLE_PUBLIQUE_ICI" ci-dessus

// ✅ Une fois configuré, vous pourrez voir tous vos paiements de test dans le dashboard Stripe
