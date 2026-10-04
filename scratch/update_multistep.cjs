const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/advanced.js';
let content = fs.readFileSync(file, 'utf8');

const oldStr = `    if (isStructure) {
      askText = \`STORY: [Name] draws half of a \${designObj} design resting against a dashed mirror line. The half-shape has \${aCount} angle(s) smaller than a right angle, \${oCount} angle(s) greater than a right angle, and \${rCount} right angle(s). When the shape is completely reflected across the mirror to form the whole \${designObj}, calculate the total number of angles the new, whole \${designObj} has.\`;
      stepsArr = [
        { label: \`Look at the half-shape. How many angles smaller than a right angle are there?\`, expectedAnswer: \`\${aCount}\`, acceptedAnswers: [] },
        { label: \`How many angles greater than a right angle are there?\`, expectedAnswer: \`\${oCount}\`, acceptedAnswers: [] },
        { label: \`How many right angles are there?\`, expectedAnswer: \`\${rCount}\`, acceptedAnswers: [] },
        { label: \`Total number of angles the new, whole shape has:\`, expectedAnswer: \`\${totalWhole}\`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });`;

const newStr = `    if (isStructure) {
      askText = \`STORY: [Name] draws half of a \${designObj} design resting against a dashed mirror line. The half-shape has \${aCount} angle(s) smaller than a right angle, \${rCount} right angle(s), and \${oCount} angle(s) greater than a right angle. When the shape is completely reflected across the mirror to form the whole \${designObj}, calculate the total number of angles the new, whole \${designObj} has.\`;
      stepsArr = [
        { label: \`For the half-shape, what is the total angle for smaller than right angle, right angle, larger than right angle? (e.g. answer 1,0,2 is 1 for smaller, 0 for right, 2 for larger):\`, expectedAnswer: \`\${aCount},\${rCount},\${oCount}\`, acceptedAnswers: [\`\${aCount}, \${rCount}, \${oCount}\`, \`\${aCount}, \${rCount},\${oCount}\`, \`\${aCount},\${rCount}, \${oCount}\`] },
        { label: \`For the new whole shape, what is the total angle for smaller than right angle, right angle, larger than right angle? (e.g. 1,0,2):\`, expectedAnswer: \`\${wholeA},\${wholeR},\${wholeO}\`, acceptedAnswers: [\`\${wholeA}, \${wholeR}, \${wholeO}\`, \`\${wholeA}, \${wholeR},\${wholeO}\`, \`\${wholeA},\${wholeR}, \${wholeO}\`] },
        { label: \`Total number of angles the new, whole shape has:\`, expectedAnswer: \`\${totalWhole}\`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });`;

content = content.replace(oldStr, newStr);
fs.writeFileSync(file, content);
