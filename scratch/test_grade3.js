import { normalizeAnswer } from '../src/lib/math.js';

const studentAnswer = "\\frac{4}{5},\\quad\\frac{3}{5},\\quad\\frac{2}{5}";
const finalAnswer = "4/5, 3/5, 2/5";

console.log("student:", normalizeAnswer(studentAnswer));
console.log("student === final:", normalizeAnswer(studentAnswer) === normalizeAnswer(finalAnswer));
