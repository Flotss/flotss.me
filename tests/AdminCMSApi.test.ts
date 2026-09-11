/**
 * @jest-environment node
 */
import adminSettingsHandler from '@/pages/api/admin/settings';
import { setUserJWT } from '@/utils/Security';

describe('Admin CMS API Handlers Security & Authorization', () => {
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

  describe('adminSettingsHandler', () => {
    it('should reject unauthenticated request with 401', async () => {
      const req = {
        cookies: {},
        method: 'GET',
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await adminSettingsHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('missing authentication') }),
      );
    });

    it('should reject non-admin request with 403', async () => {
      const nonAdminToken = await setUserJWT({
        id: 'user-1',
        email: 'user@test.com',
        roleId: 2, // Role 2 is USER, not ADMIN
      });

      const req = {
        cookies: { UserJWT: nonAdminToken },
        method: 'GET',
      } as any;

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      } as any;

      await adminSettingsHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: expect.stringContaining('admin access required') }),
      );
    });
  });
});
