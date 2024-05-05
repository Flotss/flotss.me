import {
  Box,
  Link,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { ReactNode } from "react";
import { StyledBox } from "@/components/StyledBox";

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
}: {
  children: ReactNode;
  label: string;
  href: string;
}) => {
  return (
    <Link
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      isExternal
      _hover={{
        transform: "scale(1.2)",
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </Link>
  );
};

export default function Footer() {
  return (
    <Box className="px-4 mb-2 lg:px-6 h-14 mx-5 sm:mx-20 flex items-center justify-between sticky top-[100vh] bg-box-color rounded-full">
      <nav className="flex gap-10">
        <SocialButton label="GitHub" href="https://github.com/flotss">
          <BsGithub />
        </SocialButton>
        <SocialButton label="LinkedIn" href="https://www.linkedin.com/in/florian-mangin-784604208/">
          <BsLinkedin />
        </SocialButton>
      </nav>
      <Text className="text-xs text-[#A0AEC0]">
        &copy; Flotss&rsquo;s Portfolio. All rights reserved.
      </Text>
    </Box>
  );
}
