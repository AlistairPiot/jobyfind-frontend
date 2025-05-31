# Configuration Stripe pour JobyFind

## 🚀 Installation et Configuration

### 1. Prérequis

-   Compte Stripe (gratuit) : https://stripe.com
-   Node.js et npm/yarn installés

### 2. Configuration des clés Stripe

1. **Créer un compte Stripe** (si pas déjà fait)

    - Allez sur https://stripe.com
    - Créez votre compte

2. **Récupérer vos clés de test**

    - Connectez-vous à votre dashboard Stripe
    - Allez dans `Developers > API keys`
    - Copiez votre **clé publique de test** (commence par `pk_test_`)

3. **Configurer le projet**
    - Ouvrez le fichier `src/config/stripe.js`
    - Remplacez `pk_test_51234567890abcdef` par votre vraie clé publique de test

```javascript
export const STRIPE_CONFIG = {
    publishableKey: "pk_test_VOTRE_VRAIE_CLE_PUBLIQUE_ICI",
    // ... reste de la configuration
};
```

### 3. Test du paiement

#### Cartes de test Stripe

Utilisez ces numéros de carte pour tester :

-   **Paiement réussi** : `4242 4242 4242 4242`
-   **Paiement refusé** : `4000 0000 0000 0002`
-   **Carte expirée** : `4000 0000 0000 0069`

**Autres informations de test :**

-   Date d'expiration : N'importe quelle date future (ex: 12/25)
-   CVC : N'importe quel code à 3 chiffres (ex: 123)
-   Code postal : N'importe quel code (ex: 12345)

### 4. Fonctionnement actuel

1. **Processus de candidature :**

    - Le freelance remplit le formulaire de candidature
    - Il clique sur "Continuer vers le paiement"
    - L'interface de paiement Stripe s'affiche
    - Il saisit ses informations de carte
    - Le paiement de 2€ est traité
    - La candidature est envoyée

2. **Mode test activé :**
    - Aucun vrai paiement n'est effectué
    - Les transactions sont simulées
    - Parfait pour le développement et les tests

### 5. Passage en production

⚠️ **Important** : Pour passer en production, vous devrez :

1. **Activer votre compte Stripe**

    - Fournir les informations de votre entreprise
    - Vérifier votre identité

2. **Utiliser les clés de production**

    - Remplacer `pk_test_` par `pk_live_`
    - Configurer un backend pour traiter les paiements

3. **Implémenter un backend sécurisé**
    - Créer des endpoints pour créer les PaymentIntents
    - Gérer les webhooks Stripe
    - Sauvegarder les transactions en base de données

### 6. Structure des fichiers

```
src/
├── components/
│   ├── StripePayment.jsx      # Interface de paiement
│   └── JobApplicationForm.jsx # Formulaire avec intégration paiement
├── config/
│   └── stripe.js             # Configuration Stripe
```

### 7. Dépendances utilisées

```json
{
    "@stripe/react-stripe-js": "^3.7.0",
    "@stripe/stripe-js": "^7.3.1"
}
```

### 8. Logs et débogage

Ouvrez la console du navigateur pour voir :

-   Les tokens de paiement générés
-   Les simulations de paiement
-   Les erreurs éventuelles

### 9. Personnalisation

Vous pouvez modifier :

-   Le montant dans `src/config/stripe.js` (propriété `applicationFee`)
-   Les styles de l'interface de paiement
-   Les messages d'erreur et de succès

---

## 🔧 Développement

### Démarrer le projet

```bash
npm run dev
# ou
yarn dev
```

### Tester une candidature

1. Allez sur `/dashboard/freelance`
2. Cliquez sur "Voir les missions"
3. Sélectionnez une mission
4. Cliquez sur "Postuler à cette mission"
5. Remplissez le formulaire
6. Testez le paiement avec `4242 4242 4242 4242`

---

## 📞 Support

En cas de problème :

1. Vérifiez la console du navigateur
2. Vérifiez que vos clés Stripe sont correctes
3. Consultez la documentation Stripe : https://stripe.com/docs
