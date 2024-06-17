import { Repo } from '@/types/types';
import { PrismaClient } from '@prisma/client';

// Définissez vos priorités de tri ici
const priorityOrder: any[] = [
  { pinned: true, private: false, archived: false }, // Épinglé et public
  { pinned: false, private: false, archived: false }, // Public (non épinglé)
  { pinned: true, archived: true }, // Archivé et épinglé
  { pinned: false, archived: true }, // Archivé (non épinglé)
  { private: true }, // Privé
];

export const sortRepos = (repos: Repo[]): Repo[] => {
  return repos.sort((a, b) => {
    for (const priority of priorityOrder) {
      const aMatches = Object.keys(priority).every((key) => (a as any)[key] === priority[key]);
      const bMatches = Object.keys(priority).every((key) => (b as any)[key] === priority[key]);

      if (aMatches && !bMatches) {
        return -1; // a vient avant b
      } else if (!aMatches && bMatches) {
        return 1; // b vient avant a
      }
    }

    // Si tout le reste est égal, tri alphabétique
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
