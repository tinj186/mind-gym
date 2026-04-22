/**
 * Normalizes a mathematical answer for comparison.
 * Handles whitespace, units, currency, and fraction-to-decimal conversion.
 * 
 * @param {string|number} val - The raw input from the student or database.
 * @returns {string} - A normalized numeric string.
 */
export function normalizeAnswer(val) {
  if (val === null || val === undefined) return '';

  // 1. Basic cleaning: Trim and lowercase
  let str = String(val).trim().toLowerCase();

  // 2. Handle LaTeX formats (from MathInput) to standard fraction strings
  // Converts \frac{1}{2} to 1/2
  str = str.replace(/\\frac\{(\d+)\}\{(\d+)\}/g, '$1/$2');
  // Converts mixed LaTeX like 3\frac{1}{4} to 3 1/4
  str = str.replace(/(\d+)\\frac\{(\d+)\}\{(\d+)\}/g, '$1 $2/$3');

  // 3. Remove currency symbols ($) and common units (cm, kg, m, etc.)
  // We keep digits, dots (decimal points), slashes (fractions), and spaces (for mixed numbers).
  str = str.replace(/[^\d./\s-]/g, '').trim();

  // 4. Fraction to Decimal Conversion

  // Handle Mixed Numbers (e.g., "1 1/2" -> "1.5")
  const mixedPattern = /^(\d+)\s+(\d+)\/(\d+)$/;
  const mixedMatch = str.match(mixedPattern);
  if (mixedMatch) {
    const whole = parseFloat(mixedMatch[1]);
    const num = parseFloat(mixedMatch[2]);
    const den = parseFloat(mixedMatch[3]);
    return den !== 0 ? String(whole + num / den) : str;
  }

  // Handle Simple Fractions (e.g., "1/2" -> "0.5")
  const fractionPattern = /^(\d+)\/(\d+)$/;
  const fractionMatch = str.match(fractionPattern);
  if (fractionMatch) {
    const num = parseFloat(fractionMatch[1]);
    const den = parseFloat(fractionMatch[2]);
    return den !== 0 ? String(num / den) : str;
  }

  // 5. Final numeric normalization (e.g., "0.50" -> "0.5")
  // Remove spaces and attempt to parse as a float
  const singleNum = str.replace(/\s/g, '');
  const parsed = parseFloat(singleNum);
  
  return !isNaN(parsed) && isFinite(parsed) ? String(parsed) : singleNum;
}