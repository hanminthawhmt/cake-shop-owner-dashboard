export const CURRENCY_SYMBOL = '฿';
export const CURRENCY_CODE = 'THB';

/**
 * Format a numeric or string amount into Thai Baht (THB, ฿) currency format.
 * E.g., 1250.50 -> "฿1,250.50"
 */
export const formatCurrency = (
  amount: number | string | null | undefined,
  maximumFractionDigits: number = 2
): string => {
  if (amount == null) return `${CURRENCY_SYMBOL}0.00`;
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `${CURRENCY_SYMBOL}0.00`;

  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: CURRENCY_CODE,
    maximumFractionDigits,
  }).format(num);
};
