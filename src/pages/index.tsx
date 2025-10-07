import Repos from '@/components/Repos';
import { Container, ContainerNoStyle } from '@/components/StyledBox';
import Title from '@/components/Title';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Box, Grid, Image, List } from '@chakra-ui/react';
import React from 'react';

type TechStack = {
  name: string;
  description: string;
  urlImg: string;
  link?: string;
};

/**
 * The `Home` component represents the homepage of your website.
 *
 * @returns {JSX.Element} - The rendered homepage component.
 */
export default function Home() {
  const isMobile = useIsMobile();

  const techStack = [
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
        '<i>Personal projects</i> focused on developing high-performance websites, emphasizing server-side rendering and SEO optimization.',
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
      {/* Grid layout for the homepage content */}
      <Grid className="mx-5 grid grid-cols-2 grid-rows-1 space-y-5 pt-5 sm:mx-20 lg:space-x-5 lg:space-y-0">
        {/* Left column */}
        <Container className="col-span-2 space-y-2">
          <Title title="Hello ! My name is Florian Mangin" />
          <p className="mx-auto max-w-[600px] text-center text-zinc-200 md:text-xl dark:text-zinc-100">
            I&apos;m a student in an engineering school and a passionate coder on an internship,
            always ready to tackle new software challenges! 🚀
          </p>
        </Container>
      </Grid>
      <ContainerNoStyle className="mx-5 space-y-5 pt-5 sm:mx-20">
        <Box
          className={`scrollbar-hide flex flex-wrap justify-center gap-5 ${isMobile ? '' : 'justify-between'}`}
          style={
            isMobile
              ? { flexWrap: 'wrap', justifyContent: 'center' }
              : {
                  flexWrap: 'nowrap',
                  justifyContent: 'space-between',
                  scrollSnapType: 'x mandatory',
                }
          }
        >
          {techStack.map((tech: TechStack, index: number) => (
            <Box
              key={index}
              className="flex min-w-[120px] max-w-[180px] snap-center flex-col items-center justify-center rounded-3xl bg-box-color p-5"
            >
              <Box className="mb-2 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-zinc-100">
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
              <p className="text-center text-lg font-semibold">{tech.name}</p>
            </Box>
          ))}
        </Box>
      </ContainerNoStyle>

      {/* "My Projects" section */}
      <Container className="mx-5 my-5 overflow-hidden px-0 sm:mx-20">
        <Title title="Projects" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>
        {/* Display a list of projects or repositories using the `Repos` component */}
        <Repos limit={isMobile ? 3 : 6} />
      </Container>
    </>
  );
}
