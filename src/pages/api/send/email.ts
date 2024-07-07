import { sendEmail } from '@/services/EmailService';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any | { message: string }>,
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const body = req.body;

  try {
    const message = await sendEmail(body);
    if (message) {
      res.status(400).json({ message: message });
    }
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (e: any) {
    res.status(400).json({ message: e.message + ' from repos.ts ' + e.name });
  }
}
