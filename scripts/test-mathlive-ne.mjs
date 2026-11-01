import * as MathLive from 'mathlive';

// Test inline shortcuts in MathLive
const latex = MathLive.convertAsciiMathToLatex('3 tens 3 ones');
console.log('convertAsciiMathToLatex("3 tens 3 ones"):', latex);

const latex2 = MathLive.convertAsciiMathToLatex('ones');
console.log('convertAsciiMathToLatex("ones"):', latex2);
