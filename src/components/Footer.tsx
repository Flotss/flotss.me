'use client'
import {
  Box,
  Container,
  Link,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import NextLink from "next/link";
import { BsGithub, BsDiscord, BsLinkedin } from "react-icons/bs";
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
    <Box
      className="bg-secondary text-white w-full bottom-0 left-0 right-0"
    >
      <Container
        as={Stack}
        maxW={"6xl"}
        py={4}
        direction={{ base: "column", md: "row" }}
        spacing={4}
        justify={{ base: "center", md: "space-between" }}
        align={{ base: "center", md: "center" }}
      >
        <Text>
          © 2023{" "}
          <Link as={NextLink} href="#">
            Flotss
          </Link>
          . All rights reserved
        </Text>
        <Stack direction={"row"} spacing={6}>
          <SocialButton label={"Github"} href={"https://github.com/Flotss"}>
            <BsGithub />
          </SocialButton>
          <SocialButton
            label={"Discord"}
            href={"https://discordapp.com/users/262703750920011777"}
          >
            <BsDiscord />
          </SocialButton>
          <SocialButton
            label={"Linkedin"}
            href={"https://www.linkedin.com/in/florian-mangin-784604208/"}
          >
            <BsLinkedin />
          </SocialButton>
        </Stack>
      </Container>
    </Box>
  );
}