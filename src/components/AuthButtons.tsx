'use client';

import { signIn, signOut } from '@/utils/auth';

export const LoginButton = () => {
  return <button onClick={() => signIn()}>Login with GitHub</button>;
};

export const LogoutButton = () => {
  return <button onClick={() => signOut()}>Logout</button>;
};
