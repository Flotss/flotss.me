import React, { useEffect, useState } from "react";
import { TechStackItem }  from "../pages/types/types";
import SpanExtraBold from "./Span/SpanExtraBold";
import {
  Image,
  VStack,
  Wrap,
  WrapItem,
  Text,
  Skeleton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { motion } from "framer-motion";

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

export default TechStack;
