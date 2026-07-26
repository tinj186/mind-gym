import { normalizeAnswer } from '../src/lib/math.js';

const studentAnswer1 = "\\frac{4}{5}, \\frac{3}{5}, \\frac{2}{5}";
const studentAnswer2 = "\\frac{4}{5},\\frac{3}{5},\\frac{2}{5}";
const studentAnswer3 = "4/5, 3/5, 2/5";
const finalAnswer = "4/5, 3/5, 2/5";

console.log("student1:", normalizeAnswer(studentAnswer1));
console.log("student2:", normalizeAnswer(studentAnswer2));
console.log("student3:", normalizeAnswer(studentAnswer3));
console.log("final:", normalizeAnswer(finalAnswer));
console.log("student1 === final:", normalizeAnswer(studentAnswer1) === normalizeAnswer(finalAnswer));
