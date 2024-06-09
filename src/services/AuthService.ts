import { PrismaClient } from "@prisma/client";
import {
  UserAlreadyExistsError,
  UserNotFoundError,
} from "./exception/AuthErrors";
import { hashPassword, setUserJWT } from "@/utils/Security";

export async function login(email: string, password: string): Promise<string> {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      email,
      password: await hashPassword(password),
    },
  });

  // If no user is found, return null
  if (!user) {
    throw new UserNotFoundError("Invalid credentials provided.");
  }

  // Otherwise, set the user JWT and return the token
  return setUserJWT(user);
}

export async function register(
  email: string,
  password: string
): Promise<string> {
  const prisma = new PrismaClient();
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  // If the user is found
  if (user) {
    throw new UserAlreadyExistsError("User already exists.");
  }

  const userCreate = await prisma.user.create({
    data: {
      email,
      password: await hashPassword(password),
      roleId: 2,
    },
  });

  // If the user is not created, return an error
  if (!userCreate) {
    throw new UserNotFoundError("Error while creating user.");
  }

  // Otherwise, set the user JWT and return the token
  return setUserJWT(userCreate);
}
