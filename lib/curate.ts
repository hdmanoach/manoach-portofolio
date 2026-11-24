import type { DomainId, Project } from "./types";

export const OWNER = process.env.NEXT_PUBLIC_GITHUB_OWNER ?? "hdmanoach";
export const REPO = process.env.NEXT_PUBLIC_GITHUB_REPO ?? "manoach-portfolio";

export const CURATOR_PASSWORD_HASH =
  "b64dd2b0bd2cb6f384ddd267cc646aea701d314e3d19af0a10e1d557d71fa3b1";

export const DOMAINS: DomainId[] = ["data-ia", "sysadmin", "devops", "cyber", "webdev"];

const KEYWORDS: Record<DomainId, string[]> = {
  "data-ia": ["churn", "numpy", "data", "ia", "ai", "ml", "ocr", "scraper", "film", "knn", "sum", "classif"],
  sysadmin: ["linux", "server", "sysadmin", "reseau", "réseau", "vlan", "ospf", "proxmox", "debian", "windows-server", "gestion-utilisateurs", "nexora", "redhat", "keyclo"],
  devops: ["docker", "ci", "cd", "deploy", "workflow", "aws", "pipeline", "job", "devops", "background", "screenshot", "certification"],
  cyber: ["security", "firewall", "audit", "scan", "cyber", "ids", "intrusion", "wazuh", "controle", "2fa", "vuln"],
  webdev: ["react", "next", "flask", "django", "fastapi", "frontend", "api", "app", "site", "web", "appointment", "examen", "citation", "lecture", "client"]
};

export function guessDomain(name: string, description?: string | null): DomainId {
  const haystack = `${name} ${description || ""}`.toLowerCase();
  let best: DomainId | null = null;
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

export function sortProjects(list: Project[]): Project[] {
  return [...list].sort((a, b) => DOMAINS.indexOf(a.domain) - DOMAINS.indexOf(b.domain));
}
