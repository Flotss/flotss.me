import { Box, Divider, SkeletonText } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const SkeletonTextLine = ({ width }: { width: string }) => (
  <SkeletonText noOfLines={1} width={width} />
);

interface ProjectCardSkeletonProps {
  isMobile: boolean;
}

export default function ProjectCardSkeleton(props: ProjectCardSkeletonProps) {
  const { isMobile } = props;
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Box
        className="rounded-xl border border-white/5 bg-white/[0.03] backdrop-blur-md md:max-w-2xl"
        p={8}
        width={isMobile ? '20rem' : '26rem'}
        height={isMobile ? '100%' : '10rem'}
      >
        <Box className="flex flex-col py-3">
          <Box className="flex space-x-2">
            <SkeletonTextLine width="8rem" />
            <SkeletonTextLine width="5rem" />
          </Box>
          <Divider className="my-4 opacity-10" />
          <Box className="space-y-2">
            <SkeletonTextLine width="13rem" />
            <SkeletonTextLine width="18rem" />
            <SkeletonTextLine width="15rem" />
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}
