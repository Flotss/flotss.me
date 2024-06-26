import ProjectCard from '@/components/Card/ProjectCard';
import ProjectCardSkeleton from '@/components/Card/ProjectCardSkeleton';
import { Repo } from '@/types/types';
import { Box } from '@chakra-ui/react';

export default function Home() {
  const repo: Repo = {
    name: 'test',
    description: 'test',
    stargazers_count: 0,
    archived: true,
    id: 0,
    url: '',
    html_url: '',
    created_at: '',
    updated_at: '',
    language: '',
    homepage: '',
    git_url: '',
    ssh_url: '',
    clone_url: '',
    svn_url: '',
    forked: false,
    commits: [],
    readme: '',
    owner: {
      login: '',
      avatar_url: '',
      url: '',
      html_url: '',
    },
    open_issues_count: 0,
    license: '',
    subscribers_count: 0,
    forks_count: 0,
    watchers_count: 0,
    languages: [],
    collaborators: [],
    pullRequests: [],
    pinned: true,
    private: false,
  };

  return (
    <Box className="flex flex-row items-center space-x-2 p-20">
      <ProjectCardSkeleton />
      <ProjectCard repo={repo} />
    </Box>
  );
}
