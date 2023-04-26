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
import { color, motion } from "framer-motion";
import Typed from "typed.js";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { TechStackItem, FileMap } from "./types/types";

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

const SpanExtraBold = ({
  innerHTML,
  color,
  ref,
}: {
  innerHTML: string;
  color: string;
  ref?: MutableRefObject<any>;
}) => {
  return (
    <Text as="span" color={color} className="font-extrabold" ref={ref}>
      {innerHTML}
    </Text>
  );
};

const ImageTech = ({
  src,
  alt,
  delay = 0,
}: {
  src: string;
  alt: string;
  delay: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: delay || 0 }}
    >
      <div>
        <Image src={src} alt={alt} maxH="170px" />
      </div>
    </motion.div>
  );
};

const TechStack = () => {
  // I want to use Skeleton with Chakra UI
  const [TechStack, setTechStack] = useState<TechStackItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical"
  );

  useEffect(() => {
    fetch("/api/getTechStack")
      .then((response) => response.json())
      .then((data) => {
        console.log(data.TechStack);
        setTechStack(data.TechStack);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });

    // Lorsque la taille est trop petite on fait en sorte que les tabs soient horizontaux
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setOrientation("horizontal");
      } else {
        setOrientation("vertical");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <Skeleton isLoaded={!isLoading}>
        <Tabs
          backgroundColor="transparent"
          orientation={orientation}
          variant="soft-rounded"
          colorScheme="gray"
        >
          <TabList>
            {TechStack.map((item, index) => (
              <Tab key={index}>{item.category}</Tab>
            ))}
          </TabList>
          <TabPanels>
            {TechStack.map((item, index) => (
              <TabPanel key={index}>
                <Wrap>
                  {item.files.map((file, index) => (
                    <WrapItem key={index}>
                      <VStack>
                        <ImageTech src={file.src} alt={file.name} delay={0} />
                        <Text fontSize="sm" color="white">
                          {file.name}
                        </Text>
                      </VStack>
                    </WrapItem>
                  ))}
                </Wrap>
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Skeleton>
    </>
  );
};

export default function Home() {
  const textMe = useRef(null);

  useEffect(() => {
    const typed = new Typed(textMe.current, {
      strings: [
        "Je suis étudiant",
        "Je suis développeur",
        "Je suis passionné par le métal",
        "Cinéphile",
        "Audiofile",
      ],
      typeSpeed: 80,
      backSpeed: 80,
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
      <Box
        margin="0"
        w="full"
        paddingTop="5vh"
        minH="100vh"
        bgGradient="background-color: rgb(51, 65, 85); background-image: radial-gradient(at 82% 12%, rgb(30, 58, 138) 0, transparent 75%), radial-gradient(at 30% 36%, rgb(217, 70, 239) 0, transparent 73%), radial-gradient(at 80% 14%, rgb(148, 163, 184) 0, transparent 68%), radial-gradient(at 5% 78%, rgb(136, 19, 55) 0, transparent 65%), radial-gradient(at 98% 94%, rgb(136, 19, 55) 0, transparent 33%), radial-gradient(at 86% 91%, rgb(236, 252, 203) 0, transparent 76%)"
        className="flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="flex lg:flex-row flex-col lg:space-x-10 space-y-10  items-center justify-center overflow-hidden min-h-[80vh] lg:h-[80vh]">
          <VStack
            spacing={4}
            w="50%"
            align="left"
            justify="left"
            className="pl-0 lg:pl-2"
          >
            <MotionElementJSX delay={0.1}>
              <Text
                fontSize="4xl"
                color="white"
                className="font-semibold tracking-wide"
              >
                Passionné de{" "}
                <SpanExtraBold innerHTML="technologie" color="teal.400" />,
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
                dans ses méthodes, qui ne cesse jamais d&apos;apprendre, alors vous
                êtes au bon endroit. Avec des compétences solides en travail
                d&apos;équipe, conception d&apos;applications et analyse de données,
                combinées à une expertise en bases de données, frameworks et
                langages de programmation, je suis prêt à relever tous les défis
                que l'avenir de la technologie nous réserve.
              </Text>
            </MotionElementJSX>
          </VStack>
          <MotionElementJSX delay={0.5}>
            <Image src="/techstack/Databases/mysql.png" alt="1" />
          </MotionElementJSX>
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
      {/* https://chakra-ui.com/docs/components/tabs */}
    </>
  );
}
