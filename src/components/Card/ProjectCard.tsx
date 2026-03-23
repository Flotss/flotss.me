import { Repo } from '@/types/types';
import { LockIcon, StarIcon } from '@chakra-ui/icons';
import { Badge, Box, Divider, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { memo, useCallback, useMemo } from 'react';
import { VscPinnedDirty } from 'react-icons/vsc';

interface ProjectCardProps {
  repo: Repo;
  isMobile?: boolean;
  /** Index used to stagger the entrance animation */
  index?: number;
}

function ProjectCardComponent(props: ProjectCardProps) {
  const { name, description, stargazers_count, archived, pinned } = props.repo;
  const isPrivate = props.repo.private;
  const isMobile = props.isMobile;
  const isFork = props.repo.fork;
  const index = props.index ?? 0;

  const linkHref = useMemo(() => `projects/${name}`, [name]);

  const handleClick = useCallback(
    (e: { preventDefault: () => void }) => {
      if (isPrivate) {
        e.preventDefault();
      }
    },
    [isPrivate],
  );

  return (
    <motion.div
      // Staggered entrance: each card slides up with a small delay based on its index
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: Math.min(index * 0.07, 0.35) }}
      // Lift on hover for non-private repos (Framer Motion replaces the Tailwind hover:-translate-y-1)
      whileHover={!isPrivate ? { y: -5, transition: { duration: 0.2 } } : {}}
    >
      <Link href={linkHref} onClick={handleClick}>
        <Box
          className={`group relative overflow-hidden rounded-xl border transition-colors duration-300 md:max-w-2xl ${
            isPrivate
              ? 'cursor-not-allowed border-black/5 bg-black/[0.03] dark:border-white/5 dark:bg-white/[0.02]'
              : 'cursor-pointer border-black/5 bg-black/[0.03] backdrop-blur-md hover:border-emerald-500/20 hover:bg-black/[0.06] hover:shadow-lg hover:shadow-emerald-500/5 dark:border-white/5 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]'
          }`}
          p={8}
          width={isMobile ? '20rem' : '26rem'}
          height={isMobile ? '100%' : '10rem'}
          overflow="hidden"
        >
          <Box className="flex flex-col">
            <Box className="flex justify-between">
              <Box
                className={`mb-1 mt-0 items-center overflow-hidden overflow-ellipsis whitespace-nowrap text-xl font-semibold uppercase tracking-wide transition-colors duration-300 ${
                  isPrivate
                    ? 'text-zinc-400 dark:text-zinc-600'
                    : 'text-zinc-700 group-hover:text-zinc-900 dark:text-zinc-300 dark:group-hover:text-white'
                }`}
                fontSize="xl"
                fontWeight="semibold"
                title={name}
              >
                {isFork && (
                  <Box className="absolute top-2 text-xs font-medium text-zinc-400 dark:text-zinc-500">
                    FORKED
                  </Box>
                )}
                {isPrivate && (
                  <LockIcon className="mr-1 h-5 w-5 -translate-y-0.5 pr-1 text-zinc-400 dark:text-zinc-500" />
                )}
                {name}
                {archived && (
                  <Badge
                    ml={1}
                    fontSize="0.7em"
                    marginBottom={1}
                    colorScheme="whiteAlpha"
                    className="opacity-60"
                  >
                    Archived
                  </Badge>
                )}
              </Box>
              <div className="flex items-center gap-1">
                {stargazers_count > 2 && (
                  <Box className="flex items-center gap-1">
                    <Text
                      className="tracking-wide text-zinc-500 dark:text-zinc-400"
                      fontSize="lg"
                      fontWeight="semibold"
                    >
                      {stargazers_count}
                    </Text>
                    <StarIcon className="h-3.5 w-3.5 text-yellow-500/70" />
                  </Box>
                )}
                {pinned && (
                  <VscPinnedDirty
                    className="ml-1 h-5 w-5 text-emerald-400/60"
                    title="Pinned repository"
                  />
                )}
              </div>
            </Box>
            <Divider className="opacity-10" />
            {description && (
              <Text
                className={`mt-2 block text-sm leading-relaxed transition-colors duration-300 ${
                  isPrivate
                    ? 'text-zinc-400 dark:text-zinc-600'
                    : 'text-zinc-500 group-hover:text-zinc-700 dark:text-zinc-500 dark:group-hover:text-zinc-400'
                }`}
              >
                {description}
              </Text>
            )}
          </Box>
        </Box>
      </Link>
    </motion.div>
  );
}

export default memo(ProjectCardComponent);
