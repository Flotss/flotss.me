import Repos from "@/components/Repos";
import { Button } from "@chakra-ui/react";


const moveToProjets = () => {
  const element = document.getElementById("projects");
  element?.scrollIntoView({ behavior: "smooth" });
};

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center space-y-8 text-center">
        <div className="space-y-2 mt-32">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 pb-5">
            Hello ! My name is Flotss
          </h1>
          <p className="max-w-[600px] text-zinc-200 md:text-xl dark:text-zinc-100 mx-auto">
            I&apos;m student in engineering school, and a passionate coder on an internship, always ready to tackle new software challenges! 🚀
          </p>
        </div>
      </div>
      <main className="flex-1 px-6 py-12">
        {/* Section of my techstack */}
        <section className="text-center space-y-4" id="techstack">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 pb-5">
            My Tech Stack
          </h2>
          <p className="text-[#A0AEC0]">
            A brief description about the developer
          </p>
          <div className="flex justify-center gap-x-4">
          </div>
        </section>
        <section className="text-center space-y-4" id="home">
          <h2 className="text-2xl font-bold tracking-tighter sm:text-3xl xl:text-4xl/none bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 pb-5">
            Check out some of my projects below
          </h2>
          <Button
            className="text-[#E2E8F0] border-[#E2E8F0] hover:bg-[#4A5568]"
            variant="outline"
            onClick={moveToProjets}
          >
            See My Work
          </Button>
        </section>
        <section className="text-center space-y-4 py-12" id="about">
          <h2 className="text-2xl font-bold text-[#E2E8F0]">About Me</h2>
          <p className="text-[#A0AEC0]">
            A brief description about the developer
          </p>
        </section>
        <Repos />
      </main>
    </>
  );
}

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

const TypeScriptIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
    <path fill="#3178C6" d="M20 0h216c11.046 0 20 8.954 20 20v216c0 11.046-8.954 20-20 20H20c-11.046 0-20-8.954-20-20V20C0 8.954 8.954 0 20 0Z" />
    <path fill="#FFF" d="M150.518 200.475v27.62c4.492 2.302 9.805 4.028 15.938 5.179c6.133 1.151 12.597 1.726 19.393 1.726c6.622 0 12.914-.633 18.874-1.899c5.96-1.266 11.187-3.352 15.678-6.257c4.492-2.906 8.048-6.704 10.669-11.394c2.62-4.689 3.93-10.486 3.93-17.391c0-5.006-.749-9.394-2.246-13.163a30.748 30.748 0 0 0-6.479-10.055c-2.821-2.935-6.205-5.567-10.149-7.898c-3.945-2.33-8.394-4.531-13.347-6.602c-3.628-1.497-6.881-2.949-9.761-4.359c-2.879-1.41-5.327-2.848-7.342-4.316c-2.016-1.467-3.571-3.021-4.665-4.661c-1.094-1.64-1.641-3.495-1.641-5.567c0-1.899.489-3.61 1.468-5.135s2.362-2.834 4.147-3.927c1.785-1.094 3.973-1.942 6.565-2.547c2.591-.604 5.471-.906 8.638-.906c2.304 0 4.737.173 7.299.518c2.563.345 5.14.877 7.732 1.597a53.669 53.669 0 0 1 7.558 2.719a41.7 41.7 0 0 1 6.781 3.797v-25.807c-4.204-1.611-8.797-2.805-13.778-3.582c-4.981-.777-10.697-1.165-17.147-1.165c-6.565 0-12.784.705-18.658 2.115c-5.874 1.409-11.043 3.61-15.506 6.602c-4.463 2.993-7.99 6.805-10.582 11.437c-2.591 4.632-3.887 10.17-3.887 16.615c0 8.228 2.375 15.248 7.127 21.06c4.751 5.811 11.963 10.731 21.638 14.759a291.458 291.458 0 0 1 10.625 4.575c3.283 1.496 6.119 3.049 8.509 4.66c2.39 1.611 4.276 3.366 5.658 5.265c1.382 1.899 2.073 4.057 2.073 6.474a9.901 9.901 0 0 1-1.296 4.963c-.863 1.524-2.174 2.848-3.93 3.97c-1.756 1.122-3.945 1.999-6.565 2.632c-2.62.633-5.687.95-9.2.95c-5.989 0-11.92-1.05-17.794-3.151c-5.875-2.1-11.317-5.25-16.327-9.451Zm-46.036-68.733H140V109H41v22.742h35.345V233h28.137V131.742Z" />
  </svg>
);