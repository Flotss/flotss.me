import { Repo } from '@/types/types';
import { LockIcon, StarIcon } from '@chakra-ui/icons';
import { Badge, Box, Divider, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { VscPinnedDirty } from 'react-icons/vsc';

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
export default function ProjectCard(props: ProjectCardProps) {
  const { name, description, stargazers_count, archived, pinned } = props.repo;
  const isPrivate = props.repo.private;

  return (
    <Link
      href={`projects/${name}`}
      // disable the link if the repository is private
      onClick={(e) => {
        if (isPrivate) {
          e.preventDefault();
        }
        return;
      }}
    >
      <Box
        className={`glow transform overflow-ellipsis rounded-xl border border-black bg-box-color-light transition-all duration-500 ease-in-out md:max-w-2xl ${
          isPrivate
            ? ''
            : 'shadow-sm shadow-shadow-color hover:-translate-y-1 hover:scale-105 hover:rounded-3xl hover:shadow-2xl'
        }`}
        p={8}
        width="26rem"
        height="10rem"
        overflow="hidden"
        cursor={isPrivate ? 'not-allowed' : 'pointer'}
      >
        <Box className="flex flex-col">
          <Box className="flex justify-between">
            <Text
              className={`mb-1 mt-0 items-center overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-semibold uppercase tracking-wide ${isPrivate ? 'text-gray-400' : 'text-gray-300'}`}
              fontSize="xl"
              fontWeight="semibold"
              title={name}
            >
              {isPrivate && (
                <LockIcon className="mr-1 h-6 w-6 -translate-y-1 pr-1 text-[#E2E8F0]" />
              )}
              {name}
              {archived && (
                <Badge ml={1} fontSize="0.8em" marginBottom={1} colorScheme="whiteAlpha">
                  Archived
                </Badge>
              )}
            </Text>
            <div className="flex items-center">
              {stargazers_count > 2 && (
                <Box className="flex items-center justify-between space-x-1">
                  <Text className="tracking-wide text-gray-300" fontSize="xl" fontWeight="semibold">
                    {stargazers_count}
                  </Text>
                  <StarIcon />
                </Box>
              )}
              {pinned && (
                <VscPinnedDirty
                  className={`ml-2 h-6 w-6 text-[#E2E8F0]`}
                  title="Pinned repository"
                />
              )}
            </div>
          </Box>
          <Divider />
          {description && (
            <Text
              className={`mt-1 block text-sm font-medium leading-tight ${isPrivate ? 'text-gray-500' : 'text-gray-300'}`}
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
