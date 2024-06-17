import { GithubService } from '@/services/GithubService';
import { Repo } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Repo[] | Repo | { message: string }>,
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { name } = req.query;

  const githubService = new GithubService();

  try {
    // Si le nom du dépôt est fourni, récupérer le dépôt spécifique
    if (name !== undefined) {
      const repo = await githubService.getRepo(name as string);
      if (repo) {
        res.status(200).json(repo);
      } else {
        res.status(404).json({ message: 'Repo not found' });
      }
      return;
    }

    // Récupérer la liste des dépôts
    const repos: Repo[] = await githubService.getRepos();

    // Si aucun dépôt n'est trouvé
    if (repos.length === 0) {
      res.status(404).json([]);
      return;
    }

    // Renvoi de la liste des dépôts
    res.status(200).json(repos);
  } catch (e: any) {
    // Gestion des erreurs
    res.status(400).json({ message: e.message + ' from repos.ts ' + e.name });
  }
}
