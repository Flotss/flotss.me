# Guide d'Optimisation BDD — Résolution de la Sursollicitation PostgreSQL / Prisma

Ce document recense de manière exhaustive les causes de la surconsommation récente de la base de données, la matrice **Problème / Solution**, la **Roadmap** d'implémentation, ainsi que les **modifications de code exactes (Avant / Après)** à appliquer fichier par fichier.

---

## Sommaire
1. [Diagnostic & Causes Racines](#1-diagnostic--causes-racines)
2. [Matrice Problème / Solution](#2-matrice-problème--solution)
3. [Roadmap BDD Solving](#3-roadmap-bdd-solving)
4. [Modifications Fichier par Fichier (Avant / Après)](#4-modifications-fichier-par-fichier)
   - [A. Composants & Pages (Suppression des fetches client)](#a-composants--pages-suppression-des-fetches-client)
   - [B. Services & Utilitaires (Résolution N+1 & Singleton)](#b-services--utilitaires-résolution-n1--singleton)
   - [C. Back-Office Admin (On-Demand Revalidation)](#c-back-office-admin-on-demand-revalidation)
   - [D. Routes API Publiques (Cache HTTP)](#d-routes-api-publiques-cache-http)
   - [E. Tests Unitaires](#e-tests-unitaires)
5. [Procédure de Validation & Métriques Attendues](#5-procédure-de-validation--métriques-attendues)

---

## 1. Diagnostic & Causes Racines

À l'origine, **flotss.me** fonctionnait selon une architecture purement **SSG (Static Site Generation)** :
- Les pages étaient pré-générées au build.
- La base de données PostgreSQL n'était sollicitée que lors des déploiements ou des connexions au back-office (`/admin`).

Depuis les récentes fonctionnalités (**PRs #23, #25, #26, #27, #28**), l'utilisation de la BDD a fortement augmenté pour 4 raisons majeures :

1. **Hydratation client forcée sur 100% des pages** :
   - `Footer.tsx` (inclus dans `Layout`, donc présent sur toutes les pages) exécute un `fetch('/api/get/socials')` côté client à chaque chargement de page.
   - `index.tsx` (Home) exécute un `fetch('/api/get/settings')` côté client.
   - `experience/index.tsx` exécute deux requêtes client : `fetch('/api/get/experiences')` et `fetch('/api/get/settings')`.
   - **Impact** : Chaque simple visite d'un internaute ou d'un bot déclenche 1 à 3 requêtes SQL en direct vers la BDD, alors que les données sont **déjà fournies** par Next.js via le SSG (`getStaticProps`).

2. **Problème N+1 dans `RepoUtils.createIfNotExists`** :
   - Lors de chaque révalidation ISR (`revalidate: 60`) ou appel à `GithubService.getRepos()`, la fonction boucle sur chaque repository GitHub et lance `prisma.repoDB.findUnique` individuellement.
   - **Impact** : Pour 40 à 50 dépôts, c'est **40 à 50 requêtes SQL simultanées** pour un seul appel de fonction.

3. **Absence de cache navigateur (`max-age`)** :
   - Les en-têtes HTTP de `/api/get/*` utilisent `s-maxage=10` (valable seulement 10 secondes pour le CDN Edge) sans `max-age` client. Le navigateur de l'utilisateur ne conserve rien en cache et re-contacte le serveur à chaque retour ou refresh.

4. **Singleton Prisma en Serverless (`src/lib/prisma.ts`)** :
   - La condition `if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma` empêchait la réutilisation du singleton en production, augmentant le risque de multiplication des pools de connexions lors des warm starts.

---

## 2. Matrice Problème / Solution

| # | Problème Identifié | Fichier(s) | Impact BDD | Solution Recommandée |
|---|---|---|---|---|
| **P1** | **Fetch client systématique du Footer sur 100% des pages** | `src/components/Footer.tsx` | 1 requête SQL (`socialLink.findMany`) par visite sur n'importe quelle page. | Supprimer le `fetch` au montage. Conserver `initialSocialLinks` (SSG) et l'écouteur `socialLinksUpdated` (Admin). |
| **P2** | **Double fetch client sur la Home (`/`)** | `src/pages/index.tsx` | 1 requête SQL (`siteSettings.findUnique`) à chaque visite de la Home. | Supprimer le `fetch('/api/get/settings')`. S'appuyer sur le SSG et activer l'On-Demand Revalidation (`res.revalidate('/')`). |
| **P3** | **Triple fetch client sur `/experience`** | `src/pages/experience/index.tsx` | 3 requêtes SQL en parallèle par visiteur. | Supprimer les deux fetches client. Utiliser les props SSG `initialExperiences` et `settings`. |
| **P4** | **Requêtes N+1 dans `createIfNotExists`** | `src/utils/RepoUtils.ts` | 40 à 50 requêtes SELECT individuelles à chaque révalidation ISR de `getRepos()`. | Remplacer les 50 `findUnique` par 1 seul `findMany({ select: { repoId: true } })` + 1 `createMany({ skipDuplicates: true })`. |
| **P5** | **Cache HTTP insuffisant sur les routes publiques** | `src/pages/api/get/*.ts` | Le navigateur ré-interroge le serveur en permanence. | Définir `Cache-Control: public, max-age=60, s-maxage=3600, stale-while-revalidate=86400`. |
| **P6** | **Singleton Prisma en production** | `src/lib/prisma.ts` | Multiples instances `PrismaClient` dans les conteneurs chauds serverless. | Assigner `globalForPrisma.prisma = prisma` quel que soit l'environnement. |

---

## 3. Roadmap BDD Solving

```
[Phase 1 : Éradication des Fetches Client]
   │  ├── 1.1 Footer.tsx : suppression du fetch on mount
   │  ├── 1.2 index.tsx : suppression du fetch settings on mount
   │  └── 1.3 experience/index.tsx : suppression des 2 fetches on mount
   ▼
[Phase 2 : On-Demand Revalidation dans l'Admin]
   │  ├── 2.1 admin/settings.ts -> res.revalidate('/', '/experience')
   │  ├── 2.2 admin/experiences.ts -> res.revalidate('/experience')
   │  └── 2.3 admin/repos.ts & admin/sync.ts -> res.revalidate('/', '/projects')
   ▼
[Phase 3 : Élimination du N+1 & Singleton Prisma]
   │  ├── 3.1 RepoUtils.ts : batch findMany + createMany
   │  └── 3.2 prisma.ts : singleton persistant
   ▼
[Phase 4 : Cache HTTP & Validation]
   │  ├── 4.1 En-têtes Cache-Control sur les routes /api/get/*
   │  ├── 4.2 Mise à jour des tests Jest
   │  └── 4.3 Validation globale : lint, test, build
```

---

## 4. Modifications Fichier par Fichier

### A. Composants & Pages (Suppression des fetches client)

#### 1. `src/components/Footer.tsx`
**Emplacement** : lignes 83 à 117.  
**Action** : Supprimer le bloc `fetch('/api/get/socials')` exécuté au montage. Ne conserver que l'écouteur d'événement `socialLinksUpdated` (utilisé par le Studio Admin).

```diff
--- a/src/components/Footer.tsx
+++ b/src/components/Footer.tsx
@@ -83,16 +83,7 @@ export default function Footer({ initialSocialLinks }: FooterProps) {
-  // Fetch dynamic social links on mount
-  useEffect(() => {
-    let isMounted = true;
-    fetch('/api/get/socials')
-      .then((res) => (res.ok ? res.json() : null))
-      .then((data) => {
-        if (isMounted && Array.isArray(data) && data.length > 0) {
-          setSocialLinks(data);
-        }
-      })
-      .catch(() => {});
-
-    // Listen for real-time updates from Admin Studio
+  // Listen for real-time updates from Admin Studio
+  useEffect(() => {
+    let isMounted = true;
     const handleSocialsUpdated = (event: CustomEvent<SocialLinkType[]> | Event) => {
```

---

#### 2. `src/pages/index.tsx`
**Emplacement** : lignes 45 à 69.  
**Action** : Supprimer l'appel `fetch('/api/get/settings')` dans le `useEffect`. L'événement `siteSettingsUpdated` reste actif pour le direct dans l'admin.

```diff
--- a/src/pages/index.tsx
+++ b/src/pages/index.tsx
@@ -45,15 +45,6 @@ export default function Home({
-  // Client-side fetch to ensure immediate fresh settings even with static cache
   useEffect(() => {
     let isMounted = true;
-    fetch('/api/get/settings')
-      .then((res) => (res.ok ? res.json() : null))
-      .then((data) => {
-        if (isMounted && data) {
-          setSettings(data);
-        }
-      })
-      .catch(() => {});
-
     // Listen to real-time settings updates from Admin Studio
     const handleSettingsUpdated = (event: CustomEvent<SiteSettingsType> | Event) => {
```

---

#### 3. `src/pages/experience/index.tsx`
**Emplacement** : lignes 22 à 46.  
**Action** : Supprimer les deux `fetch` client (`/api/get/experiences` et `/api/get/settings`). Remplacer par la synchronisation avec les props SSG `initialExperiences` et `ssgSettings`.

```diff
--- a/src/pages/experience/index.tsx
+++ b/src/pages/experience/index.tsx
@@ -22,25 +22,17 @@ export default function ExperiencePage({
-  // Hydrate experiences client-side for immediate freshness
   useEffect(() => {
-    let isMounted = true;
-    fetch('/api/get/experiences')
-      .then((res) => (res.ok ? res.json() : null))
-      .then((data) => {
-        if (isMounted && Array.isArray(data)) {
-          setExperiences(data);
-        }
-      })
-      .catch(() => {});
-
-    fetch('/api/get/settings')
-      .then((res) => (res.ok ? res.json() : null))
-      .then((data) => {
-        if (isMounted && data) {
-          setSettings(data);
-        }
-      })
-      .catch(() => {});
-
+    if (initialExperiences) {
+      setExperiences(initialExperiences);
+    }
+  }, [initialExperiences]);
+
+  useEffect(() => {
+    const handleSettingsUpdated = (event: CustomEvent<SiteSettingsType> | Event) => {
+      if ('detail' in event && event.detail) {
+        setSettings(event.detail);
+      }
+    };
+    window.addEventListener('siteSettingsUpdated', handleSettingsUpdated);
     return () => {
-      isMounted = false;
+      window.removeEventListener('siteSettingsUpdated', handleSettingsUpdated);
     };
   }, []);
```

---

### B. Services & Utilitaires (Résolution N+1 & Singleton)

#### 4. `src/utils/RepoUtils.ts`
**Emplacement** : fonction `createIfNotExists` (lignes 69 à 97).  
**Action** : Remplacer la boucle `repos.map` avec `findUnique` par une sélection groupée (`findMany`) et une insertion groupée (`createMany`).

```diff
--- a/src/utils/RepoUtils.ts
+++ b/src/utils/RepoUtils.ts
@@ -69,27 +69,24 @@ export const saveRepoDescription = async (repos: Repo[]): Promise<void> => {
 export const createIfNotExists = async (repos: Repo[]): Promise<void> => {
+  if (!repos || repos.length === 0) return;
   try {
-    // Create a new repo record if not exists
-    await Promise.all(
-      repos.map(async (repo) => {
-        try {
-          const existingRepo = await prisma.repoDB.findUnique({ where: { repoId: repo.id } });
-          if (!existingRepo) {
-            await prisma.repoDB.create({
-              data: {
-                repoId: repo.id,
-                description: repo.description,
-                name: repo.name,
-                url: repo.url,
-              },
-            });
-          }
-        } catch (e: any) {
-          // Change the type annotation of 'e' to 'any'
-          if (e.code !== 'P2002') {
-            console.error('Error creating repo record:', e);
-          }
-        }
-      }),
-    );
+    const existingRepos = await prisma.repoDB.findMany({
+      select: { repoId: true },
+    });
+    const existingIds = new Set(existingRepos.map((r) => r.repoId));
+
+    const missingRepos = repos.filter((repo) => !existingIds.has(repo.id));
+    if (missingRepos.length > 0) {
+      await prisma.repoDB.createMany({
+        data: missingRepos.map((repo) => ({
+          repoId: repo.id,
+          description: repo.description,
+          name: repo.name,
+          url: repo.url,
+        })),
+        skipDuplicates: true,
+      });
+    }
   } catch (err) {
     console.warn('Could not connect to DB in createIfNotExists:', err);
   }
```

---

#### 5. `src/lib/prisma.ts`
**Emplacement** : lignes 11 à 13.  
**Action** : Assigner le singleton global `globalForPrisma.prisma = prisma;` sans condition de `NODE_ENV`.

```diff
--- a/src/lib/prisma.ts
+++ b/src/lib/prisma.ts
@@ -10,6 +10,4 @@ export const prisma =
     log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
   });
 
-if (process.env.NODE_ENV !== 'production') {
-  globalForPrisma.prisma = prisma;
-}
+globalForPrisma.prisma = prisma;
 
 export default prisma;
```

---

### C. Back-Office Admin (On-Demand Revalidation)

L'ajout de l'On-Demand Revalidation (`res.revalidate`) permet de régénérer le cache HTML statique immédiatement après chaque sauvegarde admin, rendant les fetches client superflus.

#### 6. `src/pages/api/admin/settings.ts`
**Emplacement** : juste avant le `return res.status(200).json(...)` (ligne 158).

```typescript
// Déclencher la revalidation On-Demand des pages concernées
try {
  if (typeof res.revalidate === 'function') {
    await res.revalidate('/');
    await res.revalidate('/experience');
  }
} catch (revalidateError) {
  console.warn('On-demand revalidation warning for settings:', revalidateError);
}
```

---

#### 7. `src/pages/api/admin/experiences.ts`
**Emplacement** : après chaque opération réussie (POST création, POST réordonnancement, PUT mise à jour, DELETE suppression).

```typescript
try {
  if (typeof res.revalidate === 'function') {
    await res.revalidate('/experience');
  }
} catch (revalidateError) {
  console.warn('On-demand revalidation warning for experiences:', revalidateError);
}
```

---

#### 8. `src/pages/api/admin/repos.ts` et `src/pages/api/admin/sync.ts`
**Emplacement** : après la mise à jour ou la synchronisation des dépôts.

```typescript
try {
  if (typeof res.revalidate === 'function') {
    await res.revalidate('/');
    await res.revalidate('/projects');
  }
} catch (revalidateError) {
  console.warn('On-demand revalidation warning for repos:', revalidateError);
}
```

---

### D. Routes API Publiques (Cache HTTP)

Pour les requêtes restantes ou les outils externes, renforcer les en-têtes de cache.

#### 9. `src/pages/api/get/settings.ts` & `src/pages/api/get/experiences.ts`
```diff
- res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
+ res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400');
```

#### 10. `src/pages/api/get/socials.ts`
```diff
- res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
+ res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400');
```

#### 11. `src/pages/api/get/repos.ts`
Ajouter avant le `res.status(200).json(repos);` :
```typescript
res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400');
```

---

### E. Tests Unitaires

Mettre à jour la valeur attendue dans les tests vérifiant le header `Cache-Control` :
- `tests/PublicSettingsApi.test.ts` (ligne 71)
- `tests/PublicExperiencesApi.test.ts` (ligne 76)
- `tests/PublicSocialsApi.test.ts` (ligne 78)

Remplacer la valeur mockée par :
`'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400'`

---

## 5. Procédure de Validation & Métriques Attendues

1. **Vérification automatique** :
   ```bash
   npm run lint
   npm test
   npm run build
   ```
2. **Vérification réseau dans le navigateur (DevTools > Network)** :
   - Naviguer sur `/`, `/experience`, `/projects`, `/contact`.
   - Constater qu'**aucune requête** vers `/api/get/socials`, `/api/get/settings` ou `/api/get/experiences` n'est émise au chargement initial.
3. **Gain BDD attendu** :
   - **Trafic visiteur normal** : **0 requête SQL** (pages servies à 100% depuis le cache HTML statique ou le CDN).
   - **Révalidation ISR de la liste des dépôts** : passage de **50 requêtes SQL à 1 seule requête**.
   - **Économie globale estimée** : **-95% à -98% du volume de requêtes BDD**.
