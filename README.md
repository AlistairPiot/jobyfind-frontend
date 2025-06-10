# 🎨 Jobyfind Frontend

## 📋 Vue d'ensemble

**Application React + Vite** déployée en production sur **Vercel** avec communication API sécurisée.

---

## 🌐 Production

### URLs et accès

-   **🔗 Application** : `https://jobyfind-frontend.vercel.app`
-   **🔧 Backend API** : `https://jobyfind-api.fly.dev/api`
-   **📊 Dashboard Vercel** : [jobyfind-frontend](https://vercel.com/alistairpiots-projects/jobyfind-frontend)
-   **🩺 Status Check** : `curl -I https://jobyfind-frontend.vercel.app`

### Stack technique

```
React 18 + Vite 4 + Tailwind CSS
├── 🔗 API Communication (Axios)
├── 🔐 JWT Authentication
├── 🌐 SPA Routing (React Router v6)
├── 📱 Responsive Design
└── ⚡ Vercel Edge Network
```

---

## 🚀 Déploiement

### Commande rapide

```bash
cd jobyfind-frontend
vercel --prod
```

### Première installation

```bash
# 1. Installer Vercel CLI
npm install -g vercel

# 2. Connexion et déploiement
vercel login
vercel --prod
```

### Variables d'environnement

```bash
# Lister les variables actuelles
vercel env ls

# Ajouter une variable
vercel env add VITE_API_URL production
# Valeur : https://jobyfind-api.fly.dev/api
```

**Variables configurées :**

-   `VITE_API_URL` : URL de l'API backend
-   Détection automatique d'environnement dans `src/services/api.js`

---

## 🧪 Tests de production

### Status Check

```bash
curl -I https://jobyfind-frontend.vercel.app
# ✅ HTTP/2 200 OK
```

### Test de communication API

```bash
# Ouvrir la console navigateur sur https://jobyfind-frontend.vercel.app
fetch('https://jobyfind-api.fly.dev/api/health').then(r => r.json())
# ✅ {"status":"ok","timestamp":"...","version":"1.0.0"}
```

### Test des routes SPA

```bash
# Toutes les routes doivent retourner 200 (rewrites configurés)
curl -I https://jobyfind-frontend.vercel.app/login
curl -I https://jobyfind-frontend.vercel.app/dashboard
curl -I https://jobyfind-frontend.vercel.app/missions
```

---

## 🛠️ Maintenance

### Commandes essentielles

```bash
# 📊 Déploiements et status
vercel list
vercel logs --follow

# 🔄 Redéploiement
vercel --prod

# 🔍 Debug et performance
vercel logs [deployment-url]
vercel inspect [deployment-url]

# 🧹 Nettoyage
vercel remove [old-deployment-url]
```

### Gestion des domaines

```bash
# Voir les domaines et alias
vercel domains list
vercel alias list

# Changer l'alias (rollback rapide)
vercel alias set [deployment-url] jobyfind-frontend.vercel.app
```

### Rollback d'urgence

```bash
# 1. Lister les déploiements
vercel list

# 2. Rollback via alias
vercel alias set https://jobyfind-frontend-[hash-ancien].vercel.app jobyfind-frontend.vercel.app

# 3. Ou redéployer une version précédente
git checkout [commit-précédent]
vercel --prod
git checkout main
```

---

## 🏗️ Développement local

### Installation

```bash
# Dépendances
npm install

# Serveur de développement
npm run dev
# Application disponible sur http://localhost:3000
```

### Scripts disponibles

```bash
npm run dev          # Serveur de développement
npm run build        # Build de production
npm run preview      # Aperçu du build
npm run lint         # Vérification ESLint
```

### Variables d'environnement locales

```bash
# Créer .env.local
VITE_API_URL=http://localhost:8000/api
```

---

## 📚 Documentation complète

### 📖 Guide de déploiement détaillé

**🔗 Voir : [`DEPLOYMENT_FRONTEND.md`](DEPLOYMENT_FRONTEND.md)**

Ce guide contient :

-   ✅ Configuration Vercel complète
-   🔧 Résolution des problèmes techniques
-   🔗 Smart API Detection
-   🔄 Workflows de mise à jour
-   🚨 Procédures de rollback
-   🛠️ Commandes avancées

---

## 🎯 Fonctionnalités principales

### Authentification

-   ✅ Inscription multi-rôles (SCHOOL, COMPANY, FREELANCE)
-   ✅ Connexion JWT avec persistance
-   ✅ Déconnexion automatique sur expiration
-   ✅ Gestion des tokens dans localStorage

### Interface utilisateur

-   ✅ Design responsive (mobile-first)
-   ✅ Navigation fluide (React Router)
-   ✅ Loading states et spinners
-   ✅ Gestion d'erreurs gracieuse
-   ✅ Notifications toast

### Fonctionnalités métier

-   ✅ Gestion des missions (CRUD)
-   ✅ Système de candidatures
-   ✅ Profils utilisateurs
-   ✅ Gestion des compétences
-   ✅ Système de badges
-   ✅ Paiements Stripe (mode test)

---

## 🔧 Configuration technique

### API Communication

```javascript
// src/services/api.js - Détection automatique
const getApiUrl = () => {
    if (window.location.hostname.includes("vercel.app")) {
        return "https://jobyfind-api.fly.dev/api";
    }
    return import.meta.env.VITE_API_URL || "http://localhost:8000/api";
};
```

### Intercepteurs Axios

-   ✅ Ajout automatique du token JWT
-   ✅ Gestion des erreurs 401 (auto-logout)
-   ✅ Gestion des erreurs CORS
-   ✅ Headers sécurisés

### Configuration Vercel (`vercel.json`)

```json
{
    "framework": "vite",
    "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }],
    "headers": [
        /* CORS headers */
    ]
}
```

---

## ✅ Checklist de déploiement

### Avant chaque déploiement

-   [ ] Tests locaux passent (`npm run build`)
-   [ ] Nouvelles variables d'environnement ajoutées
-   [ ] Communication API testée
-   [ ] Code committé et pushé

### Après chaque déploiement

-   [ ] Site accessible (`curl -I https://jobyfind-frontend.vercel.app`)
-   [ ] Console navigateur sans erreurs
-   [ ] Communication API fonctionnelle
-   [ ] Routes SPA accessibles
-   [ ] Tests responsive OK

### Tests fonctionnels complets

-   [ ] Inscription → Success ✅
-   [ ] Connexion → JWT reçu ✅
-   [ ] Navigation → Smooth ✅
-   [ ] API calls → Backend Fly.io ✅
-   [ ] Logout → Token supprimé ✅

---

## 🚨 Support et monitoring

### En cas de problème

1. **Vérifier le status** : `curl -I https://jobyfind-frontend.vercel.app`
2. **Consulter les logs** : `vercel logs --follow`
3. **Tester l'API** : Console navigateur + Network tab
4. **Rollback si urgent** : `vercel alias set [old-deployment] [alias]`

### Monitoring automatique

-   ✅ Vercel Analytics activé
-   ✅ Performance monitoring
-   ✅ Error tracking via logs
-   ✅ Uptime monitoring automatique

### Optimisations actives

-   ✅ CDN mondial Vercel
-   ✅ Compression automatique
-   ✅ Cache optimisé
-   ✅ HTTPS/SSL automatique
-   ✅ Edge functions pour latence réduite

---

## 🔄 Workflow de développement

### Développement quotidien

```bash
# 1. Nouvelle feature
git checkout -b feature/nouvelle-fonctionnalite

# 2. Développement
npm run dev

# 3. Test du build
npm run build && npm run preview

# 4. Preview deployment
vercel  # URL de test

# 5. Merge + production
git checkout main
git merge feature/nouvelle-fonctionnalite
vercel --prod
```

### Hotfix urgent

```bash
# Fix direct sur main
git checkout main
# Modifications...
npm run build  # Vérification rapide
vercel --prod  # Déploiement immédiat
```

---

## 📱 Responsive & Accessibilité

### Breakpoints Tailwind

-   `sm:` 640px+ (mobile landscape)
-   `md:` 768px+ (tablet)
-   `lg:` 1024px+ (desktop)
-   `xl:` 1280px+ (large desktop)

### Fonctionnalités accessibilité

-   ✅ Navigation clavier
-   ✅ Focus visible
-   ✅ Alt text sur images
-   ✅ Contraste couleurs conforme
-   ✅ Screen reader friendly

---

**🎯 Le frontend Jobyfind est live, performant et optimisé pour tous les appareils !**

_Pour tous les détails techniques et workflows avancés, consultez la [documentation complète](DEPLOYMENT_FRONTEND.md)._
