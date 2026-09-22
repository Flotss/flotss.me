import { ExperienceType } from '@/types/types';
import { isExperienceOngoing } from '@/utils/DateUtils';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React from 'react';
import {
  FaBriefcase,
  FaCalendarAlt,
  FaCheckCircle,
  FaGraduationCap,
  FaMapMarkerAlt,
} from 'react-icons/fa';

interface ExperienceCardProps {
  experience: ExperienceType;
}

export default function ExperienceCard({ experience }: ExperienceCardProps) {
  const isEducation = experience.type === 'education';
  const isCurrent = isExperienceOngoing(experience);

  const hasExplicitEnd = Boolean(
    experience.endDate && experience.endDate.trim().toLowerCase() !== 'present',
  );
  const dateLabel = isCurrent
    ? `${experience.startDate} — Present`
    : hasExplicitEnd
      ? `${experience.startDate} — ${experience.endDate}`
      : experience.startDate;

  // Parse highlights
  let highlightsList: string[] = [];
  if (experience.highlights) {
    try {
      const parsed = JSON.parse(experience.highlights);
      if (Array.isArray(parsed)) {
        highlightsList = parsed;
      } else if (typeof parsed === 'string') {
        highlightsList = parsed.split('\n').filter((s) => s.trim().length > 0);
      }
    } catch {
      highlightsList = experience.highlights.split('\n').filter((s) => s.trim().length > 0);
    }
  }

  // Skills array
  const skillsList = experience.skills
    ? experience.skills
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`group relative w-full rounded-2xl border transition-all duration-300 ${
        isEducation
          ? 'border-white/5 bg-gradient-to-b from-blue-950/15 via-zinc-900/30 to-zinc-950/60 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/5'
          : 'border-white/5 bg-gradient-to-b from-emerald-950/15 via-zinc-900/30 to-zinc-950/60 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5'
      } p-6 backdrop-blur-xl`}
    >
      {/* Top Bar: Logo, Title, Dates, Badges */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          {/* Logo / Vector Icon */}
          <div
            className={`relative flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border p-2 shadow-inner transition-transform duration-300 group-hover:scale-105 ${
              isEducation
                ? 'border-blue-500/30 bg-blue-950/50 text-blue-400 shadow-blue-950'
                : 'border-emerald-500/30 bg-emerald-950/50 text-emerald-400 shadow-emerald-950'
            }`}
          >
            {experience.logoUrl ? (
              <Image
                src={experience.logoUrl}
                alt={experience.company}
                width={40}
                height={40}
                className="max-h-8 max-w-8 object-contain"
                unoptimized
              />
            ) : isEducation ? (
              <FaGraduationCap className="h-5 w-5 text-blue-400" />
            ) : (
              <FaBriefcase className="h-5 w-5 text-emerald-400" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3
                className={`text-base font-bold text-white transition-colors duration-200 sm:text-lg ${
                  isEducation ? 'group-hover:text-blue-300' : 'group-hover:text-emerald-400'
                }`}
              >
                {experience.title}
              </h3>
              <span
                className={`text-sm font-semibold ${
                  isEducation ? 'text-blue-400/90' : 'text-emerald-400/90'
                }`}
              >
                @ {experience.company}
              </span>
            </div>

            {/* Dates & Location */}
            <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-400">
              <span className="inline-flex items-center gap-1.5 font-medium text-zinc-300">
                <FaCalendarAlt className="h-3 w-3 text-zinc-500" />
                {dateLabel}
              </span>
              {experience.location && (
                <span className="inline-flex items-center gap-1.5 text-zinc-400">
                  <FaMapMarkerAlt className="h-3 w-3 text-zinc-500" />
                  {experience.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          {isCurrent && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400"></span>
              Active
            </span>
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
              isEducation
                ? 'border border-blue-500/30 bg-blue-500/10 text-blue-300'
                : 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
            }`}
          >
            {isEducation ? 'Education' : 'Work'}
          </span>
        </div>
      </div>

      {/* Summary Narrative */}
      {experience.description && (
        <p className="mt-4 text-xs leading-relaxed text-zinc-300 sm:text-sm">
          {experience.description}
        </p>
      )}

      {/* Highlights / Key Accomplishments Bullet Points */}
      {highlightsList.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-white/5 pt-3.5">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            Key Accomplishments & Responsibilities
          </p>
          <ul className="space-y-2">
            {highlightsList.map((highlight, hIdx) => {
              // Highlight bold metrics or prefixes (e.g. "Release Automation:")
              const parts = highlight.split(':');
              const hasPrefix = parts.length > 1 && parts[0].length < 35;

              return (
                <li
                  key={`exp-${experience.id}-hl-${hIdx}`}
                  className="flex items-start gap-2.5 text-xs text-zinc-300 sm:text-sm"
                >
                  <span
                    className={`mt-1 flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center rounded-full ${
                      isEducation ? 'text-blue-400' : 'text-emerald-400'
                    }`}
                  >
                    <FaCheckCircle className="h-3 w-3" />
                  </span>
                  <span className="leading-relaxed">
                    {hasPrefix ? (
                      <>
                        <strong className="font-semibold text-white">{parts[0]}:</strong>
                        {parts.slice(1).join(':')}
                      </>
                    ) : (
                      highlight
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Skills Tags */}
      {skillsList.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-1.5 border-t border-white/5 pt-3.5">
          {skillsList.map((skill, sIdx) => (
            <span
              key={`exp-${experience.id}-skill-${skill}-${sIdx}`}
              className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors duration-200 group-hover:border-white/10 group-hover:text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
