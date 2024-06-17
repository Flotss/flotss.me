import { StyledBox } from '@/components/StyledBox';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function LoginPage(props: any) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get cookie 'UserJWT' and check if it exists
    const token = localStorage.getItem('UserJWT');
    console.log('Token:', token);
    if (token) {
      router.push('/admin/dashboard');
    }
  }, [router]);

  const handleLogin = async () => {
    try {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then(async (response) => {
        if (!response.ok && response.status === 400) {
          const errorData = await response.json();
          setError(errorData.message || 'Login failed');
        } else {
          router.push('/admin/dashboard');
        }
      });
    } catch (error: any) {
      setError(error.message);
    }
  };

  const handleRegister = async () => {
    try {
      alert('Registration successful');
      fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).then(async (response) => {
        if (!response.ok && response.status === 400) {
          const errorData = await response.json();
          setError(errorData.message || 'Registration failed');
        } else {
          router.push('/admin/dashboard');
        }
      });
    } catch (error: any) {
      alert(error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Login admin</title>
      </Head>
      <div className="flex w-screen flex-col items-center justify-center space-y-5 px-5 py-5 sm:px-20">
        <StyledBox className="flex w-full items-center justify-evenly">
          <div
            className="flex w-96 flex-col items-center justify-center space-y-5"
            hidden={!isLogin}
          >
            <h1 className="text-center text-3xl font-bold">Login</h1>
            <form className="flex w-full flex-col space-y-5 text-black">
              <input
                type="email"
                placeholder="Email"
                className="rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Password"
                className="rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogin();
                }}
                className="rounded-md bg-blue-500 p-3 font-semibold text-white focus:outline-none"
              >
                Login
              </button>
              <p className="text-center text-sm text-white">
                Don&apos;t have an account?{' '}
                <span className="cursor-pointer text-blue-500" onClick={() => setIsLogin(false)}>
                  Register
                </span>
              </p>
            </form>
            {error && <p className="text-red text-center text-sm font-semibold">{error}</p>}
          </div>
          <div
            className="flex w-96 flex-col items-center justify-center space-y-5"
            hidden={isLogin}
          >
            <h1 className="text-center text-3xl font-bold">Register</h1>
            <form className="flex w-full flex-col space-y-5 text-black" onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                className="rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                type="password"
                placeholder="Password"
                className="rounded-md border border-gray-300 p-3 focus:border-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
                className="rounded-md bg-blue-500 p-3 font-semibold text-white focus:outline-none"
              >
                Register
              </button>
              <p className="text-center text-sm text-white">
                Already have an account?{' '}
                <span className="cursor-pointer text-blue-500" onClick={() => setIsLogin(true)}>
                  Login
                </span>
              </p>
            </form>
            {error && <p className="text-red text-center text-sm font-semibold">{error}</p>}
          </div>
        </StyledBox>
      </div>
    </>
  );
}
