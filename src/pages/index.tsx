import Repos from '@/components/Repos';
import { Container } from '@/components/StyledBox';
import Title from '@/components/Title';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Box, Grid, Image, Tooltip } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import { FaArrowRight, FaEnvelope } from 'react-icons/fa';

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
      {/* Hero section */}
      <Grid className="mx-5 grid grid-cols-2 grid-rows-1 space-y-5 pt-8 sm:mx-20 lg:space-x-5 lg:space-y-0">
        <Container className="col-span-2 space-y-4 py-12">
          <div className="relative min-h-[280px] sm:min-h-[340px]">
            <HeroScene />
            <div className="relative z-10 flex flex-col items-center justify-center pt-8">
              {/* Status Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300 shadow-sm shadow-emerald-500/10 backdrop-blur-md"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                Available for new opportunities
              </motion.div>

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
                Software Engineer passionate about crafting robust software, clean architectures,
                and modern web applications.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                className="mt-8 flex flex-wrap items-center justify-center gap-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <a
                  href="#projects"
                  className="group inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/15 px-6 py-2.5 text-sm font-medium text-emerald-200 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/60 hover:bg-emerald-500/25 hover:text-white hover:shadow-lg hover:shadow-emerald-500/15 active:translate-y-0"
                >
                  <span>View Projects</span>
                  <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-zinc-300 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:translate-y-0"
                >
                  <FaEnvelope className="h-3.5 w-3.5 text-zinc-400" />
                  <span>Contact Me</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </Container>
      </Grid>

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
                bg="gray.900"
                color="gray.200"
                border="1px solid"
                borderColor="whiteAlpha.200"
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
                  <Box className="flex w-[105px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-3.5 backdrop-blur-md transition-all duration-300 group-hover:-translate-y-1 group-hover:border-emerald-500/30 group-hover:bg-white/[0.06] group-hover:shadow-lg group-hover:shadow-emerald-500/5 sm:w-[124px]">
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
                    <p className="text-center text-xs font-medium text-zinc-300 transition-colors duration-300 group-hover:text-white sm:text-sm">
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
          <Repos limit={isMobile ? 3 : 6} />
        </motion.div>
      </Container>
    </>
  );
}
