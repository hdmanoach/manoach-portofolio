"use client";

import { DomainPanel } from "@/components/DomainPanel";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import {
  aboutParagraphs,
  certifications,
  education,
  learning,
  skills,
  values
} from "@/lib/content";
import { domains } from "@/lib/i18n";
import { useLanguage } from "@/lib/language";
import { projects, projectsByDomain } from "@/lib/projects";

interface CvLink {
  file: string;
  href: string;
}

function cvLabel(file: string, labels: Record<string, string>): string {
  const known = labels[file];
  if (known) return known;
  const base = file
    .replace(/^cv[-_\s]*/i, "")
    .replace(/\.pdf$/i, "")
    .replace(/[-_]+/g, " ")
    .trim();
  const title = base.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
  return `CV — ${title} ↓`;
}

export default function HomePage({ availableCvs }: { availableCvs: CvLink[] }) {
  const { lang, t } = useLanguage();

  return (
    <>
      <header className="site-header">
        <div className="container header-row">
          <div className="brand">
            M<span>.</span>H<span>.</span>D
          </div>
          <nav className="site-nav" aria-label="Sections">
            <a href="#apropos">{t.navAbout}</a>
            <a href="#competences">{t.navSkills}</a>
            <a href="#projets">{t.navProjects}</a>
            <a href="#formations">{t.navTraining}</a>
            <a href="#contact">{t.navContact}</a>
          </nav>
          <LanguageSwitcher />
        </div>
      </header>

      <main>
        <section className="masthead">
          <div className="container">
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.heroTitle}</h1>
            <p className="role">
              {lang === "fr"
                ? "Admin Système • DevOps • Infrastructure • Sécurité"
                : "Systems Administration • DevOps • Infrastructure • Security"}
            </p>
            <p className="lead">{t.heroLead}</p>
            <p className="meta">{t.heroMeta(projects.length)}</p>
          </div>
        </section>

        <section id="apropos" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="label">{t.aboutLabel}</p>
                <h2>{t.aboutTitle}</h2>
              </div>
            </div>

            <div className="about-grid">
              <div className="about-text">
                {aboutParagraphs.map((paragraph) => (
                  <p key={paragraph.fr}>{paragraph[lang]}</p>
                ))}

                {availableCvs.length > 0 && (
                  <div className="cv-row">
                    {availableCvs.map((cv) => (
                      <a key={cv.file} className="btn-cv" href={cv.href} download>
                        {cvLabel(cv.file, t.cvLabels)}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <div className="fiche-stack">
                <article className="fiche">
                  <p className="fiche-tab">{education.tab[lang]}</p>
                  <h3 className="fiche-title">{education.degree[lang]}</h3>
                  <p className="fiche-meta">{education.place[lang]}</p>
                </article>
                <article className="fiche">
                  <p className="fiche-tab">{learning.tab[lang]}</p>
                  <ul className="fiche-list">
                    {learning.lines.map((line) => (
                      <li key={line.fr}>{line[lang]}</li>
                    ))}
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="competences" className="section alt">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="label">{t.skillsLabel}</p>
                <h2>{t.skillsTitle}</h2>
              </div>
            </div>

            <div className="skills-grid">
              {skills.map((group) => (
                <article className="fiche skill-card" key={group.title.fr}>
                  <p className="fiche-tab">{group.title[lang]}</p>
                  <ul className="fiche-list">
                    {group.items.map((item) => (
                      <li key={item.fr}>{item[lang]}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="projets" className="section">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="label">{t.projectsLabel}</p>
                <h2>{t.projectsTitle}</h2>
              </div>
              <p className="hint">{t.projectsHint}</p>
            </div>

            <div className="domains">
              {domains.map((domain) => (
                <DomainPanel
                  key={domain.id}
                  domain={domain}
                  projects={projectsByDomain(domain.id)}
                />
              ))}
            </div>
          </div>
        </section>

        <section id="formations" className="section alt">
          <div className="container">
            <div className="section-head">
              <div>
                <p className="label">{t.trainingLabel}</p>
                <h2>{t.trainingTitle}</h2>
              </div>
              <p className="hint">{t.trainingHint}</p>
            </div>

            <div className="cert-stack">
              {certifications.map((category) => (
                <section className="fiche cert-category" key={category.title.fr}>
                  <header className="cert-cat-head">
                    <p className="fiche-tab">
                      {category.emoji} {category.title[lang]}
                    </p>
                    <span className="dossier-count">
                      {String(category.items.length).padStart(2, "0")}
                    </span>
                  </header>

                  <ul className="cert-list">
                    {category.items.map((item) => (
                      <li className="cert-item" key={item.name.fr}>
                        <span className="cert-date">{item.date[lang]}</span>
                        <div className="cert-body">
                          <div className="cert-title-row">
                            <strong className="cert-name">{item.name[lang]}</strong>
                            <span className="cert-provider">{item.provider}</span>
                          </div>
                          <p className="cert-skills">{item.skills[lang]}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </section>

        <section id="observations" className="section">
          <div className="container narrow">
            <div className="section-head">
              <div>
                <p className="label">{t.valueLabel}</p>
                <h2>{t.valueTitle}</h2>
              </div>
            </div>

            <div className="fiche">
              <ul className="value-list">
                {values.map((value) => (
                  <li key={value.fr}>{value[lang]}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="contact">
        <div className="container inner">
          <p className="note">
            © 2026 Manoach HOSSOU DODO — {t.footerNote}
          </p>
          <nav className="footer-links" aria-label={t.footerContact}>
            <a
              href="https://www.linkedin.com/in/hdmanoach"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t.linkedIn}
            </a>
            <a href="https://github.com/hdmanoach" target="_blank" rel="noopener noreferrer">
              {t.github}
            </a>
            <a href="mailto:hdmanoach@gmail.com">{t.email}</a>
            <a href="https://wa.me/2290153302489" target="_blank" rel="noopener noreferrer">
              {t.whatsapp}
            </a>
          </nav>
        </div>
      </footer>
    </>
  );
}
