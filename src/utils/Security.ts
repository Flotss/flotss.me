import { User } from '@prisma/client';
import * as jose from 'jose';

export async function setUserJWT(user: User) {
  const token = new jose.SignJWT({
    sub: user.id,
    email: user.email,
    admin: user.roleId === 1,
  }).setProtectedHeader({ alg: 'HS256' });
  const tokenString = await token.sign(
    Buffer.from(process.env.JWT_SECRET ?? ('' as string), 'base64'),
  );

  return tokenString;
}

export async function getUserFromJWT(token: string): Promise<string> {
  const jwt = jose.decodeJwt(token);
  return (jwt.payload as any).email;
}
