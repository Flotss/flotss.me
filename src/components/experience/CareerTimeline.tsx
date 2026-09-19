import ExperienceCard from '@/components/experience/ExperienceCard';
import { ExperienceType } from '@/types/types';
import { doExperiencesOverlap, isExperienceOngoing, parseDateToValue } from '@/utils/DateUtils';
import React, { useMemo, useState } from 'react';
import { FaBriefcase, FaGraduationCap, FaLayerGroup } from 'react-icons/fa';

interface CareerTimelineProps {
  experiences: ExperienceType[];
}

interface TimelineGroup {
  id: string;
  yearLabel: string;
  isPair: boolean;
  startDateVal: number;
  endDateVal: number;
  isCurrent: boolean;
  workItems: ExperienceType[];
  educationItems: ExperienceType[];
}

function getDynamicGroupRoleLabel(items: ExperienceType[], type: 'work' | 'education'): string {
  if (items.length === 0) return '';
  if (type === 'work') {
    if (items.length > 1) return '💼 Work Experiences';
    const t = items[0].title.toLowerCase();
    if (t.includes('apprenti')) return '💼 Apprenticeship';
    if (t.includes('intern') || t.includes('stage')) return '💼 Internship';
    if (t.includes('freelance') || t.includes('contract')) return '💼 Contract / Freelance';
    return '💼 Work Experience';
  } else {
    if (items.length > 1) return '🎓 Academics & Degrees';
    const t = items[0].title.toLowerCase();
    if (t.includes('master') || t.includes('ingénieur')) return '🎓 Master of Engineering';
    if (t.includes('dut') || t.includes('but') || t.includes('university'))
      return '🎓 University Degree';
    if (t.includes('exchange') || t.includes('échange')) return '🌍 Academic Exchange';
    return '🎓 Degree & Academics';
  }
}

function compareExperiencesReverseChronological(a: ExperienceType, b: ExperienceType): number {
  const isOngoingA = isExperienceOngoing(a);
  const isOngoingB = isExperienceOngoing(b);

  // Priority 1: Current / Ongoing experience comes first
  if (isOngoingA && !isOngoingB) return -1;
  if (!isOngoingA && isOngoingB) return 1;

  // Priority 2: Sort by startDate descending (most recent start date first)
  const startA = parseDateToValue(a.startDate);
  const startB = parseDateToValue(b.startDate);
  if (startB !== startA) {
    return startB - startA;
  }

  // Priority 3: If start dates are identical, compare end dates descending
  const endA = isOngoingA ? 999912 : parseDateToValue(a.endDate) || startA;
  const endB = isOngoingB ? 999912 : parseDateToValue(b.endDate) || startB;
  if (endB !== endA) {
    return endB - endA;
  }

  // Priority 4: Fallback to order or id
  return (a.order ?? a.id) - (b.order ?? b.id);
}

