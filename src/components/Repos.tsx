import { Repo } from '@/types/types';
import { ScaleFade, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import ProjectCard from './Card/ProjectCard';
import ProjectCardSkeleton from './Card/ProjectCardSkeleton';

/**
 * The `Repos` component displays a list of GitHub repositories. It fetches data from an API and can also use cached data from localStorage.
 * It handles loading states, error handling, and rendering the repository cards.
 *
 * @returns {JSX.Element} - The rendered Repos component.
 */
export default function Repos(): JSX.Element {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  const toast = useToast();

  useEffect(() => {
    /**
     * Fetches GitHub repositories from the API.
     * Handles different response statuses, such as rate limiting and not found.
     */
    const fetchRepos = async () => {
      const response = await fetch('api/get/repos');
      const data = await response.json();

      if (response.status === 400) {
        toast({
          title: 'Networking Error',
          description: 'Rate limit of GitHub has been reached',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      if (response.status === 404) {
        toast({
          title: 'Repositories not found',
          description: '',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const reposData = {
        repos: data,
        lastRequestDate: new Date().getTime(),
      };

      setRepos(data);
      setLoading(false);
      localStorage.setItem('repos', JSON.stringify(reposData)); // Save data in localStorage
    };

    // Check if cached data is available and not expired
    const cachedRepos = localStorage.getItem('repos');
    if (cachedRepos) {
      const { lastRequestDate } = JSON.parse(cachedRepos);

      if (new Date().getTime() - lastRequestDate > 3600000) {
        fetchRepos();
        return;
      } else {
        setRepos(JSON.parse(cachedRepos).repos);
        setLoading(false);
      }
    } else {
      fetchRepos();
    }
  }, [toast]);

  if (loading) {
    // Display skeleton loading cards while data is being fetched
    const skeletons = Array.from({ length: 6 }).map((_, index) => (
      <ProjectCardSkeleton key={index} />
    ));
    return (
      <section className="mx-14 flex flex-wrap justify-center gap-x-12 gap-y-6 py-8 sm:mx-10 lg:mx-36 lg:flex-row">
        {skeletons}
      </section>
    );
  }

  // Render the repository cards when data is available
  return (
    <section
      className="mx-5 flex flex-wrap justify-center gap-x-5 gap-y-5 py-8 sm:mx-20 lg:flex-row"
      id="projects"
    >
      {repos.map((repo) => (
        <ScaleFade key={repo.id} initialScale={0.9} in={true}>
          <ProjectCard key={repo.id} repo={repo} />
        </ScaleFade>
      ))}
    </section>
  );
}
