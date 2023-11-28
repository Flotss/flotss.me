"use client";
import {
  Box,
  Link,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import { BsGithub, BsLinkedin } from "react-icons/bs";
import { ReactNode } from "react";

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
    <Box className="px-4 lg:px-6 h-14 flex items-center justify-between border-t border-[#2D3748]">
      <nav className="flex gap-10">
        <SocialButton label="GitHub" href="#">
          <BsGithub />
        </SocialButton>
        <SocialButton label="LinkedIn" href="#">
          <BsLinkedin />
        </SocialButton>
      </nav>
      <Text className="text-xs text-[#A0AEC0]">
        &copy; Flotss&rsquo;s Portfolio. All rights reserved.
      </Text>
    </Box>
  );
}
