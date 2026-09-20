/**
 * Calculate payment with VAT and service charges
 * @param baseAmount - The original payment amount
 * @param vatPercent - Explicit authoritative VAT percentage (default: no added VAT)
 * @param serviceChargePercent - Explicit authoritative service charge (default: none)
 * @returns Object containing breakdown and total
 */
export const calculatePaymentWithCharges = (
  baseAmount: number | string,
  vatPercent: number = 0,
  serviceChargePercent: number = 0
) => {
  const amount = Number(baseAmount);
  if (!Number.isFinite(amount)) throw new Error("Invalid payment amount");
  const vat = (amount * vatPercent) / 100;
  const serviceCharge = (amount * serviceChargePercent) / 100;
  const total = amount + vat + serviceCharge;

  return {
    baseAmount: Math.round(amount * 100) / 100,
    vat: Math.round(vat * 100) / 100,
    serviceCharge: Math.round(serviceCharge * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
};

/**
 * Format currency value for display
 * @param value - The numeric value to format
 * @param currency - Currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number, currency: string = "USD") => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });
  return formatter.format(value);
};

/**
 * Format currency value concisely (without currency symbol for table display)
 * @param value - The numeric value to format
 * @returns Formatted numeric string
 */
export const formatCurrencyValue = (value: number) => {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
