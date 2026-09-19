/**
 * @jest-environment node
 */
import adminExperiencesHandler from '@/pages/api/admin/experiences';
import { prisma } from '../src/lib/prisma';
import { setUserJWT } from '@/utils/Security';

jest.mock('../src/lib/prisma', () => ({
  prisma: {
    experience: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('Admin Experiences API Handler (/api/admin/experiences)', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      JWT_SECRET: 'test-secret-key-that-is-at-least-32-characters-long!!',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should reject unauthenticated request with 401', async () => {
    const req = {
      cookies: {},
      method: 'GET',
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await adminExperiencesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('missing authentication') }),
    );
  });

  it('should reject non-admin request with 403', async () => {
    const nonAdminToken = await setUserJWT({
      id: 'user-1',
      email: 'user@test.com',
      roleId: 2,
    });

    const req = {
      cookies: { UserJWT: nonAdminToken },
      method: 'GET',
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await adminExperiencesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: expect.stringContaining('admin access required') }),
    );
  });

  it('should return all experiences on GET when authorized as admin', async () => {
    const adminToken = await setUserJWT({
      id: 'admin-1',
      email: 'admin@test.com',
      roleId: 1,
    });

    const mockExperiences = [
      { id: 1, title: 'Software Engineer', company: 'Société Générale', order: 1 },
      { id: 2, title: 'Master of Engineering', company: 'ISEP', order: 2 },
    ];

    (prisma.experience.findMany as jest.Mock).mockResolvedValue(mockExperiences);

    const req = {
      cookies: { UserJWT: adminToken },
      method: 'GET',
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await adminExperiencesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockExperiences);
  });

  it('should create a new experience on POST', async () => {
    const adminToken = await setUserJWT({
      id: 'admin-1',
      email: 'admin@test.com',
      roleId: 1,
    });

    const newExp = {
      title: 'Software Engineer Apprentice',
      company: 'Société Générale',
      startDate: 'Oct 2023',
      endDate: 'Sep 2026',
      current: true,
      type: 'work',
    };

    (prisma.experience.findFirst as jest.Mock).mockResolvedValue({ order: 2 });
    (prisma.experience.create as jest.Mock).mockResolvedValue({ id: 3, ...newExp, order: 3 });

    const req = {
      cookies: { UserJWT: adminToken },
      method: 'POST',
      body: newExp,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await adminExperiencesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, experience: expect.objectContaining({ id: 3 }) }),
    );
  });

  it('should update an existing experience on PUT', async () => {
    const adminToken = await setUserJWT({
      id: 'admin-1',
      email: 'admin@test.com',
      roleId: 1,
    });

    const updateData = {
      id: 1,
      title: 'Senior Software Engineer Apprentice',
    };

    (prisma.experience.update as jest.Mock).mockResolvedValue(updateData);

    const req = {
      cookies: { UserJWT: adminToken },
      method: 'PUT',
      body: updateData,
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await adminExperiencesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, experience: expect.objectContaining({ id: 1 }) }),
    );
  });

  it('should update endDate to explicit string when current is false, and "Present" when current is true', async () => {
    const adminToken = await setUserJWT({
      id: 'admin-1',
      email: 'admin@test.com',
      roleId: 1,
    });

    (prisma.experience.update as jest.Mock).mockImplementation(({ data }) =>
      Promise.resolve({ id: 1, ...data }),
    );

    // 1. Inactive with explicit end date
    const req1 = {
      cookies: { UserJWT: adminToken },
      method: 'PUT',
      body: { id: 1, current: false, endDate: 'Sep 2026' },
    } as any;
    const res1 = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await adminExperiencesHandler(req1, res1);
    expect(prisma.experience.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({ current: false, endDate: 'Sep 2026' }),
    });

    // 2. Active marked as current: true
    const req2 = {
      cookies: { UserJWT: adminToken },
      method: 'PUT',
      body: { id: 1, current: true, endDate: '' },
    } as any;
    const res2 = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;

    await adminExperiencesHandler(req2, res2);
    expect(prisma.experience.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: expect.objectContaining({ current: true, endDate: 'Present' }),
    });
  });

  it('should delete an experience on DELETE', async () => {
    const adminToken = await setUserJWT({
      id: 'admin-1',
      email: 'admin@test.com',
      roleId: 1,
    });

    (prisma.experience.delete as jest.Mock).mockResolvedValue({ id: 1 });

    const req = {
      cookies: { UserJWT: adminToken },
      method: 'DELETE',
      query: { id: '1' },
    } as any;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as any;

    await adminExperiencesHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ success: true, deletedId: 1 });
  });
});
