import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const experiences = await prisma.experience.findMany({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });

    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
    return res.status(200).json(experiences);
  } catch (error) {
    console.error('Error fetching public experiences:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
