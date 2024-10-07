import { owner } from '@/services/GithubService';
import { Repo } from '@/types/types';
import { useToast } from '@chakra-ui/react';
import { PrismaClient } from '@prisma/client';
import { Dispatch } from 'react';

// Définissez vos priorités de tri ici
const priorityOrder: any[] = [
  { pinned: true, private: false, archived: false }, // Pinned and public
  { pinned: false, private: false, archived: false }, // Public (not pinned)
  { pinned: true, archived: true }, // Archived and pinned
  { pinned: false, archived: true }, // Archived (not pinned)
  { private: true, archived: false }, // Private
  { private: true, archived: true }, // Archived and private
];

export const sortRepos = (repos: Repo[]): Repo[] => {
  return repos.sort((a, b) => {
    for (const priority of priorityOrder) {
      const aMatches = Object.keys(priority).every((key) => (a as any)[key] === priority[key]);
      const bMatches = Object.keys(priority).every((key) => (b as any)[key] === priority[key]);

      if (aMatches && !bMatches) {
        return -1; // a comes before b
      } else if (!aMatches && bMatches) {
        return 1; // b comes before a
      }
    }

    // If everything else is equal, sort alphabetically
    return a.name.localeCompare(b.name);
  });
};

export const saveRepoDescription = (repos: Repo[]): void => {
  const prisma = new PrismaClient();

  // Create a new repo description record if existe save the new description
  repos.forEach(async (repo) => {
    await prisma.repoDescription.upsert({
      update: { description: repo.description, name: repo.name, url: repo.url },
      create: { repoId: repo.id, description: repo.description, name: repo.name, url: repo.url },
      where: { repoId: repo.id },
    });
  });
};

export const createIfNotExists = async (repos: Repo[]): Promise<void> => {
  const prisma = new PrismaClient();

  // Create a new repo record if not exists
  repos.forEach(async (repo) => {
    try {
      const existingRepo = await prisma.repoDescription.findUnique({ where: { repoId: repo.id } });
      if (!existingRepo) {
        await prisma.repoDescription.create({
          data: { repoId: repo.id, description: repo.description, name: repo.name, url: repo.url },
        });
      }
    } catch (e: any) {
      // Change the type annotation of 'e' to 'any'
      if (e.code !== 'P2002') {
        throw e;
      }
    }
  });
};

interface loadGithubInformationProps {
  setLoading: Dispatch<boolean>;
  toast: ReturnType<typeof useToast>;
  setUser?: Dispatch<any>;
  setRepos?: Dispatch<any>;
  owner?: string;
  callback?: () => void;
}

export const loadGithubInformation = async ({
  setUser,
  setRepos,
  owner: userOwner,
  toast,
  setLoading,
  callback,
}: loadGithubInformationProps): Promise<void> => {
  setLoading(true);
  if (setRepos) {
    const fetchRepos = async () => {
      const response = await fetch('api/get/repos');
      const data = (await response.json()) as Repo[];

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
      const repositoryArray = sortRepos(data);

      const reposData = {
        repos: repositoryArray,
        lastRequestDate: new Date().getTime(),
      };

      setRepos(repositoryArray);
      localStorage.setItem('repos', JSON.stringify(reposData)); // Save data in localStorage
      setLoading(false);
    };

    // Check if cached data is available and not expired
    const cachedRepos = localStorage.getItem('repos');
    if (cachedRepos) {
      const { lastRequestDate } = JSON.parse(cachedRepos);

      if (new Date().getTime() - lastRequestDate > 3600000) {
        await fetchRepos();
        return;
      } else {
        let reposs = JSON.parse(cachedRepos).repos as Repo[];
        reposs = sortRepos(reposs);
        setRepos(reposs);
        setLoading(false);
      }
    } else {
      await fetchRepos();
    }
  }

  if (setUser) {
    // LocalStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
    } else {
      fetch(`/api/get/user?name=${userOwner ?? owner}`)
        .then((response) => response.json())
        .then((data) => {
          setUser(data);
          localStorage.setItem('user', JSON.stringify(data));
          setLoading(false);
        });
    }
  }
  callback && callback();
};
