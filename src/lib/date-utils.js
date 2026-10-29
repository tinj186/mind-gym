/**
 * Timezone and Date Utilities for Mind Gym
 * Provides robust, IANA-aware calendar calculations for streaks and daily goals.
 */

const DEFAULT_TIMEZONE = 'Asia/Singapore';

/**
 * Validates and normalizes an IANA timezone string.
 * Falls back to 'Asia/Singapore' if invalid or empty.
 */
export function normalizeTimeZone(timeZone) {
  if (!timeZone || typeof timeZone !== 'string') return DEFAULT_TIMEZONE;
  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return timeZone;
  } catch {
    return DEFAULT_TIMEZONE;
  }
}

/**
 * Returns the calendar date string ("YYYY-MM-DD") in the specified timezone.
 *
 * @param {Date} date
 * @param {string} timeZone IANA timezone (e.g. 'Asia/Singapore')
 * @returns {string} e.g. "2026-10-29"
 */
export function getUserLocalDateStr(date = new Date(), timeZone = DEFAULT_TIMEZONE) {
  const safeTz = normalizeTimeZone(timeZone);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: safeTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(date);
}

/**
 * Calculates calendar day difference between two dates in the user's timezone.
 *
 * @param {Date} currentDate
 * @param {Date|string|null} previousDate
 * @param {string} timeZone
 * @returns {number|null} 0 = same day, 1 = yesterday, >1 = 2+ days ago
 */
export function getCalendarDaysDiff(currentDate = new Date(), previousDate, timeZone = DEFAULT_TIMEZONE) {
  if (!previousDate) return null;
  const prev = previousDate instanceof Date ? previousDate : new Date(previousDate);
  if (isNaN(prev.getTime())) return null;

  const safeTz = normalizeTimeZone(timeZone);
  const s1 = getUserLocalDateStr(currentDate, safeTz);
  const s2 = getUserLocalDateStr(prev, safeTz);

  const [y1, m1, d1] = s1.split('-').map(Number);
  const [y2, m2, d2] = s2.split('-').map(Number);

  const utc1 = Date.UTC(y1, m1 - 1, d1);
  const utc2 = Date.UTC(y2, m2 - 1, d2);

  return Math.round((utc1 - utc2) / (1000 * 60 * 60 * 24));
}

/**
 * Returns the exact UTC Date object representing 00:00:00.000 midnight in the user's timezone.
 * Useful for querying attempt logs where createdAt >= startOfUserDayUTC.
 *
 * @param {string} timeZone IANA timezone string
 * @param {Date} date Current instant
 * @returns {Date} UTC Date corresponding to midnight local time
 */
export function getStartOfUserDayUTC(timeZone = DEFAULT_TIMEZONE, date = new Date()) {
  const safeTz = normalizeTimeZone(timeZone);
  const fDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: safeTz,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const [y, m, d] = fDate.format(date).split('-').map(Number);

  const fFull = new Intl.DateTimeFormat('en-US', {
    timeZone: safeTz,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false
  });

  const parts = Object.fromEntries(fFull.formatToParts(date).map(p => [p.type, p.value]));
  const hour = parts.hour === '24' ? 0 : Number(parts.hour);
  const tzDate = new Date(Date.UTC(Number(parts.year), Number(parts.month) - 1, Number(parts.day), hour, Number(parts.minute), Number(parts.second)));
  const offsetMs = tzDate.getTime() - Math.floor(date.getTime() / 1000) * 1000;

  const candidate = new Date(Date.UTC(y, m - 1, d, 0, 0, 0, 0));
  return new Date(candidate.getTime() - offsetMs);
}
