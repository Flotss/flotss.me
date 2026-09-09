/**
 * @jest-environment node
 */
import { getUserFromJWT, setUserJWT, verifyUserJWT } from '@/utils/Security';

describe('Security / JWT Utils', () => {
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

  it('should generate a valid JWT for an admin user', async () => {
    const user = {
      id: 'usr_admin_123',
      email: 'admin@flotss.me',
      roleId: 1,
    };

    const token = await setUserJWT(user);
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(20);

    const payload = await verifyUserJWT(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('usr_admin_123');
    expect(payload?.email).toBe('admin@flotss.me');
    expect(payload?.admin).toBe(true);
  });

  it('should generate a valid JWT for a non-admin user', async () => {
    const user = {
      id: 'usr_regular_456',
      email: 'user@flotss.me',
      roleId: 2,
    };

    const token = await setUserJWT(user);
    const payload = await verifyUserJWT(token);
    expect(payload).not.toBeNull();
    expect(payload?.sub).toBe('usr_regular_456');
    expect(payload?.email).toBe('user@flotss.me');
    expect(payload?.admin).toBe(false);
  });

  it('should return user email via getUserFromJWT', async () => {
    const user = {
      id: 'usr_789',
      email: 'flotss@example.com',
      roleId: 1,
    };

    const token = await setUserJWT(user);
    const email = await getUserFromJWT(token);
    expect(email).toBe('flotss@example.com');
  });

  it('should return null for invalid or tampered JWT', async () => {
    const invalidResult = await verifyUserJWT('invalid.jwt.token');
    expect(invalidResult).toBeNull();

    const emptyResult = await verifyUserJWT('');
    expect(emptyResult).toBeNull();
  });
});
