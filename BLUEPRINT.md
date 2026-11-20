# Blueprint — Mansa Hub Modération

**Dépôt source :** `johandesire14-hash/mansamoder1`  
**Révision importée :** `1dc7f1ee458f8c104c3e35d4b0bdfa1b3af1da1c` (2026-11-17)  
**État :** dépôt importé et analysé; blueprint documentaire uniquement. Aucun changement applicatif ni push GitHub effectué.

## 1. Vision produit

Mansa Hub Modération est un back-office privé destiné à l’équipe Mansa. Il donne aux administrateurs un point d’entrée sécurisé pour superviser les indicateurs opérationnels et accéder aux futures files de modération, de vérification, de paiement, d’assistance et d’audit.

**Positionnement :** poste de contrôle de l’activité Mansa, rapide à lire, réservé aux administrateurs et conçu pour évoluer d’un tableau de bord de démonstration vers des données métier réelles.

## 2. Utilisateurs et accès

- **Administrateur Mansa** : se connecte puis consulte le tableau de bord.
- **Visiteur non connecté** : est redirigé vers la connexion lorsqu’il tente d’accéder à `/dashboard`.
- **Compte connecté sans rôle `admin`** : voit un refus d’accès; il ne peut pas consulter le tableau de bord.

L’authentification par courriel vérifie côté serveur les secrets `MANSAMOD_ADMIN_EMAIL` et `MANSAMOD_ADMIN_PASSWORD`. Le mot de passe est comparé en temps constant. Le starter fournit également l’authentification Manus/OAuth. La session réutilise le cookie signé du starter et doit rester compatible avec le Preview HTTPS intégré (`SameSite=None; Secure`). Les secrets ne doivent jamais être envoyés au navigateur, inscrits dans le dépôt ou divulgués dans les logs.

## 3. Parcours et écrans

### Connexion — `/login`

- Formulaire en français : adresse e-mail, mot de passe, récupération du mot de passe et connexion.
- Option « Continuer avec Google » via l’authentification du starter.
- Erreur d’identification générique et compréhensible, sans confirmer si une adresse existe.
- Une session valide mène au tableau de bord; la déconnexion ramène à la connexion.

### Tableau de bord — `/dashboard`

Vue protégée présentant :

- navigation latérale : Dashboard, Signalements, Utilisateurs, Vérifications, Paiements, Entreprises, Statistiques, Journal d’activité, Sécurité & audit et Paramètres;
- indicateurs : argent généré, utilisateurs actifs, vérifications à traiter et revenus des créateurs;
- activité de modération sur six jours;
- priorités de modération (contenus haineux, arnaques potentielles, contenus inappropriés);
- accès rapides vers Vérifications, Statistiques, Sécurité & audit et Support client;
- recherche, notification, sélection de période, identité administrateur et déconnexion;
- navigation mobile repliable et mise en page responsive.

**Limite fonctionnelle connue :** les chiffres, tendances, priorités, activité récente, synchronisation et accès de navigation visibles dans le tableau de bord sont des données/éléments de démonstration. Les menus ne constituent pas encore des modules métier complets reliés à des données opérationnelles. Ne pas les présenter comme des données de production.

### Routes et redirections

- `/` : redirige selon l’état de session et le rôle.
- `/login` : écran de connexion.
- `/dashboard` : exige une session administrateur.
- Routes inconnues : redirection vers la connexion.

Le manifeste `public/manus-routes.json` déclare `/`, `/login` et `/dashboard`.

## 4. Direction visuelle et expérience

- **Mouvement :** SaaS éditorial et opérationnel, inspiré des maquettes Mansa Hub déjà décrites dans `plan.md`.
- **Principes :** chiffres et alertes lisibles immédiatement; actions sobres; densité maîtrisée; interface accessible sur ordinateur et mobile.
- **Palette :** fond gris froid très clair, cartes blanches arrondies, navigation/éléments forts charbon; vert pour les états sains, rouge pour les urgences et ambre pour les éléments à traiter.
- **Composition :** navigation latérale persistante sur grand écran, zone de travail compacte avec en-tête, filtres temporels et cartes de contenu; menu latéral mobile coulissant; connexion dépouillée et concentrée sur l’accès.
- **Typographie et voix :** sans-serif système, titres affirmés, libellés courts en français; ton professionnel, direct et rassurant.
- **Interactions :** transitions discrètes; aucune animation ne doit retarder l’accès aux alertes ou aux actions principales.

