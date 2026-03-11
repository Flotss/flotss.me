import Repos from '@/components/Repos';
import { Container } from '@/components/StyledBox';
import Title from '@/components/Title';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Box, Grid, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import React from 'react';

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
      name: 'Angular',
      description:
        'Professional experience building dynamic UIs at Société Générale, used by 20+ developers for branch management, Jira tracking, and real-time SQL monitoring.',
      urlImg: 'techstack/Frameworks/Angular.png',
      link: 'https://angular.dev/',
    },
    {
      name: 'TypeScript',
      description:
        'Core language across professional and personal projects, from Angular enterprise apps to Next.js personal portfolio and various web applications.',
      urlImg: 'techstack/Languages/typescript.png',
      link: 'https://www.typescriptlang.org/',
    },
    {
      name: 'Python',
      description:
        'Developed redundancy solutions for technical alarm systems at Dalkia (EDF Group), including database design and hotline autocomplete features.',
      urlImg: 'techstack/Languages/python.png',
      link: 'https://www.python.org/',
    },
  ];

  return (
    <>
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
        <Box
          className={`flex flex-wrap justify-center gap-4 ${isMobile ? '' : 'justify-between'}`}
          style={
            isMobile
              ? { flexWrap: 'wrap', justifyContent: 'center' }
              : {
                  flexWrap: 'nowrap',
                  justifyContent: 'space-between',
                }
          }
        >
          {techStack.map((tech: TechStack, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <a
                href={tech.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <Box className="flex min-w-[130px] max-w-[180px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-md p-6 transition-all duration-300 group-hover:border-emerald-500/20 group-hover:bg-white/[0.06]">
                  <Box className="mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-zinc-100 transition-transform duration-300 group-hover:scale-110">
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
                  <p className="text-center text-sm font-semibold text-zinc-300 transition-colors duration-300 group-hover:text-white">
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
