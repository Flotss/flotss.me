import { Repo } from '@/types/types';
import { StarIcon } from '@chakra-ui/icons';
import { Badge, Box, Divider, Text } from '@chakra-ui/react';
import Link from 'next/link';

interface ProjectCardProps {
  repo: Repo;
}

/**
 * Renders a card component for a project.
 *
 * @param {ProjectCardProps} props - The props for the ProjectCard component.
 * @param {Repo} props.repo - The repository object containing project details.
 * @returns {JSX.Element} The rendered ProjectCard component.
 */
export default function ProjectCard(props: ProjectCardProps): JSX.Element {
  const { repo } = props;
  const { name, description, stars, archived } = repo;

  return (
    <Link href={`projects/${name}`}>
      <Box
        className="glow transform overflow-ellipsis rounded-xl bg-box-color transition duration-500 ease-in-out hover:-translate-y-1 hover:scale-105 hover:rounded-3xl md:max-w-2xl"
        p={8}
        width="26rem"
        height="10rem"
      >
        <Box className="flex flex-col">
          <Box className="flex justify-between">
            <Text
              className="mb-1 mt-0 items-center text-xl font-semibold uppercase tracking-wide text-gray-300"
              fontSize="xl"
              fontWeight="semibold"
            >
              {name}
              {archived && (
                <Badge ml={1} fontSize="0.8em" marginBottom={1} colorScheme="whiteAlpha">
                  Archived
                </Badge>
              )}
            </Text>
            {stars > 0 && (
              <Box className="flex items-center justify-between space-x-1">
                <Text className="tracking-wide text-gray-300" fontSize="xl" fontWeight="semibold">
                  {stars}
                </Text>
                <StarIcon />
              </Box>
            )}
          </Box>
          <Divider />
          {description && (
            <Text
              className="mb-2 mt-1 block text-sm font-medium leading-tight text-gray-300"
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
