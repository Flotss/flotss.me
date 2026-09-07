import React from 'react';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import Footer from './Footer';
import Header from './Header';

/**
 * The Layout component provides a consistent structure for web pages within the application.
 * It includes a header, animated page content, and a footer.
 *
 * @param {Object} props - The component's props.
 * @param {React.ReactNode} props.children - The content to be rendered within the main content area.
 * @returns {React.ReactNode} - The rendered Layout component.
 */
export default function Layout({ children }: { children: React.ReactNode }): React.ReactNode {
  const router = useRouter();
  const pageKey = router.asPath.split('?')[0];

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={pageKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="flex flex-1 flex-col"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  );
}
