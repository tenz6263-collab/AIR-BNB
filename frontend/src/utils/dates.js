const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const LONG_MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const pad = (n) => String(n).padStart(2, '0');

/** Local-date ISO string (YYYY-MM-DD) without timezone drift. */
export function isoDate(date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

export function parseIso(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function addMonths(year, month, delta) {
  const d = new Date(year, month + delta, 1);
  return { year: d.getFullYear(), month: d.getMonth() };
}

export function nightsBetween(a, b) {
  return Math.round((b - a) / 86400000);
}

/** "18 Oct 2026 - 23 Oct 2026" */
export function formatRangeLabel(checkIn, checkOut) {
  const f = (iso) => {
    const d = parseIso(iso);
    return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
  };
  return `${f(checkIn)} - ${f(checkOut)}`;
}

/** "10/18/2026" */
export function formatUs(iso) {
  const d = parseIso(iso);
  return `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`;
}

/** "17 October" - the day before check-in. */
export function formatDayBefore(iso) {
  const d = parseIso(iso);
  d.setDate(d.getDate() - 1);
  return `${d.getDate()} ${LONG_MONTHS[d.getMonth()]}`;
}

export function formatInr(amount) {
  return `\u20B9${Math.round(amount).toLocaleString('en-IN')}`;
}
