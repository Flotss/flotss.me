# 📋 Spécifications Détaillées — Back-Office Enrichi (Mini-CMS) flotss.me

Ce document consigne l'ensemble des spécifications fonctionnelles, techniques et ergonomiques validées pour la refonte et l'enrichissement du Back-Office administrateur de **flotss.me**.

---

## 🎯 1. Principes Directeurs & Règles d'Ergonomie

1. **Sidebar Latérale par Catégories** :
   - Remplacement de la simple barre d'onglets supérieure par une **sidebar latérale moderne** (façon console / studio SaaS).
   - Navigation catégorisée :
     - 📦 **Projets** : gestion du catalogue GitHub, visibilité, ordre, personnalisation visuelle.
     - 💼 **Expériences** : gestion des postes pro, formations, réalisations et compétences.
     - ⚙️ **Paramètres du Site** : personnalisation du Hero, disponibilité, liens sociaux et CV.
     - 🚪 **Déconnexion** : action rapide en bas de la sidebar.
2. **Interdiction Formelle des Modales (« Ne fais pas de modal »)** :
   - **Aucune modale popup** (dialogues bloquants au centre de l'écran).
   - Tout formulaire de modification est directement **intégré dans la page** :
     - Vues de formulaires dédiées intégrées dans le contenu principal.
     - Ou panneaux extensibles (accordéons pleine largeur) directement sur chaque élément.
     - Sauvegarde claire et feedback en temps réel par notifications toast.

---

## 📦 2. Module Projets (`RepoDB`)

Gestion avancée des dépôts synchronisés depuis GitHub.

### Champs administrables
- **Titre d'affichage personnalisé** (`displayName` / `customTitle`) :
  - Permet de remplacer le nom brut du slug GitHub par un nom clair et soigné (ex: `« Facebook Like »` au lieu de `FacebookLike`, `« Timeline Game »` au lieu de `TimeLineGame`).
- **Image de couverture / Capture d'écran** (`coverImage`) :
  - Saisie de l'URL de l'image (capture d'écran de l'application, maquette, schéma d'architecture) pour l'affichage en carte et en page détaillée.
- **Statut « Work in Progress »** (`isWip` / booléen) :
  - Toggle indiquant qu'un projet est actuellement en cours de développement.
  - Affiche un badge discret *« Work in progress »* ou *« In Dev »* sur le site public.
- **Description personnalisée** (`description`) :
  - Déjà supportée : remplace ou complète la description GitHub par défaut.
- **Lien de Démo Live** (`demoUrl`) :
  - Lien direct vers l'application hébergée (ex: Vercel, Azure, Netlify).
- **Visibilité & Ordre d'affichage** (`visible`, `order`) :
  - Déjà supportés : contrôle de l'affichage public et de l'ordonnancement.

---

## 💼 3. Module Expériences Pro (`Experience`)

Gestion dynamique des postes et de la formation sans modifier le code source.

### Champs administrables
- **Intitulé du poste** (`title`) : ex. *Ingénieur d'Études & Développement*, *Développeur Python*.
- **Entreprise / Établissement** (`company`) : ex. *Société Générale*, *Dalkia (Groupe EDF)*, *ISEP*.
- **Lieu** (`location`) : ex. *Paris La Défense*, *Nanterre*, *Télétravail*.
- **Période** (`startDate`, `endDate`, `current`) :
  - Date de début et de fin.
  - Case à cocher *« En poste actuellement »* (`current`).
- **Type d'expérience** (`type`) : *Work* (Expérience pro) ou *Education* (Formation / Diplôme).
- **Description & Points-clés** (`description`, `highlights`) :
  - Récit des missions, défis techniques résolus et résultats quantifiables.
- **Compétences / Stack technique** (`skills`) :
  - Liste de technologies associées au poste (ex: `C#`, `ASP.NET Core`, `Angular`, `Python`, `SQL Server`).
- **Ordre d'affichage** (`order`) :
  - Ordre chronologique ou personnalisé.

---

## ⚙️ 4. Module Paramètres du Site (`SiteSettings` & `SocialLink`)

Pilotage des informations globales de Florian Mangin sur la page d'accueil.

### A. Hero & Disponibilité
- **Badge de disponibilité** :
  - Texte modifiable (ex: *« Available for new opportunities »*, *« Employed at Société Générale »*).
  - **Couleur du voyant : fixe en vert émeraude animé** (conservée telle quelle, conformément à la consigne).
- **Accroche & Titre du Hero** :
  - Titre principal (ex: *« Hello ! My name is Florian Mangin »*).
- **Sous-titre / Bio d'accueil** :
  - Texte d'introduction sous le titre (ex: *« Software Engineer passionate about crafting robust software, clean architectures, and modern web applications. »*).

### B. Curriculum Vitae (CV)
- **Lien / Fichier du CV** (`resumeUrl`) :
  - URL du document PDF (hébergé dans `/public/cv.pdf` ou lien externe drive/cloud).
  - Permet le téléchargement et la consultation directe depuis le site.

### C. Liens Sociaux Dynamiques (`SocialLink`)
- **Gestion des réseaux & contacts** :
  - Ajouter / supprimer des liens sociaux en direct.
  - Champ URL (`url`) et libellé (`label`).
  - **Choix de l'icône** parmi une bibliothèque d'icônes vectorielles standard :
    - `GitHub`, `LinkedIn`, `Twitter / X`, `Discord`, `Twitch`, `YouTube`, `Email`, `Portfolio / Web`.
  - Toggle d'activation / visibilité et ordre de tri.

---

## 🗄️ 5. Modélisation Base de Données (Prisma)

```prisma
// Extensions et nouveaux modèles

model RepoDB {
  repoId      Int      @id(map: "RepoDescription_pkey")
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  name        String   @default("No name")
  url         String?
  visible     Boolean  @default(true)
  order       Int      @default(0)
  
  // Nouveaux champs
  displayName String?  // Titre d'affichage sur mesure
  coverImage  String?  // URL de l'image / capture d'écran
  demoUrl     String?  // URL de la démo en ligne
  isWip       Boolean  @default(false) // Travail en cours

  @@map("Repository")
}

model SiteSettings {
  id               Int      @id @default(1)
  availabilityText String   @default("Available for new opportunities")
  heroHeadline     String   @default("Hello ! My name is Florian Mangin")
  heroSubtitle     String   @default("Software Engineer passionate about crafting robust software, clean architectures, and modern web applications.")
  resumeUrl        String?  @default("/cv.pdf")
  updatedAt        DateTime @updatedAt
}

model SocialLink {
  id        Int      @id @default(autoincrement())
  platform  String   // ex: "github", "linkedin", "x", "email"
  label     String   // ex: "LinkedIn"
  url       String
  icon      String   // nom de l'icône: "FaLinkedin", "FaGithub", etc.
  order     Int      @default(0)
  visible   Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Experience {
  id          Int      @id @default(autoincrement())
  title       String   // ex: "Software Engineer"
  company     String   // ex: "Société Générale"
  location    String?  // ex: "Paris La Défense"
  startDate   String   // ex: "2023" ou "Sep 2023"
  endDate     String?  // ex: "Present" ou null si en cours
  current     Boolean  @default(false)
  type        String   @default("work") // "work" | "education"
  description String?  // Texte explicatif
  skills      String?  // Tags séparés par des virgules: "C#, ASP.NET Core, Angular"
  order       Int      @default(0)
  visible     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🎨 6. Architecture UI de la Sidebar & Pages du Dashboard

```
+--------------------------------------------------------------------------------+
|  [flotss.me admin]                                        [Utilisateur | Logout]|
+-------------------+------------------------------------------------------------+
|  SIDEBAR          |  CONTENU PRINCIPAL SANS MODALE                             |
|                   |                                                            |
|  📦 Projets       |  > Si Projets actif :                                      |
|    - Catalogue    |    - Barre de recherche & filtres                          |
|    - Tri & Ordre  |    - Grille / Liste avec aperçu miniature                  |
|                   |    - Panneau d'édition inline dépliable (titre personnalisé|
|  💼 Expériences   |      image, statut WIP, démo, description, visibilité)     |
|    - Parcours pro |                                                            |
|    - Formation    |  > Si Expériences actif :                                  |
|                   |    - Formulaire d'ajout inline en haut                     |
|  ⚙️ Paramètres    |    - Liste des cartes d'expérience réordonnables           |
|    - Hero & Statut|    - Édition inline de chaque poste                        |
|    - Liens sociaux|                                                            |
|    - CV & Profil  |  > Si Paramètres actif :                                   |
|                   |    - Formulaire Hero (Titre, sous-titre, dispo)            |
|  ---------------- |    - Gestion des liens sociaux (avec sélecteur d'icônes)   |
|  🚪 Déconnexion   |    - Gestion du lien de CV                                 |
+-------------------+------------------------------------------------------------+
```

---

*Fichier créé le 10 septembre 2026 à la demande de l'utilisateur.*
