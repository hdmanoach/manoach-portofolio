import type { Lang } from "./types";

type Bi = Record<Lang, string>;

export const aboutParagraphs: Bi[] = [
  {
    fr: "Titulaire d'une licence en réseaux informatiques, mobilité et sécurité, je souhaite mettre mes compétences au service d'un environnement professionnel où je peux participer à l'administration des systèmes, la supervision des infrastructures, la mise en place de services fiables et l'automatisation des tâches opérationnelles.",
    en: "Holder of a bachelor's degree in computer networks, mobility and security, I want to put my skills to work in a professional environment where I can contribute to systems administration, infrastructure monitoring, reliable service delivery and the automation of operational tasks."
  },
  {
    fr: "Mes projets couvrent plusieurs domaines : Linux, Windows Server, réseaux, pare-feux, sécurité, DevOps et conteneurisation. Ils démontrent une vraie logique d'analyse, de déploiement, de sécurisation et de monitoring.",
    en: "My projects cover several areas: Linux, Windows Server, networking, firewalls, security, DevOps and containerization. They demonstrate a real ability to analyse, deploy, secure and monitor systems."
  }
];

export const education = {
  tab: { fr: "Formation", en: "Education" } as Bi,
  degree: {
    fr: "Licence Réseaux Informatiques, Mobilité et Sécurité (RMS)",
    en: "Bachelor's Degree in Computer Networks, Mobility and Security (RMS)"
  } as Bi,
  place: { fr: "PIGIER Bénin, Cotonou — 2026", en: "PIGIER Benin, Cotonou — 2026" } as Bi
};

export const learning = {
  tab: { fr: "Apprentissage", en: "Learning" } as Bi,
  lines: [
    {
      fr: "Autodidacte en infrastructure, sécurité et DevOps.",
      en: "Self-taught in infrastructure, security and DevOps."
    },
    {
      fr: "Projets pratiques et formations continues.",
      en: "Practical projects and continuous training."
    }
  ] as Bi[]
};

export interface SkillGroup {
  title: Bi;
  items: Bi[];
}

export const skills: SkillGroup[] = [
  {
    title: { fr: "Administration système", en: "Systems administration" },
    items: [
      { fr: "Linux", en: "Linux" },
      { fr: "Windows Server", en: "Windows Server" },
      { fr: "Active Directory", en: "Active Directory" },
      { fr: "DHCP, DNS, GPO", en: "DHCP, DNS, GPO" }
    ]
  },
  {
    title: { fr: "Infrastructure", en: "Infrastructure" },
    items: [
      { fr: "VLAN", en: "VLAN" },
      { fr: "Subnetting", en: "Subnetting" },
      { fr: "Routage", en: "Routing" },
      { fr: "ACL et sécurité réseau", en: "ACLs and network security" }
    ]
  },
  {
    title: { fr: "DevOps", en: "DevOps" },
    items: [
      { fr: "GitHub Actions", en: "GitHub Actions" },
      { fr: "CI/CD", en: "CI/CD" },
      { fr: "Docker", en: "Docker" },
      { fr: "Docker Compose", en: "Docker Compose" }
    ]
  },
  {
    title: { fr: "Monitoring & Sécurité", en: "Monitoring & Security" },
    items: [
      { fr: "Supervision", en: "Monitoring" },
      { fr: "Alertes", en: "Alerts" },
      { fr: "Wazuh", en: "Wazuh" },
      { fr: "Firewalls / pare-feu", en: "Firewalls" }
    ]
  }
];

export interface Certification {
  name: Bi;
  provider: string;
  date: Bi;
  skills: Bi;
}

export interface CertificationCategory {
  emoji: string;
  title: Bi;
  items: Certification[];
}

