import Repos from '@/components/Repos';
import Title from '@/components/Title';
import { GithubService } from '@/services/GithubService';
import { Repo } from '@/types/types';
import { sortRepos } from '@/utils/RepoUtils';
import type { GetStaticProps } from 'next';
import { useState } from 'react';

interface ProjectsProps {
  repos?: Repo[];
}

/**
 * The `Projects` component is responsible for displaying a list of repositories.
 *
 * @returns {JSX.Element} - The rendered `Projects` component.
 */
export default function Projects({ repos = [] }: ProjectsProps) {
  const [reposCount, setReposCount] = useState<number | null>(repos.length || null);

  return (
    <>
      <Title
        title={`My projects${reposCount !== 0 && reposCount ? ` (${reposCount})` : ''}`}
        className="mt-10"
      />

      <Repos repos={repos} filterVisible={true} setReposCount={setReposCount} />
    </>
  );
}

export const getStaticProps: GetStaticProps<ProjectsProps> = async () => {
  try {
    const githubService = new GithubService();
    const repos = await githubService.getRepos();
    return {
      props: {
        repos: JSON.parse(JSON.stringify(sortRepos(repos || []))),
      },
      revalidate: 3600,
    };
  } catch (err) {
    console.error('Error in Projects getStaticProps:', err);
    return {
      props: {
        repos: [],
      },
      revalidate: 60,
    };
  }
};
