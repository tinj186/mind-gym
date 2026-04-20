/**
 * Normalizes math strings: removes LaTeX commands, braces, and all whitespace
 * to allow fair comparison between student input and DB answers.
 */
export const normalizeAnswer = (val) => {
  if (!val) return '';
  return String(val).toLowerCase()
    .replace(/\\frac\s*\{(\d+)\}\s*\{(\d+)\}/g, '$1/$2') // \frac {1} {4} -> 1/4
    .replace(/\\frac\s*(\d)(\d)/g, '$1/$2')             // \frac 14 -> 1/4
    .replace(/[\\{}\s]/g, '');                          // remove \, {, }, and spaces
};