import { ExperienceType } from '@/types/types';
import { Box } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import React from 'react';
import { FaBriefcase, FaCalendarAlt, FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';
import { Container } from './StyledBox';
import Title from './Title';

interface CareerTimelineProps {
  experiences: ExperienceType[];
}

export default function CareerTimeline({ experiences }: CareerTimelineProps) {
  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <Container className="mx-5 my-12 px-4 sm:mx-20 sm:px-8">
      <Title title="Experience & Education" className="text-2xl mdrepo:text-4xl lgrepo:text-6xl" />

      <div className="relative mt-8 space-y-6 before:absolute before:bottom-0 before:left-3.5 before:top-3 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500 before:via-emerald-500/20 before:to-transparent sm:space-y-8 sm:before:left-4">
        {experiences.map((exp, index) => {
          const isEducation = exp.type === 'education';

          return (
            <motion.div
              key={exp.id || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-9 sm:pl-12"
            >
              {/* Timeline Node Dot */}
              <div
                className={`absolute left-0 top-1.5 flex h-7 w-7 items-center justify-center rounded-full border shadow-md transition-transform duration-300 hover:scale-110 sm:h-8 sm:w-8 ${
                  isEducation
                    ? 'border-blue-500/40 bg-blue-950/80 text-blue-400 shadow-blue-500/10'
                    : 'border-emerald-500/40 bg-zinc-950 text-emerald-400 shadow-emerald-500/10'
                }`}
              >
                {isEducation ? (
                  <FaGraduationCap className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                ) : (
                  <FaBriefcase className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                )}
              </div>

              {/* Experience Card */}
              <Box className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-500/30 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-emerald-500/5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-white transition-colors duration-200 group-hover:text-emerald-400 sm:text-lg">
                        {exp.title}
                      </h3>
                      <span className="text-xs font-semibold text-emerald-400/90 sm:text-sm">
                        @ {exp.company}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                      <span className="inline-flex items-center gap-1.5">
                        <FaCalendarAlt className="h-3 w-3 text-zinc-500" />
                        {exp.startDate} — {exp.current ? 'Present' : exp.endDate || 'Present'}
                      </span>
                      {exp.location && (
                        <span className="inline-flex items-center gap-1.5">
                          <FaMapMarkerAlt className="h-3 w-3 text-zinc-500" />
                          {exp.location}
                        </span>
                      )}
                    </div>
                  </div>

                  <span
                    className={`rounded-md px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${
                      isEducation
                        ? 'border border-blue-500/20 bg-blue-500/10 text-blue-300'
                        : 'border border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                    }`}
                  >
                    {isEducation ? 'Education' : 'Work'}
                  </span>
                </div>

                {exp.description && (
                  <p className="mt-3 text-xs leading-relaxed text-zinc-300 sm:text-sm">
                    {exp.description}
                  </p>
                )}

                {exp.skills && (
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-white/5 pt-3">
                    {exp.skills.split(',').map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[11px] font-medium text-zinc-300 transition-colors duration-200 group-hover:border-white/10"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </Box>
            </motion.div>
          );
        })}
      </div>
    </Container>
  );
}
