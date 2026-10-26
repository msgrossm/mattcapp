/**
 * Driver Responsibility Assessment.
 *
 * Source: https://dmv.ny.gov/how-pay-driver-responsibility-assessment
 * Last verified: 2026-09-27 (PRD §3, §9).
 *
 * This is the one dollar figure TicketPath can compute, because New York
 * publishes the formula. Insurance premiums are NOT computable — insurers
 * file proprietary rating models and no public points-to-premium table
 * exists, so nothing here estimates one (PRD Story 1 AC3, §5, record 0002).
 */

export const DRA_SOURCE_URL =
  'https://dmv.ny.gov/how-pay-driver-responsibility-assessment';
export const DRA_VERIFIED_ON = '2026-09-27';

/** Points within this window count toward the assessment. */
export const DRA_WINDOW_MONTHS = 18;
/** The assessment starts at this many points. */
export const DRA_POINT_THRESHOLD = 6;

const DRA_BASE_PER_YEAR = 100;
const DRA_PER_EXTRA_POINT_PER_YEAR = 25;
const DRA_YEARS = 3;

export type DraAssessment = {
  totalPoints: number;
  thresholdCrossed: boolean;
  pointsUntilThreshold: number;
  /** Total owed across all three years, in whole dollars. */
  totalOwed: number;
  perYear: number;
  sourceUrl: string;
  verifiedOn: string;
};

/**
 * $100/year for three years at the 6-point threshold, plus $25/year for each
 * point above it. Returns zero dollars below the threshold.
 */
export function assessDra(totalPoints: number): DraAssessment {
  const crossed = totalPoints >= DRA_POINT_THRESHOLD;
  const extraPoints = crossed ? totalPoints - DRA_POINT_THRESHOLD : 0;
  const perYear = crossed
    ? DRA_BASE_PER_YEAR + extraPoints * DRA_PER_EXTRA_POINT_PER_YEAR
    : 0;

  return {
    totalPoints,
    thresholdCrossed: crossed,
    pointsUntilThreshold: crossed ? 0 : DRA_POINT_THRESHOLD - totalPoints,
    totalOwed: perYear * DRA_YEARS,
    perYear,
    sourceUrl: DRA_SOURCE_URL,
    verifiedOn: DRA_VERIFIED_ON,
  };
}

/** Tickets whose issue date falls inside the 18-month DRA window. */
export function withinDraWindow<T extends { issue_date: string | null }>(
  tickets: readonly T[],
  now: Date = new Date(),
): T[] {
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - DRA_WINDOW_MONTHS);

  return tickets.filter((t) => {
    if (!t.issue_date) return false;
    const issued = new Date(t.issue_date);
    return !Number.isNaN(issued.getTime()) && issued >= cutoff && issued <= now;
  });
}
