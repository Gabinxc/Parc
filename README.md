# ParcAttraction (Maintenance applicative)

## Informations techniques

- Frontend : Angular 17 + Angular Material 17
- Backend : Python 3.10 (Flask)
- Base de données : MariaDB
- Reverse proxy : Nginx (HTTPS avec certificat auto-signé)
- Conteneurisation : Docker Compose

## Accès / URLs

L’application est prévue pour fonctionner via Nginx en HTTPS (port 443) avec des noms d’hôtes locaux.

- FR : https://parcattraction/accueil
- EN : https://parcattraction-en/accueil
- API : https://api/

### Prérequis (Windows)

Ajouter ces entrées dans le fichier `hosts` (en admin) :

```txt
127.0.0.1 parcattraction
127.0.0.1 parcattraction-en
127.0.0.1 api
```

## Démarrage rapide

Depuis la racine du projet :

```bash
docker compose up -d --build
```

Notes :

- Le frontend est lancé en mode dev (`ng serve`) dans les conteneurs `web` (FR) et `web-en` (EN).
- Le certificat SSL est auto-signé : le navigateur affichera un avertissement la première fois.

## Documentation fonctionnelle (utilisation)

### Rôles

- Visiteur (non connecté) : consulte la liste des attractions visibles et peut lire/ajouter des critiques.
- Administrateur (connecté) : accède à l’interface d’administration pour gérer les attractions.

### Parcours “Visiteur”

1. Ouvrir la page d’accueil : https://parcattraction/accueil
2. Les attractions visibles s’affichent sous forme de cartes (nom, description, difficulté).
3. Pour une attraction, cliquer sur **“Voir les critiques”**.
4. Dans la fenêtre de critiques :
	 - Visualiser la note moyenne et le nombre de critiques.
	 - Ajouter une critique (note + commentaire).
	 - Optionnel : désactiver “Rester anonyme” pour saisir nom/prénom.

### Parcours “Administrateur”

1. Aller sur la page de connexion : https://parcattraction/login
2. Identifiants de démonstration :
	 - utilisateur : `toto`
	 - mot de passe : `toto`
3. Une fois connecté :
	 - Accès à **Admin** dans la barre du haut.
	 - Ajout / modification des attractions (nom, description, difficulté, visibilité).
4. Se déconnecter via le bouton **Déconnexion**.

### Changer la langue (FR/EN)

Un bouton **EN/FR** est présent dans la barre de navigation.

- Il redirige vers l’autre version du site en conservant le chemin (ex: `/accueil`).
- Important : avec Angular i18n “compile-time”, le changement de langue “à chaud” n’est pas possible dans un seul build. Ici, on sert 2 builds/dev-servers :
	- `web` (FR) sur `parcattraction`
	- `web-en` (EN) sur `parcattraction-en`

## Documentation technique (fonctionnement)

### Architecture globale

- `nginx` : reverse proxy HTTPS
	- route `https://parcattraction/*` → `web:4200`
	- route `https://parcattraction-en/*` → `web-en:4200`
	- route `https://api/*` → `api:5000`
- `web` : Angular (FR)
- `web-en` : Angular (EN)
- `api` : Flask (REST)
- `database` : MariaDB

### Services Docker (docker-compose)

- `web` : expose 4200 → 4200 (dev server), variable `LOCALE` par défaut `fr`
- `web-en` : expose 4201 → 4200 (dev server), `LOCALE=en`
- `api` : expose 5000 → 5000, healthcheck HTTP sur `/`
- `database` : expose 3309 → 3306, volume `database_data`
- `nginx` : expose 443 → 443, dépend de `api` (healthy) et des 2 web

### Backend (Flask)

Le point d’entrée est `python/app.py`.

#### Endpoints principaux

- Attractions :
	- `GET /attraction` : liste complète
	- `GET /attraction/visible` : attractions visibles
	- `POST /attraction` : création (auth requise)
	- `DELETE /attraction/<id>` : suppression (auth requise)

- Auth :
	- `POST /login` : retourne un token

- Critiques (reviews) :
	- `GET /attraction/<id>/reviews` : liste des critiques
	- `POST /attraction/<id>/reviews` : ajouter une critique
	- `GET /attraction/<id>/reviews/average` : moyenne + count

#### Auth côté API

- Le login retourne un token.
- Le frontend stocke l’utilisateur dans `localStorage`.
- Un interceptor Angular ajoute l’en-tête `Authorization: Token <token>` sur les requêtes.

### Base de données (MariaDB)

Le schéma est initialisé au démarrage de l’API par `python/init.py`, qui exécute :

- `python/sql_file/init.sql` : création des tables
- `python/sql_file/create.sql` : insertion de données de démonstration

Tables :

- `attraction(attraction_id, nom, description, difficulte, visible)`
- `users(users_id, name, password)`
- `review(review_id, attraction_id, nom, prenom, note, commentaire, date_creation)`
	- FK `review.attraction_id → attraction.attraction_id` (ON DELETE CASCADE)

Connexion DB (depuis le host) :

```bash
docker compose exec database mariadb -u mysqlusr -pmysqlpwd parc
```

### Initialisation et robustesse de démarrage

- `python/docker-entrypoint.sh` attend que MariaDB soit prête avant d’exécuter `python/init.py`.
- `api` expose un endpoint `/` utilisé par le healthcheck Docker.

### i18n (Angular)

- Les textes visibles utilisent des attributs `i18n="@@id"` dans les templates.
- Le catalogue EN est dans `parc/src/locale/messages.en.xlf`.
- `@angular/localize` est installé et initialisé (nécessaire au runtime pour `$localize`).

## Données persistantes

- La base MariaDB est persistée dans le volume `database_data`.
- Attention : `docker compose down -v` supprime le volume ⇒ **toutes les données (attractions, critiques, etc.) sont perdues**.

## Réinitialiser la base de données (rejouer les scripts)

```bash
docker compose exec api sh
python3 init.py
```