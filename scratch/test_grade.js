import { normalizeAnswer } from '../src/lib/math.js';

const studentAnswer1 = "\\frac{4}{5}, \\frac{3}{5}, \\frac{2}{5}";
const studentAnswer2 = "\\frac{4}{5},\\frac{3}{5},\\frac{2}{5}";
const studentAnswer3 = "\\frac{4}{5} , \\frac{3}{5} , \\frac{2}{5}";
const finalAnswer = "4/5, 3/5, 2/5";

console.log("student1 === final:", normalizeAnswer(studentAnswer1) === normalizeAnswer(finalAnswer));
console.log("student2 === final:", normalizeAnswer(studentAnswer2) === normalizeAnswer(finalAnswer));
console.log("student3 === final:", normalizeAnswer(studentAnswer3) === normalizeAnswer(finalAnswer));

// Test with 4/5, 3/5, 2/5 directly as typed in Mathquill
const studentAnswer4 = "4/5 , 3/5 , 2/5";
console.log("student4 === final:", normalizeAnswer(studentAnswer4) === normalizeAnswer(finalAnswer));

