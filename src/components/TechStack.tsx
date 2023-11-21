import React, { useEffect, useState } from "react";
import { TechStackItem } from "../types/types";
import {
  Image,
  Wrap,
  WrapItem,
  Text,
  Skeleton,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
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
  const [TechStack, setTechStack] = useState<TechStackItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [orientation, setOrientation] = useState<"vertical" | "horizontal">(
    "vertical"
  );

  useEffect(() => {
    setTimeout(() => {
      fetch("/api/getTechStack")
        .then((response) => response.json())
        .then((data) => {
          setTechStack(data.TechStack);
          setIsLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    }, 0);

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

          // Pointer is surounded by a halo of red when hovering
          _focus={{
            boxShadow: "none",
          }}
          
        >
          <TabList >
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
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{ duration: 1, delay: index * 0.2 }}
                        >
                          <Card
                            transform={"scale(0.9)"}
                            className="transition duration-150 ease-out hover:ease-in hover:scale-100 bg-bgItem"
                          >
                            <CardHeader>
                              <ImageTech
                                src={file.src}
                                alt={file.name}
                                delay={0}
                              />
                            </CardHeader>
                            <CardBody className="flex justify-center items-center">
                              <Text fontSize="lg" color="black">
                                {file.name}
                              </Text>
                            </CardBody>
                          </Card>
                        </motion.div>
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
