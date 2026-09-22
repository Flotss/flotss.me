/**
 * @jest-environment node
 */
import publicSettingsHandler from '@/pages/api/get/settings';
import { prisma } from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    siteSettings: {
      findUnique: jest.fn(),
    },
  },
}));

describe('Public Settings API Handler (/api/get/settings)', () => {
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

    await publicSettingsHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
  });

  it('should return public site settings on GET', async () => {
    const mockSettings = {
      id: 1,
      availabilityText: 'Available for opportunities',
      heroHeadline: 'Hello Florian',
      heroSubtitle: 'Software Engineer',
      resumeUrl: 'https://docsend.com/view/gzpmyg8rjmn2btde',
    };

    (prisma.siteSettings.findUnique as jest.Mock).mockResolvedValue(mockSettings);

    const req = {
      method: 'GET',
    } as any;

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await publicSettingsHandler(req, res);

    expect(prisma.siteSettings.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: {
        id: true,
        availabilityText: true,
        heroHeadline: true,
        heroSubtitle: true,
        resumeUrl: true,
      },
    });
    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, max-age=60, s-maxage=3600, stale-while-revalidate=86400',
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockSettings);
  });
});
