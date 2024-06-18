import { Repo } from '@/types/types';
import { PrismaClient } from '@prisma/client';

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
