# 🗺️ Roadmap & Axes d'Amélioration — flotss.me

Ce document répertorie l'ensemble des améliorations recommandées et planifiées pour enrichir le portfolio de Florian Mangin (**flotss.me**), classées par valeur ajoutée, impact technique et professionnalisme.

---

## 📊 Synthèse des Priorités

| Priorité | Axe | Impact | Difficulté | Statut |
| :--- | :--- | :---: | :---: | :---: |
| 🔴 **P1** | **SEO, Indexabilité & Référencement** | Élevé | Faible | ⏳ Planifié |
| 🔴 **P1** | **Section Expérience & Timeline Pro** | Très élevé | Modérée | ⏳ Planifié |
| 🟡 **P2** | **Téléchargement Direct du CV (PDF)** | Élevé | Faible | ⏳ Planifié |
| 🟡 **P2** | **Back-Office Enrichi (Démos, Images, Statut)** | Élevé | Modérée | ⏳ Planifié |
| 🟢 **P3** | **Command Palette (`Cmd + K`)** | Élevé (UX) | Modérée | ⏳ Planifié |
| 🟢 **P3** | **Projets Phares (« Featured Case Studies »)** | Élevé | Modérée | ⏳ Planifié |
| ⚪ **P4** | **Statistiques GitHub Globales & Activité** | Modéré | Modérée | 💡 Idée |
| ⚪ **P4** | **Section Blog / Articles Techniques** | Modéré | Élevée | 💡 Idée |

---

## 1. 🔍 SEO, Découvrabilité & Indexation (Priorité 1)

> **Objectif** : Maximiser la visibilité sur Google, Bing et les partages de liens sur LinkedIn, Twitter et Discord.

- [ ] **Correction de `robots.txt`** :
  - Renommer `public/robot.txt` en `public/robots.txt` (avec un **s** indispensable).
  - Corriger la directive `Disallow: /` actuelle qui bloque les robots d'indexation.
  - Autoriser l'indexation de la home `/`, de `/projects`, `/projects/*` et de `/contact`.
  - Protéger les routes sensibles : `Disallow: /admin` et `Disallow: /api/`.
- [ ] **Génération dynamique du `sitemap.xml`** :
  - Créer un endpoint ou script générant dynamiquement le `sitemap.xml` contenant toutes les pages statiques et les URLs de chaque dépôt public (`/projects/[name]`).
- [ ] **Métadonnées OpenGraph & Twitter Cards dynamiques par projet** :
  - Sur `/projects/[name]`, injecter des balises dynamiques :
    - `og:title` : `{repo.name} — Florian Mangin`
    - `og:description` : description personnalisée ou résumé du projet
    - `og:url` : `https://flotss.me/projects/{repo.name}`
    - `og:image` : image de prévisualisation ou image générée (carte de partage avec nom, langage et étoiles)
- [ ] **Données structurées JSON-LD (`schema.org`)** :
  - Intégrer un bloc `schema.org/Person` sur la page d'accueil (nom, fonction, entreprise, compétences, profils sociaux).
  - Intégrer `schema.org/SoftwareSourceCode` sur les pages de projets.

---

## 2. 💼 Expérience & Crédibilité Professionnelle (Priorité 1)

> **Objectif** : Mettre en lumière la valeur ajoutée concrète pour les recruteurs, collègues et clients potentiels.

- [ ] **Section Parcours & Expériences (« Career Timeline »)** :
  - Concevoir une section interactive et esthétique sur la page d'accueil (design zinc-950, bordures subtiles et accents émeraude) :
    - **Société Générale** *(Ingénieur d'Études & Développement)* :
      - Applications ASP.NET Core / C#, migration d'architectures web, interfaces dynamiques Angular.
      - Outils utilisés au quotidien par plus de 20 développeurs (gestion de branches, intégration Jira, monitoring SQL temps réel).
      - Automatisation des processus de release et intégration CI/CD.
    - **Dalkia (Groupe EDF)** *(Développeur Python)* :
      - Solutions de redondance pour systèmes d'alarmes techniques industrielles.
      - Conception de bases de données et fonctionnalité d'autocomplétion pour la hotline.
    - **Formation & Cursus** :
      - Diplôme d'Ingénieur / Master en informatique (ISEP / Université).
- [ ] **Bouton d'accès direct au CV (PDF)** :
  - Ajouter un bouton d'action directe « Télécharger mon CV » dans le Hero et/ou le Header.
  - Permettre le téléchargement et la prévisualisation dans le navigateur.
- [ ] **Études de Cas sur les Projets Phares (« Featured Case Studies »)** :
  - Sélectionner 3 ou 4 projets majeurs (ex. `flotss.me`, `ObjectAidJava`, `NETVOD`) :
    - Ajouter des captures d'écran d'interface réelle et schémas d'architecture.
    - Expliquer le contexte, les défis techniques rencontrés et les solutions architecturales choisies.
    - Proposer un bouton direct « Voir la Démo » (ou vidéo de démonstration).

---

## 3. 🎛️ Back-Office Enrichi & Mini-CMS (Priorité 2)

> **Objectif** : Piloter le contenu du portfolio directement depuis l'espace administrateur sans recompiler de code.

- [ ] **Gestion du Statut de Disponibilité** :
  - Ajouter une table `SiteSettings` ou `ProfileConfig` en base de données avec Prisma.
  - Champs modifiables depuis le dashboard :
    - Statut : *« Available for new opportunities »*, *« Open to interesting challenges »*, *« Employed at Société Générale »*.
    - Disponibilité (badge animé vert/orange).
- [ ] **Champs Personnalisés par Projet (`RepoDB`)** :
  - Étendre le modèle Prisma `RepoDB` :
    ```prisma
    model RepoDB {
      repoId      Int      @id(map: "RepoDescription_pkey")
      description String?
      createdAt   DateTime @default(now())
      updatedAt   DateTime @updatedAt
      name        String   @default("No name")
      url         String?
      visible     Boolean  @default(true)
      order       Int      @default(0)
      demoUrl     String?  // URL démo live
      coverImage  String?  // Image de couverture
      featured    Boolean  @default(false) // Projet mis en vedette
      tags        String?  // Tags séparés par virgules (ex: "Fullstack, .NET, Angular")

      @@map("Repository")
    }
    ```
  - Interface d'édition dans le Back-Office pour renseigner ces champs facilement.

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

*Fichier initialisé le 10 septembre 2026.*
