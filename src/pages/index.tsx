import {
  HStack,
  VStack,
  Text,
  Image,
  Box,
  Stack,
  StackDirection,
  Wrap,
  WrapItem,
  Heading,
  Skeleton,
} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { color, motion, animate, useScroll, useSpring } from "framer-motion";
import Typed from "typed.js";
import { useEffect, useRef, useState } from "react";
import { TechStackItem, FileMap } from "./types/types";
import SpanExtraBold from "../components/Span/SpanExtraBold";
import TechStack from "@/components/TechStack";
import JSConfetti from "js-confetti";
import { ChevronDownIcon } from "@chakra-ui/icons";

const MotionElementJSX = ({
  children,
  delay,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: delay || 0 }}
    >
      {children}
    </motion.div>
  );
};

const confetti = () => {
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: ["🎉", "🎊", "🎈", "🎁"],
    emojiSize: 40,
    confettiNumber: 50,
    confettiRadius: 6,
  });
};

export default function Home() {
  const textMe = useRef(null);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const typed = new Typed(textMe.current, {
      strings: [
        "Je suis étudiant",
        "Je suis développeur",
        "Je suis métaleux",
        "Cinéphile",
      ],
      typeSpeed: 100,
      backSpeed: 100,
      loop: true,
      cursorChar: "|",
      smartBackspace: true,
    });

    return () => {
      // Destroy Typed instance during cleanup to stop animation
      typed.destroy();
    };
  }, []);

  return (
    <>
      <motion.div
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
      />
      <Box
        margin="0"
        w="full"
        paddingTop="0vh"
        minH="100vh"
        bgGradient="background-color: rgb(51, 65, 85); background-image: radial-gradient(at 82% 12%, rgb(30, 58, 138) 0, transparent 75%), radial-gradient(at 30% 36%, rgb(217, 70, 239) 0, transparent 73%), radial-gradient(at 80% 14%, rgb(148, 163, 184) 0, transparent 68%), radial-gradient(at 5% 78%, rgb(136, 19, 55) 0, transparent 65%), radial-gradient(at 98% 94%, rgb(136, 19, 55) 0, transparent 33%), radial-gradient(at 86% 91%, rgb(236, 252, 203) 0, transparent 76%)"
        className="flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="flex lg:flex-row flex-col lg:space-x-10 space-y-10  items-center justify-center overflow-hidden min-h-[100vh] lg:h-[100vh]">
          <VStack
            spacing={4}
            w="50%"
            align="left"
            justify="left"
            className="pl-0 lg:pl-2"
          >
            <motion.div
              //Fait un while hover qui est indépendant du reste
              whileHover={{
                scale: 1.1,
                x: 50,

                transition: { duration: 0.2 },
              }}
              //Fait un while tap qui est indépendant du reste
              whileTap={{
                scale: 0.9,
                x: -50,
                transition: { duration: 0.2 },

                // FrontFlip
                rotateX: 180,
              }}
            >
              <motion.div
                animate={{
                  x: [0, -2, -2, 0, 2, 4, 4, 2, 0],
                  y: [0, -2, -4, -6, -6, -4, -2, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                }}
              >
                <Box
                  borderRadius="lg"
                  border="2px solid white"
                  paddingX="1.5"
                  width="fit-content"
                  bg="white"
                  onClick={() => confetti()}
                >
                  Florian Mangin, 19 ans
                </Box>
              </motion.div>
            </motion.div>
            <MotionElementJSX delay={0.1}>
              <Text
                fontSize="4xl"
                color="white"
                className="font-semibold tracking-wide"
              >
                Futur ingénieur{" "}
                <SpanExtraBold innerHTML="logiciel" color="teal.400" />,
                j&apos;apprends sans cesse.
              </Text>
              <Text
                fontSize="3xl"
                color="white"
                className="font-semibold tracking-wide"
              >
                <span ref={textMe}></span>
              </Text>
            </MotionElementJSX>
            <MotionElementJSX delay={0.3}>
              <Text fontSize="xl" color="white">
                Si vous cherchez un passionné de technologie curieux et précis
                dans ses méthodes, qui ne cesse jamais d&apos;apprendre, alors
                vous êtes au bon endroit. Avec des compétences solides en
                travail d&apos;équipe, conception d&apos;applications et analyse
                de données, combinées à une expertise en bases de données,
                frameworks et langages de programmation, je suis prêt à relever
                tous les défis que l&apos;avenir de la technologie nous réserve.
              </Text>
            </MotionElementJSX>
          </VStack>
          <MotionElementJSX delay={0.5}>
            <div className="relative w-60 lg:w-[30em]">
              <Image
                src="avatar.jpg"
                alt="1"
                objectFit="cover"
                borderRadius="full"
              />
            </div>
          </MotionElementJSX>

          {/* Mise en place d'un indicateur qui est une fleche pour regarder vers le bas */}
          <div
            onClick={() => {
              // Scroll smooth vers le bas
              window.scrollTo({
                top: window.innerHeight,
                behavior: "smooth",
              });
            }}
          >
            <ChevronDownIcon
              position={"absolute"}
              top={"85vh"}
              left={"50%"}
              boxSize={10}
              color={"white"}
              className="animate-bounce"
            />
            <ChevronDownIcon
              position={"absolute"}
              top={"86vh"}
              left={"50%"}
              boxSize={10}
              color={"white"}
              className="animate-bounce"
            />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.5 }}
        >
          <div className="flex flex-col justify-center  border-2 rounded-lg text-white bg-slate-600  min-h-[40vh] px-16 py-8 m-[5vh] space-y-10  md:space-y-0  shadow-2xl">
            <Text className="text-4xl font-semibold mb-5 text-white break-words lg:self-auto self-center">
              Tech Stack
            </Text>
            <Box
              h="calc(100% - 4rem)"
              className="shadow-2xl bg-slate-500 flex flex-col lg:flex-row justify-start"
            >
              <TechStack />
            </Box>
          </div>
        </motion.div>
      </Box>
    </>
  );
}
