/**
 * @jest-environment node
 */
import publicSocialsHandler from '@/pages/api/get/socials';
import { prisma } from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    socialLink: {
      findMany: jest.fn(),
    },
  },
}));

describe('Public Socials API Handler (/api/get/socials)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject non-GET requests with 405', async () => {
    const req = {
      method: 'POST',
    } as any;

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await publicSocialsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
  });

  it('should return visible social links ordered by order and id on GET', async () => {
    const mockLinks = [
      {
        id: 1,
        platform: 'github',
        label: 'GitHub',
        url: 'https://github.com/flotss',
        icon: 'FaGithub',
        order: 1,
        visible: true,
      },
      {
        id: 2,
        platform: 'linkedin',
        label: 'LinkedIn',
        url: 'https://linkedin.com/in/flotss',
        icon: 'FaLinkedin',
        order: 2,
        visible: true,
      },
    ];

    (prisma.socialLink.findMany as jest.Mock).mockResolvedValue(mockLinks);

    const req = {
      method: 'GET',
    } as any;

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await publicSocialsHandler(req, res);

    expect(prisma.socialLink.findMany).toHaveBeenCalledWith({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=300',
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLinks);
  });
});
