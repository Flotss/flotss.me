import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/scrollbar.css';
import '@/styles/markdown.css';
import { ChakraProvider } from '@chakra-ui/react';
import dynamic from 'next/dynamic';
import React from 'react';

const ThreeBackground = dynamic(() => import('@/components/three/ThreeBackground'), {
  ssr: false,
});

// Suppress upstream Three.js r183 deprecation noise from @react-three/fiber's internal THREE.Clock usage
if (typeof window !== 'undefined') {
  const originalWarn = console.warn;
  console.warn = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('THREE.Clock: This module has been deprecated')
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

export default function App({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: any;
}) {
  return (
    <ChakraProvider>
      <div className="bg-grid-pattern relative flex min-h-screen flex-col bg-[#050505] text-[#e4e4e7]">
        <ThreeBackground />
        <div className="relative z-10 flex flex-1 flex-col">
          <Layout socialLinks={pageProps?.socialLinks}>
            <Component {...pageProps} />
          </Layout>
        </div>
      </div>
    </ChakraProvider>
  );
}
