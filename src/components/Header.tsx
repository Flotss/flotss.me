import { useIsMobile } from '@/hooks/useIsMobile';
import {
  Box,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaCode, FaEnvelope, FaHome, FaProjectDiagram, FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { IconType } from 'react-icons/lib';
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
  <span className="flex items-center gap-2.5">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/10">
      <FaCode className="h-4 w-4" />
    </span>
    <span className="text-sm font-bold tracking-wider text-zinc-200">FLOTSS</span>
  </span>
);

export default function Header() {
  const path = usePathname();
  const pathTab = path?.split('/');

  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const isSelected = (href: string) => {
    return pathTab?.includes(href);
  };

  const links: LinkHeaderType[] = [
    { href: '/', children: 'Home', icon: FaHome, isSelected: path === '/' },
    {
      href: '/projects',
      children: 'Projects',
      icon: FaProjectDiagram,
      isSelected: isSelected('projects') || false,
    },
  ];

  const contactLink: LinkHeaderType = {
    href: '/contact',
    children: (
      <>
        <span>Contact</span> <FaHandEmoji />
      </>
    ),
    icon: FaEnvelope,
    isSelected: isSelected('contact') || false,
  };

  const CustomLink = (link: LinkHeaderType, className?: string) => (
    <Link
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
        link.isSelected
          ? 'border border-white/10 bg-white/10 text-emerald-300 shadow-sm'
          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
      } ${isMobile ? 'text-lg' : ''} ${className || ''}`}
      href={link.href}
      key={link.href}
      onClick={() => setIsOpen(false)}
    >
      {React.createElement(link.icon, { className: 'h-4 w-4' })}
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
          className={`flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-300 transition-all duration-300 hover:border-emerald-500/50 hover:bg-emerald-500/20 hover:text-emerald-200 hover:shadow-sm hover:shadow-emerald-500/20 ${
            contactLink.isSelected
              ? 'border-emerald-500/60 bg-emerald-500/25 font-semibold text-emerald-200 shadow-sm shadow-emerald-500/20'
              : ''
          } ${isMobile ? 'text-lg' : ''}`}
          href={contactLink.href}
          onClick={() => setIsOpen(false)}
        >
          {contactLink.icon && <contactLink.icon className="h-4 w-4" />}
          {contactLink.children}
        </Link>
      )}
    </>
  );

  return (
    <Box
      as="header"
      className="sticky top-4 z-50 mx-5 mt-4 flex h-14 items-center justify-between rounded-full border border-white/10 bg-zinc-950/70 px-6 shadow-lg shadow-black/40 backdrop-blur-xl sm:mx-20 lg:px-8"
    >
      <Link
        className="flex items-center justify-center focus:outline-none"
        href="/"
        onClick={() => setIsOpen(false)}
      >
        <FaCodeLogo />
      </Link>
      {isMobile ? (
        <>
          <IconButton
            aria-label="Open Menu"
            icon={<FaBars className="h-4 w-4 text-zinc-300" />}
            onClick={toggleDrawer}
            className="ml-auto"
            variant="ghost"
            colorScheme="whiteAlpha"
            size="sm"
            rounded="full"
          />
          <Drawer isOpen={isOpen} placement="top" onClose={toggleDrawer} size="full">
            <DrawerOverlay className="backdrop-blur-sm" />
            <DrawerContent color="white" bg="#09090b" className="border-b border-white/10">
              <DrawerHeader className="flex items-center justify-between border-b border-white/5 py-4">
                <FaCodeLogo />
                <DrawerCloseButton
                  position="relative"
                  top="auto"
                  right="auto"
                  className="text-zinc-400 hover:text-white"
                />
              </DrawerHeader>
              <DrawerBody className="py-8">
                <nav className="flex flex-col gap-3">
                  <Links />
                </nav>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <nav className="ml-auto flex items-center gap-2 sm:gap-3">
          <Links />
        </nav>
      )}
    </Box>
  );
}
