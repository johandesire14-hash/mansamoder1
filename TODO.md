# TODO — Mansa Hub Modération

## Connexion sécurisée

- [x] Créer la page `/login` en français avec le formulaire Adresse e-mail, Mot de passe, Mot de passe oublié, Se connecter et Continuer avec Google.
  - Les valeurs de démonstration sont lues depuis des secrets serveur.
  - Aucun identifiant sensible n’est écrit dans le client, le dépôt ou l’interface.
  - Une erreur d’identification reste générique et compréhensible.
- [x] Protéger `/dashboard` contre les visiteurs non authentifiés.
- [x] Utiliser une session signée compatible avec le Preview HTTPS embarqué (`SameSite=None; Secure`).
- [x] Autoriser le Dashboard uniquement aux comptes administrateurs.
- [x] Permettre la déconnexion.

## Dashboard de modération

- [x] Créer le Dashboard avec la navigation latérale : Dashboard, Signalements, Utilisateurs, Vérifications, Paiements, Entreprises, Statistiques, Journal d’activité, Sécurité & audit, Paramètres.
  - Ne pas ajouter de page Abonnements.
- [x] Afficher l’argent généré, les utilisateurs actifs, les vérifications à traiter, les revenus de la plateforme et les revenus des créateurs.
- [x] Afficher l’activité de modération récente.
- [x] Afficher les priorités et les raccourcis Support client, Vérifications et Statistiques.
- [x] Reprendre l’identité visuelle des maquettes Mansa Hub : fond gris clair, cartes blanches arrondies, navigation sombre, accents verts/rouges.
- [x] Rendre le Dashboard lisible sur desktop et mobile.

## Validation

- [x] Ajouter et maintenir `public/manus-routes.json` pour `/`, `/login` et `/dashboard`.
- [x] Corriger les diagnostics TypeScript.
- [x] Exécuter `pnpm check`.
- [x] Exécuter `pnpm build`.
- [x] Vérifier que `/api/health` répond correctement et que le serveur démarre sur le port configuré.
