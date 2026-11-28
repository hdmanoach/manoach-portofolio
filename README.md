# Portfolio — Manoach HOSSOU DODO

Portfolio professionnel statique : administration système, DevOps, infrastructure, cybersécurité, data et développement web. Design « dossier d'enquête » (kraft, typewriter, tampons), bilingue FR/EN.

**URL** : racine du domaine sur Vercel (ex. `manoach-portfolio.vercel.app`) après import du dépôt — voir section Déploiement

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19 — **export statique** (`output: export`)
- Déploiement automatique sur **Vercel** (push sur `main`) ; **GitHub Actions** pour la notification email
- Aucune base de données, aucun serveur : le site est un ensemble de fichiers HTML/CSS/JS

## Commandes

```bash
npm install        # dépendances
npm run dev        # développement → http://localhost:3000/
npm run build      # export statique dans out/
npm run curate     # curation CLI des dépôts GitHub → data/projects.json
```

## Structure

```
app/                 pages (accueil, /curate) + design system (globals.css)
components/          HomePage, ProjectCard, DomainPanel, Curator…
lib/                 i18n FR/EN, contenu, types, logique de curation
data/projects.json   liste éditoriale des dépôts publiés (source de vérité)
public/cv-*.pdf      les CV téléchargeables (n'importe quel fichier cv-*.pdf est détecté)
scripts/             curate.mjs (CLI), notify-new-repos.py (notification email)
.github/workflows/   notify-new-repos.yml (email horaire) — voir docs/github-actions.md
```

## Curation des projets

Deux entrées équivalentes, toutes deux éditent `data/projects.json` :

1. **CLI** : `npm run curate` — interroge l'API GitHub, demande publier/retirer pour chaque dépôt, importe le README comme proposition de résumé. Si `GITHUB_TOKEN` est défini dans `.env` (modèle : `.env.example`), le token est **validé** (identité + droits d'écriture sur le dépôt) avant de pouvoir pousser `data/projects.json` sur GitHub.
2. **Web** : page `/curate/` (protégée par mot de passe, `noindex`) — recherche, blocs par date de push, boutons Ajouter / Retirer / Mettre à jour, import README et topics, téléchargement du fichier ou push direct sur GitHub.

Ordre des domaines : `data-ia`, `sysadmin`, `devops`, `cyber`, `webdev` (2 par ligne sur l'accueil).

- Dépôt **public** → lien « Voir sur GitHub » sur la carte
- Dépôt **privé** → tampon « Demander l'accès » (mailto pré-rempli)
- Champ **URL en ligne** (optionnel) → bouton « Voir le site ↗ » sur la carte

### Publier depuis le web

Renseigner un token GitHub (fine-grained, sur ce dépôt, scope *Contents: read & write*) dans le champ du curateur : dépôts privés visibles + « Publier sur GitHub » commit `data/projects.json` sur `main`, Actions redéploie le site. Le token reste dans la session du navigateur (jamais dans le code) ; un `.env.local` (gitignoré) peut le stocker pour un usage local.

## CV

Déposer un fichier `cv-*.pdf` dans `public/` : le bouton correspondant apparaît automatiquement au build (libellé connu pour les noms existants, sinon humanisé depuis le nom de fichier).

## Notification des nouveaux dépôts

Workflow horaire `notify-new-repos.yml` : détecte les dépôts GitHub absents de `data/projects.json` et jamais notifiés, envoie un email (Gmail SMTP) contenant le lien vers `/curate/`, puis enregistre les noms dans `data/curate-notified.json`.

Secrets à configurer (Settings → Secrets and variables → Actions) :

| Secret | Rôle |
| --- | --- |
| `SMTP_USER` | Adresse Gmail utilisée comme expéditeur/destinataire |
| `SMTP_PASS` | Mot de passe d'application Google (2FA → Mots de passe d'application) |
| `NOTIFY_TOKEN` | *(optionnel)* PAT pour détecter aussi les dépôts privés |

Sans secrets, l'action logue et réessaie à l'heure suivante.

## Déploiement

- **Vercel** (hébergeur choisi) : importer le dépôt dans le dashboard Vercel (Add New → Project → Import) → déploiement automatique à chaque push sur `main`, servi à la racine (`<projet>.vercel.app/`). Aucune config supplémentaire.
- **GitHub Actions** : uniquement la notification horaire des nouveaux dépôts (`.github/workflows/notify-new-repos.yml`). Explication détaillée des workflows dans [`docs/github-actions.md`](docs/github-actions.md).
- **GitHub Pages** (optionnel, désactivé) : pour le réactiver, recréer `.github/workflows/deploy.yml` (exemple dans le cours) et définir Settings → Pages → Source : GitHub Actions.

## Variables d'environnement

- `.env` (localement, **ignoré par git**) : `NEXT_PUBLIC_GITHUB_OWNER`, `NEXT_PUBLIC_GITHUB_REPO`, `NEXT_PUBLIC_SITE_URL`, `GITHUB_TOKEN` (token fine-grained du CLI — jamais de `NEXT_PUBLIC_*` pour un secret) — les défauts dans le code couvrent aussi la CI
- `.env.local` (gitignoré) : tout ce qui est secret (tokens…)
- `NEXT_PUBLIC_BASE_PATH` : préfixe de chemin, défini par le workflow Pages si réactivé ; absent ailleurs (dev, Vercel) → racine

## Licence

Usage personnel.
