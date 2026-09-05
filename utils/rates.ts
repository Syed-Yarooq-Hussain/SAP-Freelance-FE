export const formatHourlyRate = (
  value: number | null | undefined,
  currency = "USD"
) => {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) {
    return "N/A";
  }

  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(Number(value));
  } catch {
    return `$${Number(value).toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`;
  }
};
