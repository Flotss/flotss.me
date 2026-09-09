import type React from 'react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export interface AuthenticatedUser {
  id: string;
  email: string;
  admin: boolean;
}

export interface WithAuthProps {
  user?: AuthenticatedUser | null;
}

const withAuth = <P extends object>(WrappedComponent: React.ComponentType<P & WithAuthProps>) => {
  const ComponentWithAuth = (props: P) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<AuthenticatedUser | null>(null);

    useEffect(() => {
      let isMounted = true;

      const checkAuth = async () => {
        try {
          const res = await fetch('/api/auth/me');
          if (!res.ok) {
            if (isMounted) {
              router.replace('/admin');
            }
            return;
          }

          const data = await res.json();
          if (data.authenticated && data.user) {
            if (isMounted) {
              setUser(data.user);
              setLoading(false);
            }
          } else {
            if (isMounted) {
              router.replace('/admin');
            }
          }
        } catch {
          if (isMounted) {
            router.replace('/admin');
          }
        }
      };

      checkAuth();

      return () => {
        isMounted = false;
      };
    }, [router]);

    if (loading) {
      return (
        <div className="flex min-h-[65vh] w-full flex-col items-center justify-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent shadow-sm shadow-emerald-500/20" />
          <p className="text-sm font-medium tracking-wide text-zinc-400">
            Checking authentication...
          </p>
        </div>
      );
    }

    return <WrappedComponent {...props} user={user} />;
  };

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth;
