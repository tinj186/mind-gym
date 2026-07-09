const fs = require('fs');
const path = require('path');

const dir = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/whole-numbers-numbers-up-to-1000';

const files = [
  'counting-by-tens-hundreds.js',
  'place-values-hundreds.js',
  'number-notation.js',
  'number-comparison-and-ordering.js',
  'number-patterns.js',
  'odd-and-even-numbers.js'
];

for (const file of files) {
  const fullPath = path.join(dir, file);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  let newContent = content.replace(/if \(difficulty === 'foundation'\)/g, "if (difficulty.toLowerCase() === 'foundation')");
  newContent = newContent.replace(/else if \(difficulty === 'standard'\)/g, "else if (difficulty.toLowerCase() === 'standard')");
  newContent = newContent.replace(/else if \(difficulty === 'advanced'\)/g, "else if (difficulty.toLowerCase() === 'advanced')");
  
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log('Fixed ' + fullPath);
  }
}
