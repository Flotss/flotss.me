import { Badge, Box, Divider, Image, ScaleFade, Text } from "@chakra-ui/react";
import Link from "next/link";
import { StarIcon } from '@chakra-ui/icons'
import { Repo } from "@/types/types";

interface ProjectCardProps {
  repo: Repo;
}


export default function ProjectCard(props: ProjectCardProps): JSX.Element {
  const { repo } = props;
  const { name, description, stars, archived } = repo;


  return (
    <Link href={`projects/${name}`}>
      <Box
        className="glow bg-box-color rounded-xl md:max-w-2xl transition duration-500 ease-in-out transform hover:rounded-3xl hover:-translate-y-1 hover:scale-105 overflow-ellipsis"
        p={8}
        width="26rem"
        height="10rem"
      >
        <Box className="flex flex-col">
          <Box className="flex justify-between">
            <Text
              className="uppercase tracking-wide text-xl text-gray-300 font-semibold mt-0 mb-1 items-center"
              fontSize="xl"
              fontWeight="semibold"
            >
              {name}
              {archived && <Badge ml={1} fontSize='0.8em' marginBottom={1} colorScheme='whiteAlpha'>Archived</Badge>}
            </Text>
            {stars > 0 && 
              <Box className="flex justify-between  items-center space-x-1">
                <Text
                  className="tracking-wide text-gray-300"
                  fontSize="xl"
                  fontWeight="semibold"
                >
                  {stars}
                </Text>
                <StarIcon />
              </Box>
            }
          </Box>
          <Divider />
          {description && (
            <Text
              className="block mt-1 text-sm leading-tight font-medium text-gray-300 mb-2"
              fontSize="sm"
              fontWeight="medium"
            >
              {description}
            </Text>
          )}
        </Box>
      </Box>
    </Link>
  );
}