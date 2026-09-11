import HeroSection from '@/components/home/HeroSection';
import Repos from '@/components/Repos';
import { Container } from '@/components/StyledBox';
import Title from '@/components/Title';
import { useIsMobile } from '@/hooks/useIsMobile';
import { prisma } from '@/lib/prisma';
import { GithubService } from '@/services/GithubService';
import { Repo, SiteSettingsType, SocialLinkType } from '@/types/types';
import { sortRepos } from '@/utils/RepoUtils';
import { Box, Image, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import type { GetStaticProps } from 'next';
import React from 'react';

type TechStack = {
  name: string;
  description: string;
  urlImg: string;
  link?: string;
};

interface HomeProps {
  repos?: Repo[];
  settings?: SiteSettingsType;
  socialLinks?: SocialLinkType[];
}

export default function Home({ repos = [], settings, socialLinks = [] }: HomeProps) {
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
      <SEO page="home" />

      {/* Hero section */}
      <HeroSection settings={settings} />

      {/* Tech stack */}
      <Box className="mx-5 px-4 pt-8 sm:mx-20">
        <Box className="flex flex-wrap justify-center gap-3 sm:gap-4">
          {techStack.map((tech: TechStack, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 * index }}
            >
              <Tooltip
                label={tech.description}
                placement="top"
                hasArrow
                rounded="xl"
                bg="#18181b"
                color="#f4f4f5"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.15)"
                p={3}
                fontSize="xs"
                maxW="280px"
                textAlign="center"
                shadow="2xl"
                openDelay={150}
              >
                <a
                  href={tech.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block focus:outline-none"
                >
                  <Box className="flex w-[105px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-500/30 group-hover:bg-white/[0.06] group-hover:shadow-lg group-hover:shadow-emerald-500/10 sm:w-[124px]">
                    <Box className="mb-2.5 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] p-2 transition-all duration-300 group-hover:scale-110 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/10 sm:h-14 sm:w-14">
                      {tech.urlImg ? (
                        <Image
                          src={tech.urlImg}
                          alt={tech.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <span className="text-2xl text-zinc-400">?</span>
                      )}
                    </Box>
                    <p className="text-center text-xs font-medium text-zinc-300 transition-colors duration-300 group-hover:text-emerald-300 sm:text-sm">
                      {tech.name}
                    </p>
                  </Box>
                </a>
              </Tooltip>
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
          <Repos repos={repos} limit={isMobile ? 3 : 6} />
        </motion.div>
      </Container>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  try {
    const githubService = new GithubService();
    const [repos, settings, socialLinks] = await Promise.all([
      githubService.getRepos().catch(() => []),
      prisma.siteSettings.findUnique({ where: { id: 1 } }).catch(() => null),
      prisma.socialLink
        .findMany({
          where: { visible: true },
          orderBy: [{ order: 'asc' }, { id: 'asc' }],
        })
        .catch(() => []),
    ]);

    return {
      props: {
        repos: JSON.parse(JSON.stringify(sortRepos(repos || []))),
        settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
        socialLinks: JSON.parse(JSON.stringify(socialLinks || [])),
      },
      revalidate: 60,
    };
  } catch (err) {
    console.error('Error in Home getStaticProps:', err);
    return {
      props: {
        repos: [],
      },
      revalidate: 60,
    };
  }
};
