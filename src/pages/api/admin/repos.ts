import { prisma } from '@/lib/prisma';
import { verifyUserJWT } from '@/utils/Security';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function adminReposHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.UserJWT;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: missing authentication' });
  }

  const payload = await verifyUserJWT(token);
  if (!payload || !payload.admin) {
    return res.status(403).json({ message: 'Forbidden: admin access required' });
  }

  if (req.method === 'GET') {
    try {
      const repos = await prisma.repoDB.findMany();

      repos.sort((a, b) => {
        const orderA = a.order && a.order > 0 ? a.order : Infinity;
        const orderB = b.order && b.order > 0 ? b.order : Infinity;
        if (orderA !== orderB) return orderA - orderB;
        if (a.visible !== b.visible) return a.visible ? -1 : 1;
        return (a.name || '').localeCompare(b.name || '');
      });

      return res.status(200).json(repos);
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Failed to fetch repositories' });
    }
  }

  if (req.method === 'PATCH' || req.method === 'PUT') {
    const { items, repoId, visible, description, order } = req.body || {};

    // Support batch update (useful for reordering all or multiple repos at once)
    if (Array.isArray(items)) {
      try {
        const updates = items.map((item: { repoId: number; order?: number; visible?: boolean }) =>
          prisma.repoDB.update({
            where: { repoId: Number(item.repoId) },
            data: {
              ...(typeof item.order === 'number' ? { order: item.order } : {}),
              ...(typeof item.visible === 'boolean' ? { visible: item.visible } : {}),
            },
          }),
        );

        await prisma.$transaction(updates);
        return res.status(200).json({ success: true, count: items.length });
      } catch (e: any) {
        return res
          .status(500)
          .json({ message: e.message || 'Failed to update batch repositories' });
      }
    }

    if (repoId === undefined || isNaN(Number(repoId))) {
      return res.status(400).json({ message: 'Valid repoId is required' });
    }

    try {
      const updated = await prisma.repoDB.update({
        where: { repoId: Number(repoId) },
        data: {
          ...(typeof visible === 'boolean' ? { visible } : {}),
          ...(typeof description === 'string' || description === null ? { description } : {}),
          ...(typeof order === 'number' ? { order } : {}),
        },
      });

      return res.status(200).json({ success: true, repo: updated });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Failed to update repository' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
