import { Box, Flex, Skeleton, SkeletonText, Spinner } from "@chakra-ui/react";

export default function ProjectCardSkeleton(): JSX.Element {
  return (
    <Box
      maxW="2xl"
      mx="auto"
      bg="gray.800"
      rounded="xl"
      shadow="md"
      overflow="hidden"
      className="hover:shadow-xl transition-shadow duration-300"
      p={8}
    >
      <Flex>
        {/* Left side with a spinner */}
        <Box flexShrink={0} mr={4}>
          <Spinner size="lg" />
        </Box>
        
        {/* Right side with SkeletonText lines */}
        <Box flex="1">
          <SkeletonText height="20px" width="80%" my="5px" />
          <SkeletonText height="20px" width="70%" my="5px" />
          <SkeletonText height="20px" width="60%" my="5px" />
        </Box>
      </Flex>
    </Box>
 
    );
}