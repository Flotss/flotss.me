import { Box, Link } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { FaCode } from 'react-icons/fa';


const LinkHeader = ({ textColor, ...props } : { textColor: string }) => (
  <Link
    {...props}
    textColor={textColor}
    className="text-sm font-medium hover:text-[#A0AEC0]" />
)

export default function Header() {
  const path = usePathname();
  const pathTab = path?.split('/');

  const isSelected = (href: string) => {
    if (path == '/') {
      return true
    } 

    return pathTab?.includes(href);
  };

  return (
    <Box
      as="header"
      className="mx-5 mt-2 flex h-14 items-center rounded-full bg-box-color px-8 sm:mx-20 lg:px-10"
    >
      <Link className="flex items-center justify-center" href="/">
        <FaCode className="h-6 w-6 text-[#E2E8F0] text-[#f7fafc62]" />
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        <Link
          className="text-sm font-medium hover:text-[#A0AEC0]"
          textColor={isSelected('/') ? '#BDFFE3' : '#f7fafc62'}
          href="/"
        >
          Home
        </Link>
        <Link
          className="text-sm font-medium hover:text-[#A0AEC0]"
          textColor={isSelected('projects') ? '#BDFFE3' : '#f7fafc62'}
          href="/projects"
        >
          My projects
        </Link>
        <Link
          className="text-sm font-medium hover:text-[#A0AEC0]"
          href="/about-me"
          textColor={isSelected('about-me') ? '#BDFFE3' : '#f7fafc62'}
        >
          About me
        </Link>
        <Link
          className="text-sm font-medium hover:text-[#A0AEC0]"
          href="/contact"
          textColor={isSelected('contact') ? '#BDFFE3' : '#f7fafc62'}
        >
          Contact
        </Link>
      </nav>
    </Box>
  );
}
