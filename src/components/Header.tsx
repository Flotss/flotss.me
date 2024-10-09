import { Box, Link } from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { FaCode } from 'react-icons/fa';

export default function Header() {
  const path = usePathname();
  const pathTab = path?.split('/');

  const isSelected = (href: string) => {
    return pathTab?.includes(href);
  };

  const links = [
    { href: '/', name: 'Home', isSelected: path == '/' },
    { href: '/projects', name: 'My projects', isSelected: isSelected('projects') },
    { href: '/contact', name: 'Contact', isSelected: isSelected('contact') },
  ];

  return (
    <Box
      as="header"
      className="mx-5 mt-2 flex h-14 items-center rounded-full bg-box-color px-8 sm:mx-20 lg:px-10"
    >
      <Link className="flex items-center justify-center" href="/">
        <FaCode className="h-6 w-6 text-[#E2E8F0] text-[#f7fafc62]" />
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
        {links.map((link) => (
          <Link
            className="text-sm font-medium hover:text-[#A0AEC0]"
            textColor={link.isSelected ? '#BDFFE3' : '#f7fafc62'}
            href={link.href}
            key={link.href}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </Box>
  );
}
