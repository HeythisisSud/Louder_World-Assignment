export function extractVenue(lines: string[]) {
  const venueLine = lines.find((line) => line.includes("·")) || null;

  if (!venueLine) return { venueName: null, address: null };

  const parts = venueLine.split("·").map((x) => x.trim());

  return {
    address: parts[0] || null,
    venueName: parts[1] || null
  };
}
