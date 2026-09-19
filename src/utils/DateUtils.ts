const MONTH_MAP: Record<string, number> = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
};

const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Converts a date string (e.g. "Oct 2023", "2023-10", "2023", "Present") into a comparable number (YYYYMM).
 * For "Present", returns a high number so it sorts as current/newest.
 */
export function parseDateToValue(dateStr: string | null | undefined): number {
  if (!dateStr) return 0;
  const trimmed = dateStr.trim();
  if (!trimmed) return 0;
  if (trimmed.toLowerCase() === 'present') return 999912;

  // Handle ISO YYYY-MM
  if (/^\d{4}-\d{1,2}$/.test(trimmed)) {
    const [y, m] = trimmed.split('-').map((n) => parseInt(n, 10));
    return y * 100 + m;
  }

  // Handle "Month YYYY" or "YYYY Month"
  const tokens = trimmed.split(/[\s\-_/]+/).filter(Boolean);
  if (tokens.length >= 2) {
    let year = 0;
    let month = 1;

    for (const t of tokens) {
      const lower = t.toLowerCase();
      if (MONTH_MAP[lower]) {
        month = MONTH_MAP[lower];
      } else {
        const parsedYear = parseInt(t, 10);
        if (!isNaN(parsedYear) && parsedYear >= 1900 && parsedYear <= 2100) {
          year = parsedYear;
        }
      }
    }

    if (year > 0) {
      return year * 100 + month;
    }
  }

  // Handle single year "YYYY"
  const singleYear = parseInt(trimmed, 10);
  if (!isNaN(singleYear) && singleYear >= 1900 && singleYear <= 2100) {
    return singleYear * 100 + 1;
  }

  return 0;
}

/**
 * Formats Month + Year into a clean standardized string (e.g. "Oct 2023")
 */
export function formatMonthYear(monthNum: number, yearNum: number): string {
  const safeMonth = Math.min(Math.max(monthNum, 1), 12);
  return `${MONTH_NAMES[safeMonth - 1]} ${yearNum}`;
}

/**
 * Checks if two date intervals [startA, endA] and [startB, endB] genuinely overlap.
 * Both intervals must share at least `minOverlapMonths` (default 1) of concurrent time.
 * @deprecated For timeline experience clustering, prefer using `doExperiencesOverlap`.
 */
export function areIntervalsOverlapping(
  startAStr: string | null | undefined,
  endAStr: string | null | undefined,
  startBStr: string | null | undefined,
  endBStr: string | null | undefined,
  minOverlapMonths = 1,
): boolean {
  const startA = parseDateToValue(startAStr);
  const endA = endAStr ? parseDateToValue(endAStr) : startA;
  const startB = parseDateToValue(startBStr);
  const endB = endBStr ? parseDateToValue(endBStr) : startB;

  if (startA === 0 || startB === 0) return false;

  // Real overlap interval: [max(startA, startB), min(endA, endB)]
  const overlapStart = Math.max(startA, startB);
  const overlapEnd = Math.min(endA, endB);

  if (overlapStart > overlapEnd) {
    return false;
  }

  // Calculate approximate months of overlap
  const startYear = Math.floor(overlapStart / 100);
  const startMonth = overlapStart % 100;
  const endYear = Math.floor(overlapEnd / 100);
  const endMonth = overlapEnd % 100;

  const overlapDurationMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
  return overlapDurationMonths >= minOverlapMonths;
}

/**
 * Checks if an experience is currently active/ongoing.
 * Returns true if current is true, or if endDate explicitly equals 'Present' (or 'Actuel' / 'En cours').
 * If current is explicitly false, it is NEVER considered ongoing.
 */
export function isExperienceOngoing(exp: { endDate?: string | null; current?: boolean }): boolean {
  if (exp.current === true) return true;
  if (exp.current === false) return false;
  if (!exp.endDate) return false;
  const trimmed = exp.endDate.trim().toLowerCase();
  return trimmed === 'present' || trimmed === 'actuel' || trimmed === 'en cours';
}

/**
 * Checks if two experiences overlap or if one is contained within the other.
 */
export function doExperiencesOverlap(
  a: { startDate: string; endDate?: string | null; current?: boolean },
  b: { startDate: string; endDate?: string | null; current?: boolean },
): boolean {
  const startA = parseDateToValue(a.startDate);
  const endA = isExperienceOngoing(a) ? 999912 : parseDateToValue(a.endDate) || startA;

  const startB = parseDateToValue(b.startDate);
  const endB = isExperienceOngoing(b) ? 999912 : parseDateToValue(b.endDate) || startB;

  if (startA === 0 || startB === 0) return false;

  // Overlap or containment: [max(startA, startB), min(endA, endB)]
  const overlapStart = Math.max(startA, startB);
  const overlapEnd = Math.min(endA, endB);

  return overlapStart <= overlapEnd;
}
