export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
): number => {
  // Handle the case where previousValue is 0
  if (previousValue === 0) {
    if (currentValue === 0) {
      return 0; // No change if both values are 0
    }
    return 100; // 100% change if previousValue is 0 and currentValue is not 0
  }

  // Calculate percentage change when previousValue is not 0
  const percentage = ((currentValue - previousValue) / previousValue) * 100;

  // Round the percentage change to 2 decimal places
  return reduceDecimals(percentage);
};

/**
 * Rounds a number to a specified number of decimal places.
 * @param value - The number to be rounded.
 * @param decimalCount - The number of decimal places to round to. by default the value is 2
 * @returns The rounded number.
 */
export function reduceDecimals(value: number, decimalCount?: number): number {
  const factor = Math.pow(10, decimalCount || 2);
  return Math.round(value * factor) / factor;
}
