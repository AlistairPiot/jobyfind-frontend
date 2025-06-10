# 🎨 Déploiement Frontend Jobyfind sur Vercel

## 📋 Vue d'ensemble

**Stack déployée :**

-   **Frontend** : React + Vite sur Vercel
-   **URL** : `https://jobyfind-frontend.vercel.app`
-   **API Backend** : `https://jobyfind-api.fly.dev/api`

---

## ⚙️ 1. Configuration Vercel

### Fichiers de configuration créés

#### `vercel.json`

```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "devCommand": "npm run dev",
    "installCommand": "npm install",
    "framework": "vite",
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ],
    "headers": [
        {
            "source": "/api/(.*)",
            "headers": [
                {
                    "key": "Access-Control-Allow-Origin",
                    "value": "*"
                },
                {
                    "key": "Access-Control-Allow-Methods",
                    "value": "GET, POST, PUT, DELETE, OPTIONS"
                },
                {
                    "key": "Access-Control-Allow-Headers",
                    "value": "Content-Type, Authorization"
                }
            ]
        }
    ]
}
```

#### `.env`

```env
VITE_API_URL=https://jobyfind-api.fly.dev/api
```

---

## 🔗 2. Configuration de l'API - Smart Detection

### Problème résolu : Variables d'environnement sur Vercel

Vercel ne prenait pas en compte les variables d'environnement Vite correctement. Solution : détection automatique d'environnement.

#### Modification de `src/services/api.js`

```javascript
import axios from "axios";

// L'URL de l'API, utilise la variable d'environnement ou l'URL de production
const getApiUrl = () => {
    // Si on est sur Vercel (production), utiliser l'API de production
    if (window.location.hostname.includes("vercel.app")) {
        return "https://jobyfind-api.fly.dev/api";
    }
    // Sinon utiliser la variable d'environnement ou localhost
    return import.meta.env.VITE_API_URL || "http://localhost:8000/api";
};

const API_URL = getApiUrl();

// Création de l'instance Axios
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ➕ Intercepteur pour ajouter le token Authorization à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("authToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔁 Intercepteur de réponse pour détecter les erreurs 401
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token invalide ou expiré
            localStorage.removeItem("authToken");
            window.location.href = "/login"; // Redirection vers la page de connexion
        }
        return Promise.reject(error);
    }
);

export default api;
```

### Logique de détection d'environnement

-   **Production (Vercel)** : `hostname.includes('vercel.app')` → `https://jobyfind-api.fly.dev/api`
-   **Développement local** : `import.meta.env.VITE_API_URL` ou `http://localhost:8000/api`

---

## 🚀 3. Processus de déploiement

### Installation Vercel CLI

```bash
npm install -g vercel
```

### Connexion à Vercel

```bash
vercel login
# → Connexion via GitHub (alistair.piot@gmail.com)
```

### Déploiement initial

```bash
cd jobyfind-frontend
vercel --prod
```

**Configuration lors du premier déploiement :**

-   **Scope** : `alistairpiot's projects`
-   **Projet** : Nouveau → `jobyfind-frontend`
-   **Répertoire** : `./`
-   **Framework** : Vite (auto-détecté)
-   **Settings** : Configuration Vite détectée automatiquement

**Résultat** : `https://jobyfind-frontend-[hash]-alistairpiots-projects.vercel.app`

### Création d'un alias personnalisé

```bash
vercel alias set https://jobyfind-frontend-[hash]-alistairpiots-projects.vercel.app jobyfind-frontend.vercel.app
```

**URL finale** : `https://jobyfind-frontend.vercel.app`

---

## 🔧 4. Résolution des problèmes rencontrés

### Problème 1 : Variable d'environnement ignorée

**Symptôme** :

```
POST https://jobyfind-frontend.vercel.app/q/register 405 (Method Not Allowed)
```

Frontend faisait encore des requêtes vers `localhost:8000`

**Cause** : Vite ne prend pas en compte les variables d'environnement sur Vercel lors du build
**Solution** : Détection automatique basée sur le hostname dans `api.js`

### Problème 2 : Cache du navigateur persistant

**Symptôme** : Ancien code JS encore chargé après redéploiement

```
index-S4RxTP10.js (ancien) au lieu de index-BXkFtIxH.js (nouveau)
```

**Cause** : Cache agressif du navigateur
**Solutions** :

-   Hard refresh (Ctrl+Shift+R)
-   DevTools → Network → "Disable cache"
-   Vider le cache navigateur

