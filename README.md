# Site de Manon Pontasse

Site vitrine de Manon Pontasse, éducatrice spécialisée indépendante à Strasbourg et dans l’Eurométropole Sud.

## Installation

```bash
npm install
npm run dev
```

Créer `.env.local` à partir de `.env.example`, puis renseigner l’adresse Formspree et l’identifiant Google Analytics. Sans adresse Formspree, le formulaire est désactivé proprement et le contact direct par email reste disponible.

## Vérifications

```bash
npm run lint
npm run format:check
npm run test
npm run build
npm audit
```

## Organisation

- `public/content.json` : textes et variantes par profil ;
- `src/assets` : images importées par l’application ;
- `src/components` : composants d’interface réutilisables ;
- `src/components/contact` : coordonnées et formulaire de contact ;
- `src/components/process` : frise retournable et principes de l’approche ;
- `src/content` : sélection des contenus selon le profil ;
- `src/context/profile` : sélection et mémorisation du profil ;
- `src/data/serviceAreaMapData.js` : communes et tracé de la zone d’intervention ;
- `src/hooks` : comportements React réutilisables ;
- `src/providers/ContentProvider.jsx` : chargement et mise à disposition des contenus ;
- `src/components/ServiceArea.jsx` : carte et modalités d’intervention ;
- `src/components/CookieConsent.jsx` : consentement Analytics ;
- `src/pages` : pages du site ;
- `src/styles` : fondations visuelles communes.

## Consentement et statistiques

Google Analytics n’est chargé qu’après une acceptation explicite. Son identifiant est fourni par `VITE_GA_MEASUREMENT_ID`. Le choix est conservé sous la clé `mp_cookie_consent`. Le lien « Gérer mes cookies » du footer permet de le modifier.

## Déploiement

`vercel.json` contient la réécriture nécessaire au routage React. Avant le déploiement, renseigner `VITE_FORMSPREE_ENDPOINT` et `VITE_GA_MEASUREMENT_ID` dans Vercel. Les anciennes routes anglaises redirigent vers leurs équivalents français.

Après le déploiement de validation, contrôler les pages aux largeurs 375 px, 768 px, 1024 px et 1440 px, puis vérifier le menu, les profils, les cartes retournables, la liste des communes, le formulaire et la gestion des cookies.
