import Repos from "@/components/Repos";
import Title from "@/components/Title";
import { Box, Button, Grid } from "@chakra-ui/react";
import { StyledBox } from "@/components/StyledBox";

/**
 * `moveToProjects` is a function that scrolls the page to the "Projects" section.
 * It is typically triggered by a button or link.
 */
const moveToProjects = () => {
  const element = document.getElementById("projects");
  element?.scrollIntoView({ behavior: "smooth" });
};

/**
 * The `Home` component represents the homepage of your website.
 *
 * @returns {JSX.Element} - The rendered homepage component.
 */
export default function Home() {
  return (
    <>
      {/* Grid layout for the homepage content */}
      <Grid className="grid grid-cols-2 grid-rows-1 lg:space-x-5 space-y-5 lg:space-y-0 pt-5 mx-5 sm:mx-20">
        {/* Left column */}
        <StyledBox className="col-span-2 lg:col-span-1 space-y-2">
          <Title title="Hello ! My name is Flotss" />
          <p className="max-w-[600px] text-zinc-200 md:text-xl text-center dark:text-zinc-100 mx-auto">
            I&apos;m a student in an engineering school and a passionate coder on an internship, always ready to tackle new software challenges! 🚀
          </p>
        </StyledBox>

        {/* Right column */}
        <StyledBox className="col-span-2 lg:col-span-1 space-y-4">
          <Title title="My Tech Stack" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl"></Title>
          <p className="text-[#A0AEC0]">
            A brief description about the developer
          </p>
          <div className="flex justify-center gap-x-4">
            {/* Add your tech stack icons or content here */}
          </div>
        </StyledBox>
      </Grid>

      {/* "My Projects" section */}
      <StyledBox className="mx-5 sm:mx-20 my-5 bg-[#292929]">
        <Title title="My Projects" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl mt-10"></Title>
        {/* Display a list of projects or repositories using the `Repos` component */}
        <Repos />
      </StyledBox>
    </>
  );
}

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
