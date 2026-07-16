/**
 * Formats a number with thousand separators (e.g. 3000 → "3,000").
 * Accepts numbers or numeric strings; returns "0" for invalid/empty values.
 */
export function formatNumberWithCommas(
  value: number | string | null | undefined,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  if (value === null || value === undefined || value === "") {
    return "0";
  }

  const num = typeof value === "string" ? Number(value) : value;

  if (!Number.isFinite(num)) {
    return "0";
  }

  return num.toLocaleString("en-US", {
    minimumFractionDigits: options?.minimumFractionDigits ?? 0,
    maximumFractionDigits: options?.maximumFractionDigits ?? 0,
  });
}
