import * as jose from 'jose';

export interface AuthJWTPayload extends jose.JWTPayload {
  sub: string;
  email: string;
  admin: boolean;
}

const FALLBACK_SECRET = 'flotss-me-secure-default-jwt-secret-key-32-bytes-long';

export function getJwtSecretKey(): Uint8Array {
  const rawSecret = process.env.JWT_SECRET;
  if (!rawSecret) {
    return new TextEncoder().encode(FALLBACK_SECRET);
  }

  const utf8 = new TextEncoder().encode(rawSecret);
  if (utf8.length >= 32) {
    return utf8;
  }

  try {
    const b64 = Buffer.from(rawSecret, 'base64');
    if (b64.length >= 32) {
      return b64;
    }
  } catch {
    // Continue
  }

  return new TextEncoder().encode(rawSecret.padEnd(32, '!'));
}

export async function setUserJWT(user: {
  id: string;
  email: string;
  roleId?: number;
  role?: { name: string } | null;
}): Promise<string> {
  const isAdmin = user.roleId === 1 || user.role?.name === 'ADMIN';

  const token = await new jose.SignJWT({
    sub: user.id,
    email: user.email,
    admin: Boolean(isAdmin),
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(getJwtSecretKey());

  return token;
}

export async function verifyUserJWT(token: string): Promise<AuthJWTPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jose.jwtVerify(token, getJwtSecretKey());
    return payload as AuthJWTPayload;
  } catch {
    // Attempt fallback with base64 buffer in case token was signed with base64 secret
    const rawSecret = process.env.JWT_SECRET;
    if (rawSecret) {
      try {
        const b64 = Buffer.from(rawSecret, 'base64');
        const { payload } = await jose.jwtVerify(token, b64);
        return payload as AuthJWTPayload;
      } catch {
        // Fallback failed
      }
    }
    return null;
  }
}

export async function getUserFromJWT(token: string): Promise<string> {
  const verified = await verifyUserJWT(token);
  if (verified && verified.email) {
    return verified.email;
  }

  // Fallback to decode if signature verification failed
  try {
    const decoded = jose.decodeJwt(token);
    return (decoded as any)?.email ?? '';
  } catch {
    return '';
  }
}
