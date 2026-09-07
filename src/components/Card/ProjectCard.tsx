import { Repo } from '@/types/types';
import { LockIcon, StarIcon } from '@chakra-ui/icons';
import { Box } from '@chakra-ui/react';
import Link from 'next/link';
import { memo, useCallback, useMemo } from 'react';
import { VscPinnedDirty } from 'react-icons/vsc';

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

interface ProjectCardProps {
  repo: Repo;
  isMobile?: boolean;
}

function ProjectCardComponent(props: ProjectCardProps) {
  const { name, description, stargazers_count, archived, pinned, language } = props.repo;
  const isPrivate = props.repo.private;
  const isFork = props.repo.fork;

  const linkHref = useMemo(() => `/projects/${name}`, [name]);

  const handleClick = useCallback(
    (e: { preventDefault: () => void }) => {
      if (isPrivate) {
        e.preventDefault();
      }
    },
    [isPrivate],
  );

  return (
    <Link href={linkHref} onClick={handleClick} className="block h-full">
      <Box
        className={`group relative flex h-full min-h-[12rem] w-[20rem] flex-col justify-between overflow-hidden rounded-2xl border p-6 backdrop-blur-md transition-all duration-300 sm:w-[25rem] ${
          isPrivate
            ? 'cursor-not-allowed border-white/5 bg-white/[0.02] opacity-60'
            : 'border-white/5 bg-white/[0.02] hover:-translate-y-1 hover:border-emerald-500/40 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-emerald-500/10'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5 overflow-hidden">
              <div className="flex items-center gap-2">
                {isPrivate && <LockIcon className="h-3.5 w-3.5 flex-shrink-0 text-zinc-500" />}
                <h3
                  className={`truncate text-lg font-semibold tracking-tight transition-colors duration-200 ${
                    isPrivate ? 'text-zinc-600' : 'text-zinc-200 group-hover:text-emerald-400'
                  }`}
                  title={name}
                >
                  {name}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {isFork && (
                  <span className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-medium text-zinc-400">
                    FORKED
                  </span>
                )}
                {archived && (
                  <span className="rounded-md border border-zinc-800 bg-zinc-900/80 px-2 py-0.5 text-[10px] font-medium text-zinc-500">
                    Archived
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2 pt-0.5">
              {stargazers_count > 0 && (
                <div className="flex items-center gap-1 text-xs text-zinc-500">
                  <StarIcon className="h-3 w-3 text-zinc-500" />
                  <span>{stargazers_count}</span>
                </div>
              )}
              {pinned && (
                <VscPinnedDirty className="h-4 w-4 text-zinc-400" title="Pinned repository" />
              )}
            </div>
          </div>

          {/* Description */}
          {description ? (
            <p
              className={`mt-3 line-clamp-3 text-sm leading-relaxed transition-colors duration-200 ${
                isPrivate ? 'text-zinc-600' : 'text-zinc-400 group-hover:text-zinc-300'
              }`}
            >
              {description}
            </p>
          ) : (
            <p className="mt-3 text-xs italic text-zinc-600">No description provided</p>
          )}
        </div>

        {/* Footer info: language */}
        {language && (
          <div className="mt-4 flex items-center gap-2 border-t border-white/5 pt-3">
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: LANGUAGE_COLORS[language] || '#10b981' }}
            />
            <span className="text-xs font-medium text-zinc-400">{language}</span>
          </div>
        )}
      </Box>
    </Link>
  );
}

export default memo(ProjectCardComponent);
