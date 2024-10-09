import { Repo } from '@/types/types';
import { loadGithubInformation } from '@/utils/RepoUtils';
import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export function useFetchRepos(initialRepos: Repo[] = []) {
  const [repos, setRepos] = useState<Repo[]>(initialRepos);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      await loadGithubInformation({
        setRepos: setRepos,
        toast,
        setLoading: setLoading,
      });
    };
    fetchData();
  }, []);

  return { repos, loading };
}
