import { Container } from '@/components/StyledBox';
import { SiteSettingsType } from '@/types/types';
import { Grid } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React from 'react';
import { FaArrowRight, FaEnvelope, FaFileAlt } from 'react-icons/fa';

const HeroScene = dynamic(() => import('@/components/three/HeroScene'), {
  ssr: false,
});

interface HeroSectionProps {
  settings?: SiteSettingsType;
}

export default function HeroSection({ settings }: HeroSectionProps) {
  return (
    <Grid className="mx-5 grid grid-cols-2 grid-rows-1 space-y-5 pt-8 sm:mx-20 lg:space-x-5 lg:space-y-0">
      <Container className="col-span-2 space-y-4 py-12">
        <div className="relative min-h-[280px] sm:min-h-[340px]">
          <HeroScene />
          <div className="relative z-10 flex flex-col items-center justify-center pt-8">
            {/* Status Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-400"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              {settings?.availabilityText || 'Available for new opportunities'}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              <h1 className="text-center text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {settings?.heroHeadline ? (
                  settings.heroHeadline.includes('Florian Mangin') ? (
                    <>
                      {settings.heroHeadline.split('Florian Mangin')[0]}
                      <span className="text-emerald-400">Florian Mangin</span>
                      {settings.heroHeadline.split('Florian Mangin')[1]}
                    </>
                  ) : (
                    settings.heroHeadline
                  )
                ) : (
                  <>
                    Hello ! My name is <span className="text-emerald-400">Florian Mangin</span>
                  </>
                )}
              </h1>
            </motion.div>
            <motion.p
              className="mx-auto mt-4 max-w-[640px] text-center text-lg leading-relaxed text-zinc-400"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {settings?.heroSubtitle ||
                'Software Engineer passionate about crafting robust software, clean architectures, and modern web applications.'}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <a
                href="#projects"
                className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-zinc-950 transition-all duration-200 hover:bg-emerald-400 active:scale-95"
              >
                <span>View Projects</span>
                <FaArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.08] hover:text-white active:scale-95"
              >
                <FaEnvelope className="h-3.5 w-3.5 text-zinc-400" />
                <span>Contact Me</span>
              </Link>
              {settings?.resumeUrl && (
                <a
                  href={settings.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-2.5 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-95"
                >
                  <FaFileAlt className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Resume</span>
                </a>
              )}
            </motion.div>
          </div>
        </div>
      </Container>
    </Grid>
  );
}
