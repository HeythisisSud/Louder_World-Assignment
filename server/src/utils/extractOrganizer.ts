export function extractOrganizer(lines: string[]): string | null {
  const cleaned = lines.filter((t) => {
    const lower = t.toLowerCase();

    return (
      !t.includes("·") && // ✅ remove venue
      !lower.includes("from $") &&
      !lower.includes("$") &&
      !lower.includes("free") &&
      !lower.includes("promoted") &&
      !lower.includes("selling") &&
      !lower.includes("check ticket") &&
      !lower.includes("followers") &&
      !lower.match(/(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/) &&
      !lower.match(/\d{1,2}:\d{2}/)
    );
  });

  return cleaned.length > 0 ? cleaned[cleaned.length - 1] : null;
}
