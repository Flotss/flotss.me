import type React from 'react';
import ErrorCode from '@/components/ErrorCode';
import { Container } from '@/components/StyledBox';
import { useFetchRepo } from '@/hooks/useFetchRepo';
import { License, Repo } from '@/types/types';
import { LockIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Link,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Tooltip,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  FaBalanceScale,
  FaBookOpen,
  FaCalendarAlt,
  FaCheck,
  FaClock,
  FaCodeBranch,
  FaCopy,
  FaExternalLinkAlt,
  FaEye,
  FaGithub,
  FaHistory,
  FaStar,
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  'C#': '#68217a',
  Python: '#3572A5',
  Java: '#b07219',
  HTML: '#e34c26',
  CSS: '#563d7c',
  PHP: '#4F5D95',
  Shell: '#89e051',
  Batchfile: '#C1F12E',
  Go: '#00ADD8',
  Rust: '#dea584',
  'C++': '#f34b7d',
  C: '#555555',
  Kotlin: '#A97BFF',
  Ruby: '#701516',
};

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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyInClipBoard = (text: string | undefined, key: string) => () => {
    if (!text) return;
    navigator.clipboard.writeText(text);

    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);

    toast({
      title: 'Copied to clipboard',
      description: text,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  if (error && !repo) {
    return <ErrorCode code={error.code} message={error.error} />;
  }

  // If the repository data is not available yet, display a skeleton
  if (!repo || loading) {
    return (
      <>
        <Head>
          {(router.query.name && <title>Loading repository {router.query.name}...</title>) || (
            <title>Loading repository...</title>
          )}
        </Head>
        <div className="flex flex-col items-center justify-center space-y-6 px-5 py-8 sm:px-20">
          <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-12">
            <Container className="col-span-1 space-y-4 lg:col-span-6 xl:col-span-6">
              <Skeleton width="50%" height="2.5rem" rounded="xl" />
              <SkeletonText noOfLines={3} spacing="3" />
              <div className="flex gap-2 pt-3">
                <Skeleton width="5rem" height="1.5rem" rounded="full" />
                <Skeleton width="5rem" height="1.5rem" rounded="full" />
                <Skeleton width="5rem" height="1.5rem" rounded="full" />
              </div>
            </Container>
            <Container className="col-span-1 space-y-4 lg:col-span-3 xl:col-span-3">
              <Skeleton width="60%" height="1.2rem" rounded="md" />
              <SkeletonText noOfLines={2} spacing="3" />
              <div className="flex gap-2 pt-2">
                <SkeletonCircle size="8" />
              </div>
            </Container>
            <Container className="col-span-1 space-y-3 lg:col-span-3 xl:col-span-3">
              <Skeleton width="50%" height="1.2rem" rounded="md" />
              <Skeleton width="100%" height="2.5rem" rounded="xl" />
              <Skeleton width="100%" height="2.5rem" rounded="xl" />
              <Skeleton width="100%" height="2.5rem" rounded="xl" />
            </Container>
          </div>
          <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-5">
            <Container className="col-span-1 space-y-4 lg:col-span-3">
              <Skeleton width="30%" height="2rem" rounded="lg" />
              <SkeletonText noOfLines={8} spacing="3" />
            </Container>
            <Container className="col-span-1 space-y-4 lg:col-span-2">
              <Skeleton width="40%" height="2rem" rounded="lg" />
              <SkeletonText noOfLines={6} spacing="3" />
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
      <div className="flex flex-col items-center justify-center space-y-6 px-5 py-8 sm:px-20">
        {/* Top Hero Grid */}
        <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Main Info Card */}
          <Container className="col-span-1 flex flex-col justify-between space-y-4 lg:col-span-6 xl:col-span-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl">
                  {repo.name}
                </h1>
                {repo.archived && (
                  <span className="rounded-md border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-xs font-semibold text-zinc-400">
                    Archived
                  </span>
                )}
                {repo.fork && (
                  <span className="rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-300">
                    FORKED
                  </span>
                )}
                {repo.private && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-xs font-semibold text-red-300">
                    <LockIcon className="h-3 w-3" /> Private
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-zinc-300 sm:text-base">
                {repo.description || 'No description provided for this repository.'}
              </p>
            </div>

            {/* Badges / Stats row */}
            <div className="flex flex-wrap items-center gap-2 border-t border-white/5 pt-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
                <FaStar className="h-3 w-3 text-amber-400" />
                {repo.stargazers_count} {repo.stargazers_count === 1 ? 'star' : 'stars'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300">
                <FaCodeBranch className="h-3 w-3 text-cyan-400" />
                {repo.forks_count} {repo.forks_count === 1 ? 'fork' : 'forks'}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1 text-xs font-medium text-purple-300">
                <FaEye className="h-3 w-3 text-purple-400" />
                {repo.watchers_count} {repo.watchers_count === 1 ? 'watcher' : 'watchers'}
              </span>
              {repo.license && repo.license !== 'null' && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-zinc-300">
                  <FaBalanceScale className="h-3 w-3 text-zinc-400" />
                  {typeof repo.license === 'object' ? (repo.license as License).name : repo.license}
                </span>
              )}
            </div>
          </Container>

          {/* Details & Collaborators Card */}
          <Container className="col-span-1 flex flex-col justify-between space-y-4 lg:col-span-3 xl:col-span-3">
            <div>
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Repository Details
              </h2>
              <div className="space-y-2.5 text-xs text-zinc-300">
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="h-3.5 w-3.5 text-zinc-500" />
                  <span>
                    Created:{' '}
                    <strong className="font-medium text-zinc-200">
                      {new Date(repo.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaClock className="h-3.5 w-3.5 text-zinc-500" />
                  <span>
                    Updated:{' '}
                    <strong className="font-medium text-zinc-200">
                      {new Date(repo.updated_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-white/5 pt-3">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Collaborators
              </h3>
              <div className="flex flex-wrap items-center gap-3">
                {repo.collaborators.map((collaborator) => (
                  <Tooltip
                    key={collaborator.login}
                    hasArrow
                    label={collaborator.login}
                    bg="gray.900"
                    color="white"
                    border="1px solid"
                    borderColor="whiteAlpha.200"
                    rounded="lg"
                    placement="top"
                  >
                    <Link
                      className="group relative flex items-center gap-2"
                      href={collaborator.html_url}
                      isExternal
                    >
                      <Avatar
                        name={collaborator.login}
                        src={collaborator.avatar_url}
                        size="sm"
                        className="transition-transform duration-200 group-hover:scale-110"
                      />
                      {collaborator.login === 'Flotss' && (
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                          Owner
                        </span>
                      )}
                    </Link>
                  </Tooltip>
                ))}
              </div>
            </div>
          </Container>

          {/* Quick Actions / Clone Card */}
          <Container className="col-span-1 flex flex-col justify-center space-y-3 lg:col-span-3 xl:col-span-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Quick Actions
            </h2>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-xs font-medium text-zinc-200 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/40 hover:bg-emerald-500/15 hover:text-white"
            >
              <FaGithub className="h-4 w-4" />
              <span>View on GitHub</span>
              <FaExternalLinkAlt className="h-2.5 w-2.5 opacity-60 transition-transform duration-200 group-hover:translate-x-0.5" />
            </a>

            <button
              onClick={copyInClipBoard(repo.clone_url, 'https')}
              className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 font-mono text-xs text-zinc-300 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              title="Click to copy HTTPS clone command"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="font-sans text-[11px] font-semibold text-zinc-400">HTTPS</span>
                <span className="truncate text-zinc-500">git clone ...</span>
              </span>
              <span className="flex-shrink-0 text-emerald-400 transition-transform group-hover:scale-110">
                {copiedKey === 'https' ? (
                  <FaCheck className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <FaCopy className="h-3.5 w-3.5 text-zinc-400" />
                )}
              </span>
            </button>

            <button
              onClick={copyInClipBoard(repo.ssh_url, 'ssh')}
              className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 font-mono text-xs text-zinc-300 backdrop-blur-md transition-all duration-200 hover:border-white/20 hover:bg-white/[0.06] hover:text-white"
              title="Click to copy SSH clone command"
            >
              <span className="flex items-center gap-2 truncate">
                <span className="font-sans text-[11px] font-semibold text-zinc-400">SSH</span>
                <span className="truncate text-zinc-500">git clone git@...</span>
              </span>
              <span className="flex-shrink-0 text-emerald-400 transition-transform group-hover:scale-110">
                {copiedKey === 'ssh' ? (
                  <FaCheck className="h-3.5 w-3.5 text-emerald-400" />
                ) : (
                  <FaCopy className="h-3.5 w-3.5 text-zinc-400" />
                )}
              </span>
            </button>
          </Container>
        </div>

        {/* Language Breakdown Bar */}
        {repo.languages && repo.languages.length > 0 && (
          <Container className="w-full px-6 py-4">
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold uppercase tracking-wider text-zinc-400">
                  Languages
                </span>
                <span className="text-zinc-500">{repo.languages.length} detected</span>
              </div>
              <div className="flex h-2 w-full overflow-hidden rounded-full bg-white/5">
                {repo.languages.map((language, idx) => (
                  <div
                    key={language.name || idx}
                    style={{
                      width: `${language.percentage}%`,
                      backgroundColor: LANGUAGE_COLORS[language.name] || '#10b981',
                    }}
                    title={`${language.name}: ${language.percentage}%`}
                    className="h-full transition-all duration-500"
                  />
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 pt-1">
                {repo.languages.map((language, idx) => (
                  <div key={language.name || idx} className="flex items-center gap-1.5 text-xs">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: LANGUAGE_COLORS[language.name] || '#10b981' }}
                    />
                    <span className="font-medium text-zinc-300">{language.name}</span>
                    <span className="text-zinc-500">{language.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        )}

        {/* Readme & Commits */}
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

interface ReadmeAndCommitsProps {
  repo: Repo;
}

/**
 * Represents a component that displays the README and the commits of a repository.
 * @param {ReadmeAndCommitsProps} props - The props for the ReadmeAndCommits component.
 * @return {JSX.Element} The rendered ReadmeAndCommits component.
 */
const ReadmeAndCommits = ({ repo }: ReadmeAndCommitsProps) => {
  const commits = repo.commits || [];

  return (
    <div className="grid w-full grid-cols-1 items-start gap-6 lg:grid-cols-5">
      {/* README Column */}
      <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md sm:p-8 lg:col-span-3">
        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <FaBookOpen className="h-5 w-5 text-emerald-400" />
            <h2 className="text-lg font-bold tracking-tight text-white">README.md</h2>
          </div>
          <span className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs font-medium text-zinc-400">
            Rendered Markdown
          </span>
        </div>
        {repo.readme ? (
          <div className="markdown">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeSlug, rehypeAutolinkHeadings, rehypeRaw]}
            >
              {repo.readme}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm italic text-zinc-500">No README.md found in this repository.</p>
        )}
      </div>

      {/* Commits Column (Sticky on desktop) */}
      <div className="flex flex-col rounded-2xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur-md lg:sticky lg:top-24 lg:col-span-2">
        <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-4">
          <div className="flex items-center gap-2.5">
            <FaHistory className="h-5 w-5 text-cyan-400" />
            <h2 className="text-lg font-bold tracking-tight text-white">Commits</h2>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-0.5 text-xs font-semibold text-cyan-300">
            {commits.length} commits
          </span>
        </div>

        <div className="scrollbar flex max-h-[750px] flex-col space-y-2.5 overflow-y-auto pr-1">
          {commits.length === 0 && (
            <p className="text-xs italic text-zinc-500">No commits found.</p>
          )}
          {commits.map((commit, index) => (
            <div
              key={index}
              className="group flex flex-col gap-2 rounded-xl border border-white/5 bg-white/[0.02] p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-white/[0.05] hover:shadow-md hover:shadow-emerald-500/5"
            >
              <div className="flex items-start justify-between gap-2">
                <p
                  className="text-xs font-medium leading-snug text-zinc-200 transition-colors group-hover:text-emerald-300 sm:text-sm"
                  title={commit.message}
                >
                  {commit.message}
                </p>
                {commit.url && (
                  <a
                    href={commit.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 rounded-md bg-white/5 p-1 text-zinc-400 opacity-0 transition-opacity hover:bg-white/10 hover:text-white group-hover:opacity-100"
                    title="View commit on GitHub"
                  >
                    <FaExternalLinkAlt className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-2 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1.5 truncate">
                  <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-400/80" />
                  <span className="truncate text-zinc-400">{commit.author?.name || 'Unknown'}</span>
                </span>
                <span className="flex-shrink-0 text-zinc-500">
                  {commit.author?.date
                    ? new Date(commit.author.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
