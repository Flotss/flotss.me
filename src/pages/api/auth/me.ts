import { prisma } from '@/lib/prisma';
import { verifyUserJWT } from '@/utils/Security';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function meHandler(
  req: NextApiRequest,
  res: NextApiResponse<{
    authenticated: boolean;
    user?: { id: string; email: string; admin: boolean };
    message?: string;
  }>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ authenticated: false, message: 'Method not allowed' });
  }

  const token = req.cookies.UserJWT;
  if (!token) {
    return res.status(401).json({ authenticated: false, message: 'Not authenticated' });
  }

  const payload = await verifyUserJWT(token);
  if (!payload || !payload.sub) {
    return res.status(401).json({ authenticated: false, message: 'Invalid or expired session' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ authenticated: false, message: 'User not found' });
    }

    return res.status(200).json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        admin: user.roleId === 1 || user.role?.name === 'ADMIN',
      },
    });
  } catch {
    // If DB is temporarily unreachable, fall back to valid JWT payload
    return res.status(200).json({
      authenticated: true,
      user: {
        id: payload.sub,
        email: payload.email,
        admin: Boolean(payload.admin),
      },
    });
  }
}
