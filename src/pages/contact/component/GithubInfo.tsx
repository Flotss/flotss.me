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
  <Box className="w-[330px] overflow-hidden rounded-xl border border-white/5 bg-white/[0.03] text-white">
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
          <Text className="mt-1 text-sm text-zinc-500">
            Passionate C#, Angular, and Next.js developer.
          </Text>
          <Flex className="mt-3 flex flex-row flex-wrap gap-1.5">
            <Tag colorScheme="red" size="sm" variant="subtle">
              <TagLabel>Angular</TagLabel>
            </Tag>
            <Tag colorScheme="purple" size="sm" variant="subtle">
              <TagLabel>C#</TagLabel>
            </Tag>
            <Tag colorScheme="gray" size="sm" variant="subtle">
              <TagLabel>Next.js</TagLabel>
            </Tag>
            <Tag colorScheme="blue" size="sm" variant="subtle">
              <TagLabel>TypeScript</TagLabel>
            </Tag>
          </Flex>
          <Flex className="my-2.5 flex flex-row flex-wrap gap-1.5">
            <Tag size="sm" variant="subtle">
              <TagLabel>{repos.length} Repos</TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle">
              <TagLabel>{getStargazerCount()} Stars</TagLabel>
            </Tag>
            <Tag size="sm" variant="subtle">
              <TagLabel>{getWatchersCount()} Watchers</TagLabel>
            </Tag>
          </Flex>
          <a
            href={user.html_url}
            target="_blank"
            className="inline-block rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-sm font-medium text-zinc-300 transition-all duration-300 hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
          >
            View profile
          </a>
        </>
      )}
    </Box>
  </Box>
);

export default GithubInfo;
