const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

const regex = /if \(activeVariant === 'foundation_capital_letters'\) \{[\s\S]*?systemPrompt = `You are generating a Primary 3 Math question\./;

const newBlock = `if (activeVariant === 'foundation_capital_letters') {
    const letters = [
      { l: "E", right: 4, smaller: 0, greater: 0 },
      { l: "H", right: 4, smaller: 0, greater: 0 },
      { l: "T", right: 2, smaller: 0, greater: 0 },
      { l: "L", right: 1, smaller: 0, greater: 0 },
      { l: "F", right: 3, smaller: 0, greater: 0 },
      { l: "X", right: 0, smaller: 2, greater: 2 },
      { l: "Y", right: 0, smaller: 1, greater: 2 },
      { l: "A", right: 0, smaller: 3, greater: 2 } 
    ];
    
    const wordList = [
      "EAT", "HAT", "FAT", "FLY", "LET", "LAY", "TAX", "HAY", "TEE", "LEE", "FEE", "ALL",
      "TALL", "FALL", "HALF", "HALL", "HEAL", "LEAF", "TALE", "LATE", "FEEL", "HEEL", "FLEA", "FLAY", "FLAT", "LATH", "HATE", "FATE", "THEY", "TEAL", "HEFT", "YELL", "FELL",
      "FATAL", "ALLEY", "TEETH", "THEFT", "LATHE", "FLEET"
    ];
    
    let wordStr = getRandomArrayElement(wordList);
    let wordChars = wordStr.split('');
    
    let totalRight = 0, totalSmaller = 0, totalGreater = 0;
    wordChars.forEach(ch => {
      let lData = letters.find(x => x.l === ch);
      if (lData) {
        totalRight += lData.right;
        totalSmaller += lData.smaller;
        totalGreater += lData.greater;
      }
    });
    
    const types = [
      { key: 'right', label: 'right angles', count: totalRight },
      { key: 'smaller', label: 'angles smaller than a right angle', count: totalSmaller },
      { key: 'greater', label: 'angles greater than a right angle', count: totalGreater }
    ];
    
    const qType = getRandomInt(0, 1); // 0: total of one type, 1: difference between two types
    
    let askText = "";
    let finalAns = "";
    let hintStr = "";
    let solutionStr = "";
    let stepsArr = [];
    let optionsArr = [];
    const name1 = getRandomNames()[0];

    if (qType === 0) {
      let target = getRandomArrayElement(types);
      finalAns = \`\${target.count}\`;
      optionsArr = [\`"\${target.count}"\`, \`"\${target.count + 2}"\`, \`"\${target.count - 1 < 0 ? 0 : target.count - 1}"\`, \`"\${target.count + 1}"\`];
      
      askText = \`STORY: [name1] is looking at the word "\${wordStr}" written in capital letters. Look at the marked angles. Calculate the total number of \${target.label} in the entire word.\`;
      hintStr = \`Count the \${target.label} across all the letters and add them up.\`;
      solutionStr = \`The total number of \${target.label} is \${target.count}.\`;
      
      if (isStructure) {
        stepsArr = [
          { label: \`Total \${target.label}:\`, expectedAnswer: \`\${target.count}\`, acceptedAnswers: [] }
        ];
      }
    } else {
      let shuffledTypes = types.sort(() => 0.5 - Math.random());
      let t1 = shuffledTypes[0];
      let t2 = shuffledTypes[1];
      let diff = Math.abs(t1.count - t2.count);
      
      finalAns = \`\${diff}\`;
      optionsArr = [\`"\${diff}"\`, \`"\${diff + 2}"\`, \`"\${diff - 1 < 0 ? diff + 3 : diff - 1}"\`, \`"\${diff + 1}"\`];
      
      askText = \`STORY: [name1] is looking at the word "\${wordStr}" written in capital letters. Look at the marked angles. What is the difference between the number of \${t1.label} and \${t2.label} in the entire word?\`;
      hintStr = \`First count the \${t1.label}. Then count the \${t2.label}. Subtract the smaller number from the larger number.\`;
      solutionStr = \`1. \${t1.label.charAt(0).toUpperCase() + t1.label.slice(1)} = \${t1.count}.\\n2. \${t2.label.charAt(0).toUpperCase() + t2.label.slice(1)} = \${t2.count}.\\n3. Difference = \${Math.max(t1.count, t2.count)} - \${Math.min(t1.count, t2.count)} = \${diff}.\`;
      
      if (isStructure) {
        stepsArr = [
          { label: \`Total \${t1.label}:\`, expectedAnswer: \`\${t1.count}\`, acceptedAnswers: [] },
          { label: \`Total \${t2.label}:\`, expectedAnswer: \`\${t2.count}\`, acceptedAnswers: [] },
          { label: \`Difference:\`, expectedAnswer: \`\${diff}\`, acceptedAnswers: [] }
        ];
      }
    }
    
    askText = askText.replace('[name1]', name1);

    visualEngineStr = JSON.stringify({ componentToRender: "ANGLE_VISUALIZER", componentData: { word: wordStr } });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = \`{"inputType": "STANDARD_TEXT"}\`;
    }

    systemPrompt = \`You are generating a Primary 3 Math question.\`;`;

text = text.replace(regex, newBlock);
fs.writeFileSync(file, text);
