import { isDateLine } from "./isDateLine";

export function extractRawDate(lines: string[]): string | null {
  return lines.find((line) => isDateLine(line)) || null;
}
