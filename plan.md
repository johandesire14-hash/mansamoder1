# Plan — Mansa Hub Modération

## Périmètre du premier lot

Construire un back-office séparé avec sept écrans fonctionnels :

1. une page de connexion réservée à l’équipe Mansa, avec adresse e-mail/mot de passe et bouton Google ;
2. un Dashboard de modération inspiré de la maquette validée.
3. une page Paiements réservée aux administrateurs, selon la maquette fournie : indicateurs de revenus, recherche, filtres d’état, liste des transactions et panneau de détails.
4. une page Utilisateurs réservée aux administrateurs, selon la maquette fournie : filtres par statut, recherche, liste triable, filtres complémentaires et panneau de profil sélectionné ;
5. une page Support client réservée aux administrateurs, selon la maquette fournie : indicateurs, recherche, filtres de statut, demandes triables et conversation avec réponse et résolution.
6. un Journal d’activité réservé aux administrateurs, avec sessions visibles, journal d’audit consultable et exports CSV/JSON.
7. une page Signalements réservée aux administrateurs, selon la maquette fournie : filtres par statut, recherche, liste récente et panneau de détails avec actions de traitement/résolution.

Les identifiants de démonstration sont stockés uniquement dans les secrets `MANSAMOD_ADMIN_EMAIL` et `MANSAMOD_ADMIN_PASSWORD`. Aucune valeur sensible ne doit apparaître dans le dépôt, dans le bundle client, dans l’interface ou dans les logs.

## Architecture

- `client/src/pages/Login.tsx` : formulaire e-mail/mot de passe, bouton Google et messages d’accès.
- `client/src/pages/Dashboard.tsx` : vue protégée, navigation latérale et indicateurs du Dashboard.
- `client/src/pages/Payments.tsx` : vue Paiements protégée, indicateurs, transactions filtrables et détails de la transaction sélectionnée; valeurs locales de présentation, sans traitement de paiement.
- `client/src/pages/Users.tsx` : vue Utilisateurs protégée, recherche, filtres, liste de comptes et panneau de profil.
- `client/src/pages/Support.tsx` : vue Support protégée, liste de tickets filtrable et triable, conversation sélectionnée, réponse et résolution en mémoire côté client uniquement.
- `client/src/pages/ActivityLog.tsx` : sessions et événements d’audit en mémoire côté client, recherche, filtres, détail et export CSV/JSON.
- `client/src/pages/Reports.tsx` : vue Signalements protégée, recherche, filtres, liste récente et panneau de détail avec changements de statut locaux.
- `client/src/App.tsx` : routes `/login`, `/dashboard`, `/payments`, `/users`, `/support`, `/activity` et `/reports`, protégées par le rôle administrateur et redirection contrôlée selon l’état de session.
- `server/routers.ts` : procédures `auth.login`, `auth.me` et `auth.logout` ; login e-mail validé côté serveur.
- `server/_core/context.ts` et `server/_core/sdk.ts` : session applicative réutilisant le cookie signé du starter.
- `server/db.ts` et `server/_core/env.ts` : persistance du compte autorisé et lecture des secrets serveur.
- `client/public/manus-routes.json` : manifeste statique des routes visibles, servi par Vite et inclus dans le client compilé.

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
Les pages Paiements, Utilisateurs, Support et Signalements reprennent la même navigation latérale et la composition à deux colonnes des maquettes : liste/table à gauche, détail sélectionné à droite; la mise en page se replie en une colonne sur petit écran. Le Journal d’activité reprend la navigation latérale et garde sa table défilable sur les petits écrans.

### Typographie et ton

Utiliser une sans-serif système lisible, avec titres noirs affirmés, libellés courts et microcopy en français. Le ton est professionnel, direct et rassurant.

## Données du Dashboard

La première version affiche des données de démonstration : argent généré, utilisateurs actifs, vérifications à traiter, revenus créateurs, activité récente, priorités et support. Ces seules données de démonstration sont lues et persistées dans le `localStorage` du navigateur, avec valeurs de repli, validation, indication de disponibilité et action de réinitialisation. Les données restent propres à l’appareil et au navigateur; aucune donnée d’authentification ou aucun mot de passe n’y est enregistré.
La page Utilisateurs affiche des enregistrements de présentation en mémoire côté client uniquement : aucune donnée utilisateur n’est envoyée au serveur, sauvegardée en base ou persistée dans `localStorage`. L’interface n’ajoute pas de mention indiquant le caractère simulé de ces valeurs.
La page Support conserve tickets, messages de conversation, réponses et changements de statut en mémoire côté client uniquement : aucune donnée de support n’est envoyée au serveur, sauvegardée en base ou persistée dans `localStorage`.
La page Signalements conserve ses enregistrements et changements de statut en mémoire côté client uniquement; aucun signalement n’est envoyé au serveur, sauvegardé en base ou persisté dans `localStorage`.

## Sécurité

- la procédure de connexion compare les valeurs côté serveur ;
- le cookie de session reste `SameSite=None; Secure` pour le Preview HTTPS embarqué ;
- le Dashboard, Paiements, Utilisateurs, Support, Journal d’activité et Signalements vérifient l’utilisateur et le rôle `admin` via le garde d’accès existant ;
- le bouton Google utilise l’authentification Manus/OAuth du starter et le compte n’obtient l’accès admin que s’il est autorisé côté serveur ;
- les erreurs affichées restent fixes et compréhensibles.

## Déploiement et validation

Le projet utilise le serveur et la base gérés déjà activés. Avant livraison : diagnostic TypeScript, `pnpm check`, `pnpm build`, démarrage sur le port configuré, test des routes `/`, `/login`, `/dashboard`, `/payments`, `/users`, `/support` et protection des pages d’administration sans session.
