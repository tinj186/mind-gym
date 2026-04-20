/**
 * Strict allow-list for math-related inputs.
 * Allows: Alphanumeric, spaces, basic operators, and LaTeX braces/brackets.
 */
export const MATH_SAFE_REGEX = /^[0-9a-zA-Z\s\/\-\+\(\)\.\{\}\[\]\^\\]+$/;