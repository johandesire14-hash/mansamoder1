# Plan — Mansa Hub Modération

## Périmètre du premier lot

Construire un back-office séparé avec trois écrans fonctionnels :

1. une page de connexion réservée à l’équipe Mansa, avec adresse e-mail/mot de passe et bouton Google ;
2. un Dashboard de modération inspiré de la maquette validée.
3. une page Paiements réservée aux administrateurs, selon la maquette fournie : indicateurs de revenus, recherche, filtres d’état, liste des transactions et panneau de détails.

Les identifiants de démonstration sont stockés uniquement dans les secrets `MANSAMOD_ADMIN_EMAIL` et `MANSAMOD_ADMIN_PASSWORD`. Aucune valeur sensible ne doit apparaître dans le dépôt, dans le bundle client, dans l’interface ou dans les logs.

## Architecture

- `client/src/pages/Login.tsx` : formulaire e-mail/mot de passe, bouton Google et messages d’accès.
- `client/src/pages/Dashboard.tsx` : vue protégée, navigation latérale et indicateurs du Dashboard.
- `client/src/pages/Payments.tsx` : vue Paiements protégée, indicateurs, transactions filtrables et détails de la transaction sélectionnée; valeurs locales de présentation, sans traitement de paiement.
- `client/src/App.tsx` : routes `/login`, `/dashboard` et redirection contrôlée selon l’état de session.
- `server/routers.ts` : procédures `auth.login`, `auth.me` et `auth.logout` ; login e-mail validé côté serveur.
- `server/_core/context.ts` et `server/_core/sdk.ts` : session applicative réutilisant le cookie signé du starter.
- `server/db.ts` et `server/_core/env.ts` : persistance du compte autorisé et lecture des secrets serveur.
- `public/manus-routes.json` : manifeste des routes visibles.

## Design

### Direction choisie

Interface SaaS éditoriale et opérationnelle, directement alignée sur les maquettes Mansa Hub fournies : tableau de bord clair, navigation latérale sombre, cartes blanches arrondies, typographie noire, vert pour les états positifs, rouge pour les alertes et gris froid pour le fond.

### Principes

- hiérarchie immédiate des chiffres et des alertes ;
- actions de modération visibles mais sobres ;
- densité de données maîtrisée ;
- contraste clair sur desktop et mobile.

### Philosophie couleur

Le fond gris très clair sépare le chrome de la plateforme des cartes de données blanches. Le charbon porte la navigation et les chiffres forts. Le vert signifie une activité saine, le rouge une intervention requise, et l’ambre une vérification en attente.

### Composition

Le Dashboard utilise une navigation fixe à gauche, un en-tête de travail compact et une grille de cartes. La page de connexion abandonne la navigation pour concentrer l’attention sur l’identification et la sécurité.

### Typographie et ton

Utiliser une sans-serif système lisible, avec titres noirs affirmés, libellés courts et microcopy en français. Le ton est professionnel, direct et rassurant.

## Données du Dashboard

La première version affiche des données de démonstration : argent généré, utilisateurs actifs, vérifications à traiter, revenus créateurs, activité récente, priorités et support. Ces seules données de démonstration sont lues et persistées dans le `localStorage` du navigateur, avec valeurs de repli, validation, indication de disponibilité et action de réinitialisation. Les données restent propres à l’appareil et au navigateur; aucune donnée d’authentification ou aucun mot de passe n’y est enregistré.

## Sécurité

- la procédure de connexion compare les valeurs côté serveur ;
- le cookie de session reste `SameSite=None; Secure` pour le Preview HTTPS embarqué ;
- le Dashboard vérifie l’utilisateur et le rôle `admin` ;
- le bouton Google utilise l’authentification Manus/OAuth du starter et le compte n’obtient l’accès admin que s’il est autorisé côté serveur ;
- les erreurs affichées restent fixes et compréhensibles.

## Déploiement et validation

Le projet utilise le serveur et la base gérés déjà activés. Avant livraison : diagnostic TypeScript, `pnpm check`, `pnpm build`, démarrage sur le port configuré, test des routes `/`, `/login`, `/dashboard` et protection du Dashboard sans session.
