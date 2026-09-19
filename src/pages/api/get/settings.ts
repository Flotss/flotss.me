import { prisma } from '@/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 1 },
      select: {
        id: true,
        availabilityText: true,
        heroHeadline: true,
        heroSubtitle: true,
        resumeUrl: true,
      },
    });

    res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=60');
    return res.status(200).json(settings);
  } catch (error) {
    console.error('Error fetching public site settings:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
