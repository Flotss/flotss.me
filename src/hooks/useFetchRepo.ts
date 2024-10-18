import { Repo, RepoLocalStorage } from '@/types/types';
import { RepoMock, USE_MOCK_DATA } from '@/utils/GithubMock.constants';
import { clearLocalStorage, getLocalStorage, saveDataToLocalStorage } from '@/utils/LocalStorage';
import { useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

interface useFetchRepoProps {
  initialRepos?: Repo | null;
  name: string;
}

export function useFetchRepo({ initialRepos = null, name }: useFetchRepoProps) {
  const [repo, setRepo] = useState<Repo | null>(initialRepos);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ error: string; code: string } | null>(null);
  const toast = useToast();
  const prevNameRef = useRef<string | null>(null);

  useEffect(() => {
    if (!name) {
      return;
    }

    if (prevNameRef.current === name) {
      return;
    }

    setLoading(true);
    prevNameRef.current = name;

    async function fetchRepoDataFromApi() {
      const response = await fetch(`/api/get/repos?name=${name}`);

      if (!response.ok) {
        const reponse = await response.json();
        const message = reponse.message;
        const code = response.status.toString();
        toast({
          title: 'Erreur',
          description: message,
          status: 'error',
          duration: 9000,
          isClosable: true,
        });
        setError({ error: message, code });
        return;
      }

      const data = await response.json();
      const repo: Repo = data;
      setRepo(repo);

      const commits = await fetch(`/api/get/${repo.name}/commits`);
      const commitsData = await commits.json();
      setRepo({ ...repo, commits: commitsData });
      repo.commits = commitsData;

      saveDataToLocalStorage(name, 'repo', repo);
    }

    /**
     * Fetches repository data either from local storage or from the API.
     */
    async function fetchRepoData(): Promise<void> {
      // If the application is using mock data, use the mock data instead of fetching from the API
      if (USE_MOCK_DATA) {
        setRepo(RepoMock);
        return;
      }

      const storedRepoData = getLocalStorage<RepoLocalStorage>(name as string);
      if (storedRepoData == null) {
        await fetchRepoDataFromApi();
        return;
      }

      // if the date of the last request is more than 1 hour
      if (new Date().getTime() - storedRepoData.lastRequestDate < 3600000) {
        setRepo(storedRepoData.repo);
      } else {
        clearLocalStorage(name as string);
        await fetchRepoDataFromApi();
      }
    }

    fetchRepoData();
    setLoading(false);
  }, [name, toast]);

  return { repo, loading, error };
}
