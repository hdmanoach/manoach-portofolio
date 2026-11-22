(() => {
  // Sélection de projets à présenter dans le portfolio. Les dépôts privés ne sont
  // pas exposés ici ; les carrousels ne mélangent jamais les domaines.
  const domains = [
    {
      id: 'data-ia', title: 'Data & Intelligence artificielle', short: 'DATA & IA',
      projects: [
        { name: 'Churn Prediction (k-NN)', summary: 'Préparation et analyse de données clients pour prédire le désabonnement d’abonnés télécoms avec k-NN, optimisation de k et évaluation du modèle.', tech: ['Python', 'k-NN', 'Machine learning'], repo: 'churn-knn' },
        { name: 'Churn Prediction AI', summary: 'Projet de machine learning visant à anticiper le départ des clients à partir de leurs comportements et caractéristiques.', tech: ['Machine learning', 'Données clients'], repo: 'Churn-Prediction-AI' },
        { name: 'Analyse des ventes avec NumPy', summary: 'Exploration de données de ventes et calcul d’indicateurs avec Python et NumPy.', tech: ['Python', 'NumPy', 'Analyse de données'], repo: 'analyse-ventes-numpy' },
        { name: 'Générateur de recommandations de films', summary: 'Recommande un film ou une série à partir de deux titres appréciés, en s’appuyant sur les données TMDB et une génération par IA.', tech: ['Next.js', 'FastAPI', 'Gemini', 'TMDB'], repo: 'generateur-films' },
        { name: 'ANIP Django OCR', summary: 'Application Django consacrée à la reconnaissance optique de caractères pour extraire du texte de documents.', tech: ['Python', 'Django', 'OCR'], repo: 'ANIP-Django-OCR' },
        { name: 'Web scraper d’articles', summary: 'Collecte automatique de titres, dates, auteurs et contenus d’articles depuis des sources d’actualité en ligne.', tech: ['Python', 'Requests', 'BeautifulSoup'], repo: 'Web-scraper-to-get-news-article-content' },
        { name: 'SmartTraffic-IoT', summary: 'Traitement de données de supervision routière et calcul d’un score de risque dans une architecture temps réel.', tech: ['Python', 'FastAPI', 'IoT'], repo: 'smarttraffic-iot' }
      ]
    },
    {
      id: 'administration-systemes', title: 'Administration systèmes', short: 'ADMIN SYSTÈMES',
      projects: [
        { name: 'Nexora Systems', summary: 'Reconstruction documentée du système d’information d’une PME sous Debian : services réseau, Samba AD, stockage, supervision Zabbix et sauvegardes dans un parc hybride.', tech: ['Debian', 'Samba AD', 'Zabbix', 'Nginx'], repo: 'nexora-systems' },
        { name: 'Linux Manager', summary: 'Interface Flask d’administration Linux pour gérer utilisateurs, groupes et mots de passe, avec authentification, protection CSRF et journal d’audit.', tech: ['Linux', 'Python', 'Flask', 'Audit'], repo: 'linux-manager' },
        { name: 'Linux System Monitor', summary: 'Tableau de bord de suivi CPU, mémoire, disques, réseau, processus et services, avec historique et alertes.', tech: ['Linux', 'Flask', 'SQLite', 'Monitoring'], repo: 'Linux-System-Monitor' },
        { name: 'Projet Sysadmin Red Hat', summary: 'Travaux documentés de mise en place et d’administration d’une infrastructure système sous Red Hat.', tech: ['Linux', 'Red Hat', 'Infrastructure'], repo: 'Projet_Sysadmin' },
        { name: 'Proxmox Disaster Recovery Lab', summary: 'Plan de sauvegarde et de reprise d’activité avec Proxmox Backup Server, simulation de panne et restauration testée.', tech: ['Proxmox', 'Sauvegarde', 'PRA'], repo: 'proxmox-disaster-recovery-lab' },
        { name: 'Statistiques serveur', summary: 'Script shell qui collecte et présente des statistiques système d’un serveur Linux.', tech: ['Linux', 'Shell', 'Monitoring'], repo: 'server-statistiques' },
        { name: 'Communication entre machines virtuelles', summary: 'Rapport technique sur la configuration d’un réseau isolé entre deux machines virtuelles Debian sous VMware Workstation.', tech: ['Debian', 'VMware', 'Réseau'], repo: 'communication--machines-virtuelles' },
        { name: 'Gestion des utilisateurs et groupes', summary: 'Scripts shell pour automatiser la gestion des comptes utilisateurs et des groupes sous Linux.', tech: ['Linux', 'Shell', 'Automatisation'], repo: 'gestion-utilisateurs-groupes' },
        { name: 'Infrastructure réseau multi-sites', summary: 'Conception d’un réseau multi-sites avec routage OSPF, HSRP, VLAN, services DHCP/DNS et contrôles d’accès.', tech: ['Cisco', 'OSPF', 'VLAN', 'Packet Tracer'], repo: 'Reseau-Multi-Sites-OSPF-HSRP-BLT' },
        { name: 'Réseau entreprise VLAN DHCP', summary: 'Maquette d’un réseau d’entreprise avec subnetting, VLAN, routage inter-VLAN, DHCP et ACL.', tech: ['Cisco', 'VLAN', 'DHCP', 'Packet Tracer'], repo: 'Reseau-Entreprise-VLAN-DHCP' }
      ]
    },
    {
      id: 'devops', title: 'DevOps & Cloud', short: 'DEVOPS',
      projects: [
        { name: 'Dockerfile', summary: 'Conteneurisation avec Docker d’une application web Flask de gestion de rendez-vous.', tech: ['Docker', 'Flask', 'Conteneurisation'], repo: 'dockerfile' },
        { name: 'GitHub Deployment Workflow', summary: 'Automatisation du déploiement d’un site statique avec GitHub Actions et GitHub Pages.', tech: ['GitHub Actions', 'CI/CD', 'GitHub Pages'], repo: 'gh-deployment-workflow' },
        { name: 'SmartTraffic-IoT', summary: 'Déploiement d’une architecture microservices conteneurisée pour traiter des données routières et afficher les alertes dans un tableau de bord.', tech: ['Docker', 'FastAPI', 'Next.js'], repo: 'smarttraffic-iot' },
        { name: 'Certification AWS', summary: 'Feuille de route, notes et exemples pratiques pour préparer des certifications AWS.', tech: ['AWS', 'Cloud', 'Formation'], repo: 'certification-aws' },
        { name: 'Portfolio Admin & DevOps', summary: 'Portfolio personnel présentant des réalisations en administration systèmes, infrastructure, conteneurisation, supervision et sécurité.', tech: ['HTML', 'CSS', 'JavaScript'], repo: 'portfolio-devops-admin' }
      ]
    },
    {
      id: 'cybersecurite', title: 'Cybersécurité', short: 'CYBERSÉCURITÉ',
      projects: [
        { name: 'WebAudit', summary: 'Outil Python d’audit de sécurité web, organisé autour de modules d’analyse, de tests et de documentation.', tech: ['Python', 'Audit web', 'Tests'], repo: 'webaudit' },
        { name: 'Security Agent', summary: 'Agent IDS de laboratoire qui détecte et corrèle des incidents SSH et web, avec interface Flask pour inspection et rapports.', tech: ['Python', 'IDS', 'Flask', 'Logs'], repo: 'security-agent' },
        { name: 'Firewall Formation Lab', summary: 'Laboratoire OPNsense et FortiGate : segmentation réseau, filtrage, VPN et protection des postes.', tech: ['OPNsense', 'FortiGate', 'VPN'], repo: 'firewall-formation-lab' },
        { name: 'Windows Server Cybersecurity Lab', summary: 'Infrastructure hybride Windows/Linux intégrant Active Directory, DNS, DHCP, GPO, Samba et supervision Wazuh.', tech: ['Windows Server', 'Linux', 'Active Directory', 'Wazuh'], repo: 'windows-server-cybersecurity-lab' },
        { name: 'Script d’analyse de logs cyber', summary: 'Analyse de journaux pour repérer des intrusions, générer des alertes et visualiser les événements de sécurité.', tech: ['Python', 'SQLite', 'Matplotlib'], repo: 'script-python-cybersecurit-' },
        { name: 'Gestion d’étudiants sécurisée', summary: 'Application PHP de gestion d’étudiants avec 2FA, RBAC, requêtes préparées et protections contre les vulnérabilités web courantes.', tech: ['PHP', '2FA', 'RBAC', 'OWASP'], repo: 'gestion-etudiant' },
        { name: 'Réseau d’entreprise sécurisé', summary: 'Segmentation par VLAN et règles ACL pour contrôler les communications entre départements.', tech: ['VLAN', 'ACL', 'Cisco'], repo: 'Reseau-Entreprise-VLAN-DHCP' }
      ]
    },
    {
      id: 'developpement-web', title: 'Développement web', short: 'DÉVELOPPEMENT WEB',
      projects: [
        { name: 'Examen Bénin', summary: 'Application éducative pour aider élèves et enseignants à organiser, gérer et préparer les examens.', tech: ['TypeScript', 'Application web'], repo: 'examenbenin', private: true },
        { name: 'Gestion de clients', summary: 'Application Flask de gestion de répertoire client : opérations CRUD, recherche, pagination et validation des coordonnées.', tech: ['Python', 'Flask', 'CRUD'], repo: 'gestion_client' },
        { name: 'Gestion de rendez-vous', summary: 'Application permettant de planifier, organiser et suivre les rendez-vous d’une organisation.', tech: ['Python', 'Application web'], repo: 'Appointment-management-system' },
        { name: 'Project SRVBEN', summary: 'Application Flask de suivi des projets par département, avec gestion des rôles et des statuts.', tech: ['Python', 'Flask', 'Gestion de projets'], repo: 'project-srvben' },
        { name: 'Incident Hub', summary: 'Plateforme de gestion des interventions techniques, tickets et incidents.', tech: ['JavaScript', 'Gestion d’incidents'], repo: 'incident-hub', private: true },
        { name: 'Formulaires Django', summary: 'Application web de création, validation et traitement de formulaires.', tech: ['Python', 'Django'], repo: 'Formulaire-Django' },
        { name: 'Recette API', summary: 'API REST de gestion de recettes de cuisine, construite avec FastAPI.', tech: ['Python', 'FastAPI', 'REST'], repo: 'recette-api' },
        { name: 'Recette Frontend', summary: 'Interface Next.js et TypeScript pour consommer l’API de recettes.', tech: ['Next.js', 'TypeScript'], repo: 'recette-frontend' },
        { name: 'Habit API', summary: 'Dépôt backend d’une application de suivi des habitudes ; détails fonctionnels à confirmer dans le dépôt.', tech: ['API'], repo: 'habit-api' },
        { name: 'Habit Frontend', summary: 'Dépôt frontend d’une application de suivi des habitudes ; détails fonctionnels à confirmer dans le dépôt.', tech: ['Frontend'], repo: 'habit-frontend' },
        { name: 'Convertisseur de devises', summary: 'Convertisseur en temps réel qui estime le coût d’une transaction en tenant compte des frais et commissions.', tech: ['Next.js', 'ExchangeRate API'], repo: 'convertisseur-devises' },
        { name: 'Contrôle parental', summary: 'Projet d’application de contrôle parental, organisé en composants backend et frontend.', tech: ['TypeScript', 'Backend', 'Frontend'], repo: 'controle_parental' },
        { name: 'AgriBlock', summary: 'Application web Flask autour de l’agriculture et de la blockchain ; fonctionnalités exactes à préciser à partir du README.', tech: ['Python', 'Flask', 'Blockchain'], repo: 'agriBlock', private: true },
        { name: 'Générateur de citations', summary: 'Application web de génération de citations, construite avec Next.js et TypeScript.', tech: ['Next.js', 'TypeScript'], repo: 'generateur-citations' },
        { name: 'EchoLecture', summary: 'Application web de lecture ; le dépôt contient une application frontend basée sur Vite et TypeScript.', tech: ['TypeScript', 'Vite'], repo: 'EchoLecture' },
        { name: 'Afrikameuble', summary: 'Projet web autour de la présentation ou de la vente de meubles ; description détaillée à compléter.', tech: ['Web'], repo: 'Afrikameuble' },
        { name: 'Digital Zone BJ', summary: 'Site web publié via GitHub Pages.', tech: ['HTML', 'GitHub Pages'], repo: 'digitalzonebj.github.io' },
        { name: 'Countdown Mobile App', summary: 'Application mobile de compte à rebours.', tech: ['Application mobile'], repo: 'Countdown-mobile-app' },
        { name: 'Gestion d’examens — Administration', summary: 'Interface d’administration associée au projet Examen Bénin ; dépôt privé.', tech: ['TypeScript', 'Administration'], repo: 'examenbenin-admin', private: true }
      ]
    }
  ];

  function buildPortfolio() {
    const section = document.querySelector('#projects');
    const container = section?.querySelector('.container');
    if (!container || container.dataset.portfolioBuilt === 'true') return;
    container.dataset.portfolioBuilt = 'true';

    const tag = container.querySelector('.section-tag');
    const heading = container.querySelector('h2');
    if (tag) tag.textContent = 'Dossiers de projets';
    if (heading) heading.textContent = 'Explorez mes réalisations par domaine';

    const nav = document.createElement('nav');
    nav.className = 'domain-nav';
    nav.setAttribute('aria-label', 'Domaines de projets');
    nav.innerHTML = domains.map(domain => `<a href="#${domain.id}">${domain.short}<span class="domain-count">${String(domain.projects.length).padStart(2, '0')}</span></a>`).join('');

    const shelves = document.createElement('div');
    shelves.className = 'domain-shelves';
    shelves.innerHTML = domains.map(domain => `
      <section class="domain-shelf" id="${domain.id}" aria-labelledby="heading-${domain.id}">
        <header class="domain-heading"><div><h3 id="heading-${domain.id}">${domain.title}</h3><p>Archives de projets · ${domain.projects.length} dossiers</p></div><span class="dossier-counter" data-counter="${domain.id}"></span></header>
        <div class="dossier-carousel" aria-roledescription="carrousel" aria-label="Projets : ${domain.title}">
          <article class="dossier-card" aria-live="polite" data-card="${domain.id}"></article>
          <div class="dossier-controls"><button type="button" data-action="previous" data-domain="${domain.id}" aria-label="Projet précédent">← Précédent</button><span class="dossier-position" data-position="${domain.id}"></span><button type="button" data-action="next" data-domain="${domain.id}" aria-label="Projet suivant">Suivant →</button></div>
        </div>
      </section>`).join('');

    container.querySelector('.projects-grid')?.remove();
    container.append(nav, shelves);

    const indexes = Object.fromEntries(domains.map(domain => [domain.id, 0]));
    function render(domain) {
      const index = indexes[domain.id];
      const project = domain.projects[index];
      const card = container.querySelector(`[data-card="${domain.id}"]`);
      const repoLink = project.private
        ? '<span class="dossier-link" aria-label="Dépôt privé">Dépôt privé · lien masqué</span>'
        : `<a class="dossier-link" href="https://github.com/hdmanoach/${project.repo}" target="_blank" rel="noopener noreferrer" aria-label="Voir le dépôt GitHub ${project.name}">Ouvrir le dossier ↗</a>`;
      card.innerHTML = `
        <div class="dossier-topline"><div><div class="dossier-id">DOSSIER N°${String(index + 1).padStart(3, '0')} · ${String(domain.projects.length).padStart(2, '0')} PIÈCES</div><div class="dossier-domain-label">${domain.title}</div></div><span class="dossier-stamp">${project.private ? 'Privé' : 'Projet'}</span></div>
        <h4>${project.name}</h4><p>${project.summary}</p>
        <div class="dossier-bottom"><div class="dossier-tech">${project.tech.map(tech => `<span>${tech}</span>`).join('')}</div>${repoLink}</div>`;
      container.querySelector(`[data-position="${domain.id}"]`).textContent = `${String(index + 1).padStart(2, '0')} / ${String(domain.projects.length).padStart(2, '0')}`;
      container.querySelector(`[data-counter="${domain.id}"]`).textContent = `PIÈCE ${String(index + 1).padStart(2, '0')} / ${String(domain.projects.length).padStart(2, '0')}`;
    }
    domains.forEach(render);

    container.querySelectorAll('.dossier-controls button').forEach(button => {
      button.addEventListener('click', () => {
        const domain = domains.find(item => item.id === button.dataset.domain);
        const direction = button.dataset.action === 'next' ? 1 : -1;
        indexes[domain.id] = (indexes[domain.id] + direction + domain.projects.length) % domain.projects.length;
        render(domain);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildPortfolio);
  else buildPortfolio();
})();
