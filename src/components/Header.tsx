import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Icon,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { IconType } from "react-icons/lib";
interface ButtonHeaderProps {
  text: string;
  url: string;
  icon?: IconType;
}

const ButtonHeader = ({ text, url, icon }: ButtonHeaderProps) => {
  return (
    <Link href={url}>
      <Button
        leftIcon={icon ? <Icon as={icon} /> : undefined }
        colorScheme="gray"
        variant="ghost"
      >
        {text}
      </Button>
    </Link>
  );
};

// HAMBURGER MENU
const variants = {
  open: { opacity: 1, x: 0 },
  closed: { opacity: 0, x: "-100%" },
}

const Toggle = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}>Toggle</button>
);

const Items = () => (
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
);

const MyComponent = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav
      animate={isOpen ? "open" : "closed"}
      variants={variants}
    >
      <Toggle onClick={() => setIsOpen(isOpen => !isOpen)} />
      <Items />
    </motion.nav>
  )
}

export default function Header() {
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsAtTop(window.scrollY <= 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 transition-opacity w-full ease-in-out duration-300 ${
        isAtTop ? "opacity-100" : "opacity-0"
      }`}
    >
      <Box as="nav" className="bg-zinc-800 shadow-lg w-full">
        <Box className="grid grid-cols-8 gap-4 text-white p-2 justify-items-center items-center">
          <Box className="col-span-4">
            <Text fontSize="3xl" className="font-bold justify-self-start ">
              Flotss
            </Text>
            HamburgerMenu
          </Box>
          <ButtonHeader text="À propos" url="/about-me" />
          <ButtonHeader text="Mon parcours" url="/my-experience" />
          <ButtonHeader text="Mes projets" url="/projects" />
          <ButtonHeader text="Contact" url="/contact" />
        </Box>
      </Box>
    </header>
  );
}
