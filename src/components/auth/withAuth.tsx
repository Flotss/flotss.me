import { useEffect } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: React.ComponentType<any>) => {
    const ComponentWithAuth = (props: any) => {
        const router = useRouter();

        useEffect(() => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/admin');
            }
        }, [router]);

        return <WrappedComponent {...props} />;
    };

    ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

    return ComponentWithAuth;
};

export default withAuth;
