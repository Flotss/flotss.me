import { GithubService } from '@/services/GithubService';
import { Commit } from '@/types/types';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Commit[] | { message: string }>,
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { repo } = req.query;
  if (typeof repo !== 'string') {
    res.status(400).json({ message: 'Repo name must be a string' });
    return;
  }

  const githubService = new GithubService();

  try {
    // Si le nom du dépôt est fourni, récupérer le dépôt spécifique
    if (repo !== undefined) {
      const commits = await githubService.getAllCommits(repo as string);
      if (commits) {
        res.status(200).json(commits);
      } else {
        res.status(404).json({ message: 'Repo not found' });
      }
    }
  } catch (e: any) {
    // Gestion des erreurs
    res.status(400).json({ message: e.message });
  }
}
