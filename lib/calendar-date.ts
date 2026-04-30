/** Calendar date `YYYY-MM-DD` for a clock in `timeZone` (IANA). */
export function calendarDateInTimeZone(timeZone: string, date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

/** Inclusive day count between two `YYYY-MM-DD` strings (Gregorian). */
export function inclusiveDaySpan(startDate: string, endDate: string): number {
  const [ya, ma, da] = startDate.split("-").map(Number);
  const [yb, mb, db] = endDate.split("-").map(Number);
  const t0 = Date.UTC(ya, ma - 1, da);
  const t1 = Date.UTC(yb, mb - 1, db);
  return Math.floor((t1 - t0) / 86_400_000) + 1;
}

function addOneUtcCalendarDay(ymd: string): string {
  const [y, m, d] = ymd.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  return next.toISOString().slice(0, 10);
}

/** Every calendar day from `startDate` through `endDate` inclusive (`YYYY-MM-DD`). */
export function eachDateInclusive(startDate: string, endDate: string): string[] {
  const out: string[] = [];
  let cur = startDate;
  while (cur <= endDate) {
    out.push(cur);
    if (cur === endDate) break;
    cur = addOneUtcCalendarDay(cur);
  }
  return out;
}
