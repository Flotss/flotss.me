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
        setRepos,
        toast,
        setLoading,
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { repos, loading };
}
