import { Box, Divider, SkeletonText } from '@chakra-ui/react';

const SkeletonTextLine = ({ width }: { width: string }): JSX.Element => (
  <SkeletonText noOfLines={1} width={width} />
);

/**
 * Renders a skeleton for a project card.
 * @returns The JSX element representing the project card skeleton.
 */
export default function ProjectCardSkeleton(): JSX.Element {
  return (
    <Box className="rounded-xl bg-box-color md:max-w-2xl" p={8} width="25rem" height="10rem">
      <Box className="flex flex-col py-3">
        <Box className="flex space-x-2">
          <SkeletonTextLine width="8rem" />
          <SkeletonTextLine width="5rem" />
        </Box>
        <Divider className="my-4" />
        <Box className="space-y-2">
          <SkeletonTextLine width="13rem" />
          <SkeletonTextLine width="18rem" />
          <SkeletonTextLine width="15rem" />
        </Box>
      </Box>
    </Box>
  );
}
