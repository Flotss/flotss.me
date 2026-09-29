import CareerTimeline from '@/components/experience/CareerTimeline';
import SEO from '@/components/SEO';
import Title from '@/components/Title';
import { prisma } from '@/lib/prisma';
import { ExperienceType, SiteSettingsType, SocialLinkType } from '@/types/types';
import type { GetStaticProps } from 'next';
import React, { useEffect, useState } from 'react';
import { FaDownload, FaFileAlt } from 'react-icons/fa';

interface ExperiencePageProps {
  initialExperiences: ExperienceType[];
  settings?: SiteSettingsType | null;
  socialLinks?: SocialLinkType[];
}

export default function ExperiencePage({
  initialExperiences = [],
  settings: ssgSettings,
}: ExperiencePageProps) {
  const [experiences, setExperiences] = useState<ExperienceType[]>(initialExperiences);
  const [settings, setSettings] = useState<SiteSettingsType | null | undefined>(ssgSettings);

  useEffect(() => {
    if (initialExperiences) {
      setExperiences(initialExperiences);
    }
  }, [initialExperiences]);

  useEffect(() => {
    if (ssgSettings) {
      setSettings(ssgSettings);
    }
  }, [ssgSettings]);

  useEffect(() => {
    const handleSettingsUpdated = (event: CustomEvent<SiteSettingsType> | Event) => {
      if ('detail' in event && event.detail) {
        setSettings(event.detail);
      }
    };
    window.addEventListener('siteSettingsUpdated', handleSettingsUpdated);
    return () => {
      window.removeEventListener('siteSettingsUpdated', handleSettingsUpdated);
    };
  }, []);

  return (
    <>
      <SEO page="experience" />

      <div className="min-h-screen py-10 sm:py-16">
        {/* Page Header */}
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            Professional Track & Academic Degree
          </div>

          <Title
            title="Experience & Education"
            className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl"
          />

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">
            Detailed walkthrough of full-stack engineering apprenticeships, distributed systems
            migrations, academic engineering curriculum, and international exchange.
          </p>

          {/* Quick Resume CTA Button */}
          {settings?.resumeUrl && (
            <div className="mt-6 flex justify-center">
              <a
                href={settings.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold text-zinc-200 shadow-md backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                <FaFileAlt className="h-3.5 w-3.5" />
                <span>View Full Resume</span>
                <FaDownload className="h-3 w-3 text-zinc-500 transition-colors group-hover:text-emerald-400" />
              </a>
            </div>
          )}
        </div>

        {/* Vertical Interlocking Timeline */}
        <div className="mt-8">
          <CareerTimeline experiences={experiences} />
        </div>
      </div>
    </>
  );
}

export const getStaticProps: GetStaticProps<ExperiencePageProps> = async () => {
  try {
    const [experiences, settings, socialLinks] = await Promise.all([
      prisma.experience.findMany({
        where: { visible: true },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
      }),
      prisma.siteSettings.findUnique({
        where: { id: 1 },
        select: {
          id: true,
          availabilityText: true,
          heroHeadline: true,
          heroSubtitle: true,
          resumeUrl: true,
        },
      }),
      prisma.socialLink.findMany({
        where: { visible: true },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
      }),
    ]);

    return {
      props: {
        initialExperiences: JSON.parse(JSON.stringify(experiences)),
        settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
        socialLinks: JSON.parse(JSON.stringify(socialLinks || [])),
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps on /experience:', error);
    return {
      props: {
        initialExperiences: [],
        settings: null,
        socialLinks: [],
      },
      revalidate: 60,
    };
  }
};