export const certifications: CertificationCategory[] = [
  {
    emoji: "🌐",
    title: {
      fr: "Administration Système, Réseaux & Sécurité",
      en: "Systems Administration, Networking & Security"
    },
    items: [
      {
        name: { fr: "CCNA3", en: "CCNA3" },
        provider: "Cisco Networking Academy",
        date: { fr: "Nov. 2025", en: "Nov. 2025" },
        skills: {
          fr: "Routage dynamique, Virtualisation, OSPFv2, VPNs IPsec, Sécurisation des accès",
          en: "Dynamic routing, virtualization, OSPFv2, IPsec VPNs, access security"
        }
      },
      {
        name: { fr: "CCNA2", en: "CCNA2" },
        provider: "Cisco Networking Academy",
        date: { fr: "Avr. 2025", en: "Apr. 2025" },
        skills: {
          fr: "Routage, Switching, Commutation Cisco, VLANs, Routage inter-VLAN, STP, EtherChannel",
          en: "Routing, switching, Cisco switching, VLANs, inter-VLAN routing, STP, EtherChannel"
        }
      },
      {
        name: {
          fr: "Introduction To Ethical Hacking Course",
          en: "Introduction To Ethical Hacking Course"
        },
        provider: "Codecademy",
        date: { fr: "Juin 2025", en: "Jun. 2025" },
        skills: { fr: "Nmap, Linux, Sécurité offensive", en: "Nmap, Linux, offensive security" }
      },
      {
        name: {
          fr: "Windows Server 2025 : Active Directory et Stratégies de Groupe",
          en: "Windows Server 2025: Active Directory and Group Policy"
        },
        provider: "LinkedIn Learning",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: {
          fr: "Serveur Windows, Active Directory, GPO",
          en: "Windows Server, Active Directory, GPO"
        }
      },
      {
        name: {
          fr: "Comprendre et Configurer un Firewall",
          en: "Understanding and Configuring a Firewall"
        },
        provider: "LinkedIn Learning",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: {
          fr: "Sécurité périmétrique, Pare-feux, OPNsense, FortiGate",
          en: "Perimeter security, firewalls, OPNsense, FortiGate"
        }
      },
      {
        name: { fr: "Play It Safe: Manage Security Risks", en: "Play It Safe: Manage Security Risks" },
        provider: "Google",
        date: { fr: "Août 2026", en: "Aug. 2026" },
        skills: {
          fr: "Gestion SIEM, Surveillance des événements de sécurité",
          en: "SIEM management, security event monitoring"
        }
      },
      {
        name: { fr: "Foundations of Cybersecurity", en: "Foundations of Cybersecurity" },
        provider: "Google",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: {
          fr: "Analyse du trafic réseau, Gestion des incidents",
          en: "Network traffic analysis, incident management"
        }
      },
      {
        name: {
          fr: "Créer un Script Python pour la Cybersécurité",
          en: "Creating a Python Script for Cybersecurity"
        },
        provider: "LinkedIn Learning",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: {
          fr: "Scripting Python, Automatisation de la sécurité",
          en: "Python scripting, security automation"
        }
      },
      {
        name: {
          fr: "Découvrir la Cryptographie et la Sécurité des Réseaux",
          en: "Discovering Cryptography and Network Security"
        },
        provider: "LinkedIn Learning",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: {
          fr: "Cryptographie, Protocoles sécurisés",
          en: "Cryptography, secure protocols"
        }
      },
      {
        name: {
          fr: "La Sécurité Informatique et Cybersécurité dans les Organisations",
          en: "IT and Cybersecurity in Organizations"
        },
        provider: "LinkedIn Learning",
        date: { fr: "Juin 2026", en: "Jun. 2026" },
        skills: {
          fr: "Opérations de sécurité, Gestion des menaces et vulnérabilités",
          en: "Security operations, threat and vulnerability management"
        }
      },
      {
        name: { fr: "La Sécurité des Applications Web", en: "Web Application Security" },
        provider: "LinkedIn Learning",
        date: { fr: "Juin 2026", en: "Jun. 2026" },
        skills: { fr: "Sécurité applicative Web, OWASP", en: "Web application security, OWASP" }
      },
      {
        name: {
          fr: "Sensibilisation à la Cybersécurité : La Terminologie",
          en: "Cybersecurity Awareness: Terminology"
        },
        provider: "LinkedIn Learning",
        date: { fr: "Juin 2026", en: "Jun. 2026" },
        skills: {
          fr: "Bonnes pratiques, Sécurité de l'information",
          en: "Best practices, information security"
        }
      },
      {
        name: { fr: "Assembler des Données en SQL", en: "Combining Data in SQL" },
        provider: "DataCamp",
        date: { fr: "Juin 2026", en: "Jun. 2026" },
        skills: { fr: "Collecte de données, Requêtage SQL", en: "Data collection, SQL querying" }
      }
    ]
  },
  {
    emoji: "☁️",
    title: { fr: "DevOps & Cloud", en: "DevOps & Cloud" },
    items: [
      {
        name: { fr: "AWS Cloud Practitioner (CLF-C02)", en: "AWS Cloud Practitioner (CLF-C02)" },
        provider: "DataCamp",
        date: { fr: "Août 2026", en: "Aug. 2026" },
        skills: {
          fr: "Concepts fondamentaux AWS, Écosystème Cloud global",
          en: "AWS core concepts, global cloud ecosystem"
        }
      },
      {
        name: {
          fr: "Introduction to Information Technology and AWS Cloud",
          en: "Introduction to Information Technology and AWS Cloud"
        },
        provider: "AWS",
        date: { fr: "Juin 2026", en: "Jun. 2026" },
        skills: {
          fr: "Cloud Computing, Infrastructure informatique fondamentale",
          en: "Cloud computing, fundamental IT infrastructure"
        }
      },
      {
        name: { fr: "Comprendre le Cloud", en: "Understanding the Cloud" },
        provider: "DataCamp",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: {
          fr: "Multi-cloud (Amazon Web Services, Microsoft Azure)",
          en: "Multi-cloud (Amazon Web Services, Microsoft Azure)"
        }
      },
      {
        name: {
          fr: "Envisager une Carrière en tant qu'Administrateur Cloud",
          en: "Considering a Career as a Cloud Administrator"
        },
        provider: "LinkedIn Learning",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: { fr: "Stratégie Cloud, Sécurité Cloud", en: "Cloud strategy, cloud security" }
      },
      {
        name: { fr: "L'essentiel de Docker", en: "Docker Essentials" },
        provider: "LinkedIn Learning",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: {
          fr: "Conteneurisation, Gestion des produits Docker",
          en: "Containerization, Docker product management"
        }
      },
      {
        name: { fr: "Les Fondements du DevOps", en: "DevOps Fundamentals" },
        provider: "LinkedIn Learning",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: { fr: "Culture DevOps, Automatisation, CI/CD", en: "DevOps culture, automation, CI/CD" }
      },
      {
        name: { fr: "Les Fondements des Microservices", en: "Microservices Fundamentals" },
        provider: "LinkedIn Learning",
        date: { fr: "Juil. 2026", en: "Jul. 2026" },
        skills: {
          fr: "Architecture logicielle décentralisée, Microservices",
          en: "Decentralized software architecture, microservices"
        }
      }
    ]
  },
  {
    emoji: "🧠",
    title: { fr: "Données & Compétences Transverses", en: "Data & Soft Skills" },
    items: [
      {
        name: { fr: "Python Developer Associate", en: "Python Developer Associate" },
        provider: "DataCamp",
        date: { fr: "Sept. 2026 – Sept. 2028", en: "Sep. 2026 – Sep. 2028" },
        skills: {
          fr: "Python, programmation, développement logiciel",
          en: "Python, programming, software development"
        }
      },
      {
        name: { fr: "De l'Algèbre Linéaire à l'IA", en: "From Linear Algebra to AI" },
        provider: "Académie des Mathématiques Appliquées",
        date: { fr: "Avr. 2026", en: "Apr. 2026" },
        skills: {
          fr: "Bases mathématiques, Fondations de l'Intelligence Artificielle",
          en: "Mathematical foundations, artificial intelligence fundamentals"
        }
      },
      {
        name: { fr: "Penser comme un Leader", en: "Thinking Like a Leader" },
        provider: "LinkedIn Learning",
        date: { fr: "Juin 2026", en: "Jun. 2026" },
        skills: { fr: "Leadership, Prise de décision", en: "Leadership, decision-making" }
      }
    ]
  }
];

export const values: Bi[] = [
  {
    fr: "Administration et sécurisation de systèmes Linux et Windows",
    en: "Administration and security of Linux and Windows systems"
  },
  {
    fr: "Supervision des ressources et alertes de performance",
    en: "Resource monitoring and performance alerts"
  },
  {
    fr: "Conteneurisation avec Docker et architectures microservices",
    en: "Docker containerization and microservices architectures"
  },
  {
    fr: "Réseaux, pare-feu, sécurité et automatisation des déploiements",
    en: "Networking, firewalls, security and deployment automation"
  },
  {
    fr: "Certifications et formations terminées en administration système, cloud et sécurité",
    en: "Certifications and completed training in systems administration, cloud and security"
  }
];
