import { prisma } from '@/lib/prisma';
import { verifyUserJWT } from '@/utils/Security';
import { NextApiRequest, NextApiResponse } from 'next';

const DEFAULT_SETTINGS = {
  id: 1,
  availabilityText: 'Available for new opportunities',
  heroHeadline: 'Hello ! My name is Florian Mangin',
  heroSubtitle:
    'Software Engineer passionate about crafting robust software, clean architectures, and modern web applications.',
  resumeUrl: '/cv.pdf',
};

const DEFAULT_SOCIAL_LINKS = [
  {
    platform: 'github',
    label: 'GitHub',
    url: 'https://github.com/flotss',
    icon: 'FaGithub',
    order: 1,
    visible: true,
  },
  {
    platform: 'linkedin',
    label: 'LinkedIn',
    url: 'https://www.linkedin.com/in/florian-mangin-784604208/',
    icon: 'FaLinkedin',
    order: 2,
    visible: true,
  },
];

export default async function adminSettingsHandler(req: NextApiRequest, res: NextApiResponse) {
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
      // Find or initialize singleton settings
      let settings = await prisma.siteSettings.findUnique({
        where: { id: 1 },
      });

      if (!settings) {
        settings = await prisma.siteSettings.create({
          data: DEFAULT_SETTINGS,
        });
      }

      // Fetch social links
      let socialLinks = await prisma.socialLink.findMany({
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
      });

      // If no social links exist yet, initialize with defaults
      if (socialLinks.length === 0) {
        await prisma.socialLink.createMany({
          data: DEFAULT_SOCIAL_LINKS,
        });
        socialLinks = await prisma.socialLink.findMany({
          orderBy: [{ order: 'asc' }, { id: 'asc' }],
        });
      }

      return res.status(200).json({ settings, socialLinks });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Failed to fetch site settings' });
    }
  }

  if (req.method === 'PUT' || req.method === 'PATCH') {
    const { availabilityText, heroHeadline, heroSubtitle, resumeUrl, socialLinks } = req.body || {};

    try {
      // 1. Update SiteSettings
      const settings = await prisma.siteSettings.upsert({
        where: { id: 1 },
        create: {
          id: 1,
          availabilityText: availabilityText ?? DEFAULT_SETTINGS.availabilityText,
          heroHeadline: heroHeadline ?? DEFAULT_SETTINGS.heroHeadline,
          heroSubtitle: heroSubtitle ?? DEFAULT_SETTINGS.heroSubtitle,
          resumeUrl: resumeUrl ?? DEFAULT_SETTINGS.resumeUrl,
        },
        update: {
          ...(typeof availabilityText === 'string' ? { availabilityText } : {}),
          ...(typeof heroHeadline === 'string' ? { heroHeadline } : {}),
          ...(typeof heroSubtitle === 'string' ? { heroSubtitle } : {}),
          ...(typeof resumeUrl === 'string' || resumeUrl === null ? { resumeUrl } : {}),
        },
      });

      // 2. Synchronize SocialLinks if provided
      if (Array.isArray(socialLinks)) {
        // Delete links not in current list (for those having an id)
        const incomingIds = socialLinks
          .map((link: any) => Number(link.id))
          .filter((id) => !isNaN(id) && id > 0);

        await prisma.socialLink.deleteMany({
          where: {
            id: { notIn: incomingIds },
          },
        });

        // Upsert or create each link
        for (let i = 0; i < socialLinks.length; i++) {
          const item = socialLinks[i];
          const linkId = Number(item.id);
          const order = typeof item.order === 'number' ? item.order : i + 1;

          if (!isNaN(linkId) && linkId > 0) {
            await prisma.socialLink.upsert({
              where: { id: linkId },
              create: {
                platform: String(item.platform || 'link').toLowerCase(),
                label: String(item.label || 'Link'),
                url: String(item.url || '#'),
                icon: String(item.icon || 'FaGlobe'),
                order,
                visible: item.visible !== false,
              },
              update: {
                platform: String(item.platform || 'link').toLowerCase(),
                label: String(item.label || 'Link'),
                url: String(item.url || '#'),
                icon: String(item.icon || 'FaGlobe'),
                order,
                visible: item.visible !== false,
              },
            });
          } else {
            await prisma.socialLink.create({
              data: {
                platform: String(item.platform || 'link').toLowerCase(),
                label: String(item.label || 'Link'),
                url: String(item.url || '#'),
                icon: String(item.icon || 'FaGlobe'),
                order,
                visible: item.visible !== false,
              },
            });
          }
        }
      }

      const updatedSocialLinks = await prisma.socialLink.findMany({
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
      });

      return res.status(200).json({
        success: true,
        settings,
        socialLinks: updatedSocialLinks,
      });
    } catch (e: any) {
      return res.status(500).json({ message: e.message || 'Failed to update site settings' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
