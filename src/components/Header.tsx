import ThemeToggle from '@/components/ThemeToggle';
import { useIsMobile } from '@/hooks/useIsMobile';
import {
  Box,
  Link,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { usePathname } from 'next/navigation';
import { FaCode, FaEnvelope, FaHome, FaProjectDiagram, FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { IconType } from 'react-icons/lib';
import { useTheme } from 'next-themes';
import React from 'react';

type LinkHeaderType = {
  href: string;
  children?: React.ReactNode;
  icon: IconType;
  isSelected: boolean;
  className?: string;
};

const FaHandEmoji = () => <span className="animate-waving-hand text-2xl no-underline">👋🏼</span>;
const FaCodeLogo = () => (
  <span className="flex items-center gap-2">
    <FaCode className="h-5 w-5 text-emerald-400" />
    <span className="hidden text-sm font-bold tracking-wider text-zinc-600 dark:text-zinc-300 sm:inline">
      FLOTSS
    </span>
  </span>
);

export default function Header() {
  const path = usePathname();
  const pathTab = path?.split('/');

  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const isSelected = (href: string) => {
    return pathTab?.includes(href);
  };

  const links: LinkHeaderType[] = [
    { href: '/', children: 'Home', icon: FaHome, isSelected: path == '/' },
    {
      href: '/projects',
      children: 'My projects',
      icon: FaProjectDiagram,
      isSelected: isSelected('projects') ?? false,
    },
  ];

  const contactLink: LinkHeaderType = {
    href: '/contact',
    children: (
      <>
        Contact <FaHandEmoji />
      </>
    ),
    icon: FaEnvelope,
    isSelected: isSelected('contact') ?? false,
    className: 'bg-[#2D3748]',
  };

  const CustomLink = (link: LinkHeaderType, className?: string) => (
    <Link
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300
        hover:bg-black/5 hover:text-zinc-900
        dark:hover:bg-white/5 dark:hover:text-white
        ${link.isSelected ? 'bg-black/8 dark:bg-white/10' : ''}
        ${isMobile ? 'text-xl' : ''}
        ${className}`}
      textColor={link.isSelected ? '#34d399' : isDark ? '#A0AEC0' : '#52525b'}
      href={link.href}
      key={link.href}
    >
      {React.createElement(link.icon, { className: 'h-5 w-5' })}
      {link.children}
    </Link>
  );

  const Links = () => (
    <>
      {links.map((link) => (
        <CustomLink {...link} key={link.href} />
      ))}
      {contactLink && (
        <Link
          className={`flex items-center gap-2 rounded-full bg-emerald-500/15 px-4 py-2 text-sm font-medium no-underline transition-all duration-300 hover:bg-emerald-500/25 hover:text-white ${isMobile ? 'text-xl' : ''}`}
          textColor={contactLink.isSelected ? '#BDFFE3' : isDark ? '#A0AEC0' : '#52525b'}
          href={contactLink.href}
        >
          {contactLink.icon && <contactLink.icon className="h-5 w-5" />}
          {contactLink.children}
        </Link>
      )}
    </>
  );

  return (
    <Box
      as="header"
      className="mx-5 mt-3 flex h-14 items-center rounded-full border px-8 backdrop-blur-xl sm:mx-20 lg:px-10
        border-black/8 bg-black/[0.03]
        dark:border-white/5 dark:bg-white/[0.03]"
    >
      <Link className="flex items-center justify-center" href="/">
        <FaCodeLogo />
      </Link>
      {isMobile ? (
        <>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <IconButton
              aria-label="Open Menu"
              icon={<FaBars />}
              onClick={toggleDrawer}
              colorScheme="transparent"
            />
          </div>
          <Drawer isOpen={isOpen} placement="top" onClose={toggleDrawer} size="full">
            <DrawerOverlay />
            <DrawerContent
              color={isDark ? 'white' : 'gray.900'}
              bg={isDark ? 'black' : 'white'}
            >
              <DrawerHeader>
                <FaCodeLogo />
              </DrawerHeader>
              <DrawerCloseButton />
              <DrawerBody>
                <nav className="flex flex-col gap-4">
                  <Links />
                </nav>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <nav className="ml-auto flex items-center gap-2 sm:gap-3">
          <Links />
          <ThemeToggle />
        </nav>
      )}
    </Box>
  );
}
