# GitHub Actions — cours général

Comprendre, lire, écrire et débuguer des **workflows** GitHub Actions. Chaque notion est illustrée avec **ton vrai workflow** de ce dépôt (`notify-new-repos.yml`).

---

## 1. C'est quoi ?

GitHub Actions, c'est le **moteur d'automatisation intégré à GitHub** : tu décris dans un fichier YAML une recette (« quand il se passe X, exécute Y »), et GitHub exécute cette recette sur ses propres machines (des **runners** virtuels), gratuitement pour les dépôts publics.

Cas d'usage classiques :

| Usage | Exemple |
| --- | --- |
| **CI** (intégration continue) | Lancer les tests à chaque push / PR |
| **CD** (déploiement) | Déployer sur Pages, Vercel, un serveur… |
| **Automatisation** | Tâche planifiée, notification, nettoyage |
| **Maintenance** | Auto-formatage, mise à jour de dépendances |

Dans **ce dépôt**, Actions ne sert **pas** au déploiement (c'est Vercel qui le fait) : il sert à la **notification email horaire** des nouveaux dépôts GitHub.

---

## 2. Le vocabulaire (à connaître par cœur)

```
Workflow  =  le fichier YAML complet (.github/workflows/xxx.yml)
   └─ Event (déclencheur)  = QUAND ça se lance (push, cron, clic manuel…)
   └─ Job                 = un groupe d'étapes sur UNE machine
        └─ Step           = une action ou une commande shell
             └─ Action    = un bloc réutilisable (actions/checkout, etc.)
Runner   = la machine virtuelle qui exécute le tout (ubuntu-latest…)
```

- Un workflow peut contenir **plusieurs jobs** ; les jobs tournent en **parallèle** sauf si tu imposes une dépendance avec `needs:`.
- Les **steps** d'un même job tournent **en série**, dans l'ordre ; si l'un échoue, les suivants s'arrêtent.

---

## 3. Où ça vit ?

```
.github/
└── workflows/
    ├── notify-new-repos.yml   ← ton workflow (notification email)
    └── (deploy.yml)           ← exemple retiré, réactivable (voir §11)
```

Un dépôt peut contenir autant de fichiers `.yml` que voulu, **un fichier = un workflow**. GitHub les liste dans l'onglet **Actions** du dépôt.

---

## 4. Anatomie d'un workflow

Voici ton `notify-new-repos.yml`, décortiqué :

```yaml
name: Notify new repositories          # nom affiché dans l'onglet Actions

on:                                    # ← DÉCLENCHEURS (quand ?)
  schedule:
    - cron: "17 * * * *"              # chaque heure, à minute 17
  workflow_dispatch:                   # bouton "Run workflow" dans l'UI

permissions:                           # ← DROITS du token de l'Action
  contents: write                      # pouvoir committer/pousser

jobs:                                  # ← JOBS (quoi ?)
  notify:                              # id du job
    runs-on: ubuntu-latest             # machine (Ubuntu récent)
    steps:                             # ← ÉTAPES, en série
      - uses: actions/checkout@v4      # 1. cloner le dépôt
      - uses: actions/setup-python@v5  # 2. installer Python
        with:                          #    paramètres de l'action
          python-version: "3.12"
      - name: Detect new repositories and email   # 3. étape nommée
        env:                           #    variables d'environnement
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SMTP_PASS: ${{ secrets.SMTP_PASS }}
        run: python scripts/notify-new-repos.py  #    commande shell
      - name: Commit notified list     # 4. sauvegarder l'état
        run: |                         #    bloc multi-lignes
          git config user.name "github-actions[bot]"
          git add data/curate-notified.json
          if git diff --cached --quiet; then
            echo "Rien a committer."
          else
            git commit -m "chore: record notified repositories"
            git push
          fi
```

### Les deux façons d'exécuter quelque chose

```yaml
# a) Une ACTION réutilisable (élément du marketplace GitHub)
- uses: actions/checkout@v4

# b) Une COMMANDE shell classique
- name: Mon étape
  run: |
    echo "n'importe quelle commande bash"
    python scripts/mon-script.py
```

`actions/checkout@v4` = cloner le code du dépôt dans la machine. **Sans ce step, le répertoire de travail est vide** (c'est la cause n°1 de « fichier introuvable »).

---

## 5. Les déclencheurs (`on:`)

```yaml
on:
  push:                      # à chaque push…
    branches: [main]         # …sur une branche précise
  pull_request:              # à chaque PR ouverte/mise à jour
  schedule:
    - cron: "17 * * * *"     # planifié
  workflow_dispatch:         # lancement manuel depuis l'UI (ou gh)
```

### Le cron (planification)

```
┌───────── minute   (0-59)
│ ┌─────── heure    (0-23)
│ │ ┌───── jour     (1-31)
│ │ │ ┌─── mois     (1-12)
│ │ │ │ ┌ jour semaine (0-6, dimanche=0)
│ │ │ │ │
17 * * * *      → chaque heure, à minute 17
0 3 * * *       → chaque nuit à 03h00
0 9 * * 1       → lundi 09h00
*/5 * * * *     → toutes les 5 minutes
17 9,21 * * *   → 09h17 et 21h17
```

Attention : GitHub **peut décaler** les cron planifiés (file d'attente) ; ce n'est pas du temps réel. Minimum = toutes les 5 minutes.

---

## 6. Expressions `${{ … }}` et contextes

Toute l'intelligence des workflows vient de ces expressions :

```yaml
${{ secrets.SMTP_PASS }}                  # un secret
${{ github.event.repository.name }}       # nom du dépôt courant
${{ github.sha }}                         # commit en cours
${{ github.repository }}                  # "hdmanoach/nom-du-depot"
${{ needs.build.outputs.version }}        # sortie d'un autre job
${{ env.MA_VAR }}                         # variable d'env
```

Contextes principaux :

| Contexte | Contient |
| --- | --- |
| `github` | Événement, repo, commit, branche, acteur |
| `secrets` | Secrets (jamais affichés en clair) |
| `env` | Variables d'environnement |
| `needs` | Sorties des jobs dont on dépend |
| `matrix` | Combinaisons d'un job en parallèle |
| `steps` | Sorties (`outputs`) des étapes précédentes |

Exemple concret (l'ancien workflow Pages) : le build recevait `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}` — le chemin du site se déduisait du **nom du dépôt en direct**, sans rien coder en dur.

---

## 7. Secrets, variables et permissions

### Les secrets

```bash
# Créer un secret (UI : Settings → Secrets and variables → Actions)
# ou en CLI :
gh secret set SMTP_PASS --body "mon-mot-de-passe-application"
```

```yaml
# Dans le workflow :
env:
  SMTP_PASS: ${{ secrets.SMTP_PASS }}
```

Règles d'or :
- Un secret **n'est jamais affiché** dans les logs (GitHub le masque).
- Un secret **n'est pas disponible** dans les workflows déclenchés par une PR d'un fork (fuite classique).
- Ne **jamais** écrire un secret en clair dans le YAML ni dans le code.

### `GITHUB_TOKEN` automatique

Chaque run reçoit un jeton temporaire `${{ secrets.GITHUB_TOKEN }}` (ou `github.token`) pour agir sur le dépôt. Ses droits sont limités par le bloc `permissions:` :

```yaml
permissions:
  contents: write    # lire/écrire le code (commits, push)
  pages: write       # déployer sur Pages
  id-token: write    # authentification OIDC (ex. déployer vers un cloud)
  actions: read
```

**Principe de moindre privilège** : ne donne que ce qui est nécessaire. Ton workflow a besoin de `contents: write` car il **committe** la liste des dépôts notifiés.

Si tu as besoin d'accéder aux **dépôts privés** au-delà du dépôt courant, il faut un PAT (ton `NOTIFY_TOKEN`) stocké en secret.

---

## 8. Lire et débuguer un run

1. Onglet **Actions** du dépôt → clique sur le run concerné.
2. Clique sur l'étape pour voir son **log** (chaque commande + sa sortie).
3. Échec → l'étape est en rouge, les suivantes sont grisées (« skipped »).

Bonne pratique : ajouter des `echo` :

```bash
echo "REPO=$REPO — $(date)"
```

Pour re-lancer : bouton **Re-run all jobs** (ou re-run failed jobs).

Aussi utile : **Artifacts** — les fichiers produits par un run peuvent être téléchargeés en bas de page du run (ex. un build `out/`).

### Débogage sans push

- **`workflow_dispatch`** : déclenche manuel depuis l'UI (branche choisie) — parfait pour tester.
- **Logs détaillés** : Actions → ⋯ → Enable debug logging (variables `ACTIONS_RUNNER_DEBUG` / `ACTIONS_STEP_DEBUG`).
- **Tester la logique localement** : ton `notify-new-repos.py` s'exécute aussi sur ta machine :

```bash
python3 scripts/notify-new-repos.py
```

(les secrets ne sont pas là → le script logue « secrets absents » et ne fait rien de dangereux.)

---

## 9. La CLI `gh` (l'outil de la ligne de commande GitHub)

`gh` = officielle GitHub CLI. Installée ? `gh --version`. Sinon :

```bash
sudo apt install gh      # ou brew install gh
gh auth login
```

### Commandes Actions quotidiennes

```bash
gh run list                          # derniers runs de CE dépôt
gh run list --workflow=notify-new-repos.yml
gh run view                         # détails du dernier run
gh run view <run-id> --log          # logs complets
gh run view <run-id> --log-failed   # uniquement ce qui a échoué
gh run watch                        # suit un run en direct
gh run rerun <run-id>               # relancer
gh workflow run notify-new-repos.yml        # déclencher (workflow_dispatch)
gh workflow run notify-new-repos.yml -f branche=main

gh secret list                      # secrets existants
gh secret set SMTP_PASS             # créer/mettre à jour un secret
gh secret set SMTP_PASS < .env.local        # depuis un fichier
gh api repos/hdmanoach/<repo>/actions/runs  # API REST brute
```

Astuce : depuis n'importe quel dossier du dépôt, `gh run list` détecte automatiquement le repo courant.

---

## 10. Patterns avancés

### a) Jobs dépendants (`needs`)

```yaml
jobs:
  test:
    runs-on: ubuntu-latest
    steps: [ ... ]
  deploy:
    needs: test              # ne s'exécute QUE si test réussit
    runs-on: ubuntu-latest
    steps: [ ... ]
```

### b) Conditions (`if`)

```yaml
  deploy:
    if: github.ref == 'refs/heads/main'   # seulement sur main
```

### c) Matrice (tester N combinaisons)

```yaml
    strategy:
      matrix:
        node: [20, 22]
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node }}
```

### d) Cache (accélérer `npm ci`)

```yaml
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm          # cache automatique ~/.npm
```

### e) Concurrency (annuler les runs obsolètes)

```yaml
concurrency:
  group: pages
  cancel-in-progress: true    # un nouveau run annule le précédent en cours
```

### f) Artifacts (partager des fichiers entre jobs)

```yaml
      - uses: actions/upload-artifact@v4
        with:
          name: build
          path: out/
      # dans un autre job :
      - uses: actions/download-artifact@v4
```

### g) Sorties d'une étape (`outputs`)

```yaml
      - id: version
        run: echo "version=$(cat VERSION)" >> "$GITHUB_OUTPUT"
      - run: echo "version ${{ steps.version.outputs.version }}"
```

---

## 11. Exemple complet : déployer sur GitHub Pages

Workflow **retiré** de ce dépôt (tu utilises Vercel), mais voici comment il marchait — à recréer tel quel si tu réactives Pages un jour (`.github/workflows/deploy.yml`) :

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write          # déployer
  id-token: write       # prouver l'identité (OIDC)

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          # chemin public = /<nom du dépôt> (hdmanoach.github.io/<repo>/)
          NEXT_PUBLIC_BASE_PATH: /${{ github.event.repository.name }}
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: out

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

Pour réactiver : recréer le fichier + **Settings → Pages → Source : GitHub Actions**.

> Avec Vercel, `NEXT_PUBLIC_BASE_PATH` reste **absent** → le site est servi à la racine du domaine. Le code lit cette variable (`next.config.mjs`, `lib/site-config.ts`) ; si elle est absente, pas de préfixe.

---

## 12. Sécurité et bonnes pratiques

1. **Permissions minimales** : un bloc `permissions:` explicite sur chaque workflow.
2. **Piner les actions** : `actions/checkout@v4` (version majeure) — en environnement sensible, préfère le **SHA** : `actions/checkout@<sha>` (impossible à modifier après coup).
3. **Méfiance aux actions tierces** : chaque `uses:` exécute du code externe ; privilégie les officielles (`actions/*`).
4. **Pas de secrets dans les PR de forks** (comportement par défaut, ne pas contourner).
5. **Une seule source de vérité** : ne duplique pas une config entre YAML et code — d'où l'intérêt de `github.event.repository.name` ou de variables d'env.
6. **Étapes idempotentes** : le commit du workflow notifieur ne committe **que s'il y a quelque chose** (`git diff --cached --quiet`) — relancer ne casse rien.
7. **Les logs sont publics** sur un dépôt public : tout `echo` y est visible par tout le monde (les secrets, eux, sont masqués).

---

## 13. Limites et coûts

| | Dépôt **public** | Dépôt **privé** |
| --- | --- | --- |
| Minutes Linux/mois | **Illimité** | 2 000 (plan gratuit) |
| Minutes macOS | Illimité | 500 |
| Minutes Windows | Illimité | 1 000 |

- Un run sur `ubuntu-latest` consomme **1 minute réelle = 1 minute** (facturation à la minute, arrondie).
- Timeout par défaut d'un job : **6 heures**.
- Concurrent runs simultanés : 20 (public) / 10 (privé).
- Stockage des artifacts : 500 Mo par dépôt (public : illimité).

---

## 14. Exercices pratiques

1. **Lis** `notify-new-repos.yml` ligne par ligne à voix haute en utilisant le glossaire (§2). Tu dois pouvoir expliquer chaque mot.
2. **Déclenche-le manuellement** : onglet Actions → *Notify new repositories* → *Run workflow* → ouvre le run et suis les logs.
3. **Ajoute une étape de test** qui vérifie la syntaxe du script avant exécution :
   ```yaml
   - name: Syntax check
     run: python -m py_compile scripts/notify-new-repos.py
   ```
4. **Fais échouer volontairement** une étape (`exit 1`) : observe le rouge + « skipped », puis corrige et *Re-run*.
5. **Crée un workflow** `ci.yml` qui, à chaque push, exécute `npm run build` (pour vérifier que le build ne casse pas avant même Vercel).

---

## 15. Résumé — cheat sheet

```yaml
name: Mon workflow
on:                          # QUAND
  push: { branches: [main] }
  schedule: [{ cron: "0 9 * * *" }]
  workflow_dispatch:
permissions: { contents: read }
jobs:                        # QUOI (en parallèle)
  mon-job:
    runs-on: ubuntu-latest   # OÙ
    needs: un-autre-job      # dépendance
    steps:                   # ORDRE (en série)
      - uses: actions/checkout@v4
      - run: echo "hello ${{ github.repository }}"
        env:
          TOKEN: ${{ secrets.MON_SECRET }}
```

| Je veux… | Je regarde… |
| --- | --- |
| Comprendre un run | Onglet **Actions** → run → étape → log |
| Relancer | **Re-run all jobs** ou `gh run rerun` |
| Déclencher à la main | `workflow_dispatch` ou `gh workflow run` |
| Un accès réseau/code | `permissions:` + `secrets` |
| Que ça ne tourne qu'une fois à la fois | `concurrency` + `cancel-in-progress` |
| Accélérer | `cache: npm` |
| Aller plus loin | `gh run view --log`, docs : [docs.github.com/actions](https://docs.github.com/actions) |
