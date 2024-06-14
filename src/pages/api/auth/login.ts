import { login } from '@/services/AuthService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function loginHandler(
  req: NextApiRequest,
  res: NextApiResponse<{ message: string }>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const token = await login(email, password);
    res.setHeader('Set-Cookie', `UserJWT=${token}; Path=/; HttpOnly; SameSite=Strict;`);
    res.status(200).json({ message: 'Login successful' });
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
}
