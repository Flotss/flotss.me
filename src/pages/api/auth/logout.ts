import { NextApiRequest, NextApiResponse } from 'next';

export default async function logoutHandler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string; success: boolean }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const isProd = process.env.NODE_ENV === 'production';
  const cookie = [
    'UserJWT=',
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
    'Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ...(isProd ? ['Secure'] : []),
  ].join('; ');

  res.setHeader('Set-Cookie', cookie);
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
}
