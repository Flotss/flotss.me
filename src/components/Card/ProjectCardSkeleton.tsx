import { Box, SkeletonCircle, SkeletonText } from '@chakra-ui/react';
import { motion } from 'framer-motion';

const SkeletonTextLine = ({ width }: { width: string }) => (
  <SkeletonText noOfLines={1} width={width} />
);

interface ProjectCardSkeletonProps {
  isMobile: boolean;
}

export default function ProjectCardSkeleton(_props: ProjectCardSkeletonProps) {
  return (
    <motion.div
      animate={{ opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Box className="flex h-full min-h-[12rem] w-[20rem] flex-col justify-between rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md sm:w-[25rem]">
        <Box className="space-y-3">
          <Box className="flex items-center justify-between">
            <SkeletonTextLine width="8rem" />
            <SkeletonTextLine width="3rem" />
          </Box>
          <Box className="space-y-2 pt-2">
            <SkeletonTextLine width="90%" />
            <SkeletonTextLine width="75%" />
          </Box>
        </Box>
        <Box className="flex items-center gap-2 border-t border-white/5 pt-3">
          <SkeletonCircle size="2.5" />
          <SkeletonTextLine width="4rem" />
        </Box>
      </Box>
    </motion.div>
  );
}
