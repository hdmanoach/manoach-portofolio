(() => {
  const domains = [
    {
      id: 'data-ia', title: 'Data & Intelligence artificielle', short: 'DATA & IA',
      projects: [
        { name: 'Churn Prediction (k-NN)', summary: 'Projet de classification pour analyser des données clients et estimer le risque de désabonnement. Le dépôt présente la préparation des données, l’optimisation de k et l’évaluation du modèle.', tech: ['Python', 'Machine Learning', 'k-NN'], repo: 'churn-knn' },
        { name: 'Analyse des ventes avec NumPy', summary: 'Analyse de données de ventes et calculs numériques avec Python et NumPy, pour explorer les indicateurs et tirer des enseignements des données.', tech: ['Python', 'NumPy', 'Analyse de données'], repo: 'analyse-ventes-numpy' },
        { name: 'Générateur de recommandations de films', summary: 'Application qui croise deux films ou séries appréciés pour proposer une suggestion générée par IA à partir des données TMDB.', tech: ['Next.js', 'FastAPI', 'Gemini', 'TMDB'], repo: 'generateur-films' },
        { name: 'ANIP Django OCR', summary: 'Projet autour de l’extraction de texte à partir de documents grâce à l’OCR, avec une application web Django.', tech: ['Python', 'Django', 'OCR'], repo: 'ANIP-Django-OCR' }
      ]
    },
    {
      id: 'administration-systemes', title: 'Administration systèmes', short: 'ADMIN SYSTÈMES',
      projects: [
        { name: 'Nexora Systems', summary: 'Reconstruction documentée du système d’information d’une PME sous Debian : DNS, DHCP, Nginx, GLPI, Samba AD, stockage, supervision Zabbix et sauvegardes dans un parc hybride.', tech: ['Debian', 'Samba AD', 'Zabbix', 'Nginx'], repo: 'nexora-systems' },
        { name: 'Linux Manager', summary: 'Interface Flask d’administration Linux pour gérer les utilisateurs, les groupes et les mots de passe, avec authentification, protection CSRF et journal d’audit.', tech: ['Linux', 'Python', 'Flask', 'Audit'], repo: 'linux-manager' },
        { name: 'Linux System Monitor', summary: 'Tableau de bord de supervision des ressources, processus et services Linux, avec historique, alertes et analyse IA optionnelle.', tech: ['Linux', 'Flask', 'Monitoring', 'SQLite'], repo: 'Linux-System-Monitor' },
        { name: 'Proxmox Disaster Recovery Lab', summary: 'Mise en place d’un plan de sauvegarde et de reprise d’activité avec Proxmox Backup Server, simulation de panne et test de restauration.', tech: ['Proxmox', 'Sauvegarde', 'PRA'], repo: 'proxmox-disaster-recovery-lab' }
      ]
    },
    {
      id: 'devops', title: 'DevOps & Cloud', short: 'DEVOPS',
      projects: [
        { name: 'SmartTraffic-IoT', summary: 'Architecture microservices de supervision routière : ingestion FastAPI, traitement Python, tableau de bord et alertes, le tout conteneurisé avec Docker.', tech: ['Docker', 'FastAPI', 'Python', 'Next.js'], repo: 'smarttraffic-iot' },
        { name: 'Dockerfile', summary: 'Conteneurisation d’une application web Flask de gestion de rendez-vous à l’aide de Docker.', tech: ['Docker', 'Flask', 'Conteneurisation'], repo: 'dockerfile' },
        { name: 'GitHub Deployment Workflow', summary: 'Workflow de déploiement automatisé d’un site statique avec GitHub Actions et GitHub Pages.', tech: ['GitHub Actions', 'CI/CD', 'GitHub Pages'], repo: 'gh-deployment-workflow' },
        { name: 'Certification AWS', summary: 'Feuille de route, fiches de révision et exemples pratiques pour la préparation aux certifications Amazon Web Services.', tech: ['AWS', 'Cloud', 'Formation'], repo: 'certification-aws' }
      ]
    },
    {
      id: 'cybersecurite', title: 'Cybersécurité', short: 'CYBERSÉCURITÉ',
      projects: [
        { name: 'WebAudit', summary: 'Outil d’audit web pour examiner la sécurité d’un site et présenter les résultats et recommandations de façon claire.', tech: ['Python', 'Audit web', 'Sécurité'], repo: 'webaudit' },
        { name: 'Security Agent', summary: 'Agent de détection orienté laboratoire qui corrèle des incidents SSH et web et fournit un tableau de bord d’inspection et de reporting.', tech: ['Python', 'IDS', 'Logs', 'Flask'], repo: 'security-agent' },
        { name: 'Firewall Formation Lab', summary: 'Laboratoire pratique OPNsense et FortiGate : segmentation réseau, règles de filtrage, VPN et filtrage web.', tech: ['OPNsense', 'FortiGate', 'VPN'], repo: 'firewall-formation-lab' },
        { name: 'Windows Server Cybersecurity Lab', summary: 'Infrastructure hybride Windows Server et Linux avec Active Directory, DNS, DHCP, GPO, Samba et supervision Wazuh.', tech: ['Windows Server', 'Active Directory', 'Wazuh'], repo: 'windows-server-cybersecurity-lab' },
        { name: 'Security Scan Demo', summary: 'Dépôt de démonstration autour de l’analyse et des scans de sécurité.', tech: ['Sécurité', 'Analyse'], repo: 'security-scan-demo' }
      ]
    }
  ];

  function buildPortfolio() {
    const section = document.querySelector('#projects');
    const container = section?.querySelector('.container');
    if (!container) return;

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
        <header class="domain-heading">
          <div><h3 id="heading-${domain.id}">${domain.title}</h3><p>Archives de projets · ${domain.projects.length} dossiers</p></div>
          <span class="dossier-counter" data-counter="${domain.id}"></span>
        </header>
        <div class="dossier-carousel" aria-roledescription="carrousel" aria-label="Projets : ${domain.title}">
          <article class="dossier-card" aria-live="polite" data-card="${domain.id}"></article>
          <div class="dossier-controls">
            <button type="button" data-action="previous" data-domain="${domain.id}" aria-label="Projet précédent">← Précédent</button>
            <span class="dossier-position" data-position="${domain.id}"></span>
            <button type="button" data-action="next" data-domain="${domain.id}" aria-label="Projet suivant">Suivant →</button>
          </div>
        </div>
      </section>`).join('');

    container.querySelector('.projects-grid')?.remove();
    container.append(nav, shelves);

    const indexes = Object.fromEntries(domains.map(domain => [domain.id, 0]));
    function render(domain) {
      const index = indexes[domain.id];
      const project = domain.projects[index];
      const card = container.querySelector(`[data-card="${domain.id}"]`);
      card.innerHTML = `
        <div class="dossier-topline">
          <div><div class="dossier-id">DOSSIER N°${String(index + 1).padStart(3, '0')} · ${String(domain.projects.length).padStart(2, '0')} PIÈCES</div><div class="dossier-domain-label">${domain.title}</div></div>
          <span class="dossier-stamp">Projet</span>
        </div>
        <h4>${project.name}</h4>
        <p>${project.summary}</p>
        <div class="dossier-bottom">
          <div class="dossier-tech">${project.tech.map(tech => `<span>${tech}</span>`).join('')}</div>
          <a class="dossier-link" href="https://github.com/hdmanoach/${project.repo}" target="_blank" rel="noopener noreferrer" aria-label="Voir le dépôt GitHub ${project.name}">Ouvrir le dossier ↗</a>
        </div>`;
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
