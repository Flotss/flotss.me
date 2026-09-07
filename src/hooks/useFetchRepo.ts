import { Repo } from '@/types/types';
import { RepoMock, USE_MOCK_DATA } from '@/utils/GithubMock.constants';
import { useToast } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';

interface useFetchRepoProps {
  initialRepos?: Repo | null;
  name: string;
}

export function useFetchRepo({ initialRepos = null, name }: useFetchRepoProps) {
  const [repo, setRepo] = useState<Repo | null>(initialRepos);
  const [loading, setLoading] = useState(!initialRepos);
  const [error, setError] = useState<{ error: string; code: string } | null>(null);
  const toast = useToast();
  const prevNameRef = useRef<string | null>(initialRepos ? name : null);

  useEffect(() => {
    if (!name) {
      return;
    }

    if (prevNameRef.current === name && repo) {
      return;
    }

    setLoading(true);
    prevNameRef.current = name;

    async function fetchRepoData() {
      if (USE_MOCK_DATA) {
        setRepo(RepoMock);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/get/repos?name=${name}`);

        if (!response.ok) {
          const reponse = await response.json();
          const message = reponse.message || 'Failed to fetch repository';
          const code = response.status.toString();
          toast({
            title: 'Erreur',
            description: message,
            status: 'error',
            duration: 9000,
            isClosable: true,
          });
          setError({ error: message, code });
          setLoading(false);
          return;
        }

        const data: Repo = await response.json();
        setRepo(data);

        const commitsResponse = await fetch(`/api/get/${data.name}/commits`);
        if (commitsResponse.ok) {
          const commitsData = await commitsResponse.json();
          setRepo({ ...data, commits: commitsData });
        }
      } catch (err: any) {
        setError({ error: err.message || 'Unknown error', code: '500' });
      } finally {
        setLoading(false);
      }
    }

    fetchRepoData();
  }, [name, toast, repo]);

  return { repo, loading, error };
}
