import { Box, Link, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';

const SocialButton = ({
  children,
  label,
  href,
  color: childrenColor,
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

export default function Footer() {
  return (
    <Box className="sticky top-[100vh] mx-5 mb-3 flex h-14 items-center justify-between rounded-full border border-white/5 bg-white/[0.03] px-6 backdrop-blur-xl sm:mx-20">
      <nav className="flex gap-6">
        <SocialButton label="GitHub" href="https://github.com/flotss" color="#FFFFFF">
          <BsGithub className="h-4 w-4" />
        </SocialButton>
        <SocialButton
          label="LinkedIn"
          href="https://www.linkedin.com/in/florian-mangin-784604208/"
          color="#0077B5"
        >
          <BsLinkedin className="h-4 w-4" />
        </SocialButton>
      </nav>
      <Text className="text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} Flotss. All rights reserved.
      </Text>
    </Box>
  );
}
