// GithubInfo.tsx
'use client';
import { Repo } from '@/types/types';
import { Box, Flex, Link, Tag, TagLabel, Text } from '@chakra-ui/react';
import Image from 'next/image';

type GithubInfoProps = {
  user: any;
  repos: Repo[];
  getStargazerCount: () => number;
  getWatchersCount: () => number;
};

const GithubInfo = ({ user, repos, getStargazerCount, getWatchersCount }: GithubInfoProps) => (
  <Box className="w-[330px] overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] text-white backdrop-blur-md">
    <Box className="flex items-center gap-2 border-b border-white/5 bg-white/[0.05] px-4 py-2.5">
      <Image
        src="logo/github_logo_wide.svg"
        alt="github logo"
        width={92}
        height={0}
        className="rounded-sm bg-white p-1"
        fetchPriority="high"
      />
    </Box>

    <Box className="px-4 pb-4 pt-3">
      {user && (
        <>
          <Image
            src={user.avatar_url}
            alt="github user"
            width={48}
            height={48}
            className="mb-2 rounded-full border border-white/10"
            fetchPriority="high"
          />
          <Link
            href={user.html_url}
            className="font-semibold text-zinc-200 transition-colors hover:text-white hover:underline"
          >
            {user.login}
          </Link>
          <Text className="mt-1 text-sm text-zinc-400">
            Software Engineer passionate about building modern web applications.
          </Text>
          <Flex className="mt-3 flex flex-row flex-wrap gap-1.5">
            <Tag colorScheme="whiteAlpha" size="sm" variant="subtle">
              <TagLabel>Angular</TagLabel>
            </Tag>
            <Tag colorScheme="whiteAlpha" size="sm" variant="subtle">
              <TagLabel>C#</TagLabel>
            </Tag>
            <Tag colorScheme="whiteAlpha" size="sm" variant="subtle">
              <TagLabel>Next.js</TagLabel>
            </Tag>
            <Tag colorScheme="whiteAlpha" size="sm" variant="subtle">
              <TagLabel>TypeScript</TagLabel>
            </Tag>
          </Flex>
          <Flex className="my-2.5 flex flex-row flex-wrap gap-1.5">
            <Tag size="sm" variant="subtle" colorScheme="whiteAlpha">
              <TagLabel>{repos.length} Repos</TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="whiteAlpha">
              <TagLabel>{getStargazerCount()} Stars</TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle" colorScheme="whiteAlpha">
              <TagLabel>{getWatchersCount()} Watchers</TagLabel>
            </Tag>
          </Flex>
          <a
            href={user.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-emerald-500/40 bg-emerald-500/15 px-4 py-1.5 text-xs font-medium text-emerald-200 transition-all duration-200 hover:border-emerald-500/60 hover:bg-emerald-500/25 hover:text-white"
          >
            View profile
          </a>
        </>
      )}
    </Box>
  </Box>
);

export default GithubInfo;