### Problème 3 : CORS depuis le nouveau domaine

**Symptôme** : Erreurs CORS depuis vercel.app
**Cause** : Backend configuré pour localhost uniquement
**Solution** : Mise à jour de `CORS_ALLOW_ORIGIN` sur Fly.io

```bash
flyctl secrets set CORS_ALLOW_ORIGIN="https://jobyfind-frontend.vercel.app"
```

### Problème 4 : Requêtes vers mauvaise URL

**Symptôme** : Requêtes vers `/q/register` au lieu de `/api/register`
**Cause** : Configuration d'URL incorrecte
**Solution** : Validation de l'URL dans la logique de détection

---

## 📊 5. Monitoring et maintenance

### URLs importantes

-   **Application** : https://jobyfind-frontend.vercel.app
-   **Dashboard Vercel** : https://vercel.com/alistairpiots-projects/jobyfind-frontend
-   **Monitoring** : Automatique via Vercel Analytics
-   **Logs** : Dashboard Vercel (Functions tab)

### Commandes utiles

```bash
# Redéployer
vercel --prod

# Voir les déploiements
vercel list

# Voir les logs du projet
vercel logs [deployment-url]

# Créer un alias
vercel alias set [deployment-url] [alias]

# Voir les variables d'environnement
vercel env ls

# Ajouter une variable d'environnement
vercel env add VITE_API_URL production

# Supprimer un déploiement
vercel remove [deployment-url]

# Voir les domaines
vercel domains list
```

---

## 🧪 6. Tests de validation

### Test d'accès au frontend

```bash
curl -I https://jobyfind-frontend.vercel.app
# Réponse attendue : HTTP/2 200
```

### Test de l'API JavaScript

Ouvrir la console navigateur sur https://jobyfind-frontend.vercel.app :

```javascript
// Vérifier l'URL de l'API
console.log(window.location.hostname); // jobyfind-frontend.vercel.app
// Doit pointer vers https://jobyfind-api.fly.dev/api
```

### Tests fonctionnels validés

-   ✅ **Inscription d'utilisateur** : Formulaire → API → Succès
-   ✅ **Connexion JWT** : Login → Token → Authentification
-   ✅ **Requêtes API** : Frontend → Backend Fly.io
-   ✅ **CORS** : Communication cross-origin autorisée
-   ✅ **Routing SPA** : React Router fonctionne avec rewrites
-   ✅ **Responsive** : Interface adaptative mobile/desktop

---

## 🔄 WORKFLOWS DE MISE À JOUR PRODUCTION

### 📋 Vue d'ensemble des changements Frontend

Selon le type de modification frontend, voici les étapes à suivre pour mettre à jour votre application React en production sur Vercel :

---

## 🎨 1. Changements FRONTEND purs (UI/UX)

### Modifications composants React (pas d'API)

```bash
# 1. Développement local
cd jobyfind-frontend
# Faire vos modifications React/CSS...

# 2. Test local
npm run dev
# Tester l'interface sur localhost:3000

# 3. Build test
npm run build
npm run preview
# Vérifier le build de production

# 4. Déploiement production
vercel --prod
# ✅ Déploiement automatique sur Vercel

# 5. Validation production
curl -I https://jobyfind-frontend.vercel.app
# Vérifier que le site répond (Status 200)
```

### Modifications CSS/Tailwind

```bash
# 1. Modifier les styles Tailwind/CSS
# 2. Test local avec hot reload
npm run dev

# 3. Vérifier le build (purge CSS automatique)
npm run build

# 4. Déployer
vercel --prod

# 5. Vérifier que les styles sont appliqués
# Ouvrir DevTools → Network → Vérifier les CSS chargés
```

### Ajout de nouvelles pages/routes

```bash
# 1. Créer nouveaux composants/pages
# src/pages/NouvellePage.jsx

# 2. Ajouter les routes dans App.jsx
# <Route path="/nouvelle-page" element={<NouvellePage />} />

# 3. Tester navigation locale
npm run dev

# 4. Déployer (rewrites Vercel gèrent automatiquement)
vercel --prod

# 5. Tester les routes en prod
curl -I https://jobyfind-frontend.vercel.app/nouvelle-page
```

---

## 🔗 2. Changements API/COMMUNICATION Backend

### Nouveaux endpoints à consommer

