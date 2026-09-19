/**
 * @jest-environment node
 */
import publicExperiencesHandler from '@/pages/api/get/experiences';
import { prisma } from '../src/lib/prisma';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    experience: {
      findMany: jest.fn(),
    },
  },
}));

describe('Public Experiences API Handler (/api/get/experiences)', () => {
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

    await publicExperiencesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.setHeader).toHaveBeenCalledWith('Allow', ['GET']);
  });

  it('should return visible experiences ordered by order and id on GET', async () => {
    const mockExperiences = [
      {
        id: 1,
        title: 'Software Engineer (Apprenticeship)',
        company: 'Société Générale',
        type: 'work',
        visible: true,
        order: 1,
      },
      {
        id: 2,
        title: 'Master of Engineering in Computer Science',
        company: 'ISEP',
        type: 'education',
        visible: true,
        order: 2,
      },
    ];

    (prisma.experience.findMany as jest.Mock).mockResolvedValue(mockExperiences);

    const req = {
      method: 'GET',
    } as any;

    const res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await publicExperiencesHandler(req, res);

    expect(prisma.experience.findMany).toHaveBeenCalledWith({
      where: { visible: true },
      orderBy: [{ order: 'asc' }, { id: 'asc' }],
    });
    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      'public, s-maxage=10, stale-while-revalidate=60',
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockExperiences);
  });
});
