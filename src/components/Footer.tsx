import { SocialIcon } from '@/components/icons/SocialIcon';
import { SocialLinkType } from '@/types/types';
import { Box, Link, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import React, { ReactNode, useEffect, useState } from 'react';

const DEFAULT_SOCIAL_LINKS: SocialLinkType[] = [
  {
    id: -1,
    platform: 'github',
    label: 'GitHub',
    url: 'https://github.com/flotss',
    icon: 'FaGithub',
    order: 1,
    visible: true,
  },
  {
    id: -2,
    platform: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/florian-mangin-784604208/',
    icon: 'FaLinkedin',
    order: 2,
    visible: true,
  },
];

const SocialButton = ({
  children,
  label,
  href,
  color: childrenColor = '#34d399',
}: {
  children: ReactNode;
  label: string;
  href: string;
  color?: string;
}) => {
  return (
    <Link
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={9}
      h={9}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'all 0.3s ease'}
      isExternal
      _hover={{
        transform: 'scale(1.15)',
        color: childrenColor,
        bg: 'whiteAlpha.200',
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Link>
  );
};

interface FooterProps {
  initialSocialLinks?: SocialLinkType[];
}

export default function Footer({ initialSocialLinks }: FooterProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLinkType[]>(() => {
    if (initialSocialLinks && initialSocialLinks.length > 0) {
      return initialSocialLinks;
    }
    return DEFAULT_SOCIAL_LINKS;
  });

  // Sync if initialSocialLinks changes through page navigation
  useEffect(() => {
    if (initialSocialLinks && initialSocialLinks.length > 0) {
      setSocialLinks(initialSocialLinks);
    }
  }, [initialSocialLinks]);

  // Fetch dynamic social links on mount
  useEffect(() => {
    let isMounted = true;
    fetch('/api/get/socials')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (isMounted && Array.isArray(data) && data.length > 0) {
          setSocialLinks(data);
        }
      })
      .catch(() => {});

    // Listen for real-time updates from Admin Studio
    const handleSocialsUpdated = (event: CustomEvent<SocialLinkType[]> | Event) => {
      if ('detail' in event && Array.isArray(event.detail)) {
        setSocialLinks(event.detail.filter((l) => l.visible));
      } else {
        fetch('/api/get/socials')
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (isMounted && Array.isArray(data) && data.length > 0) {
              setSocialLinks(data);
            }
          })
          .catch(() => {});
      }
    };

    window.addEventListener('socialLinksUpdated', handleSocialsUpdated);

    return () => {
      isMounted = false;
      window.removeEventListener('socialLinksUpdated', handleSocialsUpdated);
    };
  }, []);

  const currentYear = new Date().getFullYear();

  return (
    <Box className="sticky top-[100vh] mx-5 mb-3 flex h-14 items-center justify-between rounded-full border border-white/5 bg-white/[0.03] px-6 backdrop-blur-xl sm:mx-20">
      <nav className="flex items-center gap-3 sm:gap-4">
        {socialLinks.map((link, idx) => (
          <SocialButton
            key={link.id || idx}
            label={link.label || 'Social Link'}
            href={link.url}
            color="#34d399"
          >
            <SocialIcon iconName={link.icon} className="h-4 w-4" />
          </SocialButton>
        ))}
      </nav>
      <Text className="text-xs text-zinc-500">
        &copy; {currentYear} Flotss. All rights reserved.
      </Text>
    </Box>
  );
}
