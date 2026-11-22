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
- [x] Le Dashboard responsive conserve sa navigation latérale (Dashboard, Signalements, Utilisateurs, Vérifications, Paiements, Entreprises, Abonnements, Statistiques, Journal d’activité, Sécurité & audit, Paramètres), ses indicateurs, son activité de modération, ses priorités et ses accès rapides.
- [x] Les indicateurs et priorités présentés comme exemples sont identifiés clairement comme données de démonstration; ils ne sont pas présentés comme des données opérationnelles réelles.
- [x] Seules les données de démonstration du Dashboard sont stockées dans le `localStorage` du navigateur, sous une clé versionnée; elles sont validées à la lecture, retombent sur les exemples initiaux si elles sont absentes ou invalides, et peuvent être réinitialisées.
- [x] L’interface indique si le stockage navigateur fonctionne ou si les données ne pourront pas persister; aucun mot de passe, identifiant ou état utilisateur n’est sauvegardé dans `localStorage`.

## Interactions — première passe
- [x] Le Dashboard met à jour ses indicateurs, la période affichée et le graphique lorsque l’administrateur choisit « Aujourd’hui », « Cette semaine » ou « Ce mois » et la plage affichée suit le calendrier courant; les sélecteurs du graphique basculent entre six et trente jours.
- [x] Le bouton « Tout voir » de la carte Priorités ouvre la file Signalements.
- [x] Sur Paiements, la recherche de l’en-tête filtre les transactions, « Tout voir » efface la recherche et réinitialise le filtre, et le bouton d’action copie explicitement la référence au lieu de promettre une navigation inexistante.
- [x] Sur Utilisateurs, la pagination n’affiche plus de pages fictives; les flèches sont désactivées car aucune source ne fournit les pages suivantes au-delà des profils affichés.
- [x] Sur Connexion, « Mot de passe oublié ? » affiche une aide transparente et n’annonce pas l’envoi d’un lien tant qu’aucune procédure de réinitialisation n’existe.
- [x] Audit multi-pages (Dashboard, Signalements, Utilisateurs, Vérifications, Paiements, Entreprises, Paramètres, Support, Journal d’activité et Connexion) : relier les commandes aux routes/données existantes; rendre les recherches, filtres, compteurs, sélections et paginations cohérents avec les résultats visibles; enlever ou désactiver les éléments sans action/destination; afficher clairement les changements locaux, erreurs de navigateur et limites d’absence d’API; ne pas inventer routes, données ou mutations serveur. Les fonctions métier nécessitant une API restent explicitement locales ou indisponibles.
- [x] Validation finale de l’audit : `pnpm check`, `pnpm test` et `pnpm build` passent; synchronisation sur `main` dans les deux dépôts, sans force-push.

## Page Signalements
- [x] Ajouter la page `/reports` accessible uniquement à une session administrateur, l’indiquer dans `client/public/manus-routes.json` et relier le menu « Signalements » des pages d’administration à cette route.
- [x] Reproduire l’en-tête « Signalements », la recherche « Rechercher un signalement… » et les onglets Tous (56), Nouveaux (18), En cours (24) et Résolus (14).
- [x] Afficher « Signalements récents » avec le tri « Plus récents » et les colonnes Utilisateur, Contenu, Motif, Date, Priorité et Statut; reprendre les dix lignes visibles de la maquette avec leurs noms, contenus, motifs, dates, priorités et statuts.
- [x] Afficher le détail du signalement sélectionné avec l’utilisateur signalé, son type de contenu et extrait, le motif et sa description, la date du signalement, le déclarant et le nombre de signalements antérieurs.
- [x] Permettre de filtrer par statut, rechercher parmi les signalements, sélectionner une ligne, traiter un signalement (« En cours ») et le marquer comme résolu.
- [x] Garder les signalements et changements de statut en mémoire côté client uniquement : ne pas modifier la base, appeler un service externe ou utiliser `localStorage` pour ces données.

## Page Entreprises
- [ ] Ajouter la page `/businesses` accessible uniquement à une session administrateur, l’indiquer dans `client/public/manus-routes.json` et relier les menus « Entreprises » des pages d’administration à cette route.
- [ ] Reproduire le titre « Entreprises », le sous-titre « Surveillez les entreprises, leurs performances et les risques associés », la recherche « Rechercher une entreprise ou un propriétaire… », le sélecteur FCFA et le filtre « Tous les statuts ».
- [ ] Afficher les dix entreprises de la maquette avec leur propriétaire et e-mail, statut KYC, statut de l’entreprise, nombre de produits, membres, volume brut (GMV), taux de remboursement et action de ligne.
- [ ] Ouvrir le panneau de Kora Academy par défaut avec son propriétaire, son e-mail, son statut « Active » et les onglets « Résumé & Métriques », « Produits » et « Dashboard Financier ».
- [ ] Afficher les quatre métriques visibles, les intégrations YouTube et Stripe indiquées comme connectées, la rétention de 72 h, le seuil minimum de 5 000 FCFA et les moyens de versement Orange Money, MTN Money, Wave et virement bancaire.
- [ ] Permettre la recherche, le filtrage, la sélection d’entreprise et les changements d’état uniquement en mémoire côté client; ne pas appeler YouTube, Stripe ou un service financier, modifier la base ou utiliser `localStorage` pour ces données.