```bash
# 1. BACKEND D'ABORD (s'assurer que l'API est prête)
curl https://jobyfind-api.fly.dev/api/nouveau-endpoint

# 2. Modifier services/api.js ou composants concernés
# Ajouter les nouvelles fonctions d'appel API

# 3. Test local avec API production
npm run dev
# Tester les nouveaux appels API

# 4. Déployer le frontend
vercel --prod

# 5. VALIDATION COMPLÈTE
# Tester le flux complet sur https://jobyfind-frontend.vercel.app
```

### Modifications authentification/JWT

```bash
# 1. Modifier la logique d'auth dans src/services/api.js
# Ou dans les composants d'authentification

# 2. Test local complet (inscription/connexion)
npm run dev

# 3. Tester avec API production
# S'assurer que les tokens fonctionnent

# 4. Déploiement
vercel --prod

# 5. Tests spécifiques authentification
# Inscription → Login → Navigation avec token
```

### Changements CORS/Variables environnement

```bash
# 1. Si nouveau domaine/URL backend
# Modifier la logique dans src/services/api.js

# 2. Si nouvelles variables Vercel nécessaires
vercel env add VITE_NOUVELLE_VAR production

# 3. Redéployer après ajout variables
vercel --prod

# 4. Vérifier dans console navigateur
# console.log(import.meta.env.VITE_NOUVELLE_VAR)
```

---

## 📦 3. Changements DÉPENDANCES

### Nouvelles dépendances npm

```bash
# 1. Installer localement
npm install nouvelle-librairie

# 2. Vérifier package.json et package-lock.json
git add package.json package-lock.json

# 3. Tester que l'import fonctionne
npm run dev

# 4. Vérifier le build
npm run build
# S'assurer pas d'erreurs de build

# 5. Déployer
vercel --prod

# 6. Vérifier en prod que la lib est bien bundlée
# DevTools → Network → Vérifier les JS chargés
```

### Mise à jour React/Vite/dépendances majeures

```bash
# ⚠️ ATTENTION : Tests approfondis requis !

# 1. Backup du package.json
cp package.json package.json.backup

# 2. Mise à jour progressive
npm update
# Ou pour version majeure : npm install react@latest

# 3. Tests complets en local
npm run dev
npm run build
npm run preview

# 4. Si tout fonctionne, déployer
vercel --prod

# 5. En cas de problème, rollback :
cp package.json.backup package.json
npm install
```

### Ajout outils dev (ESLint, Prettier, etc.)

```bash
# 1. Install en devDependencies
npm install -D nouvel-outil-dev

# 2. Configuration (eslintrc, prettierrc, etc.)
# Créer/modifier les fichiers de config

# 3. Tester que ça n'impacte pas le build prod
npm run build

# 4. Déployer (devDeps pas incluses dans le build)
vercel --prod
```

---

## 🚀 4. Changements CONFIGURATION

### Modifications vite.config.js

```bash
# 1. Modifier la config Vite
# Plugins, optimisations, aliases, etc.

# 2. Test local
npm run dev  # Dev server
npm run build  # Build production

# 3. Test du build
npm run preview

# 4. Si tout OK, déployer
vercel --prod

# 5. Surveiller les performances
# Vercel Analytics pour vérifier l'impact
```

### Modifications vercel.json

```bash
# 1. Modifier vercel.json
# Rewrites, headers, redirects, etc.

# 2. Test local du build
npm run build
npm run preview

# 3. Déploiement (la config sera appliquée)
vercel --prod

# 4. Tester les changements spécifiques
# Rewrites : Tester les routes SPA
# Headers : Vérifier avec curl -I
# Redirects : Tester les anciennes URLs
```

### Variables d'environnement

```bash
# 1. Ajouter/modifier variables Vercel
vercel env add VITE_NOUVELLE_VAR production
vercel env add VITE_NOUVELLE_VAR preview
vercel env add VITE_NOUVELLE_VAR development

# 2. Modifier le code pour utiliser la variable
# import.meta.env.VITE_NOUVELLE_VAR

# 3. Redéployer (obligatoire après ajout env vars)
vercel --prod

# 4. Vérifier en prod
# Console navigateur → Variables bien définies
```

---

## 🎯 5. Changements FULL-STACK coordonnés

### Nouvelle fonctionnalité complète

