import { parse, isValid, nextDay } from "date-fns";

export function parseEventbriteDate(dateText: string): Date | null {
  const year = new Date().getFullYear();

  // Normalize spacing + lowercase am/pm
  const cleanedText = dateText.replace(/\s+/g, " ").trim();

  // ---------------------------------------------------
  // ✅ FORMAT 1: "Fri, Feb 27, 9:00 AM PST"
  // Pattern: EEE, MMM dd, hh:mm a
  // ---------------------------------------------------
  if (cleanedText.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/)) {
    // Remove timezone like PST
    const noTimezone = cleanedText.replace(/\b[A-Z]{2,4}\b/g, "").trim();

    // Add year
    const fullText = `${noTimezone}, ${year}`;

    // Try Pattern A: "Fri, Feb 27, 9:00 AM"
    let parsed = parse(fullText, "EEE, MMM dd, h:mm a, yyyy", new Date());

    // Try Pattern B: "Sat, 21 Feb, 3:00 pm" ✅ NEW
    if (!isValid(parsed)) {
      parsed = parse(fullText, "EEE, dd MMM, h:mm a, yyyy", new Date());
    }

    return isValid(parsed) ? parsed : null;
  }

  // ---------------------------------------------------
  // ✅ FORMAT 2: "Friday at 6:00 PM"
  // ---------------------------------------------------
  if (cleanedText.toLowerCase().includes("at")) {
    const match = cleanedText.match(
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday) at (\d{1,2}:\d{2})\s?(AM|PM)/i
    );

    if (!match) return null;

    const weekday = match[1];
    const time = match[2];
    const ampm = match[3];

    const weekdayMap: any = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6
    };

    const today = new Date();
    const targetDay = weekdayMap[weekday.toLowerCase()];

    let date = nextDay(today, targetDay);

    // Parse time into date
    const parsedTime = parse(`${time} ${ampm}`, "h:mm a", new Date());

    if (!isValid(parsedTime)) return null;

    date.setHours(parsedTime.getHours());
    date.setMinutes(parsedTime.getMinutes());

    return date;
  }

  return null;
}
