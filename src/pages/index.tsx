import Repos from '@/components/Repos';
import { StyledBox } from '@/components/StyledBox';
import Title from '@/components/Title';
import { breakpoints } from '@/utils/tailwindBreakpoints';
import { Box, Grid, Image, useMediaQuery } from '@chakra-ui/react';

/**
 * `moveToProjects` is a function that scrolls the page to the "Projects" section.
 * It is typically triggered by a button or link.
 */
const moveToProjects = () => {
  const element = document.getElementById('projects');
  element?.scrollIntoView({ behavior: 'smooth' });
};

/**
 * The `Home` component represents the homepage of your website.
 *
 * @returns {JSX.Element} - The rendered homepage component.
 */
export default function Home() {
  const [isMobile] = useMediaQuery(`(max-width: ${breakpoints.lg})`);

  return (
    <>
      {/* Grid layout for the homepage content */}
      <Grid className="mx-5 grid grid-cols-2 grid-rows-1 space-y-5 pt-5 sm:mx-20 lg:space-x-5 lg:space-y-0">
        {/* Left column */}
        <StyledBox className="col-span-2 space-y-2 lg:col-span-1">
          <Title title="Hello ! My name is Flotss" />
          <p className="mx-auto max-w-[600px] text-center text-zinc-200 md:text-xl dark:text-zinc-100">
            I&apos;m a student in an engineering school and a passionate coder on an internship,
            always ready to tackle new software challenges! 🚀
          </p>
        </StyledBox>

        {/* Right column */}
        <StyledBox className="col-span-2 space-y-4 lg:col-span-1">
          <Title title="Tech stack" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>
          <p className="text-[#A0AEC0]">A brief description about the developer</p>
          <div className="flex justify-center gap-x-4">
            {/* Add your tech stack icons or content here */}
          </div>
        </StyledBox>
      </Grid>

      {/* "My Projects" section */}
      <StyledBox className="mx-5 my-5 overflow-hidden sm:mx-20">
        <Title title="Projects" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>
        {/* Display a list of projects or repositories using the `Repos` component */}
        <Repos limit={isMobile ? 3 : 6} />
      </StyledBox>
      
      {/* About me  */}
      {/* QUi je suis */}
      {/* Quel jobs */}
      {/* Quel étude */}

      {/* <StyledBox className="mx-5 my-5 flex flex-col gap-5 text-lg sm:mx-20">
        <Title title="About me" className="mt-10 text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>

        <Box className="grid grid-cols-12 gap-4">
          <p className="col-span-10 pt-6">
            <b>I am Florian Mangin</b>, a passionate and dedicated Software Engineer based in Paris,
            Ile de France. With a strong foundation in programming and web development, I am
            currently advancing my expertise through a rigorous engineering program at <b>ISEP</b>.
          </p>
          <Image
            src="https://file.diplomeo-static.com/file/00/00/01/45/14501.svg"
            alt="Florian Mangin"
            width={200}
            className="col-span-2"
          />
        </Box>

        <p>
          Currently, I am gaining practical experience and enhancing my expertise as a{' '}
          <b>Software Engineer</b> through an apprenticeship at <b>Société Générale</b>. Here, I
          utilize my proficiency in 
          <b>C# and Angular</b> to contribute to significant projects, providing me with invaluable
          hands-on experience in a real-world setting. This role has honed my ability to deliver
          high-quality software solutions in a fast-paced financial environment, further solidifying
          my skills and knowledge.
        </p>

        <p>
          I thrive in dynamic and collaborative environments, leveraging my skills in{' '}
          <b>C#, Java, JavaScript</b>, and various web technologies to develop innovative solutions.
          Fluent in both French and English, I am committed to continuous learning and staying at
          the forefront of technological advancements. Outside of my professional pursuits, I enjoy
          exploring the latest in cinema, technology, and video games.
        </p>
      </StyledBox>
      <Box className="h-screen">
        <Box className="mx-5 my-5 flex sm:mx-20">
          <Title title="Carrier" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>
        </Box>

        <CustomStyledBox className="snap-center snap-always" left>
          <div>
            <CustomImage src="images/societe-general.png" alt="Société Générale" />
          </div>
        </CustomStyledBox>
        <CustomStyledBox right>
          <div></div>
        </CustomStyledBox>
      </Box>
      <Box className="h-screen">
        <Box className="mx-5 my-5 flex sm:mx-20">
          <Title title="Carrier" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>
        </Box>

        <CustomStyledBox left>
          <div>
            <CustomImage src="images/societe-general.png" alt="Société Générale" />
          </div>
        </CustomStyledBox>
        <CustomStyledBox right>
          <div></div>
        </CustomStyledBox>
      </Box> */}
    </>
  );
}

type CustomStyledBoxProps = {
  children: React.ReactNode;
  left?: boolean;
  right?: boolean;
  className?: string;
};

import { motion } from 'framer-motion';

const CustomStyledBox = (props: CustomStyledBoxProps) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      transition={{ duration: 1 }}
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0, x: props.left ? -1000 : 1000 },
        visible: { opacity: 1, x: 0 },
      }}
      className={`mx-5 my-5 ${props.left ? 'mr-36' : 'ml-36'} sm:mx-20 ${props.left ? 'sm:mr-96' : 'sm:ml-96'} ${props.className}`}
    >
      <StyledBox>{props.children}</StyledBox>
    </motion.div>
  );
};

const CustomImage = (props: any) => {
  return (
    <Image
      src={props.src}
      alt={props.alt}
      bg={'transparent'}
      width={400}
      height={200}
      // Garde le ratio de l'image
      objectFit="cover"
      className="rounded-xl"
    />
  );
};

/**
 * Icon component (SVG).
 *
 * @param {React.SVGProps<SVGSVGElement>} props - SVG icon properties.
 * @returns {JSX.Element} - The SVG icon component.
 */
const Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 256 256"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  />
);

/**
 * TypeScriptIcon component (SVG) for TypeScript logo.
 *
 * @returns {JSX.Element} - The TypeScript logo icon component.
 */
const TypeScriptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    {/* Add the path for the TypeScript logo */}
  </svg>
);
