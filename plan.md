# Plan — Mansa Hub Modération

## Périmètre du premier lot

Construire un back-office séparé avec dix écrans fonctionnels :

1. une page de connexion réservée à l’équipe Mansa, avec adresse e-mail/mot de passe et bouton Google ;
2. un Dashboard de modération inspiré de la maquette validée.
3. une page Paiements réservée aux administrateurs, selon la maquette fournie : indicateurs de revenus, recherche, filtres d’état, liste des transactions et panneau de détails.
4. une page Utilisateurs réservée aux administrateurs, selon la maquette fournie : filtres par statut, recherche, liste triable, filtres complémentaires et panneau de profil sélectionné.
5. une page Support client réservée aux administrateurs, selon la maquette fournie : indicateurs de tickets, liste filtrable et triable des demandes, conversation sélectionnée, réponse et résolution ;
6. un Journal d’activité réservé aux administrateurs, selon la maquette fournie : sessions visibles, journal d’audit consultable et exports CSV/JSON.
7. une page Signalements réservée aux administrateurs, selon la maquette fournie : filtres par statut, recherche, liste récente des signalements et panneau de détails avec actions de traitement/résolution.
8. une page Entreprises réservée aux administrateurs, selon la maquette fournie : recherche, filtres, indicateurs d’activité, tableau des entreprises et panneau de détails à onglets.
9. une page Vérifications réservée aux administrateurs : indicateurs, filtres de demandes, liste avec documents et dossier sélectionné avec note interne et actions locales.
10. une page Paramètres réservée aux administrateurs : règles de commissions et de conformité, maintenance, bannière de crise et sauvegarde conditionnée par un motif.

Les identifiants de démonstration sont stockés uniquement dans les secrets `MANSAMOD_ADMIN_EMAIL` et `MANSAMOD_ADMIN_PASSWORD`. Aucune valeur sensible ne doit apparaître dans le dépôt, dans le bundle client, dans l’interface ou dans les logs.

## Architecture

- `client/src/pages/Login.tsx` : formulaire e-mail/mot de passe, bouton Google et messages d’accès.
- `client/src/pages/Dashboard.tsx` : vue protégée, navigation latérale et indicateurs du Dashboard.
- `client/src/pages/Payments.tsx` : vue Paiements protégée, indicateurs, transactions filtrables et détails de la transaction sélectionnée; valeurs locales de présentation, sans traitement de paiement.
- `client/src/pages/Users.tsx` : vue Utilisateurs protégée, recherche, filtres, liste de comptes et panneau de profil.
- `client/src/pages/Support.tsx` : vue Support client protégée, indicateurs, tickets filtrables, fil de conversation et actions de réponse/résolution locales.
- `client/src/pages/ActivityLog.tsx` : sessions et événements d’audit présentés en mémoire côté client, recherche, filtres, détails et export CSV/JSON.
- `client/src/pages/Reports.tsx` : vue Signalements protégée, filtres et recherche, tableau récent et panneau de détail avec changements de statut en mémoire côté client.
- `client/src/pages/Businesses.tsx` : liste filtrable des entreprises et panneau d’entreprise avec résumé/métriques, produits et dashboard financier; changements d’état en mémoire côté client.
- `client/src/pages/Verifications.tsx` : file de demandes de vérification filtrable, pièces fournies, dossier détaillé et transitions locales approuver/demander des informations.
- `client/src/pages/Settings.tsx` : formulaire des règles opérationnelles, état de maintenance et bannière, aperçu en direct et validation de sauvegarde avec motif obligatoire, en mémoire côté client.
- `client/src/App.tsx` : routes `/login`, `/dashboard`, `/payments`, `/users`, `/support`, `/activity`, `/reports`, `/businesses`, `/verifications` et `/settings`, protégées par le rôle administrateur et redirection contrôlée selon l’état de session.
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
Les pages Paiements, Utilisateurs, Support client, Signalements et Entreprises reprennent la même navigation latérale et la composition à deux colonnes des maquettes : liste/table à gauche, détail ou conversation sélectionné à droite; la mise en page se replie en une colonne sur petit écran. Le Journal d’activité reprend la navigation latérale, affiche les sessions au-dessus du registre et garde la table défilable sur les petits écrans.

