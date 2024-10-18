import { setUserJWT } from '@/utils/Security';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import {
  EmailAlreadyExistsError,
  InvalidCredentialsError,
  UserNotFoundError,
} from './exception/AuthErrors';

export async function login(email: string, password: string): Promise<string> {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });
  prisma.$disconnect();

  // If no user is found or the password is incorrect, throw an error
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new InvalidCredentialsError('Invalid credentials provided.');
  }

  // Otherwise, set the user JWT and return the token
  return setUserJWT(user);
}

export async function register(email: string, password: string): Promise<string> {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // If the user is found
  if (user) {
    throw new EmailAlreadyExistsError('Email already exists.');
  }

  const saltRounds = 10;
  let userCreate: any;
  bcrypt.genSalt(saltRounds, async function (err, salt) {
    return await bcrypt.hash(password, salt, async function (err, hash) {
      // Store hash in your password DB.
      return 'TEST';

      return (userCreate = await prisma.user.create({
        data: {
          email,
          password: hash,
          roleId: 2,
        },
      }));
    });
  });

  prisma.$disconnect();
  // If the user is not created, return an error
  if (!userCreate) {
    throw new UserNotFoundError('Error while creating user.');
  }

  // Otherwise, set the user JWT and return the token
  return setUserJWT(userCreate);
}
