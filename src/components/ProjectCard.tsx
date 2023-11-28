import { Box, Image, Text } from "@chakra-ui/react";

interface ProjectCardProps {
  name: string;
  description: string;
  commits: number;
}


export default function ProjectCard(props: ProjectCardProps) : JSX.Element {
  const { name, description, commits } = props;



  return (
    <Box
      className="max-w-lg mx-auto bg-gray-800 rounded-xl shadow-md overflow-hidden md:max-w-2xl hover:shadow-xl transition-shadow duration-300"
      p={8}
    >
      <Box display="flex">
        <Box flexShrink={0}>
          <Image
            alt="Project thumbnail"
            className="h-48 w-full object-cover md:w-48"
            height="192"
            src="/next.svg"
            style={{
              aspectRatio: "448/192",
              objectFit: "cover",
            }}
            width="448"
          />
        </Box>
        <Box pl={8} textAlign="left">
          <Text
            className="uppercase tracking-wide text-xl text-gray-300 font-semibold"
            mt={0}
            mb={1}
            fontSize="xl"
            fontWeight="semibold"
          >
            {name}
          </Text>
          <Text
            className="block mt-1 text-sm leading-tight font-medium text-gray-300"
            mt={0}
            mb={2}
            fontSize="sm"
            fontWeight="medium"
          >
{description}
          </Text>
          <Text mt={2} color="gray.500">
            Number of commits: {commits}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}