export default function CareerTimeline({ experiences }: CareerTimelineProps) {
  const [filter, setFilter] = useState<'all' | 'work' | 'education'>('all');

  // Group experiences into timeline blocks based on date overlap and containment
  const timelineGroups = useMemo<TimelineGroup[]>(() => {
    const list = filter === 'all' ? experiences : experiences.filter((e) => e.type === filter);
    if (!list || list.length === 0) return [];

    // Find connected components based on interval overlap/containment
    const visited = new Set<number>();
    const clusters: ExperienceType[][] = [];

    // Sort initial items reverse chronologically
    const initialSorted = [...list].sort(compareExperiencesReverseChronological);

    for (let i = 0; i < initialSorted.length; i++) {
      const exp = initialSorted[i];
      if (visited.has(exp.id)) continue;

      const cluster: ExperienceType[] = [exp];
      visited.add(exp.id);
      const queue = [exp];

      while (queue.length > 0) {
        const curr = queue.shift()!;
        for (let j = 0; j < initialSorted.length; j++) {
          const candidate = initialSorted[j];
          if (!visited.has(candidate.id) && doExperiencesOverlap(curr, candidate)) {
            visited.add(candidate.id);
            cluster.push(candidate);
            queue.push(candidate);
          }
        }
      }

      clusters.push(cluster);
    }

    // Convert each cluster into a TimelineGroup
    const groups: TimelineGroup[] = clusters.map((cluster, idx) => {
      const workItems = cluster
        .filter((e) => e.type === 'work')
        .sort(compareExperiencesReverseChronological);
      const educationItems = cluster
        .filter((e) => e.type === 'education')
        .sort(compareExperiencesReverseChronological);

      const isCurrent = cluster.some((e) => isExperienceOngoing(e));

      // Earliest start date & latest end date of the cluster
      let earliestStart = cluster[0].startDate;
      let earliestStartVal = parseDateToValue(cluster[0].startDate);
      let latestEnd = cluster[0].endDate;
      let latestEndVal = isExperienceOngoing(cluster[0])
        ? 999912
        : parseDateToValue(cluster[0].endDate);

      for (const item of cluster) {
        const sVal = parseDateToValue(item.startDate);
        if (sVal > 0 && (earliestStartVal === 0 || sVal < earliestStartVal)) {
          earliestStartVal = sVal;
          earliestStart = item.startDate;
        }
        const eVal = isExperienceOngoing(item) ? 999912 : parseDateToValue(item.endDate);
        if (eVal > latestEndVal) {
          latestEndVal = eVal;
          latestEnd = item.endDate;
        }
      }

      let endLabel = '';
      if (isCurrent) {
        endLabel = 'Present';
      } else if (latestEnd && latestEnd.trim().toLowerCase() !== 'present') {
        endLabel = latestEnd.trim();
      } else {
        endLabel = earliestStart;
      }

      const yearLabel =
        earliestStart === endLabel ? earliestStart : `${earliestStart} — ${endLabel}`;

      return {
        id: `cluster-${idx}-${cluster.map((e) => e.id).join('-')}`,
        yearLabel,
        isPair: workItems.length > 0 && educationItems.length > 0,
        startDateVal: earliestStartVal,
        endDateVal: latestEndVal,
        isCurrent,
        workItems,
        educationItems,
      };
    });

    // Sort timeline groups: active first, then start date descending
    return groups.sort((a, b) => {
      if (a.isCurrent && !b.isCurrent) return -1;
      if (!a.isCurrent && b.isCurrent) return 1;

      if (b.startDateVal !== a.startDateVal) {
        return b.startDateVal - a.startDateVal;
      }
      return b.endDateVal - a.endDateVal;
    });
  }, [experiences, filter]);

  if (!experiences || experiences.length === 0) {
    return (
      <div className="py-20 text-center text-sm text-zinc-400">
        No experiences currently published. Check back soon.
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      {/* Category Filter Tabs */}
      <div className="mb-14 flex items-center justify-center">
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-zinc-950/80 p-1.5 shadow-xl backdrop-blur-xl">
          <button
            onClick={() => setFilter('all')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              filter === 'all'
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FaLayerGroup className="h-3 w-3" />
            <span>All Timeline</span>
            <span
              className={`py-0.2 rounded-full px-1.5 text-[10px] ${
                filter === 'all' ? 'bg-zinc-950/20 text-zinc-950' : 'bg-white/5 text-zinc-400'
              }`}
            >
              {experiences.length}
            </span>
          </button>

          <button
            onClick={() => setFilter('work')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              filter === 'work'
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FaBriefcase className="h-3 w-3" />
            <span>Work</span>
            <span
              className={`py-0.2 rounded-full px-1.5 text-[10px] ${
                filter === 'work' ? 'bg-zinc-950/20 text-zinc-950' : 'bg-white/5 text-zinc-400'
              }`}
            >
              {experiences.filter((e) => e.type === 'work').length}
            </span>
          </button>

          <button
            onClick={() => setFilter('education')}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 ${
              filter === 'education'
                ? 'bg-blue-500 text-zinc-950 shadow-md shadow-blue-500/20'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <FaGraduationCap className="h-3.5 w-3.5" />
            <span>Education</span>
            <span
              className={`py-0.2 rounded-full px-1.5 text-[10px] ${
                filter === 'education' ? 'bg-zinc-950/20 text-zinc-950' : 'bg-white/5 text-zinc-400'
              }`}
            >
              {experiences.filter((e) => e.type === 'education').length}
            </span>
          </button>
        </div>
      </div>

      {/* Main Continuous Timeline */}
      <div className="relative">
        {/* Glowing Central Vertical Line (Desktop: Center / Mobile: Left) */}
        <div className="absolute bottom-6 left-4 top-6 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-500/40 to-emerald-500/20 lg:left-1/2 lg:-translate-x-1/2" />

        <div className="space-y-16">
          {timelineGroups.map((group) => {
            // Pair Item: Work & Education happening concurrently (e.g. Société Générale + ISEP + Hanze, or Dalkia + IUT)
            if (group.isPair) {
              return (
                <div key={group.id} className="relative">
                  {/* Central Timeline Milestone Node & Badge */}
                  <div className="relative mb-6 flex flex-col items-start pl-10 lg:items-center lg:pl-0">
                    {/* Glowing Node on the line */}
                    <div className="absolute left-1.5 top-2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-2 border-emerald-400 bg-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.9)] lg:static lg:mb-2.5 lg:translate-y-0">
                      <span
                        className={`h-2 w-2 rounded-full bg-emerald-400 ${
                          group.isCurrent ? 'animate-ping' : ''
                        }`}
                      />
                    </div>

                    <span className="rounded-full border border-emerald-500/30 bg-zinc-950/95 px-3.5 py-1 text-xs font-bold text-emerald-400 shadow-md backdrop-blur-md">
                      {group.yearLabel} • Simultaneous Work & Degree
                    </span>
                  </div>

                  {/* Side-by-Side Grid on Desktop / Stacked on Mobile */}
                  <div className="grid grid-cols-1 gap-6 pl-9 sm:pl-12 lg:grid-cols-2 lg:gap-12 lg:pl-0">
                    {/* Left Column: Work Experience(s) */}
                    <div className="flex flex-col items-start space-y-6">
                      <div className="hidden w-full px-1 text-left text-xs font-bold uppercase tracking-wider text-emerald-400 lg:block">
                        {getDynamicGroupRoleLabel(group.workItems, 'work')}
                      </div>
                      {group.workItems.map((item) => (
                        <ExperienceCard key={item.id} experience={item} />
                      ))}
                    </div>

                    {/* Right Column: Degree Education(s) */}
                    <div className="flex flex-col items-start space-y-6">
                      <div className="hidden w-full px-1 text-left text-xs font-bold uppercase tracking-wider text-blue-400 lg:block">
                        {getDynamicGroupRoleLabel(group.educationItems, 'education')}
                      </div>
                      {group.educationItems.map((item) => (
                        <ExperienceCard key={item.id} experience={item} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

            // Single Category: Either Work only or Education only
            const items = group.workItems.length > 0 ? group.workItems : group.educationItems;
            const isEdu = group.educationItems.length > 0;

            return (
              <div key={group.id} className="relative">
                {/* Milestone Node & Badge */}
                <div className="relative mb-6 flex flex-col items-start pl-10 lg:items-center lg:pl-0">
                  {/* Glowing Node on the line */}
                  <div
                    className={`absolute left-1.5 top-2 flex h-5 w-5 -translate-y-1/2 items-center justify-center rounded-full border-2 bg-zinc-950 shadow-[0_0_15px_rgba(52,211,153,0.8)] lg:static lg:mb-2.5 lg:translate-y-0 ${
                      isEdu ? 'border-blue-400 shadow-blue-500/50' : 'border-emerald-400'
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${isEdu ? 'bg-blue-400' : 'bg-emerald-400'} ${
                        group.isCurrent ? 'animate-ping' : ''
                      }`}
                    />
                  </div>

                  <span className="rounded-full border border-white/10 bg-zinc-950/95 px-3.5 py-1 text-xs font-semibold text-zinc-300 shadow-md backdrop-blur-md">
                    {group.yearLabel}
                  </span>
                </div>

                {/* Centered on Desktop / Left-padded on Mobile */}
                <div className="pl-9 sm:pl-12 lg:pl-0">
                  <div className="mx-auto max-w-2xl space-y-6">
                    {items.map((item) => (
                      <ExperienceCard key={item.id} experience={item} />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
