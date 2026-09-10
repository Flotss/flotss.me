import SEO from '@/components/SEO';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { FaLock, FaSignInAlt } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Automatically redirect if already logged in
  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => {
        if (res.ok) return res.json();
        return { authenticated: false };
      })
      .then((data) => {
        if (isMounted) {
          if (data.authenticated) {
            router.replace('/admin/dashboard');
          } else {
            setCheckingAuth(false);
          }
        }
      })
      .catch(() => {
        if (isMounted) setCheckingAuth(false);
      });

    return () => {
      isMounted = false;
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || 'Login failed');
        setLoading(false);
        return;
      }

      setSuccess('Login successful! Redirecting...');

      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 600);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent shadow-sm shadow-emerald-500/20" />
      </div>
    );
  }

  return (
    <>
      <SEO page="admin" />
      <div className="relative flex min-h-[75vh] w-full items-center justify-center px-4 py-12">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl filter" />

        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-zinc-950/80 p-8 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-10">
          {/* Header */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/10">
              <FaLock className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Back Office
            </h1>
            <p className="mt-1 text-sm text-zinc-400">Sign in to access repository management</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@flotss.me"
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-zinc-300">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                minLength={6}
                className="w-full rounded-xl border border-white/10 bg-zinc-900/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 transition-all focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                {success}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
              ) : (
                <>
                  <FaSignInAlt className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
