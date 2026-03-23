import Layout from '@/components/layout';
import '@/styles/globals.css';
import '@/styles/scrollbar.css';
import '@/styles/markdown.css';
import { ChakraProvider } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeProvider, useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const ThreeBackground = dynamic(() => import('@/components/three/ThreeBackground'), {
  ssr: false,
});

/**
 * Renders the Three.js background only in dark mode to avoid wasting
 * GPU resources on a light background where it wouldn't be visible.
 * Must be a child of ThemeProvider to access useTheme().
 */
function DarkModeBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  // Before mount render in dark (SSR default), after mount check real theme
  if (!mounted || resolvedTheme === 'dark') {
    return <ThreeBackground />;
  }
  return null;
}

/**
 * Inner app shell that can access next-themes context.
 * Handles page transitions with Framer Motion AnimatePresence.
 */
function AppContent({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}) {
  const router = useRouter();

  return (
    <div
      className="bg-grid-pattern relative flex min-h-screen flex-col transition-colors duration-300
        bg-[#f4f4f5] text-zinc-900
        dark:bg-[#050505] dark:text-[#e4e4e7]"
    >
      <DarkModeBackground />

      <div className="relative z-10 flex flex-1 flex-col">
        <Layout>
          {/* Page-level fade + slide transition on route change */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={router.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </Layout>
      </div>
    </div>
  );
}

export default function App({
  Component,
  pageProps,
}: {
  Component: React.ComponentType;
  pageProps: Record<string, unknown>;
}) {
  return (
    // attribute="class" → next-themes adds/removes "dark" class on <html>
    // defaultTheme="dark" → keeps the current dark aesthetic as default
    // enableSystem={false} → don't auto-follow OS preference (can be changed later)
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <ChakraProvider>
        <AppContent Component={Component} pageProps={pageProps} />
      </ChakraProvider>
    </ThemeProvider>
  );
}
