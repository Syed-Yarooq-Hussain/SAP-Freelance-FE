/**
 * Calculate payment with VAT and service charges
 * @param baseAmount - The original payment amount
 * @param vatPercent - VAT percentage (default: 10)
 * @param serviceChargePercent - Service charge percentage (default: 10)
 * @returns Object containing breakdown and total
 */
export const calculatePaymentWithCharges = (
  baseAmount: number,
  vatPercent: number = 10,
  serviceChargePercent: number = 10
) => {
  const vat = (baseAmount * vatPercent) / 100;
  const serviceCharge = (baseAmount * serviceChargePercent) / 100;
  const total = baseAmount + vat + serviceCharge;

  return {
    baseAmount: Math.round(baseAmount * 100) / 100,
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
