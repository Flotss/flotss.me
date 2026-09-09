import { login } from '@/services/AuthService';
import { verifyUserJWT } from '@/utils/Security';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<{
    message: string;
    success?: boolean;
    user?: { email: string; admin: boolean };
  }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const token = await login(email, password);
    const payload = await verifyUserJWT(token);

    const isProd = process.env.NODE_ENV === 'production';
    const cookie = [
      `UserJWT=${token}`,
      'Path=/',
      'HttpOnly',
      'SameSite=Lax',
      'Max-Age=604800',
      ...(isProd ? ['Secure'] : []),
    ].join('; ');

    res.setHeader('Set-Cookie', cookie);
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        email: payload?.email ?? email,
        admin: Boolean(payload?.admin),
      },
    });
  } catch (e: any) {
    return res.status(400).json({ message: e.message || 'Login failed' });
  }
}
