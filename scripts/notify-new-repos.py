#!/usr/bin/env python3
import json
import os
import smtplib
import urllib.request
from email.mime.text import MIMEText
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def load_env():
    try:
        for line in (ROOT / ".env").read_text(encoding="utf-8").splitlines():
            if "=" in line and not line.strip().startswith("#"):
                key, value = line.split("=", 1)
                key = key.strip()
                value = value.strip().strip('"').strip("'")
                if key and key not in os.environ:
                    os.environ[key] = value
    except FileNotFoundError:
        pass


load_env()

OWNER = os.environ.get("NEXT_PUBLIC_GITHUB_OWNER", "hdmanoach")
REPO = os.environ.get("NEXT_PUBLIC_GITHUB_REPO", "portfolio-devops-admin")
CURATE_URL = f"https://{OWNER}.github.io/{REPO}/curate/"


def gh_list_repos():
    token = os.environ.get("NOTIFY_TOKEN") or os.environ.get("GITHUB_TOKEN")
    repos = []
    page = 1
    while page <= 6:
        url = f"https://api.github.com/users/{OWNER}/repos?per_page=100&page={page}&sort=pushed"
        request = urllib.request.Request(
            url,
            headers={
                "Accept": "application/vnd.github+json",
                "User-Agent": "portfolio-notifier",
            },
        )
        if token:
            request.add_header("Authorization", f"Bearer {token}")
        with urllib.request.urlopen(request, timeout=30) as response:
            batch = json.load(response)
        repos.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return repos


def load_json(relative, default):
    try:
        return json.loads((ROOT / relative).read_text(encoding="utf-8"))
    except Exception:
        return default


def main():
    repos = gh_list_repos()
    published = {
        project["name"].lower()
        for project in load_json("data/projects.json", {"projects": []})["projects"]
    }
    notified = load_json("data/curate-notified.json", [])
    new = [
        repo
        for repo in repos
        if repo["name"] not in notified
        and repo["name"].lower() not in published
        and not repo.get("archived")
    ]
    if not new:
        print("Aucun nouveau depot.")
        return

    smtp_user = os.environ.get("SMTP_USER")
    smtp_pass = os.environ.get("SMTP_PASS")
    if not smtp_user or not smtp_pass:
        print(
            f"{len(new)} nouveau(x) depot(s) detecte(s) mais secrets SMTP absents "
            "(SMTP_USER / SMTP_PASS) — email reporte a la prochaine execution."
        )
        return

    lines = []
    for repo in new:
        description = (repo.get("description") or "pas de description").strip()
        visibility = "prive" if repo["private"] else "public"
        lines.append(f"- {repo['name']} ({visibility}) — {description}\n  {repo['html_url']}")

    body = (
        "Bonjour Manoach,\n\n"
        f"{len(new)} nouveau(x) depot(s) GitHub non encore gere(s) par le portfolio :\n\n"
        + "\n".join(lines)
        + "\n\nPour decidir de leur visibilite sur le portfolio, ouvre le curateur :\n"
        + CURATE_URL
        + "\n\nLes depots deja publies ou deja notifies ne sont pas listes.\n"
    )

    message = MIMEText(body, "plain", "utf-8")
    message["Subject"] = f"[Portfolio] {len(new)} nouveau(x) depot(s) a reviewer"
    message["From"] = smtp_user
    message["To"] = smtp_user

    with smtplib.SMTP("smtp.gmail.com", 587, timeout=30) as server:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, [smtp_user], message.as_string())

    notified.extend(repo["name"] for repo in new)
    (ROOT / "data/curate-notified.json").write_text(
        json.dumps(notified, indent=2, ensure_ascii=False) + "\n",
        encoding="utf-8",
    )
    print(f"Email envoye pour {len(new)} depot(s).")


if __name__ == "__main__":
    main()
