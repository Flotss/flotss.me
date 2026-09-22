# 🎬 Guide d'Implémentation des Animations & Transitions — flotss.me

Ce document répertorie **l'ensemble des modifications de code** à apporter pour intégrer les animations cinématiques (Depth Dive avec zoom, accélération 3D Three.js, propulsion du bouton CTA et cascade des cartes projets).

> **Statut Git** : La copie de travail est 100% propre (`git status` vérifié, aucun fichier source n'a été altéré). Vous pouvez appliquer ces changements manuellement ou quand vous le souhaiterez.

---

## Sommaire des Modifications

1. [`src/components/layout.tsx`](#1-srccomponentslayouttsx--depth-dive-page-transition) — Depth Dive Page Transition
2. [`src/components/three/ThreeBackground.tsx`](#2-srccomponentsthreethreebackgroundtsx--3d-camera-rig) — Contrôleur de caméra 3D réactif aux routes
3. [`src/components/three/ParticleField.tsx`](#3-srccomponentsthreeparticlefieldtsx--effet-warp-sur-les-particules) — Effet Warp / poussée des particules
4. [`src/components/Repos.tsx`](#4-srccomponentsrepostsx--cascade-des-cartes--cta-propulsion) — Cascade des cartes & propulsion du bouton CTA
5. [Commandes de validation](#5-commandes-de-validation)

---

## 1. `src/components/layout.tsx` — Depth Dive Page Transition

### Objectif
Remplacer la simple translation verticale par une transition cinématique avec **zoom optique (`scale`)**, **flou cinétique (`filter: blur(...)`)** et respect de l'accessibilité (`prefers-reduced-motion`).

### Code complet à remplacer dans `src/components/layout.tsx`

```tsx
import { SocialLinkType } from '@/types/types';
import { useRouter } from 'next/router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  socialLinks?: SocialLinkType[];
}

export default function Layout({ children, socialLinks }: LayoutProps): React.ReactNode {
  const router = useRouter();
  const pageKey = router.asPath.split('?')[0];
  const shouldReduceMotion = useReducedMotion();

  const pageVariants = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 0.97,
          filter: 'blur(6px)',
        },
    animate: shouldReduceMotion
      ? { opacity: 1 }
      : {
          opacity: 1,
          scale: 1,
          filter: 'blur(0px)',
          transition: {
            duration: 0.32,
            ease: [0.22, 1, 0.36, 1], // Courbe cubique douce inspirée Apple/Linear
          },
        },
    exit: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 1.03,
          filter: 'blur(6px)',
          transition: {
            duration: 0.24,
            ease: [0.22, 1, 0.36, 1],
          },
        },
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col overflow-x-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pageKey}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-1 flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer initialSocialLinks={socialLinks} />
    </>
  );
}
```

---

## 2. `src/components/three/ThreeBackground.tsx` — 3D Camera Rig

### Objectif
Ajouter un composant interne `CameraRig` au `<Canvas>` WebGL persistant. Lors d'un changement de route Next.js (`routeChangeStart`), la caméra plonge vers l'avant sur l'axe Z (de `8` à `5.2`), puis revient en douceur à sa position nominale à l'arrivée (`routeChangeComplete`).

### Code complet à remplacer dans `src/components/three/ThreeBackground.tsx`

```tsx
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import Router from 'next/router';
import { Suspense, useEffect, useRef } from 'react';
import * as THREE from 'three';
import FloatingGeometry from './FloatingGeometry';
import ParticleField from './ParticleField';

function CameraRig() {
  const { camera } = useThree();
  const targetZ = useRef(8);

  useEffect(() => {
    const handleStart = () => {
      // Plongée vers l'avant lors de la navigation
      targetZ.current = 5.2;
    };

    const handleComplete = () => {
      // Retour fluide à la distance par défaut
      targetZ.current = 8;
    };

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
    };
  }, []);

  useFrame((_, delta) => {
    const clampedDelta = Math.min(delta, 0.1);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ.current, clampedDelta * 4);
  });

  return null;
}

export default function ThreeBackground() {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={0.5} color="#34d399" />
          <pointLight position={[-10, -10, -5]} intensity={0.3} color="#8b5cf6" />
          <CameraRig />
          <ParticleField />
          <FloatingGeometry />
        </Suspense>
      </Canvas>
    </div>
  );
}
```

---

## 3. `src/components/three/ParticleField.tsx` — Effet Warp sur les Particules

### Objectif
Accélérer la vitesse des particules et créer une sensation de poussée (« hyperespace ») sur l'axe Z pendant le changement de page.

### Modifications à apporter dans `src/components/three/ParticleField.tsx`

1. **Ajouter l'import `Router` de `next/router` en tête de fichier** :
```tsx
import Router from 'next/router';
```

2. **Ajouter l'écouteur de navigation dans le composant `ParticleField`** :
```tsx
  const isWarping = useRef(false);

  useEffect(() => {
    const handleStart = () => {
      isWarping.current = true;
    };
    const handleComplete = () => {
      isWarping.current = false;
    };

    Router.events.on('routeChangeStart', handleStart);
    Router.events.on('routeChangeComplete', handleComplete);
    Router.events.on('routeChangeError', handleComplete);

    return () => {
      Router.events.off('routeChangeStart', handleStart);
      Router.events.off('routeChangeComplete', handleComplete);
      Router.events.off('routeChangeError', handleComplete);
    };
  }, []);
```

3. **Dans la boucle `useFrame`**, ajouter l'impulsion Z :
```tsx
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Poussée warp vers l'avant lors de la navigation
      if (isWarping.current) {
        velocities[iz] += 0.008;
      }
      ...
```

---

## 4. `src/components/Repos.tsx` — Cascade des Cartes & CTA Propulsion

### Objectif
1. Les cartes de projets apparaissent en cascade (*staggered children*) avec un léger ressort élastique (`spring`).
2. Le bouton « Explore All Projects » s'anime au clic avec un effet de pulsation et d'onde émeraude.

### Modifications à apporter dans `src/components/Repos.tsx`

1. **Ajouter l'import `motion` de `framer-motion`** :
```tsx
import { motion } from 'framer-motion';
```

2. **Définir les variants de cascade au niveau du fichier** :
```tsx
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 20,
    },
  },
};
```

3. **Remplacer le conteneur de rendu des cartes** :
```tsx
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`margin-auto col-span-1 flex w-full flex-wrap items-stretch justify-center gap-x-5 gap-y-5 lg:flex-row ${
            props.filterVisible ? 'lg:col-span-4' : 'lg:col-span-5'
          }`}
        >
          {loading
            ? skeletons
            : filteredRepos.slice(0, props.limit).map((repo) => (
                <motion.div key={repo.id} variants={itemVariants}>
                  <ProjectCard repo={repo} isMobile={isMobile} />
                </motion.div>
              ))}
          {!loading && filteredRepos.length === 0 && (
            <Title
              title="No repositories found"
              className="mt-10 sm:text-xl mdrepo:text-xl lgrepo:text-xl"
            />
          )}
        </motion.div>
```

4. **Améliorer le bouton CTA « Explore All Projects »** avec `motion.button` :
```tsx
      {props.limit && filteredRepos.length > props.limit && (
        <Box className="mt-6 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-white/10 bg-white/[0.04] px-7 py-3 text-sm font-medium text-zinc-300 backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white hover:shadow-lg hover:shadow-emerald-500/15"
            onClick={() => {
              router.push('/projects');
            }}
          >
            <span className="relative z-10">Explore All Projects</span>
            <span className="relative z-10 text-sm text-zinc-400 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-300">
              →
            </span>
          </motion.button>
        </Box>
      )}
```

---

## 5. Commandes de Validation

Lorsque vous appliquerez ces modifications, lancez les commandes suivantes pour vous assurer que tout est parfait :

```bash
# Vérification du typage et du linting (ESLint 9 + Prettier)
npm run lint

# Vérification de l'ensemble des tests unitaires et de sécurité
npm test

# Compilation de production Next.js avec Turbopack
npm run build
```