```bash
# 1. BACKEND EN PREMIER
# S'assurer que l'API backend est déployée et fonctionnelle

# 2. ADAPTER LE FRONTEND
cd jobyfind-frontend
# Créer/modifier composants pour la nouvelle fonctionnalité
# Ajouter appels API correspondants

# 3. TESTER avec API production
npm run dev
# Tester la communication avec l'API live

# 4. DÉPLOYER FRONTEND
vercel --prod

# 5. VALIDATION COMPLÈTE
# Tester le flux complet sur https://jobyfind-frontend.vercel.app
```

### Changements de schéma de données

```bash
# 1. S'ASSURER que backend + DB sont mis à jour
curl https://jobyfind-api.fly.dev/api/endpoint-concerne

# 2. Adapter les interfaces TypeScript/PropTypes (si utilisés)
# 3. Modifier les composants qui consomment ces données
# 4. Tester avec nouvelles données

# 5. Déployer
vercel --prod

# 6. Validation sur données réelles
# Vérifier que l'affichage est correct avec nouvelles données
```

---

## 🚨 6. ROLLBACK / RETOUR ARRIÈRE Frontend

### Rollback rapide (alias)

```bash
# 1. Lister les déploiements précédents
vercel list

# 2. Identifier le bon déploiement
# Ex: https://jobyfind-frontend-[hash-ancien].vercel.app

# 3. Changer l'alias vers l'ancien déploiement
vercel alias set https://jobyfind-frontend-[hash-ancien].vercel.app jobyfind-frontend.vercel.app

# 4. Vérifier que le rollback fonctionne
curl -I https://jobyfind-frontend.vercel.app
```

### Rollback par redéploiement

```bash
# 1. Identifier le commit à rollback
git log --oneline

# 2. Checkout du commit précédent
git checkout [commit-hash-ancien]

# 3. Redéployer cette version
vercel --prod

# 4. Revenir sur main
git checkout main

# 5. Fix forward (corriger le problème au lieu de rester sur ancien)
# Faire les corrections nécessaires puis redéployer
```

### Rollback des variables d'environnement

```bash
# 1. Voir les variables actuelles
vercel env ls

# 2. Supprimer les problématiques
vercel env rm VITE_VARIABLE_PROBLEME production

# 3. Redéployer sans la variable
vercel --prod

# 4. Ou restaurer l'ancienne valeur
vercel env add VITE_VARIABLE_PROBLEME production
# Saisir l'ancienne valeur
vercel --prod
```

---

## 🛠️ 7. COMMANDES UTILES FRONTEND

### Surveillance et monitoring

```bash
# 📊 DÉPLOIEMENTS ET STATUS
vercel list                                    # Tous les déploiements
vercel --help                                  # Aide Vercel CLI
vercel logs [deployment-url]                   # Logs d'un déploiement
vercel logs --follow                           # Logs temps réel

# 🔍 DEBUGGING
vercel dev                                     # Serveur de dev Vercel (simule prod)
vercel logs | grep ERROR                       # Filtrer les erreurs
vercel inspect [deployment-url]                # Détails d'un déploiement

# 📈 PERFORMANCE
vercel ls --meta                               # Métadonnées des déploiements
npm run build -- --analyze                    # Analyse du bundle (si configuré)
```

### Gestion des domaines et alias

```bash
# 🌐 DOMAINES
vercel domains list                            # Domaines configurés
vercel domains add mondomaine.com              # Ajouter domaine custom
vercel alias set [deployment] mondomaine.com  # Pointer domaine vers déploiement

# 🔗 ALIAS
vercel alias list                              # Tous les alias
vercel alias set [deployment-url] [alias]     # Créer alias
vercel alias rm [alias]                        # Supprimer alias
```

### Variables d'environnement

```bash
# 🌍 VARIABLES ENVIRONNEMENT
vercel env ls                                  # Lister toutes les variables
vercel env add VITE_VAR production             # Ajouter variable production
vercel env add VITE_VAR preview                # Ajouter variable preview
vercel env add VITE_VAR development            # Ajouter variable dev
vercel env rm VITE_VAR production              # Supprimer variable
vercel env pull .env.local                     # Télécharger variables localement
```

### Tests et validation

```bash
# 🩺 HEALTH CHECKS
curl -I https://jobyfind-frontend.vercel.app            # Status site
curl https://jobyfind-frontend.vercel.app/manifest.json # Vérifier PWA (si applicable)

# 🔐 TEST API COMMUNICATION
# Ouvrir https://jobyfind-frontend.vercel.app
# Console navigateur :
# fetch('https://jobyfind-api.fly.dev/api/health').then(r => r.json())

# 🌐 TEST ROUTING SPA
curl -I https://jobyfind-frontend.vercel.app/login      # Route React
curl -I https://jobyfind-frontend.vercel.app/dashboard   # Route protégée
curl -I https://jobyfind-frontend.vercel.app/inexistante # Doit rediriger vers 200 (SPA)
```

