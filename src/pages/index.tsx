import Repos from '@/components/Repos';
import { Container } from '@/components/StyledBox';
import Title from '@/components/Title';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Box, Grid, Image } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';

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
        'Professional experience in developing robust applications, including process automation and migrating existing applications to modern web solutions.',
      urlImg: 'techstack/Languages/csharp.png',
      link: 'https://dotnet.microsoft.com/',
    },
    {
      name: 'Angular',
      description:
        'Professional experience in creating dynamic and responsive user interfaces, enhancing user experience and facilitating integration with backend systems.',
      urlImg: 'techstack/Frameworks/Angular.png',
      link: 'https://angular.io/',
    },
    {
      name: 'Next.js',
      description:
        'Personal projects focused on developing high-performance websites, emphasizing server-side rendering and SEO optimization.',
      urlImg: 'techstack/Frameworks/Nextjs.png',
      link: 'https://nextjs.org/',
    },
    {
      name: 'Java',
      description:
        'Academic projects involving object-oriented application development, including management systems and simple games, strengthening my Java programming skills.',
      urlImg: 'techstack/Languages/java.png',
      link: 'https://www.java.com/',
    },
  ];

  return (
    <>
      {/* Hero section */}
      <Grid className="mx-5 grid grid-cols-2 grid-rows-1 space-y-5 pt-8 sm:mx-20 lg:space-x-5 lg:space-y-0">
        <Container className="col-span-2 space-y-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title title="Hello ! My name is Florian Mangin" />
          </motion.div>
          <motion.p
            className="mx-auto max-w-[640px] text-center text-lg leading-relaxed text-zinc-400"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            I&apos;m a student in an engineering school and a passionate coder on an internship,
            always ready to tackle new software challenges!
          </motion.p>
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
                <Box className="flex min-w-[130px] max-w-[180px] flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.03] p-6 transition-all duration-300 group-hover:border-emerald-500/20 group-hover:bg-white/[0.06]">
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
