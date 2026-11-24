"use client";

import { useLanguage } from "@/lib/language";
import type { Lang, Project } from "@/lib/types";

function buildAccessMailto(project: Project, lang: Lang): string {
  const subject =
    lang === "fr"
      ? `Demande d'accès au dépôt ${project.name}`
      : `Access request for the ${project.name} repository`;
  const body =
    lang === "fr"
      ? `Bonjour Manoach,\n\nJe souhaite consulter le dépôt privé « ${project.name} » :\n${project.url}\n\nMerci.`
      : `Hi Manoach,\n\nI would like to view the private repository "${project.name}":\n${project.url}\n\nThank you.`;
  return `mailto:hdmanoach@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ProjectCard({ project, index, total }: { project: Project; index: number; total: number }) {
  const { lang, t } = useLanguage();

  return (
    <article className="project-card">
      <div className="card-top">
        <span className={`stamp-status ${project.private ? "private" : "public"}`}>
          {project.private ? t.statusPrivate : t.statusPublic}
        </span>
        <span className="repo-index">
          {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <h3 className="repo-name">{project.name}</h3>
      <p className="card-summary">{project.summary[lang]}</p>

      <div className="tags">
        {project.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className="card-actions">
        {project.demo && (
          <a
            className="link-demo"
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.viewDemo}
          </a>
        )}
        {project.private ? (
          <a className="btn-access" href={buildAccessMailto(project, lang)}>
            {t.requestAccess}
          </a>
        ) : (
          <a
            className="link-github"
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t.viewGithub}
          </a>
        )}
      </div>
    </article>
  );
}
