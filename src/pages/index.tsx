import Repos from "@/components/Repos";
import { Button } from "@chakra-ui/react";


const moveToProjets = () => {
  const element = document.getElementById("projects");
  element?.scrollIntoView({ behavior: "smooth" });
};

export default function Home() {
  return (
    <>
      <main className="flex-1 px-6 py-12 bg-[#2D3748]">
        <section className="text-center space-y-4" id="home">
          <h1 className="text-3xl font-bold text-[#E2E8F0]">
            Welcome to My Portfolio
          </h1>
          <p className="text-[#A0AEC0]">Check out some of my projects below</p>
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
        <Repos/>
      </main>
    </>
  );
}