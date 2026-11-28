import type { DomainId, DomainMeta, Lang } from "./types";

interface Strings {
  navAbout: string;
  navSkills: string;
  navProjects: string;
  navTraining: string;
  navContact: string;
  eyebrow: string;
  heroTitle: string;
  heroLead: string;
  heroMeta: (repos: number) => string;
  cvLabels: Record<string, string>;
  aboutLabel: string;
  aboutTitle: string;
  skillsLabel: string;
  skillsTitle: string;
  projectsLabel: string;
  projectsTitle: string;
  projectsHint: string;
  trainingLabel: string;
  trainingTitle: string;
  trainingHint: string;
  valueLabel: string;
  valueTitle: string;
  dossier: string;
  projectsCount: (n: number) => string;
  statusPublic: string;
  statusPrivate: string;
  viewGithub: string;
  viewDemo: string;
  requestAccess: string;
  prev: string;
  next: string;
  emptyDomain: string;
  footerNote: string;
  footerContact: string;
  backToTop: string;
  linkedIn: string;
  github: string;
  email: string;
  whatsapp: string;
}

const fr: Strings = {
  navAbout: "À propos",
  navSkills: "Compétences",
  navProjects: "Projets",
  navTraining: "Formations",
  navContact: "Contact",
  eyebrow: "Dossier ouvert — portfolio 2026",
  heroTitle: "Manoach HOSSOU DODO",
  heroLead:
    "Titulaire d'une licence en réseaux, mobilité et sécurité, je documente ici mes projets classés par domaine : administration système, DevOps, cybersécurité, data et développement web.",
  heroMeta: (repos) => `${repos} dépôts indexés · 5 domaines · sélection éditoriale`,
  cvLabels: {
    "cv-admin-systeme.pdf": "CV — Administration Système ↓",
    "cv-developpement-web.pdf": "CV — Développement web ↓"
  },
  aboutLabel: "À propos",
  aboutTitle: "Titulaire d'une licence, orienté infrastructure, sécurité et automatisation.",
  skillsLabel: "Compétences",
  skillsTitle: "Administration système, infrastructure et DevOps",
  projectsLabel: "Section projets",
  projectsTitle: "Index des dépôts",
  projectsHint: "Ouvrez un dossier pour parcourir les projets de chaque domaine.",
  trainingLabel: "Formations",
  trainingTitle: "Certifications et formations terminées",
  trainingHint: "Certifications et parcours suivis — sélection par domaine",
  valueLabel: "Observations",
  valueTitle: "Ce que ces projets démontrent.",
  dossier: "Dossier",
  projectsCount: (n) => `${n} projet${n > 1 ? "s" : ""}`,
  statusPublic: "Public",
  statusPrivate: "Privé",
  viewGithub: "Voir sur GitHub ↗",
  viewDemo: "Voir le site ↗",
  requestAccess: "Demander l'accès",
  prev: "Projet précédent",
  next: "Projet suivant",
  emptyDomain: "Aucun dépôt publié dans ce domaine pour l'instant.",
  footerNote: "Classé et conservé à Cotonou, Bénin",
  footerContact: "Contact",
  backToTop: "Retour en haut",
  linkedIn: "LinkedIn",
  github: "GitHub",
  email: "Email",
  whatsapp: "WhatsApp"
};

const en: Strings = {
  navAbout: "About",
  navSkills: "Skills",
  navProjects: "Projects",
  navTraining: "Courses",
  navContact: "Contact",
  eyebrow: "Open file — portfolio 2026",
  heroTitle: "Manoach HOSSOU DODO",
  heroLead:
    "Holder of a bachelor's degree in networks, mobility and security, I document here my projects sorted by domain: systems administration, DevOps, cybersecurity, data and web development.",
  heroMeta: (repos) => `${repos} indexed repositories · 5 domains · editorial selection`,
  cvLabels: {
    "cv-admin-systeme.pdf": "CV — Systems Administration ↓",
    "cv-developpement-web.pdf": "CV — Web Development ↓"
  },
  aboutLabel: "About",
  aboutTitle: "Bachelor's degree holder, focused on infrastructure, security and automation.",
  skillsLabel: "Skills",
  skillsTitle: "Systems administration, infrastructure and DevOps",
  projectsLabel: "Projects section",
  projectsTitle: "Repository index",
  projectsHint: "Open a dossier to browse the projects of each domain.",
  trainingLabel: "Courses",
  trainingTitle: "Certifications and training completed",
  trainingHint: "Certifications and training paths — sorted by domain",
  valueLabel: "Notes",
  valueTitle: "What these projects demonstrate.",
  dossier: "File",
  projectsCount: (n) => `${n} project${n > 1 ? "s" : ""}`,
  statusPublic: "Public",
  statusPrivate: "Private",
  viewGithub: "View on GitHub ↗",
  viewDemo: "View live ↗",
  requestAccess: "Request access",
  prev: "Previous project",
  next: "Next project",
  emptyDomain: "No repository published in this domain yet.",
  footerNote: "Filed and kept in Cotonou, Benin",
  footerContact: "Contact",
  backToTop: "Back to top",
  linkedIn: "LinkedIn",
  github: "GitHub",
  email: "Email",
  whatsapp: "WhatsApp"
};

export const dict: Record<Lang, Strings> = { fr, en };

export const domains: DomainMeta[] = [
  {
    id: "data-ia",
    num: 1,
    title: { fr: "Data & IA", en: "Data & AI" },
    description: {
      fr: "De l'analyse numérique à la prédiction : notebooks Python, modèles supervisés et extraction de données.",
      en: "From numerical analysis to prediction: Python notebooks, supervised models and data extraction."
    }
  },
  {
    id: "sysadmin",
    num: 2,
    title: { fr: "Administration systèmes", en: "Systems Administration" },
    description: {
      fr: "Serveurs, annuaires, réseaux et reprise d'activité — des labos complets et documentés.",
      en: "Servers, directories, networks and disaster recovery — complete, well-documented labs."
    }
  },
  {
    id: "devops",
    num: 3,
    title: { fr: "DevOps", en: "DevOps" },
    description: {
      fr: "Conteneurs, pipelines et déploiements : automatiser du commit jusqu'à la production.",
      en: "Containers, pipelines and deployments: automating from commit to production."
    }
  },
  {
    id: "cyber",
    num: 4,
    title: { fr: "Cybersécurité", en: "Cybersecurity" },
    description: {
      fr: "Audit, détection et durcissement — outils et labos de sécurité offensive et défensive.",
      en: "Auditing, detection and hardening — offensive and defensive security tools and labs."
    }
  },
  {
    id: "webdev",
    num: 5,
    title: { fr: "Développement web", en: "Web Development" },
    description: {
      fr: "Applications et APIs du front au back : Django, Flask, FastAPI, React et Next.js.",
      en: "Applications and APIs from front to back: Django, Flask, FastAPI, React and Next.js."
    }
  }
];

export const domainOrder: DomainId[] = domains.map((d) => d.id);
