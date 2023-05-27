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
  Link,
} from "@chakra-ui/react";
import { color, motion, animate, useScroll, useSpring } from "framer-motion";
import Typed from "typed.js";
import { useEffect, useRef, useState } from "react";
import SpanExtraBold from "../components/Span/SpanExtraBold";
import TechStack from "@/components/TechStack";
import JSConfetti from "js-confetti";
import { ChevronDownIcon } from "@chakra-ui/icons";
import Head from "next/head";

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
      transition={{ duration: 1, delay: delay || 0 }}
      animate={{ opacity: 1, y: 0 }}
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
      <Head>
        <title>Accueil</title>
        <meta
          name="description"
          content="Florian Mangin, étudiant en informatique, développeur web et mobile, métaleux, cinéphile"
        />
        <meta
          name="keywords"
          content="Florian Mangin, étudiant, développeur, web, mobile, métaleux, cinéphile"
        />
        <meta name="author" content="Florian Mangin" />
      </Head>
      <motion.div
        className="progress-bar absolute"
        style={{ scaleX: scrollYProgress }}
      />
      <Box
        margin="0"
        w="full"
        paddingTop="0vh"
        minH="100vh"
        bgGradient="background-color: #cde085;
        background-image: linear-gradient(180deg, #cde085 -20%, #447f00 30%, #395849 54%, #16161a 93%);        
        "
        className="flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="flex lg:flex-row flex-col lg:space-x-10 space-y-10  items-center justify-center overflow-hidden min-h-[100vh] lg:h-[100vh] w-[100%]">
          <VStack
            spacing={4}
            align="left"
            justify="left"
            className="lg:w-[50%] w-[100%] lg:pr-0 lg:pl-0 pl-10 pr-10"
          >
            <motion.div
              className="cursor-pointer w-[fit-content]"
              whileHover={{
                scale: 1.1,
                x: 50,

                transition: { duration: 0.2 },
              }}
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
              {/* TODO: Voir si je fais une description */}
              {/* <Text fontSize="xl" color="white" className="text-justify">
                Si vous cherchez un passionné de technologie curieux et précis
                dans ses méthodes, qui ne cesse jamais d&apos;apprendre, alors
                vous êtes au bon endroit. Avec des compétences solides en
                travail d&apos;équipe, conception d&apos;applications et analyse
                de données, combinées à une expertise en bases de données,
                frameworks et langages de programmation, je suis prêt à relever
                tous les défis que l&apos;avenir de la technologie nous réserve.
              </Text> */}
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
            className="hidden lg:block cursor-pointer"
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
      </Box>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.5 }}
      >
        <div className="flex flex-col justify-center  border-2 rounded-lg text-white bg-bgElem  min-h-[40vh] px-16 py-8 m-[5vh] space-y-10  md:space-y-0  shadow-2xl">
          <Text className="text-4xl font-semibold mb-5 text-white break-words lg:self-auto self-center">
            Tech Stack
          </Text>
          <Box
            h="calc(100% - 4rem)"
            className="shadow-2xl bg-bgElem/50 flex flex-col lg:flex-row justify-start"
          >
            <TechStack />
          </Box>
        </div>
      </motion.div>
    </>
  );
}
