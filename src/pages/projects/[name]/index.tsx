import ErrorCode from '@/components/ErrorCode';
import { Container } from '@/components/StyledBox';
import Title from '@/components/Title';
import { useFetchRepo } from '@/hooks/useFetchRepo';
import { License, Repo } from '@/types/types';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Text,
  ToastId,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

/**
 * The `Project` component displays information about a GitHub repository.
 * It fetches data from an API or local storage and handles various HTTP status errors.
 *
 * @returns {JSX.Element} - The rendered `Project` component.
 */
export default function Project() {
  const router = useRouter();
  const { name } = router.query as { name: string };
  const { repo, loading, error } = useFetchRepo({ name });
  const toast = useToast();

  let lastToastId: ToastId;
  /**
   * Copies text to the clipboard and displays a toast notification.
   *
   * @param {string | undefined} text - The text to copy to the clipboard.
   */
  const copyInClipBoard = (text: string | undefined) => () => {
    if (!text) return;

    navigator.clipboard.writeText(text);

    if (lastToastId) {
      toast.close(lastToastId);
    }

    lastToastId = toast({
      title: 'Copied to clipboard',
      description: text,
      status: 'success',
      duration: 4000,
      isClosable: true,
    });
  };

  if (error && !repo) {
    return <ErrorCode code={error.code} message={error.error} />;
  }

  // If the repository data is not available yet, display a skeleton
  if (!repo) {
    return (
      <>
        <Head>
          {(router.query.name && <title>Loading repository {router.query.name}...</title>) || (
            <title>Loading repository...</title>
          )}
        </Head>
        <div className="flex flex-col items-center justify-center space-y-5 px-5 py-5 sm:px-20">
          <div className="grid w-full grid-flow-row-dense grid-cols-1 grid-rows-1 mdrepo:grid-cols-3 lgrepo:grid-cols-5 lgrepo:space-x-5">
            <Container className="col-span-3 space-y-5 mdrepo:col-span-2">
              <Skeleton width={'30%'}>
                <Box className="text-7xl">.</Box>
              </Skeleton>
              {Array.from({ length: 8 }).map((_, index) => (
                <SkeletonText
                  key={index}
                  noOfLines={1}
                  width={`${Math.floor(Math.random() * 40) + 40}%`}
                ></SkeletonText>
              ))}
            </Container>
            <Container className="col-span-3 mt-5 mdrepo:col-span-1 mdrepo:ml-5 mdrepo:mt-0 lgrepo:col-span-1">
              <Skeleton>
                <Box className="text-6xl">.</Box>
              </Skeleton>
              {Array.from({ length: 7 }).map((_, index) => (
                <SkeletonText
                  key={index}
                  noOfLines={1}
                  width={`${Math.floor(Math.random() * 100)}%`}
                ></SkeletonText>
              ))}
              <Flex width={'100%'} gap={5} className="justify-around pt-5">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCircle key={index} />
                ))}
              </Flex>
            </Container>
            <Container className="col-span-5 mt-5 flex flex-col items-center justify-center space-y-2 lgrepo:col-span-2 lgrepo:mt-0">
              <Skeleton width={'30%'}>
                <Box className="text-3xl">.</Box>
              </Skeleton>
              <Box
                gap={2}
                className="flex w-full flex-col items-center justify-center md:flex-row lgrepo:flex-col"
              >
                {Array.from({ length: 3 }).map((_, index) => (
                  <Skeleton key={index} className="w-full">
                    <h1 className="text-6xl">.</h1>
                  </Skeleton>
                ))}
              </Box>
            </Container>
          </div>
          <Flex width={'100%'} gap={5} className="justify-around py-5">
            {Array.from({ length: 5 }).map((_, index) => (
              <SkeletonCircle key={index} width="100%" height={'2rem'} />
            ))}
          </Flex>
          <div className="grid w-full grid-flow-row-dense grid-cols-3 grid-rows-1 space-y-5 lg:grid-cols-5 lg:space-x-5 lg:space-y-0">
            <Container className="col-span-3 space-y-2">
              <Skeleton width={'30%'}>
                <Box className="text-5xl">.</Box>
              </Skeleton>
              <Divider />
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonText
                  key={index}
                  noOfLines={4}
                  width={`${Math.floor(Math.random() * 40) + 40}%`}
                ></SkeletonText>
              ))}
            </Container>
            <Container className="col-span-2 space-y-2">
              <Skeleton width={'30%'}>
                <Box className="text-5xl">.</Box>
              </Skeleton>
              <Divider />
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonText
                  key={index}
                  noOfLines={4}
                  width={`${Math.floor(Math.random() * 40) + 40}%`}
                ></SkeletonText>
              ))}
            </Container>
          </div>
        </div>
      </>
    );
  }

  // If the repository data is available, display it
  return (
    <>
      <Head>
        <title>{repo.name}</title>
      </Head>
      <div className="flex flex-col items-center justify-center space-y-5 px-5 py-5 sm:px-20">
        <div className="grid w-full grid-flow-row-dense grid-cols-1 grid-rows-1 mdrepo:grid-cols-3 lgrepo:grid-cols-5 lgrepo:space-x-5">
          <Container className="col-span-3 space-y-5 mdrepo:col-span-2">
            <Title title={repo.name} className="mdrepo:text-5xl lgrepo:text-7xl" />
            <StyledText>{repo.description}</StyledText>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                Plus d&apos;information
              </MenuButton>
              <MenuList style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }} border={'none'}>
                <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}>
                  <Image
                    src={`https://img.shields.io/badge/Stars-${repo.stargazers_count}-green`}
                    alt="Stars"
                  />
                </MenuItem>
                <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}>
                  <Image
                    src={`https://img.shields.io/badge/Forks-${repo.forks_count}-blue`}
                    alt="Forks"
                  />
                </MenuItem>
                <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}>
                  <Image
                    src={`https://img.shields.io/badge/Open_Issues-${repo.open_issues_count}-blue`}
                    alt="Open Issues"
                  />
                </MenuItem>
                {repo.license && repo.license != 'null' && (
                  <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}>
                    <Image
                      src={`https://img.shields.io/badge/License-${(repo.license as License).name}-black`}
                      alt="License"
                    />
                  </MenuItem>
                )}
                <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}>
                  <Image
                    src={`https://img.shields.io/badge/Watchers-${repo.watchers_count}-yellow`}
                    alt="Watchers"
                  />
                </MenuItem>
                <MenuItem style={{ backgroundColor: 'rgb(30, 30, 30, 1)' }}>
                  <Image
                    src={`https://img.shields.io/badge/Subscribers-${repo.subscribers_count}-yellow`}
                    alt="Subscribers"
                  />
                </MenuItem>
              </MenuList>
            </Menu>
          </Container>
          <Container className="col-span-3 mt-5 mdrepo:col-span-1 mdrepo:ml-5 mdrepo:mt-0 lgrepo:col-span-1">
            <StyledText className="lgrepo:text-xl">
              Created : {new Date(repo.created_at).toLocaleDateString()}
            </StyledText>
            <StyledText className="lgrepo:text-xl">
              Updated : {new Date(repo.updated_at).toLocaleDateString()}
            </StyledText>

            <StyledText className="pb-2 pt-5">Collaborators :</StyledText>
            <Flex width={'100%'} gap={5} className="justify-around" flexWrap={'wrap'}>
              {repo.collaborators.map((collaborator, index) => (
                <>
                  <Tooltip
                    hasArrow
                    label={collaborator.login}
                    bg="gray.300"
                    placement="top"
                    color="black"
                  >
                    <Link
                      className="flex flex-col items-center space-y-2"
                      href={collaborator.html_url}
                      isExternal
                    >
                      <Avatar name={collaborator.login} src={collaborator.avatar_url} size={'md'} />
                      {collaborator.login == 'Flotss' && (
                        <Badge ml="1" colorScheme="green">
                          Me
                        </Badge>
                      )}
                    </Link>
                  </Tooltip>
                </>
              ))}
            </Flex>
          </Container>
          <Container className="col-span-5 mt-5 flex flex-col items-center justify-center lgrepo:col-span-2 lgrepo:mt-0">
            <Title title={'Clone'} className="text-lg mdrepo:text-xl lgrepo:text-2xl" />
            <Box
              gap={2}
              className="flex w-full flex-col items-center justify-center md:flex-row lgrepo:flex-col"
            >
              <ButtonCopy as="a" href={repo.html_url} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </ButtonCopy>
              <ButtonCopy colorScheme="blue" onClick={copyInClipBoard(repo.clone_url)}>
                Clone (HTTPS)
              </ButtonCopy>
              <ButtonCopy colorScheme="blue" onClick={copyInClipBoard(repo.ssh_url)}>
                Clone (SSH)
              </ButtonCopy>
            </Box>
          </Container>
        </div>
        <Flex width={'100%'} gap={5} className="items-center justify-evenly" flexWrap="wrap">
          {repo.languages.map((language, index) => {
            return (
              <Box
                key={index}
                className={`w-${(100 / repo.languages.length).toFixed(
                  2,
                )} flex items-center justify-center rounded-3xl bg-box-color px-6 py-1`}
              >
                <StyledText>{language.name}</StyledText>
              </Box>
            );
          })}
        </Flex>
        {repo.commits ? (
          <ReadmeAndCommits repo={repo} />
        ) : (
          <Head>
            <title>Loading commits...</title>
          </Head>
        )}
      </div>
    </>
  );
}

