export function isDateLine(text: string): boolean {
  const lower = text.toLowerCase();

  // Month format: "Sat, 21 Feb, 3:00 pm"
  if (text.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/i))
    return true;

  // Weekday format: "Saturday at 9:00 PM"
  if (
    lower.match(
      /(monday|tuesday|wednesday|thursday|friday|saturday|sunday) at/
    )
  )
    return true;

  // Any time pattern
  if (lower.match(/\d{1,2}:\d{2}\s?(am|pm)/)) return true;

  return false;
}
