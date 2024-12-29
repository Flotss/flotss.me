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
import React from 'react';

type LinkHeaderType = {
  href: string;
  children?: React.ReactNode;
  icon: IconType;
  isSelected: boolean;
  className?: string;
};

const FaHandEmoji = () => <span className="animate-waving-hand text-2xl no-underline">👋🏼</span>;
const FaCodeLogo = () => <FaCode className="h-6 w-6 text-[#f7fafc62]" />;

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
    { href: '/', children: 'Home', icon: FaHome, isSelected: path == '/' },
    {
      href: '/projects',
      children: 'My projects',
      icon: FaProjectDiagram,
      isSelected: isSelected('projects'),
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
    isSelected: isSelected('contact'),
    className: 'bg-[#2D3748]',
  };

  const CustomLink = (link: LinkHeaderType, className?: string) => (
    <Link
      className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 hover:text-[#e7edf5] ${isMobile ? 'bg-[#0f0f0f] text-xl' : ''} ${className}`}
      textColor={link.isSelected ? '#BDFFE3' : '#A0AEC0'}
      href={link.href}
      key={link.href}
    >
      {React.createElement(link.icon, { className: 'h-6 w-6' })}
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
          className={`flex items-center gap-2 rounded-full bg-[#2D3748] px-4 py-2 text-sm font-medium no-underline transition-colors duration-300 hover:text-[#e7edf5] ${isMobile ? 'text-xl' : ''}`}
          textColor={contactLink.isSelected ? '#BDFFE3' : '#A0AEC0'}
          href={contactLink.href}
        >
          {contactLink.icon && <contactLink.icon className="h-6 w-6" />}
          {contactLink.children}
        </Link>
      )}
    </>
  );

  return (
    <Box
      as="header"
      className="mx-5 mt-2 flex h-14 items-center rounded-full bg-box-color px-8 sm:mx-20 lg:px-10"
    >
      <Link className="flex items-center justify-center" href="/">
        <FaCodeLogo />
      </Link>
      {isMobile ? (
        <>
          <IconButton
            aria-label="Open Menu"
            icon={<FaBars />}
            onClick={toggleDrawer}
            className="ml-auto"
            colorScheme="transparent"
          />
          <Drawer isOpen={isOpen} placement="top" onClose={toggleDrawer} size="full">
            <DrawerOverlay />
            <DrawerContent color="white" bg={'black'}>
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
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Links />
        </nav>
      )}
    </Box>
  );
}
