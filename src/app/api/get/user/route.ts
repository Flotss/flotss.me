import { GithubService } from '@/services/GithubService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { message: string }>,
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
      const user = await githubService.getUser(name as string);
      return res.status(200).json(user);
    }
  } catch (e: any) {
    // Gestion des erreurs
    res.status(400).json({ message: e.message + ' from repos.ts ' + e.name });
  }
}
