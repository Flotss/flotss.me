import { SocialLinkType } from '@/types/types';
import { useRouter } from 'next/router';
import { AnimatePresence, motion, useReducedMotion, Variants } from 'framer-motion';
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
  const shouldReduceMotion = useReducedMotion();

  const pageVariants: Variants = {
    initial: shouldReduceMotion
      ? { opacity: 0 }
      : {
          opacity: 0,
          scale: 0.965,
          y: 18,
        },
    animate: shouldReduceMotion
      ? {
          opacity: 1,
          transition: {
            duration: 0.22,
            ease: 'easeOut',
          },
        }
      : {
          opacity: 1,
          scale: 1,
          y: 0,
          transition: {
            duration: 0.28,
            ease: [0.22, 1, 0.36, 1] as const,
          },
        },
    exit: shouldReduceMotion
      ? {
          opacity: 0,
          transition: {
            duration: 0.15,
            ease: 'easeIn',
          },
        }
      : {
          opacity: 0,
          scale: 1.025,
          y: -14,
          transition: {
            duration: 0.18,
            ease: [0.32, 0, 0.67, 0] as const,
          },
        },
  };

  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col overflow-x-hidden">
        <AnimatePresence
          mode="wait"
          initial={false}
          onExitComplete={() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        >
          <motion.div
            key={pageKey}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
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
