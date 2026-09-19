import { SiteSettingsType } from '@/types/types';
import { motion } from 'framer-motion';
import Link from 'next/link';
import React from 'react';
import { FaArrowRight, FaBriefcase, FaDownload, FaEnvelope, FaFileAlt } from 'react-icons/fa';

interface HomeBottomCTAProps {
  settings?: SiteSettingsType | null;
}

export default function HomeBottomCTA({ settings }: HomeBottomCTAProps) {
  return (
    <section className="relative mx-5 mb-16 mt-4 px-0 sm:mx-20 sm:mb-20 sm:mt-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900/50 via-zinc-950/70 to-zinc-950/95 p-6 text-center shadow-2xl backdrop-blur-2xl sm:p-10 lg:p-12"
      >
        {/* Ambient Emerald Glow Highlight */}
        <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-emerald-500/15 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-3xl">
          {/* Status Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span>{settings?.availabilityText || 'Available for new opportunities'}</span>
          </div>

          {/* Headline */}
          <h2 className="text-2xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Let&apos;s Build Something Impactful Together
          </h2>

          {/* Subtitle */}
          <p className="mx-auto mt-4 max-w-xl text-xs leading-relaxed text-zinc-400 sm:text-sm md:text-base">
            Looking for a software engineer with enterprise full-stack expertise, distributed
            systems migrations, and proven delivery? Let&apos;s connect or explore my background.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-3 text-xs font-bold text-zinc-950 shadow-lg shadow-emerald-500/20 transition-all duration-200 hover:bg-emerald-400 active:scale-95 sm:text-sm"
            >
              <FaEnvelope className="h-3.5 w-3.5" />
              <span>Get in Touch</span>
              <FaArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>

            {settings?.resumeUrl && (
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 text-xs font-semibold text-zinc-200 backdrop-blur-md transition-all duration-200 hover:border-emerald-500/30 hover:bg-emerald-500/10 hover:text-emerald-300 active:scale-95 sm:text-sm"
              >
                <FaFileAlt className="h-3.5 w-3.5 text-emerald-400" />
                <span>View Full Resume</span>
                <FaDownload className="h-3 w-3 text-zinc-500 transition-colors group-hover:text-emerald-400" />
              </a>
            )}

            <Link
              href="/experience"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/60 px-5 py-3 text-xs font-medium text-zinc-400 transition-all duration-200 hover:border-white/20 hover:text-zinc-200 active:scale-95 sm:text-sm"
            >
              <FaBriefcase className="h-3.5 w-3.5 text-zinc-500" />
              <span>Career Timeline</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
