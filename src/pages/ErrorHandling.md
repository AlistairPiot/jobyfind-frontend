# Système de Gestion d'Erreurs - Jobyfind

Ce document explique comment fonctionne le système de gestion d'erreurs mis en place dans l'application Jobyfind.

## Composants Principaux

### 1. Pages d'Erreur

#### NotFound.jsx (`/pages/NotFound.jsx`)

-   Page d'erreur 404 pour les routes non trouvées
-   Design moderne avec options de navigation
-   Liens contextuels selon l'état de connexion de l'utilisateur

#### ErrorPage.jsx (`/pages/ErrorPage.jsx`)

-   Page d'erreur générique pour tous types d'erreurs
-   Paramètres configurables (code, titre, message, description)
-   Icônes adaptées selon le type d'erreur
-   Boutons d'action (actualiser, retour, accueil)

### 2. Gestion des Erreurs JavaScript

#### ErrorBoundary.jsx (`/components/ErrorBoundary.jsx`)

-   Capture les erreurs JavaScript non gérées
-   Logging automatique des erreurs
-   Affichage d'une page d'erreur conviviale
-   Enveloppe toute l'application dans `App.jsx`

### 3. Hook de Gestion d'Erreurs API

#### useErrorHandler.js (`/hooks/useErrorHandler.js`)

-   Hook personnalisé pour gérer les erreurs d'API
-   Navigation automatique vers les pages d'erreur appropriées
-   Gestion des différents codes d'erreur HTTP
-   Fonction `showError` pour les messages temporaires

## Routes d'Erreur

```javascript
// Route pour erreurs génériques avec paramètres
/error

// Route spécifique pour 404
/404

// Route catch-all pour toutes les autres routes
*
```

## Utilisation

### 1. Gestion d'Erreurs API

```javascript
import useErrorHandler from "../hooks/useErrorHandler";

function MonComposant() {
    const { handleError, showError } = useErrorHandler();

    const chargerDonnees = async () => {
        try {
            const data = await apiCall();
            return data;
        } catch (error) {
            handleError(error, "Message personnalisé");
        }
    };

    // Pour les erreurs sans redirection
    const validerFormulaire = () => {
        if (!isValid) {
            showError("Formulaire invalide");
        }
    };
}
```

### 2. Navigation Manuelle vers Pages d'Erreur

```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Erreur 404
navigate("/404");

// Erreur personnalisée
navigate("/error", {
    state: {
        errorCode: "403",
        title: "Accès refusé",
        message: "Vous n'avez pas les permissions nécessaires.",
        description: "Contactez votre administrateur.",
    },
});
```

## Codes d'Erreur Gérés

-   **401** : Non autorisé → Redirection vers `/login`
-   **403** : Accès interdit → Page d'erreur avec message approprié
-   **404** : Non trouvé → Page NotFound
-   **500, 502, 503** : Erreurs serveur → Page d'erreur serveur
-   **NETWORK** : Erreurs de réseau → Page d'erreur de connexion
-   **REQUEST** : Erreurs de requête → Page d'erreur générique

## Fonctionnalités

### Pages d'Erreur

-   ✅ Design responsive et moderne
-   ✅ Messages d'erreur clairs et en français
-   ✅ Boutons d'action pertinents
-   ✅ Liens contextuels selon l'état de connexion
-   ✅ Informations techniques pour le debugging

### ErrorBoundary

-   ✅ Capture automatique des erreurs JavaScript
-   ✅ Logging des erreurs dans la console
-   ✅ Interface utilisateur de fallback
-   ✅ Prêt pour intégration avec services de monitoring

### Hook useErrorHandler

-   ✅ Gestion automatique des codes d'erreur HTTP
-   ✅ Navigation contextuelle selon le type d'erreur
-   ✅ Messages d'erreur personnalisables
-   ✅ Fonction showError pour notifications temporaires

## Installation et Configuration

Le système est déjà configuré et prêt à l'emploi :

1. **ErrorBoundary** enveloppe l'application dans `App.jsx`
2. **Routes d'erreur** configurées dans `router/root.jsx`
3. **Hook useErrorHandler** disponible dans `hooks/useErrorHandler.js`

## Personnalisation

### Modifier les Messages d'Erreur

Éditez les fichiers `NotFound.jsx` et `ErrorPage.jsx` pour personnaliser les messages.

### Ajouter un Service de Monitoring

Dans `ErrorBoundary.jsx`, décommentez et configurez l'envoi d'erreurs vers un service externe.

### Personnaliser la Gestion d'Erreurs API

Modifiez `useErrorHandler.js` pour ajouter de nouveaux codes d'erreur ou changer le comportement.

## Bonnes Pratiques

1. **Toujours utiliser le hook** `useErrorHandler` pour les appels API
2. **Messages d'erreur explicites** pour l'utilisateur final
3. **Logging détaillé** pour les développeurs
4. **Navigation contextuelle** selon l'état de l'utilisateur
5. **Tests des cas d'erreur** pour valider le comportement

---

_Ce système de gestion d'erreurs offre une expérience utilisateur cohérente et aide au debugging en développement._
