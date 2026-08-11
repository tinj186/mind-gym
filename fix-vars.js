import fs from 'fs';
const file = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/fractions-equivalent-fractions/equivalent-fractions/foundation.js';
const data = fs.readFileSync(file, 'utf8');
fs.writeFileSync(file, data.replace(/\\\$\{/g, '${'));