## Page Paramètres
- [x] Ajouter `/settings` au garde administrateur, au manifeste des routes et aux liens « Paramètres » de tous les menus administrateur.
- [x] Reproduire le titre et sous-titre de Paramètres, la mention « Modifications sensibles », les cartes « Modèle de tarification & commissions Mansa » et « Seuils réglementaires LCB-FT & antifraude ».
- [x] Préremplir les règles : commission plateforme 5 %, rétention des fonds 72 heures, seuil KYC 100 000 FCFA, double validation retrait 500 000 FCFA et taux de remboursement maximal 4 %.
- [x] Reproduire « Maintenance opérationnelle & communication de crise » avec le mode maintenance désactivé, sa description, la bannière « Aucun incident en cours. » et l’aperçu des règles actives qui se met à jour avec les champs.
- [x] Permettre de modifier les champs et le mode maintenance; « Annuler » restaure le dernier état sauvegardé; « Enregistrer et journaliser dans l’audit » exige un motif non vide avant de confirmer.
- [x] Garder les réglages et leur journal en mémoire côté client uniquement; ne pas appliquer de règles serveur, désactiver les pages publiques, créer d’audit persistant, écrire en base ou utiliser `localStorage`.

## Page Vérifications
- [x] Ajouter `/verifications` sous le garde administrateur, l’inscrire dans `client/public/manus-routes.json` et relier « Vérifications » à cette route depuis les menus administrateur.
- [x] Reproduire l’en-tête « Vérifications », l’indicateur « Demandes de vérification » (47, +12 %), la période « 1 sept. 2024 - 30 sept. 2024 », la recherche globale et la recherche de demande.
- [x] Afficher les filtres Toutes (47), Nouvelles (18), En cours (16), Approuvées (13), et les dix demandes visibles, avec demandeur, type, date de soumission, nombre de documents, statut et accès au dossier.
- [x] Ouvrir le dossier d’Aminata K. par défaut avec ses informations, trois documents fournis et les actions de téléchargement visuelles, une note interne et les boutons « Approuver » et « Demander des informations ».
- [x] Permettre la recherche, le filtrage, la sélection, l’ajout d’une note et la transition des statuts en mémoire uniquement; ne pas appeler de service externe ni téléverser ou persister des documents.

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

## Page Support client
- [x] Ajouter la page `/support` accessible uniquement à une session administrateur et l’indiquer dans `client/public/manus-routes.json`.
- [x] Reproduire l’en-tête « Support client », son sous-titre « Demandes des utilisateurs vers l’équipe de maintenance » et les trois indicateurs « Nouveaux tickets » (18, +25 %), « En cours » (7, −12 %) et « Résolus aujourd’hui » (24, +33 %).
- [x] Afficher la liste filtrable et triable des demandes récentes avec la recherche, les onglets Toutes/Nouvelles/En cours/Résolues et les colonnes Utilisateur, Sujet, Date, Priorité et Statut; reprendre les huit demandes visibles dans la maquette.
- [x] Afficher la conversation du ticket sélectionné avec son identifiant, le demandeur, le sujet, l’horodatage, les messages, le champ de réponse et les actions « Répondre » et « Marquer comme résolu ».
- [x] Garder les tickets, réponses et changements de statut en mémoire côté client uniquement : ne pas modifier la base, appeler un service de support externe ou utiliser `localStorage` pour ces données.
- [x] Faire ouvrir `/support` depuis les cartes « Support client / Ouvrir la file » et le raccourci Support client présents dans l’espace administrateur.

## Page Journal d’activité
- [x] Ajouter la page `/activity` accessible uniquement à une session administrateur et l’indiquer dans `client/public/manus-routes.json`.
- [x] Reproduire l’en-tête « Journal d’activité », le sous-titre, l’indicateur « Registre sécurisé » et l’action « Déconnecter les autres sessions ».
- [x] Afficher les trois sessions visibles (MacBook Pro, iPhone 15, Windows PC), avec navigateur/système, adresse IP, localisation, dernière activité, statut « Session actuelle » et action « Révoquer » pour les autres.
- [x] Reproduire le « Journal d’audit immuable » avec la bannière de lecture seule, la recherche, le filtre d’actions, les colonnes Horodatage, Administrateur, Type d’action, Cible & ID, Motif réglementaire, Adresse IP et Détails, ainsi que les cinq événements visibles.
- [x] Faire ouvrir le détail d’un événement depuis l’icône œil et proposer les exports « Export CSV LCB-FT » et « Export JSON Brut »; la fenêtre se ferme avec Échap, reçoit le focus à l’ouverture et le restitue à la fermeture.
- [x] Garder sessions et événements de présentation en mémoire côté client uniquement, sans `localStorage`, base de données ni service externe; les actions locales de révocation n’invalident pas les sessions d’authentification réelles et aucun registre persistant immuable n’est créé.
- [x] Afficher clairement dans l’interface que les sessions et événements sont locaux, que la révocation ne déconnecte pas réellement d’appareils et que le journal n’est pas un registre serveur immuable.
- [x] Relier « Journal d’activité » à `/activity` dans les navigations des pages administrateur.

## Site Webdev permanent, privé et persistant
- [x] Le projet Webdev dispose d’un serveur et d’une base MySQL gérée; le dépôt importé contient la migration utilisateur et `/api/health` répond sans authentification.
- [x] Le manifeste `client/public/manus-routes.json` déclare `/`, `/login`, `/dashboard`, `/payments`, `/users`, `/support`, `/activity`, `/reports`, `/businesses`, `/verifications` et `/settings`; le `Dockerfile` sert le client compilé et respecte le port `PORT`.
- [ ] Les secrets d’administration sont enregistrés de façon protégée pour le runtime publié; les migrations applicatives requises sont appliquées sans exposer de credential.
- [ ] Une nouvelle build de publication réussit et fournit une URL stable; l’accès à ce site privé demeure réservé au propriétaire, sans basculer la visibilité en public.

Le Blueprint confirmé et les choix de sécurité restent la source de vérité. Ne pas contourner la connexion ni publier un secret dans Git.
