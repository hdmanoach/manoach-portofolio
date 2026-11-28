"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { CURATOR_PASSWORD_HASH, DOMAINS, OWNER, REPO, guessDomain, sortProjects } from "@/lib/curate";
import { domains } from "@/lib/i18n";
import type { DomainId, Project } from "@/lib/types";

interface GhRepo {
  name: string;
  html_url: string;
  private: boolean;
  description: string | null;
  topics: string[];
  pushed_at: string;
}

interface Row {
  name: string;
  url: string;
  private: boolean;
  description: string | null;
  pushedAt: string | null;
  topics: string[];
}

type Status = { kind: "ok" | "err" | "info"; text: string } | null;

const TOKEN_KEY = "portfolio-curator-token";
const UNLOCK_KEY = "portfolio-curator-unlocked";

async function sha256Hex(text: string): Promise<string> {
  const bytes = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function gh(pathname: string, token: string, init?: RequestInit): Promise<any> {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "portfolio-curator-web"
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (init?.body) headers["Content-Type"] = "application/json";
  const res = await fetch(`https://api.github.com${pathname}`, { ...init, headers });
  if (!res.ok) {
    let detail = "";
    try {
      detail = (await res.json()).message || "";
    } catch {
      detail = await res.text();
    }
    throw new Error(`GitHub ${res.status}${detail ? ` — ${detail}` : ""}`);
  }
  return res.json();
}

async function fetchAllPages(path: string, token: string): Promise<GhRepo[]> {
  const out: GhRepo[] = [];
  for (let page = 1; page <= 6; page += 1) {
    const sep = path.includes("?") ? "&" : "?";
    const batch = await gh(`${path}${sep}per_page=100&page=${page}`, token);
    out.push(...batch);
    if (batch.length < 100) break;
  }
  return out;
}

async function fetchRepos(token: string): Promise<GhRepo[]> {
  const byName = new Map<string, GhRepo>();
  const publicRepos = await fetchAllPages(`/users/${OWNER}/repos?sort=full_name`, "");
  for (const repo of publicRepos) byName.set(repo.name, repo);
  if (token) {
    try {
      const owned = await fetchAllPages(`/user/repos?affiliation=owner&sort=full_name`, token);
      for (const repo of owned) byName.set(repo.name, repo);
    } catch {
    }
  }
  return [...byName.values()].sort((a, b) => a.name.localeCompare(b.name));
}

async function fetchReadmeSummary(name: string, token: string): Promise<string | null> {
  try {
    const data = await gh(`/repos/${OWNER}/${name}/readme`, token);
    const binary = atob(String(data.content).replace(/\n/g, ""));
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const text = new TextDecoder("utf-8").decode(bytes);
    const line = text
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

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function buildPayload(projects: Project[]): { payload: { projects: Project[] }; skipped: number } {
  const valid = projects.filter((project) => project.summary.fr.trim());
  return {
    payload: { projects: sortProjects(valid) },
    skipped: projects.length - valid.length
  };
}

export default function Curator({ initialProjects }: { initialProjects: Project[] }) {
  const [token, setToken] = useState("");
  const [repos, setRepos] = useState<GhRepo[] | null>(null);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [filter, setFilter] = useState("");
  const [status, setStatus] = useState<Status>(null);
  const [busy, setBusy] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [baseline, setBaseline] = useState<Project[]>(initialProjects);
  const [tokenCheck, setTokenCheck] = useState<{
    kind: "checking" | "ok" | "invalid" | "readonly" | "error";
    message: string;
  } | null>(null);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(UNLOCK_KEY) === "1") setUnlocked(true);
    } catch {
      setUnlocked(false);
    }
  }, []);

  const loadRepos = useCallback(async (useToken: string) => {
    setBusy(true);
    setStatus({ kind: "info", text: "Lecture de GitHub…" });
    try {
      const list = await fetchRepos(useToken);
      setRepos(list);
      setStatus({
        kind: "ok",
        text: `${list.length} dépôt${list.length > 1 ? "s" : ""} récupéré${list.length > 1 ? "s" : ""}${useToken ? " (avec token)" : " (public — ajoutez un token pour les privés)"}.`
      });
    } catch (error) {
      setStatus({ kind: "err", text: error instanceof Error ? error.message : String(error) });
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    let saved = "";
    try {
      saved = window.sessionStorage.getItem(TOKEN_KEY) ?? "";
    } catch {
      saved = "";
    }
    if (saved) setToken(saved);
    void loadRepos(saved);
  }, [loadRepos]);

  useEffect(() => {
    if (!unlocked) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") void loadRepos(token);
    }, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, [unlocked, token, loadRepos]);

  const saveToken = (value: string) => {
    setToken(value);
    try {
      if (value) window.sessionStorage.setItem(TOKEN_KEY, value);
      else window.sessionStorage.removeItem(TOKEN_KEY);
    } catch {
      setToken(value);
    }
  };

  useEffect(() => {
    if (!unlocked || !token) {
      setTokenCheck(null);
      return;
    }
    let cancelled = false;
    setTokenCheck({ kind: "checking", message: "Vérification du token…" });
    const id = window.setTimeout(() => {
      void (async () => {
        try {
          await gh("/user", token);
          const meta = await gh(`/repos/${OWNER}/${REPO}`, token);
          if (cancelled) return;
          if (meta?.permissions?.push) {
            setTokenCheck({ kind: "ok", message: "✓ Token valide — push autorisé sur ce dépôt" });
          } else {
            setTokenCheck({
              kind: "readonly",
              message:
                "⚠ Token valide mais sans droit d'écriture — Permissions → Contents: read & write"
            });
          }
        } catch (error) {
          if (cancelled) return;
          const message = error instanceof Error ? error.message : String(error);
          if (message.includes("401") || message.includes("403")) {
            setTokenCheck({
              kind: "invalid",
              message: "✗ Token invalide ou expiré — régénère-le (Fine-grained tokens)"
            });
          } else {
            setTokenCheck({ kind: "error", message });
          }
        }
      })();
    }, 500);
    return () => {
      cancelled = true;
      window.clearTimeout(id);
    };
  }, [unlocked, token]);
  const rows = useMemo<Row[]>(() => {
    const base: Row[] = (repos ?? []).map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      private: repo.private,
      description: repo.description,
      pushedAt: repo.pushed_at,
      topics: repo.topics ?? []
    }));
    for (const project of projects) {
      if (!base.some((row) => row.name === project.name)) {
        base.push({
          name: project.name,
          url: project.url,
          private: project.private,
          description: null,
          pushedAt: null,
          topics: []
        });
      }
    }
    const query = filter.trim().toLowerCase();
    const filtered = query
      ? base.filter((row) => {
          const project = projects.find((entry) => entry.name === row.name);
          const haystack = [
            row.name,
            row.description ?? "",
            row.topics.join(" "),
            project?.domain ?? "",
            project?.tags.join(" ") ?? "",
            project?.summary.fr ?? "",
            project?.summary.en ?? ""
          ]
            .join(" ")
            .toLowerCase();
          return haystack.includes(query);
        })
      : base;
    return filtered.sort((a, b) => {
      const da = a.pushedAt ?? "";
      const db = b.pushedAt ?? "";
      if (da !== db) return db.localeCompare(da);
      return a.name.localeCompare(b.name);
    });
  }, [repos, projects, filter]);

  const publishedCount = projects.length;

  const groups = useMemo(() => {
    const out: { key: string; label: string; rows: Row[] }[] = [];
    for (const row of rows) {
      const label = row.pushedAt
        ? new Date(row.pushedAt).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
          })
        : "Sans date — privés visibles sans token";
      const last = out[out.length - 1];
      if (last && last.label === label) last.rows.push(row);
      else out.push({ key: `${label}-${out.length}`, label, rows: [row] });
    }
    return out;
  }, [rows]);

  const pending = useMemo(() => {
    const beforeByName = new Map(baseline.map((project) => [project.name, project]));
    const currentNames = new Set(projects.map((project) => project.name));
    let count = 0;
    for (const project of projects) {
      const before = beforeByName.get(project.name);
      if (!before || JSON.stringify(before) !== JSON.stringify(project)) count += 1;
    }
    for (const project of baseline) {
      if (!currentNames.has(project.name)) count += 1;
    }
    return count;
  }, [projects, baseline]);

  function addRow(row: Row) {
    setProjects((prev) => {
      if (prev.some((project) => project.name === row.name)) return prev;
      return [
        ...prev,
        {
          id: row.name.toLowerCase(),
          name: row.name,
          url: row.url,
          private: row.private,
          domain: guessDomain(row.name, row.description),
          tags: row.topics.slice(0, 5),
          summary: { fr: row.description ?? "", en: row.description ?? "" }
        }
      ];
    });
  }

  function removeRow(row: Row) {
    setProjects((prev) => prev.filter((project) => project.name !== row.name));
  }

  function patchProject(
    name: string,
    patch: Partial<Omit<Project, "summary">> & { summary?: Partial<Project["summary"]> }
  ) {
    setProjects((prev) =>
      prev.map((project) =>
        project.name === name
          ? {
              ...project,
              ...patch,
              summary: patch.summary ? { ...project.summary, ...patch.summary } : project.summary
            }
          : project
      )
    );
  }

  async function importReadme(row: Row) {
    setBusy(true);
    setStatus({ kind: "info", text: `Lecture du README de ${row.name}…` });
    try {
      const summary = await fetchReadmeSummary(row.name, token);
      if (!summary) {
        setStatus({ kind: "err", text: `Aucun résumé exploitable dans le README de ${row.name}.` });
        return;
      }
      setProjects((prev) =>
        prev.map((project) =>
          project.name === row.name
            ? {
                ...project,
                summary: {
                  fr: summary,
                  en: project.summary.en.trim() ? project.summary.en : summary
                }
              }
            : project
        )
      );
      setStatus({ kind: "ok", text: `Résumé importé depuis le README de ${row.name}.` });
    } catch (error) {
      setStatus({ kind: "err", text: error instanceof Error ? error.message : String(error) });
    } finally {
      setBusy(false);
    }
  }

  function download() {
    const { payload, skipped } = buildPayload(projects);
    const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "projects.json";
    link.click();
    URL.revokeObjectURL(url);
    setBaseline(projects);
    setStatus({
      kind: "ok",
      text: `projects.json téléchargé (${payload.projects.length} projet(s)${skipped ? `, ${skipped} sans résumé ignoré(s)` : ""}). À déposer dans data/.`
    });
  }

  async function publishToGitHub() {
    if (!token) {
      setStatus({ kind: "err", text: "Token requis pour pousser sur GitHub (scope Contents: read & write)." });
      return;
    }
    setBusy(true);
    setStatus({ kind: "info", text: "Envoi sur GitHub…" });
    try {
      const { payload, skipped } = buildPayload(projects);
      const meta = await gh(`/repos/${OWNER}/${REPO}`, token);
      if (!meta?.permissions?.push) {
        setStatus({
          kind: "err",
          text: "Token sans droit d'écriture sur ce dépôt — Permissions → Contents: read & write."
        });
        return;
      }
      const branch = meta.default_branch as string;
      let sha: string | undefined;
      try {
        const file = await gh(
          `/repos/${OWNER}/${REPO}/contents/data/projects.json?ref=${branch}`,
          token
        );
        sha = file.sha;
      } catch {
        sha = undefined;
      }
      const message = `chore(data): update curated projects (web)${skipped ? ` — ${skipped} sans résumé ignoré(s)` : ""}`;
      await gh(`/repos/${OWNER}/${REPO}/contents/data/projects.json`, token, {
        method: "PUT",
        body: JSON.stringify({
          message,
          content: toBase64(`${JSON.stringify(payload, null, 2)}\n`),
          sha,
          branch
        })
      });
      setBaseline(projects);
      setStatus({
        kind: "ok",
        text: `Poussé sur ${branch} (${payload.projects.length} projet(s)) — le déploiement (Vercel) se relance tout seul.`
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus({
        kind: "err",
        text:
          message.includes("401") || message.includes("403")
            ? "Token invalide ou expiré — régénère-le (Developer settings → Fine-grained tokens)."
            : message
      });
    } finally {
      setBusy(false);
    }
  }

  if (!unlocked) {
    return (
      <Gate
        onUnlock={() => {
          try {
            window.sessionStorage.setItem(UNLOCK_KEY, "1");
          } catch {
          }
          setUnlocked(true);
        }}
      />
    );
  }

  return (
    <>
      <header className="site-header">
        <div className="container header-row">
          <div className="brand">
            M<span>.</span>H<span>.</span>D
          </div>
          <nav className="site-nav" aria-label="Navigation">
            <Link href="/">← Retour au portfolio</Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="label">Outil d&apos;administration</p>
                <h1 className="curator-title">Curation des dépôts</h1>
              </div>
              <p className="hint">
                Équivalent web de <code>npm run curate</code> : Ajouter / Retirer chaque dépôt,
                éditez résumés et domaines, puis validez avec «&nbsp;Mettre à jour&nbsp;» ou
                «&nbsp;Publier sur GitHub&nbsp;».
              </p>
            </div>

            <div className="fiche curator-panel">
              <div className="curator-controls">
                <label className="curator-field">
                  Token GitHub (optionnel)
                  <input
                    className="curator-input"
                    type="password"
                    autoComplete="off"
                    spellCheck={false}
                    placeholder="ghp_… ou github_pat_…"
                    value={token}
                    onChange={(event) => saveToken(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="curator-btn"
                  disabled={busy}
                  onClick={() => void loadRepos(token)}
                >
                  Rafraîchir depuis GitHub
                </button>
                <span className="curator-count">
                  {repos ? `${repos.length} dépôts` : "liste non chargée"} · {publishedCount} publié
                  {publishedCount > 1 ? "s" : ""}
                </span>
              </div>

              {tokenCheck && (
                <p
                  className={`curator-status ${
                    tokenCheck.kind === "ok"
                      ? "ok"
                      : tokenCheck.kind === "checking"
                        ? "info"
                        : tokenCheck.kind === "readonly"
                          ? "warn"
                          : "err"
                  }`}
                >
                  {tokenCheck.message}
                </p>
              )}

              <div className="curator-controls">
                <button type="button" className="curator-btn" onClick={download}>
                  Télécharger projects.json
                </button>
                <button
                  type="button"
                  className="curator-btn primary"
                  disabled={busy || !token}
                  onClick={() => void publishToGitHub()}
                >
                  Publier sur GitHub
                </button>
              </div>

              {status && <p className={`curator-status ${status.kind}`}>{status.text}</p>}

              {pending > 0 && (
                <p className="curator-status warn">
                  {pending} modification{pending > 1 ? "s" : ""} en attente — clique sur
                  «&nbsp;Mettre à jour&nbsp;» d&apos;une carte ou «&nbsp;Publier sur GitHub&nbsp;»
                  pour appliquer sur le portfolio (token requis), ou télécharge le fichier pour le
                  commiter toi-même.
                </p>
              )}

              <p className="curator-help">
                Sans token : lecture des dépôts publics + téléchargement du fichier. Avec un token
                fine-grained sur ce dépôt (Contents : read &amp; write) : dépôts privés visibles et
                envoi direct sur <code>main</code> — Vercel redéploie tout seul. Le token est
                vérifié avant chaque push (validité + droits d&apos;écriture) et reste dans la
                session du navigateur : jamais dans le code, jamais dans <code>.env</code> — un
                token lisible dans le code public serait volable par n&apos;importe qui.
              </p>
            </div>

            <div className="curator-sticky">
              <input
                className="curator-input curator-search"
                type="search"
                placeholder="Rechercher : nom, résumé, tag, domaine…"
                aria-label="Rechercher un dépôt"
                value={filter}
                onChange={(event) => setFilter(event.target.value)}
              />
              <span className="curator-count">
                {rows.length} affiché{rows.length > 1 ? "s" : ""} sur {repos ? repos.length : "…"} ·{" "}
                {publishedCount} publié{publishedCount > 1 ? "s" : ""}
              </span>
            </div>

            <div className="curator-list">
              {rows.length === 0 && (
                <p className="hint">
                  {repos === null
                    ? "Chargement de la liste GitHub…"
                    : "Aucun dépôt ne correspond au filtre."}
                </p>
              )}
              {groups.map((group) => (
                <section className="curator-group" key={group.key}>
                  <h3 className="curator-date-head">
                    {group.label}
                    <span className="curator-count">
                      {group.rows.length} dépôt{group.rows.length > 1 ? "s" : ""}
                    </span>
                  </h3>
                  {group.rows.map((row) => {
                    const project = projects.find((entry) => entry.name === row.name);
                    const baselineEntry = baseline.find((entry) => entry.name === row.name);
                    const checkState = baselineEntry
                      ? "pub"
                      : project
                        ? "pending"
                        : "none";
                    const modified = Boolean(
                      project &&
                        baselineEntry &&
                        JSON.stringify(project) !== JSON.stringify(baselineEntry)
                    );
                    const action = !project ? "add" : modified ? "update" : "remove";
                    return (
                      <article className="fiche curator-row" key={row.name}>
                        <div className="curator-row-head">
                          <span
                            className={`curator-check ${checkState}`}
                            title={
                              checkState === "pub"
                                ? "Publié sur le portfolio"
                                : checkState === "pending"
                                  ? "Ajouté — en attente de publication"
                                  : "Non publié"
                            }
                          >
                            ✓
                          </span>
                          <span className="curator-name">{row.name}</span>
                          <span
                            className={`stamp-status ${row.private ? "private" : "public"}`}
                          >
                            {row.private ? "Privé" : "Public"}
                          </span>
                          {project && (
                            <span className="repo-index">{project.domain}</span>
                          )}
                          <a
                            className="curator-link"
                            href={row.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            GitHub ↗
                          </a>
                          <button
                            type="button"
                            className={`curator-btn row-action${action === "remove" ? " danger" : " primary"}`}
                            disabled={busy}
                            onClick={() => {
                              if (action === "add") addRow(row);
                              else if (action === "remove") removeRow(row);
                              else void publishToGitHub();
                            }}
                          >
                            {action === "add"
                              ? "Ajouter"
                              : action === "update"
                                ? "Mettre à jour"
                                : "Retirer"}
                          </button>
                        </div>

                        {project && (
                          <div className="curator-fields">
                        <label className="curator-field">
                          Domaine
                          <select
                            className="curator-select"
                            value={project.domain}
                            onChange={(event) =>
                              patchProject(row.name, { domain: event.target.value as DomainId })
                            }
                          >
                            {DOMAINS.map((domain) => {
                              const meta = domains.find((entry) => entry.id === domain);
                              return (
                                <option key={domain} value={domain}>
                                  {domain} — {meta?.title.fr ?? domain}
                                </option>
                              );
                            })}
                          </select>
                        </label>
                        <label className="curator-field">
                          Tags (séparés par des virgules)
                          <input
                            className="curator-input"
                            type="text"
                            value={project.tags.join(", ")}
                            onChange={(event) =>
                              patchProject(row.name, {
                                tags: event.target.value
                                  .split(",")
                                  .map((tag) => tag.trim())
                                  .filter(Boolean)
                              })
                            }
                          />
                        </label>
                        <label className="curator-field full">
                          Résumé FR
                          <textarea
                            className="curator-textarea"
                            rows={2}
                            value={project.summary.fr}
                            onChange={(event) =>
                              patchProject(row.name, { summary: { fr: event.target.value } })
                            }
                          />
                        </label>
                        <label className="curator-field full">
                          Résumé EN
                          <textarea
                            className="curator-textarea"
                            rows={2}
                            value={project.summary.en}
                            onChange={(event) =>
                              patchProject(row.name, { summary: { en: event.target.value } })
                            }
                          />
                        </label>
                        <div className="full curator-demo-row">
                          <label className="curator-field grow">
                            URL en ligne (optionnelle)
                            <input
                              className="curator-input"
                              type="url"
                              placeholder="https://…"
                              value={project.demo ?? ""}
                              onChange={(event) =>
                                patchProject(row.name, {
                                  demo: event.target.value.trim() || undefined
                                })
                              }
                            />
                          </label>
                          <button
                            type="button"
                            className="curator-btn"
                            onClick={() =>
                              patchProject(row.name, {
                                demo: `https://${OWNER}.github.io/${row.name}/`
                              })
                            }
                          >
                            Proposer GitHub Pages
                          </button>
                        </div>
                        <div className="full curator-actions">
                          <button
                            type="button"
                            className="curator-btn"
                            disabled={busy}
                            onClick={() => void importReadme(row)}
                          >
                            Importer le résumé du README
                          </button>
                          <button
                            type="button"
                            className="curator-btn"
                            disabled={busy || row.topics.length === 0}
                            onClick={() => patchProject(row.name, { tags: row.topics.slice(0, 5) })}
                          >
                            Importer les topics GitHub
                          </button>
                          <span className="curator-hint">
                            Le résumé FR est requis pour publier — l&apos;EN retombe sur le FR s&apos;il
                            est vide.
                          </span>
                        </div>
                        </div>
                      )}
                    </article>
                  );
                })}
              </section>
            ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function Gate({ onUnlock }: { onUnlock: () => void }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    let hash = "";
    try {
      hash = await sha256Hex(value);
    } catch {
      hash = "";
    }
    if (hash === CURATOR_PASSWORD_HASH) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setValue("");
    }
  }

  return (
    <main className="gate-wrap">
      <form className="fiche gate" onSubmit={submit}>
        <p className="fiche-tab">Accès restreint</p>
        <h1 className="gate-title">Curation du dossier</h1>
        <p className="gate-hint">Cette page est réservée à son titulaire.</p>
        <input
          className="curator-input"
          type="password"
          autoFocus
          placeholder="Mot de passe"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
        <button className="curator-btn primary" type="submit">
          Entrer
        </button>
        {error && <p className="curator-status err">Mot de passe incorrect.</p>}
      </form>
    </main>
  );
}
