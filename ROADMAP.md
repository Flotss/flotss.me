# 🗺️ Roadmap & Axes d'Amélioration — flotss.me

Ce document répertorie l'ensemble des améliorations recommandées et planifiées pour enrichir le portfolio de Florian Mangin (**flotss.me**), classées par valeur ajoutée, impact technique et professionnalisme.

---

## 📊 Synthèse des Priorités & Progression

| Priorité | Axe | Impact | Difficulté | Statut |
| :--- | :--- | :---: | :---: | :---: |
| 🔴 **P1** | **SEO, Indexabilité & Référencement Contrôlé** | Élevé | Faible | ✅ **Terminé (PR #25)** |
| 🔴 **P1** | **Correction Fetch READMEs (Branches `master`/`main`)** | Élevé | Faible | ✅ **Terminé (PR #25)** |
| 🔴 **P1** | **Section Expérience & Timeline Pro (Accueil)** | Très élevé | Modérée | ⏳ **Planifié (Prochaine PR dédiée)** |
| 🟡 **P2** | **Téléchargement Direct du CV (PDF)** | Élevé | Faible | ✅ **Terminé (PR #26)** |
| 🟡 **P2** | **Back-Office Enrichi & Mini-CMS (Zéro Modale, Sidebar)** | Élevé | Modérée | ✅ **Terminé (PR #26)** |
| 🟢 **P3** | **Command Palette (`Cmd + K`)** | Élevé (UX) | Modérée | 🚀 **Prêt à démarrer** |
| 🟢 **P3** | **Projets Phares (« Featured Case Studies »)** | Élevé | Modérée | ⏳ Planifié |
| ⚪ **P4** | **Statistiques GitHub Globales & Activité** | Modéré | Modérée | 💡 Idée |
| ⚪ **P4** | **Section Blog / Articles Techniques** | Modéré | Élevée | 💡 Idée |

---

## 1. 🔍 SEO, Découvrabilité & Indexation (Priorité 1) — ✅ TERMINÉ

> **Objectif** : Maximiser la visibilité sur Google du site personnel (`/`, `/contact`) tout en verrouillant l'indexation des projets et de l'administration selon les souhaits de Florian.

- [x] **Architecture SEO centralisée (`src/config/seo.config.ts`)** :
  - Single Source of Truth pour les métadonnées, titres, descriptions, URLs canoniques et statut d'indexation.
  - Règles d'indexation : autorisée pour `/` et `/contact` (`noindex: false`), interdite pour `/projects`, `/projects/*`, `/admin`, `/admin/*` (`noindex: true`).
- [x] **Composant réutilisable `<SEO />` (`src/components/SEO.tsx`)** :
  - Remplace les blocs `<Head>` volumineux par un simple appel `<SEO page="..." />`.
  - Gestion automatique des balises OpenGraph, Twitter Cards, balises `<meta name="robots">` et `<meta name="googlebot">` avec directives `noindex, nofollow, noarchive, nosnippet`.
- [x] **Directive `public/robots.txt`** :
  - Correction du nom du fichier (suppression de l'ancien `robot.txt`).
  - Autorise `/` et `/contact`.
  - Bloque explicitement `/projects`, `/projects/`, `/admin`, `/admin/`, `/api/`.
- [x] **Sitemap XML statique (`public/sitemap.xml`)** :
  - Référence uniquement les pages indexables (`/` et `/contact`).
- [x] **Protection HTTP `X-Robots-Tag` (`next.config.js`)** :
  - En-tête HTTP renvoyé pour `/admin/:path*`, `/projects/:path*` et `/api/:path*`.
- [x] **Correction récupération READMEs via GitHub API (`src/services/GithubService.ts`)** :
  - Remplacement de l'URL brute avec branche `main` en dur par l'endpoint officiel `api.github.com/repos/{owner}/{repo}/readme` avec `Accept: application/vnd.github.raw`.
  - Résolution dynamique de la branche par défaut (`master` pour `FacebookLike`, `main`, etc.) et du nom de fichier avec fallback.

---

## 2. 💼 Expérience & Crédibilité Professionnelle (Priorité 1) — ⏳ PLANIFIÉ (PROCHAINE PR)

> **Objectif** : Mettre en lumière la valeur ajoutée concrète pour les recruteurs et clients potentiels directement sur la page d'accueil dans une PR dédiée.

- [ ] **Section Parcours & Expériences (« Career Timeline »)** :
  - Sera développée et intégrée dans une PR dédiée ultérieure.
- [x] **Bouton d'accès direct au CV (PDF)** :
  - Bouton d'action direct « Resume » dans le Hero connecté au champ dynamique `resumeUrl`.
- [ ] **Études de Cas sur les Projets Phares (« Featured Case Studies »)** :
  - Sélectionner 3 ou 4 projets majeurs (ex. `flotss.me`, `ObjectAidJava`, `NETVOD`) :
    - Ajouter des captures d'écran d'interface réelle et schémas d'architecture.
    - Expliquer le contexte, les défis techniques rencontrés et les solutions architecturales choisies.
    - Proposer un bouton direct « Voir la Démo » (ou vidéo de démonstration).

---

## 3. 🎛️ Back-Office Enrichi & Mini-CMS (Priorité 2) — ✅ TERMINÉ — 📄 [Spécifications Détaillées](./BACKOFFICE_SPEC.md)

> **Objectif** : Piloter l'ensemble du portfolio (projets, expériences, hero, liens sociaux, CV) directement depuis un studio d'administration moderne sans recompiler de code.

- [x] **Ergonomie Générale & Navigation (Sans Modale)** :
  - Mise en place d'une **sidebar latérale par catégories** (*Projets*, *Expériences*, *Paramètres du Site*).
  - **Règle absolue respectée : aucune modale popup** — tous les formulaires d'édition sont intégrés inline, en accordéon dépliable ou panneau pleine largeur.
- [x] **Module Projets (`RepoDB`)** :
  - **Titre d'affichage personnalisé** (`displayName`) pour remplacer les slugs bruts de dépôts.
  - **Image de couverture** (`coverImage`) pour chaque projet avec prévisualisation en direct.
  - **Statut « Work in Progress »** (`isWip`) pour marquer les projets en cours de développement avec badge public.
  - **Lien de Démo Live** (`demoUrl`) avec bouton d'action public dans la fiche détaillée.
  - Visibilité, réordonnancement par glisser/déposer ou boutons, et description personnalisée.
- [x] **Module Expériences Pro & Formations (`Experience`)** :
  - Modèle Prisma dédié pour administrer les expériences (Société Générale, Dalkia, Formation ISEP, etc.).
  - Formulaire d'ajout inline au sommet et édition inline par poste (titre, entreprise, dates, points-clés, tags de compétences, ordre).
- [x] **Module Paramètres du Site (`SiteSettings` & `SocialLink`)** :
  - **Badge de disponibilité du Hero** : modification du texte avec voyant vert émeraude fixe et prévisualisation en direct.
  - **Accroche & sous-titre de la page d'accueil** éditables dynamiquement.
  - **Lien / Fichier du CV** (`resumeUrl`) avec prévisualisation.
  - **Gestion dynamique des liens sociaux** : ajout/suppression avec sélecteur d'icônes vectorielles (`FaGithub`, `FaLinkedin`, `FaXTwitter`, `FaDiscord`, etc.).

---

## 4. ✨ UX Moderne & Touche « Dev Experiencing » (Priorité 3)

> **Objectif** : Rendre la navigation fluide, moderne et mémorable.

- [ ] **Command Palette (`Cmd + K` / `Ctrl + K`)** :
  - Modal de recherche rapide au clavier (via `cmdk` ou implémentation personnalisée React) :
    - Recherche instantanée parmi tous les projets avec filtres de langage.
    - Liens rapides : *Accueil*, *Projets*, *Contact*, *Back-Office*.
    - Actions en 1 clic : *Copier l'email*, *Ouvrir LinkedIn*, *Ouvrir GitHub*, *Télécharger le CV*.
- [ ] **Statistiques Globales & Activité GitHub** :
  - Composant visuel affichant :
    - Total de commits et contributions.
    - Donut chart ou bar chart de répartition des langages sur l'ensemble du profil.
    - Étoiles totales accumulées.
- [ ] **Améliorations Three.js (HeroScene)** :
  - Rendre la scène 3D réactive aux mouvements de souris (effet de parallaxe subtil ou onde).
  - Détection automatique des appareils à faible consommation pour désactiver les rendus superflus.

---

## 5. ✍️ Blog / Articles Techniques (Priorité 4)

> **Objectif** : Démontrer une veille technique et asseoir une expertise en ingénierie logicielle.

- [ ] **Section Articles / Insights** :
  - Page `/blog` avec liste d'articles écrits en Markdown (`content/articles/*.mdx`).
  - Idées de sujets :
    - *« Migration d'un portfolio vers Next.js 16 et React 19 avec Turbopack »*
    - *« Conception d'un Back-Office moderne avec Prisma ORM et Next.js »*
    - *« Bonnes pratiques d'architecture logicielle en C# .NET Core »*
    - *« Automatisation et tooling agentique dans le développement quotidien »*
  - Estimation du temps de lecture et coloration syntaxique soignée du code.

---

*Dernière mise à jour : 10 septembre 2026 — PR #25 (SEO & README Fix).*
