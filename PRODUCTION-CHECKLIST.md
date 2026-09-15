# Checklist de mise en production

## Configuration du projet

- Créer le dépôt GitHub officiel `manon-pontasse-educatrice-liberale`.
- Créer le projet Vercel officiel relié à ce dépôt.
- Déclarer `VITE_FORMSPREE_ENDPOINT` dans l’environnement Production.
- Déclarer la variable Analytics indiquée dans `.env.example`.
- Redéployer le projet après l’ajout des variables.
- Vérifier le fonctionnement du site avec son adresse `vercel.app`.
- Rattacher le nom de domaine après les vérifications.

## Parcours à contrôler

- Accueil : changer les quatre profils et vérifier les textes associés.
- Navigation : tester le menu mobile, le sous-menu Informations, la touche Échap et la navigation au clavier.
- Mon approche : retourner chaque carte au clic, au clavier et sur écran tactile.
- Informations : ouvrir les questions fréquentes et tester les liens internes.
- Contact : afficher la liste des communes, parcourir la carte, contrôler les erreurs puis réaliser un véritable envoi.
- Cookies : refuser les statistiques, vérifier l’absence d’Analytics, rouvrir les préférences, accepter puis vérifier son chargement.
- Footer : vérifier le texte adapté à chaque profil et tester tous les liens.

## Largeurs de référence

- 375 px : petit téléphone.
- 768 px : tablette en mode portrait et point de bascule du menu.
- 1024 px : tablette en mode paysage.
- 1440 px : ordinateur de bureau.

## Contrôles avant la mise en ligne

- Aucun débordement horizontal.
- Aucun texte tronqué ou superposé.
- Contrastes suffisants et focus clavier visibles.
- Images nettes et sans déplacement de la mise en page.
- Carte lisible sans zoom involontaire pendant le défilement.
- Formulaire utilisable et message correctement reçu.
- Bandeau de consentement fonctionnel.
- Analytics chargé uniquement après acceptation.
- Mentions légales et politique de confidentialité à jour.
- Domaine avec et sans `www` correctement configuré.
- Redirection vers l’adresse principale fonctionnelle.
- Connexion HTTPS valide.

## Contrôles après la migration

- Vérifier toutes les pages depuis le nom de domaine officiel.
- Envoyer un nouveau message depuis le formulaire.
- Contrôler la réception du message.
- Tester le site dans une fenêtre de navigation privée.
- Tester le site sur un véritable téléphone.
- Vérifier l’indexation et le suivi dans Google Search Console.
- Conserver temporairement l’ancien projet comme solution de secours.