interface ButtonCopyProps {
  children: React.ReactNode;
  colorScheme?: string;
  onClick?: () => void;
  className?: string;
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Represents a button that copies text to the clipboard.
 */
const ButtonCopy = ({
  colorScheme,
  children,
  onClick,
  className,
  as,
  href,
  target,
  rel,
}: ButtonCopyProps) => (
  <Button
    colorScheme={colorScheme}
    onClick={onClick}
    className={`w-full py-9 md:py-7 lgrepo:py-9 ${className}`}
    as={as}
    href={href}
    target={target}
    rel={rel}
  >
    {children}
  </Button>
);

interface StyledProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Represents a styled text component.
 */
const StyledText = ({ children, className, ...props }: StyledProps) => (
  <Text className={`sm:text-xl md:text-2xl ${className}`} {...props}>
    {children}
  </Text>
);

interface ReadmeAndCommitsProps {
  repo: Repo;
}

/**
 * Represents a component that displays the README and the commits of a repository.
 * @param {ReadmeAndCommitsProps} props - The props for the ReadmeAndCommits component.
 * @return {JSX.Element} The rendered ReadmeAndCommits component.
 */
const ReadmeAndCommits = ({ repo }: ReadmeAndCommitsProps) => {
  const [boxHeight, setBoxHeight] = useState<number>(0);
  const refFirstBox = useRef<HTMLDivElement>(null);

  const commits = repo.commits;

  useEffect(() => {
    if (refFirstBox.current) {
      setBoxHeight(refFirstBox.current.offsetHeight);
    }
  }, [repo.readme]); // Change the height of the commits box when the readme changes

  return (
    <Box className="grid w-full grid-flow-row-dense grid-cols-3 grid-rows-1 space-y-5 lg:grid-cols-5 lg:space-x-5 lg:space-y-0">
      <Box // TODO : Change Box to StyledBox
        ref={refFirstBox}
        className="col-span-3 space-y-2 rounded-3xl bg-box-color p-8"
        style={{ minHeight: '500px' }}
      >
        <Title title={'Readme'} className="text-5xl" />
        <Divider />{' '}
        <div className="markdown">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeRaw]}
          >
            {repo.readme}
          </ReactMarkdown>
        </div>
      </Box>
      <Container
        className="col-span-3 space-y-2 rounded-3xl bg-box-color p-8 lg:col-span-2"
        style={{ height: `${boxHeight}px` }}
      >
        <Title title={`Commits (${commits.length})`} className="text-5xl" />
        <Divider />
        <Box
          className="scrollbar flex flex-col space-y-2 p-2"
          style={{ overflowY: 'auto' }}
          height={`${boxHeight - 180}px`}
        >
          {commits.map((commit, index) => (
            <Box key={index} width={'100%'} height={'100%'} className="group">
              <Box className="space-y-2 rounded-3xl bg-[#202020] px-4 py-2 transition-all duration-300 ease-in-out hover:scale-[1.02] hover:rounded-3xl">
                <h1 className="text-xl" title={commit.message}>
                  {commit.message.slice(0, 80)}
                  {commit.message.slice(0, 80).length == 80 ? `...` : ''}
                </h1>

                <Box className="between flex items-center justify-between space-x-2">
                  <Box className="flex items-start justify-start space-x-2">
                    <h1 className="text-lg">
                      Date: {new Date(commit.author.date).toLocaleDateString()}
                    </h1>
                    <h1 className="text-lg">Author: {commit.author.name}</h1>
                  </Box>
                  <Link href={commit.url} isExternal textDecoration={'none'}>
                    <Button
                      colorScheme="blue"
                      size={'xs'}
                      className="opacity-0 transition-opacity delay-150 ease-in-out group-hover:opacity-100"
                    >
                      See on GitHub
                    </Button>
                  </Link>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};