## 5. Architecture existante

- `client/src/App.tsx` : routes, redirections et garde d’accès.
- `client/src/pages/Login.tsx` : connexion.
- `client/src/pages/Dashboard.tsx` : tableau de bord et navigation responsive.
- `client/src/_core/hooks/useAuth.ts` : état de session côté client.
- `client/src/lib/trpc.ts` : client tRPC.
- `server/routers.ts` : procédures `auth.me`, `auth.login` et `auth.logout`.
- `server/_core/` : contexte, cookies, OAuth, SDK, environnement, intégrations du starter et serveur.
- `server/db.ts`, `server/storage.ts`, `drizzle/` : persistance et schéma de base de données du starter.
- `shared/` : types et constantes partagés.
- `public/manus-routes.json` : manifeste des routes.
- `package.json` : scripts `pnpm dev`, `pnpm build`, `pnpm start`, `pnpm check`, `pnpm test` et commandes Drizzle.

**Pile détectée :** React, TypeScript, Vite, Express, tRPC, Drizzle et MySQL géré. Le dépôt comporte une base serveur et des migrations initiales d’utilisateurs; cela ne signifie pas que les métriques du dashboard sont déjà stockées ou calculées à partir de données métier.

## 6. Modèle de données et intégrations

Le schéma livré contient le socle utilisateur du starter. Le dashboard utilise actuellement des valeurs définies côté interface, non des agrégats persistés. Les futurs modules devront définir leurs propres entités, règles d’accès et procédures serveur avant tout branchement des données.

Aucune intégration supplémentaire (paiement, service externe de modération ou notification métier) n’est revendiquée par ce blueprint. L’option Google dépend de l’authentification configurée par le starter et de l’environnement cible.

## 7. Sécurité et confidentialité

1. Comparer les identifiants côté serveur et conserver les secrets uniquement dans le coffre prévu à cet effet.
2. Vérifier le rôle `admin` sur les accès privés; ne pas se fier à une simple protection visuelle côté client.
3. Émettre et invalider correctement la session signée; conserver les attributs de cookie compatibles avec le Preview HTTPS intégré.
4. Garder les messages d’échec génériques et ne jamais journaliser les secrets ou mots de passe.
5. Ne rendre publiques que les valeurs explicitement prévues pour le navigateur.
6. Traiter les données de modération et d’audit futures comme des données sensibles, avec autorisation serveur et minimisation des accès.

## 8. Périmètre

### Présent dans le dépôt

- Connexion par e-mail/mot de passe vérifiée côté serveur.
- État de session, accès administrateur au dashboard et déconnexion.
- Présentation responsive du dashboard et de données de démonstration.
- Charpente visuelle et libellés de navigation pour les espaces opérationnels.

### Hors périmètre de cette importation / non démontré comme implémenté

- Files CRUD réelles pour signalements, utilisateurs, vérifications, paiements ou entreprises.
- Données de production, filtres métier persistés, recherche opérationnelle ou exports.
- Journal d’audit alimenté par des actions réelles et politiques de rétention.
- Gestion complète des comptes administrateurs, invitations, récupération de mot de passe et MFA.
- Mesure réelle des revenus et indicateurs financiers.

Ces points sont des pistes d’évolution, pas des exigences ajoutées au projet actuel.

## 9. Références et vérification

Ce blueprint synthétise les éléments inspectés dans `README.md`, `plan.md`, `TODO.md`, `client/src/App.tsx`, `client/src/pages/Login.tsx`, `client/src/pages/Dashboard.tsx`, `server/routers.ts`, `package.json` et les migrations/schémas Drizzle. Le plan d’origine du dépôt et son `TODO.md` restent inchangés.