import { Box, Link } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { FaCode } from 'react-icons/fa';

export default function Header() {
  const path = usePathname();

  return (
    <Box
      as="header"
      className="mx-5 mt-2 flex h-14 items-center rounded-full bg-box-color px-8 sm:mx-20 lg:px-10"
    >
      <Link className="flex items-center justify-center" href="/">
        <FaCode className="h-6 w-6 text-[#E2E8F0]" />
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link className="text-sm font-medium hover:text-[#A0AEC0]" href="/">
          Accueil
        </Link>
        <Link className="text-sm font-medium hover:text-[#A0AEC0]" href="/projects">
          Mes projets
        </Link>
        <Link className="text-sm font-medium hover:text-[#A0AEC0]" href="/about-me">
          À propos
        </Link>
        <Link className="text-sm font-medium hover:text-[#A0AEC0]" href="/contact">
          Contact
        </Link>
      </nav>
    </Box>
  );
}
