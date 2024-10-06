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
  <Box className="w-[330px] rounded-lg bg-black text-white">
    <Box className="h-[45px] rounded-t-lg bg-[#38434f] px-[16px] py-[8px]">
      <Image
        src="logo/github_logo_wide.svg"
        alt="github logo"
        width={92}
        height={0}
        className="rounded-sm bg-white p-1"
        fetchPriority="high"
      />
    </Box>

    <Box className="h-[216px] px-[16px]">
      {user && (
        <>
          <Image
            src={user.avatar_url}
            alt="github user"
            width={52}
            height={52}
            className="mb-2 mt-3 rounded-full border-2"
          />
          <Link href={user.html_url} className="font-semibold hover:underline">
            {user.login}
          </Link>
          <Text className="text-sm font-normal">
            Passionate C#, Angular, and Next.js developer.
          </Text>
          <Flex className="mt-3 flex flex-row flex-wrap gap-2">
            {/* Technologies */}
            <Tag colorScheme="red" size="sm">
              <TagLabel>Angular</TagLabel>
            </Tag>
            <Tag colorScheme="purple" size="sm">
              <TagLabel>C#</TagLabel>
            </Tag>
            <Tag colorScheme="black" size="sm">
              <TagLabel>Next.js</TagLabel>
            </Tag>
            <Tag colorScheme="blue" size="sm">
              <TagLabel>TypeScript</TagLabel>
            </Tag>
          </Flex>
          <Flex className="my-2 mb-3 flex flex-row flex-wrap gap-2">
            <Tag size="sm">
              <TagLabel>{repos.length} Repos</TagLabel>
            </Tag>
            <Tag size="sm">
              <TagLabel>{getStargazerCount()} Stars</TagLabel>
            </Tag>
            <Tag size="sm">
              <TagLabel>{getWatchersCount()} Watchers</TagLabel>
            </Tag>
          </Flex>
          <a
            href={user.html_url}
            target="_blank"
            className="rounded-full border border-white bg-black px-4 py-1 font-semibold text-white"
          >
            View profile
          </a>
        </>
      )}
    </Box>
  </Box>
);

export default GithubInfo;