### Nettoyage et maintenance

```bash
# 🧹 NETTOYAGE
vercel remove [deployment-url]                 # Supprimer déploiement
vercel list | grep "old"                       # Identifier vieux déploiements

# 📊 OPTIMISATION
npm run build                                  # Vérifier taille du build
npm audit                                      # Vérifier vulnérabilités
npm outdated                                   # Voir packages à mettre à jour

# 🔄 CACHE
# Hard refresh navigateur (Ctrl+Shift+R)
# Vercel gère automatiquement cache/invalidation
```

---

## ✅ 8. CHECKLIST DE VALIDATION POST-DÉPLOIEMENT Frontend

### Après chaque déploiement Frontend

-   [ ] `curl -I https://jobyfind-frontend.vercel.app` → Status 200
-   [ ] Site charge correctement dans navigateur
-   [ ] Console navigateur → Pas d'erreurs JavaScript
-   [ ] Toutes les pages principales accessibles
-   [ ] CSS/styles appliqués correctement
-   [ ] Images et assets chargent
-   [ ] Tests responsive (mobile/tablet/desktop)

### Communication avec API Backend

-   [ ] Appels API fonctionnent (Network tab dans DevTools)
-   [ ] Authentification/JWT gérée correctement
-   [ ] CORS : Pas d'erreurs cross-origin
-   [ ] Variables d'environnement bien définies
-   [ ] Messages d'erreur API affichés proprement

### Tests fonctionnels complets

-   [ ] Inscription utilisateur → Success
-   [ ] Connexion → Token reçu et stocké
-   [ ] Navigation entre pages → Smooth
-   [ ] Données affichées correctement
-   [ ] Formulaires soumis → API appelée
-   [ ] Logout → Token supprimé
-   [ ] Accès pages protégées → Redirection si pas connecté

### Performance et optimisation

-   [ ] Temps de chargement initial < 3s
-   [ ] Images optimisées (WebP si possible)
-   [ ] JS/CSS minifiés dans Network tab
-   [ ] Pas de requêtes inutiles/doublons
-   [ ] Cache navigateur fonctionne (304 codes)

---

## 🎯 RÉSUMÉ DES COMMANDES ESSENTIELLES FRONTEND

```bash
# 🚀 DÉPLOIEMENT
vercel --prod                                  # Déployer en production
vercel                                         # Déployer en preview

# 🔍 MONITORING
vercel list                                    # Voir tous les déploiements
vercel logs --follow                           # Logs temps réel
curl -I https://jobyfind-frontend.vercel.app   # Quick health check

# 🌍 VARIABLES
vercel env ls                                  # Lister variables
vercel env add VITE_KEY production             # Ajouter variable
vercel env rm VITE_KEY production              # Supprimer variable

# 🔄 ROLLBACK
vercel alias set [old-deployment] jobyfind-frontend.vercel.app  # Rollback rapide
vercel remove [deployment-url]                 # Nettoyer ancien déploiement

# 🛠️ DÉVELOPPEMENT
npm run dev                                    # Dev local
npm run build                                  # Build production
npm run preview                                # Test du build local
vercel dev                                     # Dev avec simulation Vercel
```

---

## 🎯 WORKFLOW RECOMMANDÉ pour développement continu

### Développement quotidien

```bash
# 1. Branche feature
git checkout -b feature/nouvelle-fonctionnalité

# 2. Développement local
npm run dev

# 3. Test build avant commit
npm run build && npm run preview

# 4. Preview deployment pour test
vercel
# → URL preview pour tests

# 5. Si OK, merge et déploiement prod
git checkout main
git merge feature/nouvelle-fonctionnalité
vercel --prod
```

### Hotfix urgent

```bash
# 1. Hotfix directement sur main
git checkout main

# 2. Fix rapide
# Modifier le code...

# 3. Test rapide
npm run build

# 4. Déploiement immédiat
vercel --prod

# 5. Validation
curl -I https://jobyfind-frontend.vercel.app
```

**✅ Avec ces workflows frontend, vous maîtrisez maintenant tous les aspects de la maintenance et des mises à jour de votre application React en production sur Vercel !**

```

```
