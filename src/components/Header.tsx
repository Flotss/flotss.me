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
import { useRouter } from 'next/router';
import { FaCode, FaEnvelope, FaHome, FaProjectDiagram, FaBars } from 'react-icons/fa';
import { useState } from 'react';
import { IconType } from 'react-icons/lib';
import React from 'react';
import { motion } from 'framer-motion';

type NavLinkItem = {
  href: string;
  label: string;
  icon: IconType;
  isSelected: boolean;
  emoji?: string;
};

const FaCodeLogo = () => (
  <span className="flex items-center gap-2.5">
    <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-500/10 transition-transform duration-200 hover:scale-105">
      <FaCode className="h-4 w-4" />
    </span>
    <span className="text-sm font-bold tracking-wider text-zinc-200">FLOTSS</span>
  </span>
);

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;

  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  const navLinks: NavLinkItem[] = [
    {
      href: '/',
      label: 'Home',
      icon: FaHome,
      isSelected: currentPath === '/',
    },
    {
      href: '/projects',
      label: 'Projects',
      icon: FaProjectDiagram,
      isSelected: currentPath.startsWith('/projects'),
    },
    {
      href: '/contact',
      label: 'Contact',
      icon: FaEnvelope,
      isSelected: currentPath.startsWith('/contact'),
      emoji: '👋🏼',
    },
  ];

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
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 rounded-xl px-4 py-3 text-base font-medium transition-all ${
                        link.isSelected
                          ? 'border border-emerald-500/30 bg-emerald-500/10 font-semibold text-emerald-300'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                      }`}
                    >
                      <link.icon
                        className={`h-5 w-5 ${link.isSelected ? 'text-emerald-400' : 'text-zinc-400'}`}
                      />
                      <span>{link.label}</span>
                      {link.emoji && (
                        <span className="animate-waving-hand text-lg leading-none no-underline">
                          {link.emoji}
                        </span>
                      )}
                    </Link>
                  ))}
                </nav>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
        </>
      ) : (
        <nav className="ml-auto flex items-center gap-1 sm:gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-200 ${
                link.isSelected ? 'text-emerald-300' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {link.isSelected && (
                <motion.span
                  layoutId="navbar-dock-indicator"
                  className="absolute inset-0 rounded-full border border-emerald-500/30 bg-emerald-500/15 shadow-sm shadow-emerald-500/10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2">
                <link.icon
                  className={`h-4 w-4 transition-colors duration-200 ${
                    link.isSelected ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-zinc-300'
                  }`}
                />
                <span>{link.label}</span>
                {link.emoji && (
                  <span className="animate-waving-hand text-base leading-none no-underline">
                    {link.emoji}
                  </span>
                )}
              </span>
            </Link>
          ))}
        </nav>
      )}
    </Box>
  );
}
