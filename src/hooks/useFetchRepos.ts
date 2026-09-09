import { Repo } from '@/types/types';
import { ReposMock, USE_MOCK_DATA } from '@/utils/GithubMock.constants';
import { sortRepos } from '@/utils/RepoUtils';
import { useEffect, useState } from 'react';

export function useFetchRepos(initialRepos: Repo[] = []) {
  const [repos, setRepos] = useState<Repo[]>(() => sortRepos(initialRepos));
  const [loading, setLoading] = useState<boolean>(initialRepos.length === 0);

  useEffect(() => {
    // If initial repos were provided, initialize immediately with custom sort
    if (initialRepos.length > 0) {
      setRepos(sortRepos(initialRepos));
    }

    let isMounted = true;

    const fetchFreshRepos = async () => {
      // Mock data handling for tests or mock mode
      if (USE_MOCK_DATA) {
        if (isMounted) {
          setRepos(sortRepos(ReposMock as Repo[]));
          setLoading(false);
        }
        return;
      }

      try {
        const res = await fetch('/api/get/repos');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && isMounted) {
            setRepos(sortRepos(data));
          }
        }
      } catch {
        // Silently retain initialRepos if client fetch fails
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchFreshRepos();

    return () => {
      isMounted = false;
    };
  }, [initialRepos]);

  return { repos, loading };
}
