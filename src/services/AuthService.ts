import { prisma } from '@/lib/prisma';
import { setUserJWT } from '@/utils/Security';
import bcrypt from 'bcrypt';
import { InvalidCredentialsError } from './exception/AuthErrors';

export async function ensureDefaultRoles(): Promise<void> {
  try {
    await prisma.role.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: 'ADMIN' },
    });
    await prisma.role.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: 'USER' },
    });
  } catch (error) {
    console.warn('Could not ensure default roles:', error);
  }
}

export async function login(email: string, password: string): Promise<string> {
  if (!email || !password) {
    throw new InvalidCredentialsError('Email and password are required.');
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
    },
    include: {
      role: true,
    },
  });

  // If no user is found or the password does not match
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new InvalidCredentialsError('Invalid credentials provided.');
  }

  // Generate and return JWT token
  return setUserJWT(user);
}
