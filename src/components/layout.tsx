import { SocialLinkType } from '@/types/types';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import Footer from './Footer';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
  socialLinks?: SocialLinkType[];
}

export default function Layout({ children, socialLinks }: LayoutProps): React.ReactNode {
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
      <Footer initialSocialLinks={socialLinks} />
    </>
  );
}
