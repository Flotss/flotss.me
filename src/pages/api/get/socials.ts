import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const socialLinks = await prisma.socialLink.findMany({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(socialLinks);
  } catch (error) {
    console.error('Error fetching public social links:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
