// Frontmatter dates are calendar dates (yyyy-MM-dd), not instants. Parsing them
// with `new Date()` produces UTC midnight, which renders one day earlier for
// readers west of UTC and triggers hydration mismatch (build runs in UTC).
export function parseCalendarDate(date: string): Date | null {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (!match) return null;
    const [, y, m, d] = match;
    return new Date(Number(y), Number(m) - 1, Number(d));
}