### Typographie et ton

Utiliser une sans-serif système lisible, avec titres noirs affirmés, libellés courts et microcopy en français. Le ton est professionnel, direct et rassurant.

## Données du Dashboard

La première version affiche des données de démonstration : argent généré, utilisateurs actifs, vérifications à traiter, revenus créateurs, activité récente, priorités et support. Les boutons de période « Aujourd’hui », « Cette semaine » et « Ce mois » modifient les indicateurs et le graphique à partir de ces données; le sélecteur du graphique bascule entre les six derniers jours et les trente derniers jours. Sur les autres écrans concernés, les commandes doivent rester honnêtes face aux données disponibles : recherche Paiements reliée au tableau, « Tout voir » réinitialisant le filtre, pagination Utilisateurs limitée aux profils présents tant qu’aucune API de pages n’existe, et aide connexion expliquant l’absence de réinitialisation automatique. Ces seules données de démonstration sont lues et persistées dans le `localStorage` du navigateur, avec valeurs de repli, validation, indication de disponibilité et action de réinitialisation. Les données restent propres à l’appareil et au navigateur; aucune donnée d’authentification ou aucun mot de passe n’y est enregistré.
La page Utilisateurs affiche des enregistrements de présentation en mémoire côté client uniquement : aucune donnée utilisateur n’est envoyée au serveur, sauvegardée en base ou persistée dans `localStorage`. L’interface n’ajoute pas de mention indiquant le caractère simulé de ces valeurs.
La page Support client conserve les tickets, réponses et changements de statut en mémoire côté client uniquement : aucun ticket n’est envoyé au serveur, sauvegardé en base ou persisté dans `localStorage`.
Le Journal d’activité conserve ses sessions et événements de présentation en mémoire côté client uniquement. Les exports sont générés dans le navigateur; les actions de révocation ne changent pas les sessions d’authentification réelles et aucun registre persistant ou immuable n’est créé sans backend dédié. L’écran indique clairement ces limites afin de ne pas présenter l’aperçu local comme un dispositif de sécurité réel.
La page Signalements conserve ses enregistrements et changements de statut en mémoire côté client uniquement; aucun signalement n’est envoyé au serveur, sauvegardé en base ou persisté dans `localStorage`.
La page Entreprises conserve ses enregistrements, connexions d’intégration affichées et changements de statut en mémoire côté client uniquement; aucune entreprise n’est envoyée au serveur, aucun service YouTube/Stripe n’est appelé, et aucune donnée n’est sauvegardée en base ou dans `localStorage`.
La page Vérifications conserve les demandes, notes et transitions de statut en mémoire côté client; aucun document réel n’est téléchargé et aucune donnée n’est envoyée à un service externe ou sauvegardée en base/localStorage.
La page Paramètres garde ses valeurs, brouillons et journal local en mémoire uniquement; aucun paramètre opérationnel réel n’est modifié sans backend autorisé.

## Sécurité

- la procédure de connexion compare les valeurs côté serveur ;
- le cookie de session reste `SameSite=None; Secure` pour le Preview HTTPS embarqué ;
- le Dashboard, Paiements, Utilisateurs, Support client, Journal d’activité, Signalements, Entreprises et Vérifications vérifient l’utilisateur et le rôle `admin` via le garde d’accès existant ;
- le bouton Google utilise l’authentification Manus/OAuth du starter et le compte n’obtient l’accès admin que s’il est autorisé côté serveur ;
- les erreurs affichées restent fixes et compréhensibles.

## Déploiement et validation

Le projet utilise le serveur et la base gérés déjà activés. Avant livraison : diagnostic TypeScript, `pnpm check`, `pnpm build`, démarrage sur le port configuré, test des routes `/`, `/login`, `/dashboard`, `/payments`, `/users`, `/support`, `/activity`, `/reports`, `/businesses` et protection des pages d’administration sans session.
