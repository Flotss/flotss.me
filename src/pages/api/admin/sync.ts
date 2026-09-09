import { GithubService } from '@/services/GithubService';
import { verifyUserJWT } from '@/utils/Security';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function syncHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies.UserJWT;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: missing authentication' });
  }

  const payload = await verifyUserJWT(token);
  if (!payload || !payload.admin) {
    return res.status(403).json({ message: 'Forbidden: admin access required' });
  }

  try {
    const githubService = new GithubService();
    const repos = await githubService.getRepos();
    return res.status(200).json({
      success: true,
      message: `Successfully synced ${repos.length} repositories from GitHub.`,
      count: repos.length,
    });
  } catch (e: any) {
    return res.status(500).json({ message: e.message || 'Sync failed' });
  }
}
