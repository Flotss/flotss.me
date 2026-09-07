import { Repo } from '@/types/types';
import { loadGithubInformation, sortRepos } from '@/utils/RepoUtils';
import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export function useFetchRepos(initialRepos: Repo[] = []) {
  const [repos, setRepos] = useState<Repo[]>(() => sortRepos(initialRepos));
  const [loading, setLoading] = useState<boolean>(initialRepos.length === 0);
  const toast = useToast();

  useEffect(() => {
    // If initialRepos were already provided via getStaticProps (ISR), no need to fetch!
    if (initialRepos.length > 0) {
      setRepos(sortRepos(initialRepos));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      await loadGithubInformation({
        setRepos,
        toast,
        setLoading,
      });
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialRepos]);

  return { repos, loading };
}
