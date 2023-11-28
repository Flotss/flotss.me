import { Box, Link } from "@chakra-ui/react";
import { FaCode, FaTools, FaUserGraduate } from "react-icons/fa";

export default function Header() {
  return (
    <Box
      as="header"
      className="px-8 lg:px-10 h-14 flex items-center border-b border-[#2D3748]"
    >
      <Link className="flex items-center justify-center" href="#">
        <FaCode className="h-6 w-6 text-[#E2E8F0]" />
        <span className="sr-only">Portfolio du développeur</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:text-[#A0AEC0]" href="#">
          Accueil
        </Link>
        <Link className="text-sm font-medium hover:text-[#A0AEC0]" href="#">
          À propos
        </Link>
        <Link className="text-sm font-medium hover:text-[#A0AEC0]" href="#">
          Contact
        </Link>
      </nav>
    </Box>
  );
}
