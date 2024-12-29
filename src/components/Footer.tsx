import { Box, Link, Text, useColorModeValue, VisuallyHidden } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BsGithub, BsLinkedin } from 'react-icons/bs';

/**
 * Represents a social media button.
 * @param children - The content of the button.
 * @param label - The label for accessibility.
 * @param href - The URL to navigate to.
 */
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
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      isExternal
      _hover={{
        transform: 'scale(1.2)',
        color: childrenColor,
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Link>
  );
};

export default function Footer() {
  return (
    <Box className="sticky top-[100vh] mx-5 mb-2 flex h-14 items-center justify-between rounded-full bg-box-color px-4 sm:mx-20 lg:px-6">
      <nav className="flex gap-10">
        <SocialButton label="GitHub" href="https://github.com/flotss" color="#FFFFFF">
          <BsGithub />
        </SocialButton>
        <SocialButton
          label="LinkedIn"
          href="https://www.linkedin.com/in/florian-mangin-784604208/"
          color="#0077B5"
        >
          <BsLinkedin />
        </SocialButton>
      </nav>
      <Text className="text-xs text-[#A0AEC0]">
        &copy; Flotss&rsquo;s Portfolio. All rights reserved.
      </Text>
    </Box>
  );
}
