/**
 * Temporary client-side safeguard for the consultation picker.
 * Real availability and booking will be enforced by the Central API (Kabba #267).
 *
 * Check BOTH the displayed date in the visitor's time zone and the Kabba
 * business date in America/Chicago: no Saturday/Sunday option may be shown.
 */
const kabbaWeekday = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/Chicago',
  weekday: 'short',
});

export function isWeekdayAppointment(date: Date): boolean {
  if (!Number.isFinite(date.getTime())) return false;

  const localDay = date.getDay();
  const centralDay = kabbaWeekday.format(date);
  return localDay >= 1 && localDay <= 5 &&
    centralDay !== 'Sat' && centralDay !== 'Sun';
}
