import { Container } from '@/components/StyledBox';
import withAuth from '@/components/auth/withAuth';
import Head from 'next/head';
import Router from 'next/router';
import { useState } from 'react';

function DashBoard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleLogin = () => {
    fetch('/api/post/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    }).then(async (res) => {
      if (res.ok) {
        Router.push('/admin/dashboard');
      } else if (res.status === 400) {
        const resJson = await res.json();
        setError(resJson.message);
      }
    });
  };

  const handleRegister = async () => {
    try {
      alert('Registration successful');
    } catch (error: any) {
      alert(error.message);
      setError(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <div className="flex w-screen flex-col items-center justify-center space-y-5 px-5 py-5 sm:px-20">
        <Container className="flex w-full items-center justify-evenly">
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
        </Container>
      </div>
    </>
  );
}

export default withAuth(DashBoard);
