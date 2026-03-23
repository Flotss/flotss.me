import Repos from '@/components/Repos';
import SEO from '@/components/SEO';
import { Container } from '@/components/StyledBox';
import Title from '@/components/Title';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Box, Grid, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import React from 'react';

/**
 * Données structurées JSON-LD (Schema.org — type "Person").
 *
 * Google lit ce script pour comprendre qui est l'auteur du site et peut
 * afficher un "Knowledge Panel" dans les résultats de recherche (la box
 * sur la droite avec photo, nom, titre, liens réseaux sociaux).
 *
 * Les propriétés sameAs pointent vers les profils officiels pour que
 * Google puisse relier les entités entre elles.
 */
const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Florian Mangin',
  url: 'https://flotss.me',
  image: 'https://flotss.me/avatar.jpg',
  jobTitle: 'Software Engineer',
  worksFor: {
    '@type': 'Organization',
    name: 'Société Générale',
    url: 'https://www.societegenerale.com',
  },
  alumniOf: {
    '@type': 'EducationalOrganization',
    name: 'ISEP Paris',
    url: 'https://www.isep.fr',
  },
  sameAs: [
    'https://github.com/Flotss',
    // Ajoute ton profil LinkedIn ici si tu en as un
  ],
  knowsAbout: ['TypeScript', 'Next.js', 'C#', '.NET', 'Angular', 'PostgreSQL', 'React'],
};

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});

type TechStack = {
  name: string;
  description: string;
  urlImg: string;
  link?: string;
};

export default function Home() {
  const isMobile = useIsMobile();

  const techStack: TechStack[] = [
    {
      name: 'C# / .NET',
      description:
        'Software engineer at Société Générale, building ASP.NET Core applications, automating release processes, and migrating C# frameworks to modern web solutions.',
      urlImg: 'techstack/Languages/csharp.png',
      link: 'https://dotnet.microsoft.com/',
    },
    {
      name: 'TypeScript',
      description:
        'Core language across professional and personal projects, from Angular enterprise apps to Next.js personal portfolio and various web applications.',
      urlImg: 'techstack/Languages/typescript.png',
      link: 'https://www.typescriptlang.org/',
    },
    {
      name: 'Java',
      description:
        'Academic projects involving JavaFX application development, including ObjectAidJava for automatic UML schema generation from Java classes.',
      urlImg: 'techstack/Languages/java.png',
      link: 'https://www.java.com/',
    },
    {
      name: 'Python',
      description:
        'Developed redundancy solutions for technical alarm systems at Dalkia (EDF Group), including database design and hotline autocomplete features.',
      urlImg: 'techstack/Languages/python.png',
      link: 'https://www.python.org/',
    },
    {
      name: 'Angular',
      description:
        'Professional experience building dynamic UIs at Société Générale, used by 20+ developers for branch management, Jira tracking, and real-time SQL monitoring.',
      urlImg: 'techstack/Frameworks/Angular.png',
      link: 'https://angular.dev/',
    },
    {
      name: 'Next.js',
      description:
        'Personal projects focused on developing high-performance websites with server-side rendering, including this portfolio.',
      urlImg: 'techstack/Frameworks/nextJs.png',
      link: 'https://nextjs.org/',
    },
    {
      name: 'Tailwind CSS',
      description:
        'Utility-first CSS framework used across personal and professional projects for rapid, responsive UI development.',
      urlImg: 'techstack/Frameworks/Tailwind CSS.png',
      link: 'https://tailwindcss.com/',
    },
    {
      name: 'PostgreSQL',
      description:
        'Database design and management experience across multiple projects, including production environments.',
      urlImg: 'techstack/Databases/PostgreSQL.png',
      link: 'https://www.postgresql.org/',
    },
    {
      name: 'Git',
      description:
        'Daily use in professional and personal workflows, including CI/CD pipelines, branch management, and team collaboration.',
      urlImg: 'techstack/Tools/Git.png',
      link: 'https://git-scm.com/',
    },
  ];

  return (
    <>
      {/* SEO — balises <head> spécifiques à la homepage */}
      <SEO
        type="profile"
        description="Software engineering student at ISEP Paris and software engineer at Société Générale. Building modern web applications with Next.js, TypeScript, Angular and C#."
        url="/"
      />

      {/*
       * JSON-LD injecté dans un <script> dans le <head>.
       * dangerouslySetInnerHTML est ici la seule façon de produire un <script>
       * avec du JSON valide sans que React échappe les guillemets.
       * Le contenu est entièrement statique et contrôlé — pas de risque XSS.
       */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </Head>

      {/* Hero section */}
      <Grid className="mx-5 grid grid-cols-2 grid-rows-1 space-y-5 pt-8 sm:mx-20 lg:space-x-5 lg:space-y-0">
        <Container className="col-span-2 space-y-4 py-12">
          <div className="relative min-h-[280px] sm:min-h-[320px]">
            <HeroScene />
            <div className="relative z-10 flex flex-col items-center justify-center pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              >
                <h1 className="glitch-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-purple-500 bg-clip-text text-center text-4xl font-bold text-transparent sm:text-5xl lg:text-6xl">
                  Hello ! My name is Florian Mangin
                </h1>
              </motion.div>
              <motion.p
                className="mx-auto mt-4 max-w-[640px] text-center text-lg leading-relaxed text-zinc-400"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Software engineering student at ISEP Paris, currently working as a software engineer
                at Société Générale. Passionate about building modern web applications.
              </motion.p>
            </div>
          </div>
        </Container>
      </Grid>

      {/* Tech stack */}
      <Box className="mx-5 px-8 pt-5 sm:mx-20">
        <Box className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {techStack.map((tech: TechStack, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
            >
              <a
                href={tech.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Box className="flex w-[100px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur-md transition-all duration-300 group-hover:border-emerald-500/20 group-hover:bg-white/[0.06] sm:w-[120px] sm:p-4">
                  <Box className="mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-zinc-100 transition-transform duration-300 group-hover:scale-110 sm:h-14 sm:w-14">
                    {tech.urlImg ? (
                      <Image
                        src={tech.urlImg}
                        alt={tech.name}
                        className="h-full w-full rounded-full object-contain"
                      />
                    ) : (
                      <span className="text-2xl text-zinc-400">?</span>
                    )}
                  </Box>
                  <p className="text-center text-xs font-semibold text-zinc-300 transition-colors duration-300 group-hover:text-white sm:text-sm">
                    {tech.name}
                  </p>
                </Box>
              </a>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Projects section */}
      <Container className="mx-5 my-8 overflow-hidden px-0 sm:mx-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Title title="Projects" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl" />
          <Repos limit={isMobile ? 3 : 6} />
        </motion.div>
      </Container>
    </>
  );
}
