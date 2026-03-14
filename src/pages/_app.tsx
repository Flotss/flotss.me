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
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </div>
      </div>
    </ChakraProvider>
  );
}
