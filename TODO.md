# TODO — Mansa Hub Modération

## Authentification administrateur
- [x] La page `/login` présente en français la connexion par adresse e-mail et mot de passe, l’option OAuth existante, des messages d’erreur génériques et un accès réservé aux membres autorisés.
- [x] Le serveur compare l’adresse et le mot de passe aux secrets `MANSAMOD_ADMIN_EMAIL` et `MANSAMOD_ADMIN_PASSWORD`; le mot de passe n’est ni persisté dans le navigateur, ni exposé dans le client, le dépôt ou les logs.
- [x] La session est signée, utilise le cookie `webdev_app_session` avec `SameSite=None; Secure` pour le Preview HTTPS, et peut être invalidée à la déconnexion.
- [x] Les secrets d’authentification ne sont ni écrits dans les fichiers du dépôt, ni intégrés au bundle client.
- [ ] Les valeurs de production pour `MANSAMOD_ADMIN_EMAIL` et `MANSAMOD_ADMIN_PASSWORD` sont fournies via l’entrée protégée des secrets du projet; elles ne sont pas les valeurs de démonstration révélées dans le chat.

## Protection du Dashboard
- [x] `/dashboard` redirige un visiteur sans session vers `/login` et n’affiche la page qu’aux sessions dont le rôle est `admin`.
- [x] Les comptes sans rôle administrateur voient un refus d’accès; l’autorisation est vérifiée à partir de l’utilisateur de la base et non d’une valeur fournie par le navigateur.
- [x] La route `/` redirige selon l’état de connexion et le rôle; la déconnexion invalide le cookie et revient à `/login`.

## Dashboard et données de démonstration
- [x] Le Dashboard responsive conserve sa navigation latérale (Dashboard, Signalements, Utilisateurs, Vérifications, Paiements, Entreprises, Statistiques, Journal d’activité, Sécurité & audit, Paramètres), ses indicateurs, son activité de modération, ses priorités et ses accès rapides.
- [x] Les indicateurs et priorités présentés comme exemples sont identifiés clairement comme données de démonstration; ils ne sont pas présentés comme des données opérationnelles réelles.
- [x] Seules les données de démonstration du Dashboard sont stockées dans le `localStorage` du navigateur, sous une clé versionnée; elles sont validées à la lecture, retombent sur les exemples initiaux si elles sont absentes ou invalides, et peuvent être réinitialisées.
- [x] L’interface indique si le stockage navigateur fonctionne ou si les données ne pourront pas persister; aucun mot de passe, identifiant ou état utilisateur n’est sauvegardé dans `localStorage`.

## Page Paiements
- [x] Ajouter la page `/payments` accessible uniquement à une session administrateur et l’indiquer comme route dans `client/public/manus-routes.json`.
- [x] Reproduire la maquette fournie avec les indicateurs « Revenus de la plateforme », « Revenus des créateurs » et « Paiements en attente », la recherche, les filtres Toutes/En attente/Payées/Échouées, le tableau des transactions et le panneau de détails sélectionné.
- [x] Utiliser les montants, statuts, références et types de transaction fournis par la maquette; ne pas ajouter de texte indiquant que ces valeurs sont simulées.
- [x] Garder la page visuelle uniquement : aucun paiement, virement, abonnement ou appel à un prestataire de paiement n’est exécuté; ne pas créer de page Abonnements.

## Page Utilisateurs
- [x] Ajouter la page `/users` accessible uniquement à une session administrateur et l’indiquer dans `client/public/manus-routes.json`.
- [x] Reproduire la maquette avec les onglets Tous (16 815), Actifs (14 230), Suspendus (412) et Vérifiés (12 580), le champ de recherche, le bouton Filtres et le tri « Plus récents ».
- [ ] Afficher la table Utilisateur, Email, Inscription, Activité, Statut et Actions; reprendre les dix profils et statuts montrés dans la maquette, puis afficher le profil de l’utilisateur sélectionné avec vérification, date d’inscription, e-mail, rôle, entreprise, localisation, dernière activité, signalements et abonnés. La table et le profil sont présents; les profils/statuts exacts restent à recaler à partir de la capture originale, absente des fichiers disponibles lors de cette reprise.
- [x] Garder les enregistrements utilisateurs en mémoire côté client uniquement : ne pas modifier la base, appeler un service externe, utiliser `localStorage` pour ces enregistrements, ni afficher de mention indiquant qu’ils sont simulés.
- [x] Reproduire les actions visibles « Voir le profil », « Suspendre » et « Ajouter une note » sans créer de page Abonnements.

## Site Webdev permanent, privé et persistant
- [x] Le projet Webdev dispose d’un serveur et d’une base MySQL gérée; le dépôt importé contient la migration utilisateur et `/api/health` répond sans authentification.
- [x] Le manifeste `client/public/manus-routes.json` déclare `/`, `/login`, `/dashboard`, `/payments` et `/users`; le `Dockerfile` sert le client compilé et respecte le port `PORT`.
- [ ] Les secrets d’administration sont enregistrés de façon protégée pour le runtime publié; les migrations applicatives requises sont appliquées sans exposer de credential.
- [ ] Une nouvelle build de publication réussit et fournit une URL stable; l’accès à ce site privé demeure réservé au propriétaire, sans basculer la visibilité en public.

Le Blueprint confirmé et les choix de sécurité restent la source de vérité. Ne pas contourner la connexion ni publier un secret dans Git.
