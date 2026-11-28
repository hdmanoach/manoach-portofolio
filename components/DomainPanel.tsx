"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/language";
import type { DomainMeta, Project } from "@/lib/types";
import { ProjectCard } from "./ProjectCard";

export function DomainPanel({ domain, projects }: { domain: DomainMeta; projects: Project[] }) {
  const { lang, t } = useLanguage();
  const count = projects.length;
  const [index, setIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const current = count === 0 ? 0 : Math.min(index, count - 1);

  useEffect(() => {
    if (!autoplay || count < 2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number | undefined;

    const advance = () => {
      setIndex((previous) => (previous + 1) % count);
    };
    const syncTimer = () => {
      if (reducedMotion.matches) {
        if (timer !== undefined) window.clearInterval(timer);
        timer = undefined;
      } else if (timer === undefined) {
        timer = window.setInterval(advance, 30_000);
      }
    };

    syncTimer();
    reducedMotion.addEventListener("change", syncTimer);

    return () => {
      reducedMotion.removeEventListener("change", syncTimer);
      if (timer !== undefined) window.clearInterval(timer);
    };
  }, [autoplay, count]);

  const go = (next: number) => {
    if (count === 0) return;
    setAutoplay(false);
    setIndex(Math.max(0, Math.min(next, count - 1)));
  };

  return (
    <section className="dossier" aria-label={domain.title[lang]} data-reveal>
      <header className="dossier-head">
        <div>
          <p className="dossier-num">
            {t.dossier} n° {String(domain.num).padStart(2, "0")}
          </p>
          <h3 className="dossier-title">{domain.title[lang]}</h3>
        </div>
        {count > 0 && <span className="dossier-count">{t.projectsCount(count)}</span>}
      </header>

      <p className="dossier-desc">{domain.description[lang]}</p>

      {count === 0 ? (
        <div className="carousel">
          <div className="viewport">
            <div className="track">
              <div className="slide">
                <div className="project-card">
                  <p className="card-summary">{t.emptyDomain}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="carousel">
          <div className="viewport">
            <div className="track" style={{ transform: `translateX(-${current * 100}%)` }}>
              {projects.map((project, i) => (
                <div
                  className={`slide${i === current ? " active" : ""}`}
                  key={project.id}
                  inert={i !== current}
                >
                  <ProjectCard project={project} index={i} total={count} />
                </div>
              ))}
            </div>
          </div>

          <div className="carousel-controls">
            <button
              type="button"
              className="arrow"
              onClick={() => go(current - 1)}
              disabled={current === 0}
              aria-label={t.prev}
            >
              ‹
            </button>

            <div className="dots-wrap">
              <div className="dots">
                {projects.map((project, i) => (
                  <button
                    key={project.id}
                    type="button"
                    className={`dot${i === current ? " active" : ""}`}
                    onClick={() => go(i)}
                    aria-label={`${project.name} — ${i + 1}/${count}`}
                    aria-current={i === current}
                  />
                ))}
              </div>
              <span className="counter">
                {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>

            <button
              type="button"
              className="arrow"
              onClick={() => go(current + 1)}
              disabled={current === count - 1}
              aria-label={t.next}
            >
              ›
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
