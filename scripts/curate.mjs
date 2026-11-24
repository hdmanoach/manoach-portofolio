import { readFile, writeFile } from "node:fs/promises";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

await (async () => {
  try {
    const text = await readFile(new URL("../.env", import.meta.url), "utf8");
    for (const line of text.split("\n")) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/);
      if (match && !(match[1] in process.env)) {
        process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* .env absent */
  }
})();

const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER || "hdmanoach";
const FILE = new URL("../data/projects.json", import.meta.url);
const DOMAINS = ["data-ia", "sysadmin", "devops", "cyber", "webdev"];

const DOMAIN_LABELS = {
  "data-ia": "Data & IA",
  sysadmin: "Administration systèmes",
  devops: "DevOps",
  cyber: "Cybersécurité",
  webdev: "Développement web"
};

const KEYWORDS = {
  "data-ia": ["churn", "numpy", "data", "ia", "ai", "ml", "ocr", "scraper", "film", "knn", "sum", "classif"],
  sysadmin: ["linux", "server", "sysadmin", "reseau", "réseau", "vlan", "ospf", "proxmox", "debian", "windows-server", "gestion-utilisateurs", "nexora", "redhat", "keyclo"],
  devops: ["docker", "ci", "cd", "deploy", "workflow", "aws", "pipeline", "job", "devops", "background", "screenshot", "certification"],
  cyber: ["security", "firewall", "audit", "scan", "cyber", "ids", "intrusion", "wazuh", "controle", "2fa", "vuln"],
  webdev: ["react", "next", "flask", "django", "fastapi", "frontend", "api", "app", "site", "web", "appointment", "examen", "citation", "lecture", "client"]
};

const rl = readline.createInterface({ input, output });

async function ask(question, defaultValue = "") {
  const suffix = defaultValue ? ` [${defaultValue}]` : "";
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || defaultValue;
}

async function confirm(question) {
  const answer = (await rl.question(`${question} (o/N): `)).trim().toLowerCase();
  return answer === "o" || answer === "oui" || answer === "y" || answer === "yes";
}

async function fetchRepos() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-curator"
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const repos = [];
  for (let page = 1; page <= 10; page += 1) {
    const url = `https://api.github.com/users/${OWNER}/repos?per_page=100&page=${page}&sort=pushed`;
    const res = await fetch(url, { headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status} — ${await res.text()}`);
    const batch = await res.json();
    repos.push(...batch);
    if (batch.length < 100) break;
  }
  return repos;
}

function guessDomain(name, description) {
  const haystack = `${name} ${description || ""}`.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const domain of DOMAINS) {
    const score = KEYWORDS[domain].reduce(
      (acc, keyword) => acc + (haystack.includes(keyword) ? 1 : 0),
      0
    );
    if (score > bestScore) {
      bestScore = score;
      best = domain;
    }
  }
  return best || "webdev";
}

function sortProjects(list) {
  return [...list].sort((a, b) => DOMAINS.indexOf(a.domain) - DOMAINS.indexOf(b.domain));
}

async function save(projects) {
  const payload = { projects: sortProjects(projects) };
  await writeFile(FILE, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
}

async function fetchReadme(repo) {
  try {
    const headers = {
      Accept: "application/vnd.github+json",
      "User-Agent": "portfolio-curator"
    };
    if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    const res = await fetch(
      `https://api.github.com/repos/${OWNER}/${repo.name}/readme`,
      { headers }
    );
    if (!res.ok) return null;
    const data = await res.json();
    const content = Buffer.from(data.content, "base64").toString("utf8");
    const line = content
      .split("\n")
      .map((entry) => entry.trim())
      .find(
        (entry) =>
          entry &&
          !entry.startsWith("#") &&
          !entry.startsWith("[!") &&
          !entry.startsWith("![") &&
          !entry.startsWith("```") &&
          entry.length > 40
      );
    if (!line) return null;
    return line
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_`]/g, "")
      .slice(0, 240);
  } catch {
    return null;
  }
}

async function main() {
  if (!process.env.GITHUB_TOKEN) {
    console.log(
      "Remarque : sans GITHUB_TOKEN, les dépôts privés n'apparaîtront pas dans la liste GitHub.\n"
    );
  }

  const repos = await fetchRepos();
  const { projects } = JSON.parse(await readFile(FILE, "utf8"));

  console.log(`${repos.length} dépôts récupérés sur GitHub, ${projects.length} déjà publiés.\n`);

  for (const repo of repos) {
    const index = projects.findIndex((p) => p.name.toLowerCase() === repo.name.toLowerCase());
    const visibility = repo.private ? "PRIVÉ" : "PUBLIC";
    const existing = index >= 0 ? projects[index] : null;

    console.log(`── ${repo.name} [${visibility}]${existing ? ` — publié (${existing.domain})` : ""}`);
    if (repo.description) console.log(`   ${repo.description}`);

    if (existing) {
      if (await confirm("   Retirer du portfolio ?")) {
        projects.splice(index, 1);
        await save(projects);
        console.log("   retiré.\n");
      } else {
        console.log("   conservé.\n");
      }
      continue;
    }

    if (!(await confirm("   Publier sur le portfolio ?"))) {
      console.log("   ignoré.\n");
      continue;
    }

    const guessed = guessDomain(repo.name, repo.description);
    console.log(`   Domaines : ${DOMAINS.map((d) => `${d} (${DOMAIN_LABELS[d]})`).join(", ")}`);
    const domain = await ask("   Domaine", guessed);
    if (!DOMAINS.includes(domain)) {
      console.log(`   Domaine inconnu « ${domain} » — ignoré.\n`);
      continue;
    }

    const readme = await fetchReadme(repo);
    if (readme) console.log(`   README : ${readme}`);

    const summaryFr = await ask(
      "   Résumé FR",
      existing?.summary?.fr || repo.description || readme || ""
    );
    const summaryEn = await ask("   Résumé EN", summaryFr);
    const tagsRaw = await ask("   Tags (séparés par des virgules)", "");
    const demo = (await ask("   URL en ligne (laisser vide si pas déployé)", "")) || undefined;

    projects.push({
      id: repo.name.toLowerCase(),
      name: repo.name,
      url: repo.html_url,
      private: Boolean(repo.private),
      domain,
      tags: tagsRaw
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      summary: { fr: summaryFr, en: summaryEn },
      ...(demo ? { demo } : {})
    });

    await save(projects);
    console.log("   publié.\n");
  }

  await save(projects);
  console.log(`Terminé — ${projects.length} projets dans data/projects.json`);
}

main()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(() => rl.close());
