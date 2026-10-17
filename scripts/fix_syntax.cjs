const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

text = text.replace(/systemPrompt = \`You are generating a Primary 3 Math question.\`;\nTopic: \$\{topic\}/, `systemPrompt = \`You are generating a Primary 3 Math question.
Topic: \${topic}`);

fs.writeFileSync(file, text);
