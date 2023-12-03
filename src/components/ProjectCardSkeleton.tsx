import { Box, Divider, SkeletonText,  } from "@chakra-ui/react";

export default function ProjectCardSkeleton(): JSX.Element {
  return (
    <Box
      className="bg-gray-800 rounded-xl md:max-w-2xl"
      p={8}
      width="25rem"
      height="10rem"
    >
      <Box className="flex flex-col py-3">
        <Box className="flex space-x-2">
          <SkeletonText noOfLines={1} width="8rem" />
          <SkeletonText noOfLines={1} width="5rem" />
        </Box>
        <Divider className="my-4" />
        <Box className="space-y-2">
          <SkeletonText noOfLines={1} width="13rem" />
          <SkeletonText noOfLines={1} width="18rem" />
          <SkeletonText noOfLines={1} width="15rem" />
        </Box>
      </Box>
    </Box>
  );
}
