import {
  parseDateToValue,
  formatMonthYear,
  areIntervalsOverlapping,
  doExperiencesOverlap,
  isExperienceOngoing,
} from '@/utils/DateUtils';

describe('DateUtils', () => {
  describe('parseDateToValue', () => {
    it('should parse "Oct 2023" correctly to 202310', () => {
      expect(parseDateToValue('Oct 2023')).toBe(202310);
      expect(parseDateToValue('October 2023')).toBe(202310);
    });

    it('should parse ISO "2023-10" to 202310', () => {
      expect(parseDateToValue('2023-10')).toBe(202310);
    });

    it('should parse "Feb 2026" to 202602', () => {
      expect(parseDateToValue('Feb 2026')).toBe(202602);
    });

    it('should parse year only "2021" to 202101', () => {
      expect(parseDateToValue('2021')).toBe(202101);
    });

    it('should assign a high comparable value to "Present"', () => {
      expect(parseDateToValue('Present')).toBeGreaterThan(203000);
    });

    it('should handle null, undefined, or empty string gracefully', () => {
      expect(parseDateToValue(null)).toBe(0);
      expect(parseDateToValue(undefined)).toBe(0);
      expect(parseDateToValue('')).toBe(0);
    });
  });

  describe('formatMonthYear', () => {
    it('should format month and year into clean string', () => {
      expect(formatMonthYear(10, 2023)).toBe('Oct 2023');
      expect(formatMonthYear(2, 2026)).toBe('Feb 2026');
      expect(formatMonthYear(1, 2021)).toBe('Jan 2021');
    });
  });

  describe('areIntervalsOverlapping', () => {
    it('should return true for simultaneous Société Générale and ISEP (2023 to 2026)', () => {
      const sgStart = 'Oct 2023';
      const sgEnd = 'Sep 2026';
      const isepStart = 'Oct 2023';
      const isepEnd = 'Sep 2026';

      expect(areIntervalsOverlapping(sgStart, sgEnd, isepStart, isepEnd)).toBe(true);
    });

    it('should return false for Dalkia (Feb-Apr 2023) and Hanze (Feb-Apr 2026)', () => {
      const dalkiaStart = 'Feb 2023';
      const dalkiaEnd = 'Apr 2023';
      const hanzeStart = 'Feb 2026';
      const hanzeEnd = 'Apr 2026';

      expect(areIntervalsOverlapping(dalkiaStart, dalkiaEnd, hanzeStart, hanzeEnd)).toBe(false);
    });

    it('should return false when periods do not overlap', () => {
      expect(areIntervalsOverlapping('Jan 2021', 'Jun 2022', 'Jul 2022', 'Dec 2023')).toBe(false);
    });
  });

  describe('Solution 1 Chronological Sorting', () => {
    it('should correctly sort Dalkia (Feb 2023) BEFORE IUT Nancy (Sep 2021)', () => {
      const dalkia = {
        title: 'Dalkia',
        startDate: 'Feb 2023',
        endDate: 'Apr 2023',
        current: false,
      };
      const iut = {
        title: 'IUT',
        startDate: 'Sep 2021',
        endDate: 'Jun 2023',
        current: false,
      };

      const startDalkia = parseDateToValue(dalkia.startDate);
      const startIUT = parseDateToValue(iut.startDate);

      expect(startDalkia).toBeGreaterThan(startIUT);
    });

    it('should sort Hanze (Feb 2026) before Dalkia (Feb 2023)', () => {
      const hanzeStart = parseDateToValue('Feb 2026');
      const dalkiaStart = parseDateToValue('Feb 2023');

      expect(hanzeStart).toBeGreaterThan(dalkiaStart);
    });
  });

  describe('doExperiencesOverlap', () => {
    it('should detect Dalkia (Feb 2023 — Apr 2023) as contained within IUT Nancy (Sep 2021 — Jun 2023)', () => {
      const dalkia = { startDate: 'Feb 2023', endDate: 'Apr 2023', current: false };
      const iut = { startDate: 'Sep 2021', endDate: 'Jun 2023', current: false };

      expect(doExperiencesOverlap(dalkia, iut)).toBe(true);
      expect(doExperiencesOverlap(iut, dalkia)).toBe(true);
    });

    it('should detect Hanze (Feb 2026 — Apr 2026) as contained within Société Générale (Oct 2023 — Sep 2026)', () => {
      const hanze = { startDate: 'Feb 2026', endDate: 'Apr 2026', current: false };
      const sg = { startDate: 'Oct 2023', endDate: 'Sep 2026', current: true };

      expect(doExperiencesOverlap(hanze, sg)).toBe(true);
      expect(doExperiencesOverlap(sg, hanze)).toBe(true);
    });

    it('should detect Société Générale and ISEP (both Oct 2023 — Sep 2026) as overlapping', () => {
      const sg = { startDate: 'Oct 2023', endDate: 'Sep 2026', current: true };
      const isep = { startDate: 'Oct 2023', endDate: 'Sep 2026', current: true };

      expect(doExperiencesOverlap(sg, isep)).toBe(true);
    });

    it('should detect Hanze as overlapping with Société Générale when current is true or endDate reaches 2026', () => {
      const hanze = { startDate: 'Feb 2026', endDate: 'Apr 2026', current: false };
      const sgActive = { startDate: 'Oct 2023', endDate: null, current: true };
      const sgExpected = { startDate: 'Oct 2023', endDate: 'Sep 2026', current: false };

      expect(doExperiencesOverlap(hanze, sgActive)).toBe(true);
      expect(doExperiencesOverlap(sgActive, hanze)).toBe(true);
      expect(doExperiencesOverlap(hanze, sgExpected)).toBe(true);
      expect(doExperiencesOverlap(sgExpected, hanze)).toBe(true);
    });

    it('should return false for experiences in disjoint time periods', () => {
      const dalkia = { startDate: 'Feb 2023', endDate: 'Apr 2023', current: false };
      const hanze = { startDate: 'Feb 2026', endDate: 'Apr 2026', current: false };

      expect(doExperiencesOverlap(dalkia, hanze)).toBe(false);
      expect(doExperiencesOverlap(hanze, dalkia)).toBe(false);
    });
  });

  describe('isExperienceOngoing', () => {
    it('should return true if current is true', () => {
      expect(isExperienceOngoing({ current: true, endDate: 'Sep 2026' })).toBe(true);
      expect(isExperienceOngoing({ current: true, endDate: null })).toBe(true);
      expect(isExperienceOngoing({ current: true, endDate: '' })).toBe(true);
    });

    it('should return false if current is explicitly false, even if endDate is null or empty', () => {
      expect(isExperienceOngoing({ endDate: null, current: false })).toBe(false);
      expect(isExperienceOngoing({ endDate: undefined, current: false })).toBe(false);
      expect(isExperienceOngoing({ endDate: '', current: false })).toBe(false);
    });

    it('should return true if current is undefined but endDate is "Present" (case insensitive)', () => {
      expect(isExperienceOngoing({ endDate: 'Present' })).toBe(true);
      expect(isExperienceOngoing({ endDate: 'present' })).toBe(true);
      expect(isExperienceOngoing({ endDate: 'Actuel' })).toBe(true);
      expect(isExperienceOngoing({ endDate: 'En cours' })).toBe(true);
    });

    it('should return false if endDate is a past date and current is false', () => {
      expect(isExperienceOngoing({ endDate: 'Apr 2023', current: false })).toBe(false);
      expect(isExperienceOngoing({ endDate: 'Jun 2023', current: false })).toBe(false);
    });
  });
});
