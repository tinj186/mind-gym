import { getRandomNames, getKgItems, getGramItems, getRandomLiquids, getRandomLocations } from '@/lib/utils/variable-bank';

export const standardLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const kgFoods = getKgItems(2);
  const liquids = getRandomLiquids(2);
  const locations = getRandomLocations(2);
  
  const units = [
    { big: "km", small: "m", factor: 1000 },
    { big: "kg", small: "g", factor: 1000 },
    { big: "ℓ", small: "ml", factor: 1000 }
  ];
  const selectedUnit = units[Math.floor(Math.random() * units.length)];
  const fullSmallLabel = selectedUnit.small === "m" ? "metres" : selectedUnit.small === "g" ? "grams" : "millilitres";
  
  let askText, answer, options, solutionSteps, hint;
  let visualEngineStr = `{"componentToRender": "NONE", "componentData": {}}`;
  let inputRequirementStr = null;

  switch (activeVariant) {
    case 'standard_convert_to_compare': {
      // Variant 6: Convert to Compare & Comparison Bar Models
      const smallValG = (Math.floor(Math.random() * 3) + 1) * 1000 + (Math.floor(Math.random() * 9) * 100 + 100);
      const diff = Math.floor(Math.random() * 5) * 100 + 200; // 200-600
      const largeValG = smallValG + diff;
      
      const isItemALarger = Math.random() > 0.5;
      const valA = isItemALarger ? largeValG : smallValG;
      const valB = isItemALarger ? smallValG : largeValG;

      const itemAName = selectedUnit.big === 'km' ? "Path A" : selectedUnit.big === 'kg' ? "Box A" : "Jug A";
      const itemBName = selectedUnit.big === 'km' ? "Path B" : selectedUnit.big === 'kg' ? "Box B" : "Jug B";
      const adjective = selectedUnit.big === "km" ? "longer" : selectedUnit.big === "kg" ? "heavier" : "more volume";

      const toCompound = (g) => `${Math.floor(g/1000)} ${selectedUnit.big} ${g%1000} ${selectedUnit.small}`;
      const toPure = (g) => `${g} ${selectedUnit.small}`;
      const makeAns = (val) => [`${val}`, `${val}${selectedUnit.small}`, `${val} ${selectedUnit.small}`];
      
      const makeEq = (a, op, b, c) => [
        `${a} ${op} ${b} = ${c}`,
        `${a}${op}${b}=${c}`,
        `${a} ${op} ${b} = ${c} ${selectedUnit.small}`,
        `${a}${selectedUnit.small} ${op} ${b}${selectedUnit.small} = ${c}${selectedUnit.small}`,
        `${a} ${selectedUnit.small} ${op} ${b} ${selectedUnit.small} = ${c} ${selectedUnit.small}`,
        ...(op === '+' ? [
          `${b} ${op} ${a} = ${c}`,
          `${b}${op}${a}=${c}`,
          `${b} ${op} ${a} = ${c} ${selectedUnit.small}`,
          `${b}${selectedUnit.small} ${op} ${a}${selectedUnit.small} = ${c}${selectedUnit.small}`,
          `${b} ${selectedUnit.small} ${op} ${a} ${selectedUnit.small} = ${c} ${selectedUnit.small}`
        ] : [])
      ];

      // 3 Types: 0 = Find Diff, 1 = Find Larger, 2 = Find Smaller
      const qType = Math.floor(Math.random() * 3);
      
      if (qType === 0) {
        const aFormat = Math.random() > 0.5 ? toCompound(valA) : toPure(valA);
        const bFormat = aFormat === toCompound(valA) ? toPure(valB) : toCompound(valB);
        
        answer = `${diff} ${selectedUnit.small}`;
        
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            type: "COMPARISON",
            isStatic: true,
            bar1: { name: itemAName, size: valA, layoutSize: valA, value: aFormat, segments: 1 },
            bar2: { name: itemBName, size: valB, layoutSize: valB, value: bFormat, segments: 1 },
            difference: { displayValue: "?" }
          }
        });

        if (isStructure) {
          askText = `${itemAName} is ${aFormat}. ${itemBName} is ${bFormat}. What is the difference in ${selectedUnit.small}?`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Convert ${aFormat.includes(selectedUnit.big) ? itemAName : itemBName}'s measurement into ${fullSmallLabel}:`, expectedAnswer: `${aFormat.includes(selectedUnit.big) ? valA : valB} ${selectedUnit.small}`, acceptedAnswers: makeAns(aFormat.includes(selectedUnit.big) ? valA : valB) },
              { label: `Which is ${adjective}? (Type A or B)`, expectedAnswer: isItemALarger ? "A" : "B", acceptedAnswers: [isItemALarger ? "A" : "B", isItemALarger ? "a" : "b"] },
              { label: `Write the working equation to find the difference:`, expectedAnswer: `${largeValG} - ${smallValG} = ${diff}`, acceptedAnswers: makeEq(largeValG, '-', smallValG, diff) },
              { label: `So, the difference in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(diff) }
            ]
          });
        } else {
          askText = `${itemAName} is ${aFormat}. ${itemBName} is ${bFormat}. What is the difference in ${selectedUnit.small}?`;
        }
        
        options = [answer, `${diff + 100} ${selectedUnit.small}`, `${diff - 100} ${selectedUnit.small}`, `${smallValG} ${selectedUnit.small}`];
        solutionSteps = `1. Convert to the same unit to compare.\n2. ${itemAName} = ${valA} ${selectedUnit.small}.\n3. ${itemBName} = ${valB} ${selectedUnit.small}.\n4. Subtract to find the difference: ${largeValG} - ${smallValG} = ${diff} ${selectedUnit.small}.`;
        hint = `Convert the compound unit to ${fullSmallLabel} first, then subtract!`;
        
      } else if (qType === 1) {
        const largerName = isItemALarger ? itemAName : itemBName;
        const smallerName = isItemALarger ? itemBName : itemAName;
        const smallerFormat = toCompound(smallValG);
        
        answer = `${largeValG} ${selectedUnit.small}`;
        
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            type: "COMPARISON",
            isStatic: true,
            bar1: { name: itemAName, size: valA, layoutSize: valA, value: isItemALarger ? "?" : smallerFormat, segments: 1 },
            bar2: { name: itemBName, size: valB, layoutSize: valB, value: isItemALarger ? smallerFormat : "?", segments: 1 },
            difference: { displayValue: `${diff} ${selectedUnit.small}` }
          }
        });

        if (isStructure) {
          askText = `${smallerName} is ${smallerFormat}. ${largerName} is ${diff} ${selectedUnit.small} ${adjective} than ${smallerName}. Find the value of ${largerName} in ${selectedUnit.small}.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Convert ${smallerName}'s measurement into ${fullSmallLabel}:`, expectedAnswer: `${smallValG} ${selectedUnit.small}`, acceptedAnswers: makeAns(smallValG) },
              { label: `Since ${largerName} is ${adjective}, should you add or subtract? (Type Add or Subtract)`, expectedAnswer: "Add", acceptedAnswers: ["Add", "add", "+"] },
              { label: `Write the working equation to find the value of ${largerName}:`, expectedAnswer: `${smallValG} + ${diff} = ${largeValG}`, acceptedAnswers: makeEq(smallValG, '+', diff, largeValG) },
              { label: `So, the value of ${largerName} in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(largeValG) }
            ]
          });
        } else {
          askText = `${smallerName} is ${smallerFormat}. ${largerName} is ${diff} ${selectedUnit.small} ${adjective} than ${smallerName}. Find the value of ${largerName} in ${selectedUnit.small}.`;
        }
        
        options = [answer, `${largeValG + 100} ${selectedUnit.small}`, `${largeValG - 100} ${selectedUnit.small}`, `${smallValG - diff} ${selectedUnit.small}`];
        solutionSteps = `1. Convert ${smallerName} to ${fullSmallLabel}: ${smallValG} ${selectedUnit.small}.\n2. Since ${largerName} is ${adjective}, we add the difference.\n3. ${smallValG} + ${diff} = ${largeValG} ${selectedUnit.small}.`;
        hint = `Draw a comparison bar model! The longer bar is the smaller bar PLUS the difference.`;
        
      } else {
        const largerName = isItemALarger ? itemAName : itemBName;
        const smallerName = isItemALarger ? itemBName : itemAName;
        const largerFormat = toCompound(largeValG);
        
        answer = `${smallValG} ${selectedUnit.small}`;
        
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            type: "COMPARISON",
            isStatic: true,
            bar1: { name: itemAName, size: valA, layoutSize: valA, value: isItemALarger ? largerFormat : "?", segments: 1 },
            bar2: { name: itemBName, size: valB, layoutSize: valB, value: isItemALarger ? "?" : largerFormat, segments: 1 },
            difference: { displayValue: `${diff} ${selectedUnit.small}` }
          }
        });

        if (isStructure) {
          const notAdj = selectedUnit.big === "km" ? "shorter" : selectedUnit.big === "kg" ? "lighter" : "less volume";
          askText = `${largerName} is ${largerFormat}. It is ${diff} ${selectedUnit.small} ${adjective} than ${smallerName}. Find the value of ${smallerName} in ${selectedUnit.small}.`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Convert ${largerName}'s measurement into ${fullSmallLabel}:`, expectedAnswer: `${largeValG} ${selectedUnit.small}`, acceptedAnswers: makeAns(largeValG) },
              { label: `Since ${smallerName} is ${notAdj}, should you add or subtract the difference? (Type Add or Subtract)`, expectedAnswer: "Subtract", acceptedAnswers: ["Subtract", "subtract", "-"] },
              { label: `Write the working equation to find the value of ${smallerName}:`, expectedAnswer: `${largeValG} - ${diff} = ${smallValG}`, acceptedAnswers: makeEq(largeValG, '-', diff, smallValG) },
              { label: `So, the value of ${smallerName} in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(smallValG) }
            ]
          });
        } else {
          askText = `${largerName} is ${largerFormat}. It is ${diff} ${selectedUnit.small} ${adjective} than ${smallerName}. Find the value of ${smallerName} in ${selectedUnit.small}.`;
        }
        
        options = [answer, `${smallValG + 100} ${selectedUnit.small}`, `${smallValG - 100} ${selectedUnit.small}`, `${largeValG + diff} ${selectedUnit.small}`];
        solutionSteps = `1. Convert ${largerName} to ${fullSmallLabel}: ${largeValG} ${selectedUnit.small}.\n2. Since ${smallerName} is smaller, we subtract the difference.\n3. ${largeValG} - ${diff} = ${smallValG} ${selectedUnit.small}.`;
        hint = `Draw a comparison bar model! To find the shorter bar, take the longer bar MINUS the difference.`;
      }
      
      break;
    }

    case 'standard_add_and_convert': {
      // Variant 7: Add and Convert / Find Missing Part (Part-Whole Model)
      const s1 = Math.floor(Math.random() * 5) * 100 + 600; // 600 to 1000
      const s2 = Math.floor(Math.random() * 5) * 100 + 1100; // 1100 to 1500
      const totalG = s1 + s2;
      const totalB = Math.floor(totalG / 1000);
      const totalS = totalG % 1000;
      
      let labelTotal, label1, label2;
      if (selectedUnit.big === 'km') {
        labelTotal = "Total distance"; label1 = "Morning run"; label2 = "Evening run";
      } else if (selectedUnit.big === 'kg') {
        labelTotal = "Total mass"; label1 = `${kgFoods[0].item}`; label2 = `${kgFoods[1].item}`;
      } else {
        labelTotal = "Total volume"; label1 = `${liquids[0]}`; label2 = `${liquids[1]}`;
      }

      const toCompound = (g) => `${Math.floor(g/1000)} ${selectedUnit.big} ${g%1000} ${selectedUnit.small}`.replace(' 0 m', '').replace(' 0 g', '').replace(' 0 ml', ''); // cleanup trailing 0
      const toPure = (g) => `${g} ${selectedUnit.small}`;
      const makeAns = (val) => [`${val}`, `${val}${selectedUnit.small}`, `${val} ${selectedUnit.small}`];
      
      const makeEq = (a, op, b, c) => [
        `${a} ${op} ${b} = ${c}`,
        `${a}${op}${b}=${c}`,
        `${a} ${op} ${b} = ${c} ${selectedUnit.small}`,
        `${a}${selectedUnit.small} ${op} ${b}${selectedUnit.small} = ${c}${selectedUnit.small}`,
        `${a} ${selectedUnit.small} ${op} ${b} ${selectedUnit.small} = ${c} ${selectedUnit.small}`,
        ...(op === '+' ? [
          `${b} ${op} ${a} = ${c}`,
          `${b}${op}${a}=${c}`,
          `${b} ${op} ${a} = ${c} ${selectedUnit.small}`,
          `${b}${selectedUnit.small} ${op} ${a}${selectedUnit.small} = ${c}${selectedUnit.small}`,
          `${b} ${selectedUnit.small} ${op} ${a} ${selectedUnit.small} = ${c} ${selectedUnit.small}`
        ] : [])
      ];

      // 3 Types: 0 = Find Total (Compound), 1 = Find Part 1 (Pure), 2 = Find Part 2 (Pure)
      const qType = Math.floor(Math.random() * 3);
      
      if (qType === 0) {
        answer = `${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;
        
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            type: "PART_WHOLE",
            isStatic: true,
            parts: [
              { value: toPure(s1), size: s1, layoutSize: s1, segments: 1 },
              { value: toPure(s2), size: s2, layoutSize: s2, segments: 1 }
            ],
            whole: "?"
          }
        });

        if (isStructure) {
          let story = "";
          if (selectedUnit.big === 'km') story = `${names[0]} runs ${s1} m in the morning and ${s2} m in the evening.`;
          else if (selectedUnit.big === 'kg') story = `${names[0]} buys ${s1} g of ${kgFoods[0].item} and ${s2} g of ${kgFoods[1].item}.`;
          else story = `A chef mixes ${s1} ml of ${liquids[0]} and ${s2} ml of ${liquids[1]}.`;

          askText = `${story} What is the total in ${selectedUnit.big} and ${selectedUnit.small}?`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to find the total in ${fullSmallLabel}:`, expectedAnswer: `${s1} + ${s2} = ${totalG}`, acceptedAnswers: makeEq(s1, '+', s2, totalG) },
              { label: `Convert this total into ${selectedUnit.big} and ${selectedUnit.small}. How many full ${selectedUnit.big}?`, expectedAnswer: `${totalB} ${selectedUnit.big}`, acceptedAnswers: [`${totalB}`, `${totalB}${selectedUnit.big}`, `${totalB} ${selectedUnit.big}`] },
              { label: `How many ${selectedUnit.small} are left over?`, expectedAnswer: `${totalS} ${selectedUnit.small}`, acceptedAnswers: [`${totalS}`, `${totalS}${selectedUnit.small}`, `${totalS} ${selectedUnit.small}`] }
            ]
          });
        } else {
          askText = `Add ${toPure(s1)} and ${toPure(s2)}. Express the answer in ${selectedUnit.big} and ${selectedUnit.small}.`;
        }

        options = [
          answer,
          `${totalB} ${selectedUnit.big} ${totalS + 100} ${selectedUnit.small}`,
          `${totalB + 1} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`,
          `${totalG} ${selectedUnit.big}`
        ];

        solutionSteps = `1. Add the two values: ${s1} ${selectedUnit.small} + ${s2} ${selectedUnit.small} = ${totalG} ${selectedUnit.small}.\n2. Convert ${totalG} ${selectedUnit.small} back to compound units.\n3. Split ${totalG} into thousands and hundreds: ${totalB * 1000} and ${totalS}.\n4. ${totalB * 1000} ${selectedUnit.small} = ${totalB} ${selectedUnit.big}.\n5. The final answer is ${answer}.`;
        hint = `Add the two smaller units together first. Once you have the big total, split out the thousands to find the ${selectedUnit.big}!`;
        
      } else if (qType === 1 || qType === 2) {
        const knownPart = qType === 1 ? s2 : s1;
        const missingPart = qType === 1 ? s1 : s2;
        const compoundTotalStr = toCompound(totalG);
        
        answer = `${missingPart} ${selectedUnit.small}`;
        
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            type: "PART_WHOLE",
            isStatic: true,
            parts: [
              { value: qType === 1 ? "?" : toPure(knownPart), size: s1, layoutSize: s1, segments: 1 },
              { value: qType === 1 ? toPure(knownPart) : "?", size: s2, layoutSize: s2, segments: 1 }
            ],
            whole: compoundTotalStr
          }
        });

        if (isStructure) {
          let story = "";
          let missingLabel = "";
          if (selectedUnit.big === 'km') {
            story = `${names[0]} wants to run a total of ${compoundTotalStr} today. If they ran ${knownPart} m ${qType === 1 ? 'in the evening' : 'in the morning'}, how far did they run ${qType === 1 ? 'in the morning' : 'in the evening'}?`;
            missingLabel = `distance run in the ${qType === 1 ? 'morning' : 'evening'}`;
          } else if (selectedUnit.big === 'kg') {
            story = `${names[0]} bought a total of ${compoundTotalStr} of groceries. If the ${qType === 1 ? kgFoods[1].item : kgFoods[0].item} weighed ${knownPart} g, how much did the ${qType === 1 ? kgFoods[0].item : kgFoods[1].item} weigh?`;
            missingLabel = `mass of the ${qType === 1 ? kgFoods[0].item : kgFoods[1].item}`;
          } else {
            story = `A chef made a total of ${compoundTotalStr} of mixed juice. If he used ${knownPart} ml of ${qType === 1 ? liquids[1] : liquids[0]}, how much ${qType === 1 ? liquids[0] : liquids[1]} did he use?`;
            missingLabel = `volume of ${qType === 1 ? liquids[0] : liquids[1]}`;
          }

          askText = story;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Convert the total amount into ${fullSmallLabel}:`, expectedAnswer: `${totalG} ${selectedUnit.small}`, acceptedAnswers: makeAns(totalG) },
              { label: `Write the working equation to find the ${missingLabel}:`, expectedAnswer: `${totalG} - ${knownPart} = ${missingPart}`, acceptedAnswers: makeEq(totalG, '-', knownPart, missingPart) },
              { label: `So, the ${missingLabel} in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(missingPart) }
            ]
          });
        } else {
          askText = `The total is ${compoundTotalStr}. One part is ${toPure(knownPart)}. What is the other part in ${selectedUnit.small}?`;
        }

        options = [
          answer,
          `${missingPart + 100} ${selectedUnit.small}`,
          `${missingPart - 100} ${selectedUnit.small}`,
          `${totalG + knownPart} ${selectedUnit.small}`
        ];

        solutionSteps = `1. Convert the total into ${fullSmallLabel}: ${compoundTotalStr} = ${totalG} ${selectedUnit.small}.\n2. To find the missing part, subtract the known part from the total.\n3. ${totalG} - ${knownPart} = ${missingPart} ${selectedUnit.small}.`;
        hint = `Draw a Part-Whole bar model! Convert the total to ${fullSmallLabel}, then subtract the part you know to find the part you don't.`;
      }
      break;
    }

    case 'standard_subtract_from_compound': {
      // Variant 8: Subtract from Compound (Finding the Remainder/Missing Part)
      const b1 = Math.floor(Math.random() * 3) + 2; // 2 to 4
      const s1 = Math.floor(Math.random() * 5) * 100 + 200; // 200 to 600
      const totalG = (b1 * 1000) + s1;
      const minusG = Math.floor(Math.random() * 6) * 100 + 700; // 700 to 1200
      
      const leftG = totalG - minusG;

      let labelTotal, labelMinus, labelLeft;
      if (selectedUnit.big === 'km') {
        labelTotal = "Total distance"; labelMinus = "Walked"; labelLeft = "Left";
      } else if (selectedUnit.big === 'kg') {
        labelTotal = "Total mass"; labelMinus = "Used"; labelLeft = "Left";
      } else {
        labelTotal = "Total volume"; labelMinus = "Poured out"; labelLeft = "Left";
      }

      const toCompound = (g) => `${Math.floor(g/1000)} ${selectedUnit.big} ${g%1000} ${selectedUnit.small}`.replace(' 0 m', '').replace(' 0 g', '').replace(' 0 ml', '');
      const toPure = (g) => `${g} ${selectedUnit.small}`;
      const makeAns = (val) => [`${val}`, `${val}${selectedUnit.small}`, `${val} ${selectedUnit.small}`];
      
      const makeEq = (a, op, b, c) => [
        `${a} ${op} ${b} = ${c}`,
        `${a}${op}${b}=${c}`,
        `${a} ${op} ${b} = ${c} ${selectedUnit.small}`,
        `${a}${selectedUnit.small} ${op} ${b}${selectedUnit.small} = ${c}${selectedUnit.small}`,
        `${a} ${selectedUnit.small} ${op} ${b} ${selectedUnit.small} = ${c} ${selectedUnit.small}`,
        ...(op === '+' ? [
          `${b} ${op} ${a} = ${c}`,
          `${b}${op}${a}=${c}`,
          `${b} ${op} ${a} = ${c} ${selectedUnit.small}`,
          `${b}${selectedUnit.small} ${op} ${a}${selectedUnit.small} = ${c}${selectedUnit.small}`,
          `${b} ${selectedUnit.small} ${op} ${a} ${selectedUnit.small} = ${c} ${selectedUnit.small}`
        ] : [])
      ];

      // 3 Types: 0 = Find Amount Left (Pure), 1 = Find Amount Used (Pure), 2 = Find Total (Compound)
      const qType = Math.floor(Math.random() * 3);
      
      if (qType === 0) {
        answer = `${leftG} ${selectedUnit.small}`;
        
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            type: "PART_WHOLE",
            isStatic: true,
            parts: [
              { value: toPure(minusG), size: minusG, layoutSize: minusG, segments: 1 },
              { value: "?", size: leftG, layoutSize: leftG, segments: 1 }
            ],
            whole: toCompound(totalG),
            wholeLayoutSize: totalG
          }
        });

        if (isStructure) {
          let story = "";
          if (selectedUnit.big === 'km') story = `${names[0]} has to walk ${toCompound(totalG)}. ${names[0]} walks ${toPure(minusG)}.`;
          else if (selectedUnit.big === 'kg') story = `A bag contains ${toCompound(totalG)} of rice. ${names[0]} uses ${toPure(minusG)}.`;
          else story = `A large bottle contains ${toCompound(totalG)} of juice. ${names[0]} pours out ${toPure(minusG)}.`;

          askText = `${story} How much is left in ${selectedUnit.small}?`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Convert the total amount into ${fullSmallLabel}:`, expectedAnswer: `${totalG} ${selectedUnit.small}`, acceptedAnswers: makeAns(totalG) },
              { label: `Write the working equation to find the amount left:`, expectedAnswer: `${totalG} - ${minusG} = ${leftG}`, acceptedAnswers: makeEq(totalG, '-', minusG, leftG) },
              { label: `So, the amount left in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(leftG) }
            ]
          });
        } else {
          askText = `${toCompound(totalG)} - ${toPure(minusG)} = ? ${selectedUnit.small}`;
        }

        options = [
          answer,
          `${leftG + 100} ${selectedUnit.small}`,
          `${leftG - 100} ${selectedUnit.small}`,
          `${totalG + minusG} ${selectedUnit.small}`
        ];

        solutionSteps = `1. You cannot easily subtract from mixed units. Convert the total to ${fullSmallLabel} first.\n2. ${toCompound(totalG)} = ${totalG} ${selectedUnit.small}.\n3. Subtract the amount used: ${totalG} - ${minusG} = ${leftG} ${selectedUnit.small}.`;
        hint = `First, convert the total amount into ${fullSmallLabel}. Then you can easily subtract!`;
        
      } else if (qType === 1) {
        answer = `${minusG} ${selectedUnit.small}`;
        
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            type: "PART_WHOLE",
            isStatic: true,
            parts: [
              { value: "?", size: minusG, layoutSize: minusG, segments: 1 },
              { value: toPure(leftG), size: leftG, layoutSize: leftG, segments: 1 }
            ],
            whole: toCompound(totalG),
            wholeLayoutSize: totalG
          }
        });

        if (isStructure) {
          let story = "";
          if (selectedUnit.big === 'km') story = `${names[0]} has to walk ${toCompound(totalG)}. After walking some distance, ${names[0]} still has ${toPure(leftG)} left.`;
          else if (selectedUnit.big === 'kg') story = `A bag contained ${toCompound(totalG)} of rice. After ${names[0]} used some, there was ${toPure(leftG)} left.`;
          else story = `A bottle contained ${toCompound(totalG)} of juice. After pouring some out, there was ${toPure(leftG)} left.`;

          let missingLabel = selectedUnit.big === 'km' ? "distance walked" : selectedUnit.big === 'kg' ? "amount used" : "volume poured out";

          askText = `${story} What was the ${missingLabel} in ${selectedUnit.small}?`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Convert the total amount into ${fullSmallLabel}:`, expectedAnswer: `${totalG} ${selectedUnit.small}`, acceptedAnswers: makeAns(totalG) },
              { label: `Write the working equation to find the ${missingLabel}:`, expectedAnswer: `${totalG} - ${leftG} = ${minusG}`, acceptedAnswers: makeEq(totalG, '-', leftG, minusG) },
              { label: `So, the ${missingLabel} in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(minusG) }
            ]
          });
        } else {
          askText = `${toCompound(totalG)} - ? ${selectedUnit.small} = ${toPure(leftG)}`;
        }

        options = [
          answer,
          `${minusG + 100} ${selectedUnit.small}`,
          `${minusG - 100} ${selectedUnit.small}`,
          `${totalG + leftG} ${selectedUnit.small}`
        ];

        solutionSteps = `1. Convert the total to ${fullSmallLabel} first: ${toCompound(totalG)} = ${totalG} ${selectedUnit.small}.\n2. Subtract the amount left from the total: ${totalG} - ${leftG} = ${minusG} ${selectedUnit.small}.`;
        hint = `Convert the total to ${fullSmallLabel}, then subtract what is left to find out what was taken away!`;
        
      } else {
        answer = toCompound(totalG);
        
        visualEngineStr = JSON.stringify({
          componentToRender: "BAR_MODEL",
          componentData: {
            type: "PART_WHOLE",
            isStatic: true,
            parts: [
              { value: toPure(minusG), size: minusG, layoutSize: minusG, segments: 1 },
              { value: toPure(leftG), size: leftG, layoutSize: leftG, segments: 1 }
            ],
            whole: "?",
            wholeLayoutSize: totalG
          }
        });

        if (isStructure) {
          let story = "";
          if (selectedUnit.big === 'km') story = `${names[0]} walks ${toPure(minusG)} and still has ${toPure(leftG)} left to walk.`;
          else if (selectedUnit.big === 'kg') story = `${names[0]} uses ${toPure(minusG)} of rice and still has ${toPure(leftG)} left in the bag.`;
          else story = `${names[0]} pours out ${toPure(minusG)} of juice and still has ${toPure(leftG)} left in the bottle.`;

          askText = `${story} What was the total initial amount in ${selectedUnit.big} and ${selectedUnit.small}?`;
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Write the working equation to find the total in ${fullSmallLabel}:`, expectedAnswer: `${minusG} + ${leftG} = ${totalG}`, acceptedAnswers: makeEq(minusG, '+', leftG, totalG) },
              { label: `Convert this total into ${selectedUnit.big} and ${selectedUnit.small}. How many full ${selectedUnit.big}?`, expectedAnswer: `${b1} ${selectedUnit.big}`, acceptedAnswers: makeAns(b1).map(x => x.replace(selectedUnit.small, selectedUnit.big)) },
              { label: `How many ${selectedUnit.small} are left over?`, expectedAnswer: `${s1} ${selectedUnit.small}`, acceptedAnswers: makeAns(s1) }
            ]
          });
        } else {
          askText = `? - ${toPure(minusG)} = ${toPure(leftG)}. Find the initial amount in ${selectedUnit.big} and ${selectedUnit.small}.`;
        }

        options = [
          answer,
          `${b1} ${selectedUnit.big} ${s1 + 100} ${selectedUnit.small}`,
          `${b1 - 1} ${selectedUnit.big} ${s1} ${selectedUnit.small}`,
          `${totalG} ${selectedUnit.small}`
        ];

        solutionSteps = `1. Add the two parts to find the total: ${minusG} + ${leftG} = ${totalG} ${selectedUnit.small}.\n2. Convert ${totalG} ${selectedUnit.small} into compound units: ${totalG} = ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}.`;
        hint = `Draw a Part-Whole bar model. If you know both parts, you can ADD them together to find the whole!`;
      }
      break;
    }

    case 'standard_missing_part': {
      // Variant 9: The Missing Part (Reverse Conversion)
      const bTotal = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const totalG = bTotal * 1000;
      
      const part1G = Math.floor(Math.random() * 8) * 100 + 1200; // 1200 to 1900
      const part2G = totalG - part1G;
      
      const part2B = Math.floor(part2G / 1000);
      const part2S = part2G % 1000;
      answer = `${part2B} ${selectedUnit.big} ${part2S} ${selectedUnit.small}`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${part1G} ${selectedUnit.small}`, size: part1G, layoutSize: part1G, segments: 1 },
            { value: "?", size: part2G, layoutSize: part2G, segments: 1 }
          ],
          whole: `${bTotal} ${selectedUnit.big}`,
          wholeLayoutSize: totalG
        }
      });

      const makeAns = (val) => [`${val}`, `${val}${selectedUnit.small}`, `${val} ${selectedUnit.small}`];
      const makeEq = (a, op, b, c) => [
        `${a} ${op} ${b} = ${c}`,
        `${a}${op}${b}=${c}`,
        `${a} ${op} ${b} = ${c} ${selectedUnit.small}`,
        `${a}${selectedUnit.small} ${op} ${b}${selectedUnit.small} = ${c}${selectedUnit.small}`,
        `${a} ${selectedUnit.small} ${op} ${b} ${selectedUnit.small} = ${c} ${selectedUnit.small}`,
        ...(op === '+' ? [
          `${b} ${op} ${a} = ${c}`,
          `${b}${op}${a}=${c}`,
          `${b} ${op} ${a} = ${c} ${selectedUnit.small}`,
          `${b}${selectedUnit.small} ${op} ${a}${selectedUnit.small} = ${c}${selectedUnit.small}`,
          `${b} ${selectedUnit.small} ${op} ${a} ${selectedUnit.small} = ${c} ${selectedUnit.small}`
        ] : [])
      ];

      if (isStructure) {
        let story = "";
        if (selectedUnit.big === 'km') story = `The total distance is ${bTotal} km. If Leg X is ${part1G} m, what is the distance of Leg Y in ${selectedUnit.big} and ${selectedUnit.small}?`;
        else if (selectedUnit.big === 'kg') story = `The total mass of two parcels is ${bTotal} kg. If Parcel X weighs ${part1G} g, what is the mass of Parcel Y in ${selectedUnit.big} and ${selectedUnit.small}?`;
        else story = `A tank holds ${bTotal} ℓ of water. If Container X holds ${part1G} ml, what does Container Y hold in ${selectedUnit.big} and ${selectedUnit.small}?`;

        askText = story;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Convert the total amount into ${fullSmallLabel}:`, expectedAnswer: `${totalG} ${selectedUnit.small}`, acceptedAnswers: makeAns(totalG) },
            { label: `Write the working equation to find the missing part in ${fullSmallLabel}:`, expectedAnswer: `${totalG} - ${part1G} = ${part2G}`, acceptedAnswers: makeEq(totalG, '-', part1G, part2G) },
            { label: `Convert this missing part into ${selectedUnit.big} and ${selectedUnit.small}. How many full ${selectedUnit.big}?`, expectedAnswer: `${part2B} ${selectedUnit.big}`, acceptedAnswers: makeAns(part2B).map(x => x.replace(selectedUnit.small, selectedUnit.big)) },
            { label: `How many ${selectedUnit.small} are left over?`, expectedAnswer: `${part2S} ${selectedUnit.small}`, acceptedAnswers: makeAns(part2S) }
          ]
        });
      } else {
        askText = `Total is ${bTotal} ${selectedUnit.big}. Part A is ${part1G} ${selectedUnit.small}. Find Part B in ${selectedUnit.big} and ${selectedUnit.small}.`;
      }

      options = [
        answer,
        `${part2B} ${selectedUnit.big} ${part2S + 100} ${selectedUnit.small}`,
        `${part2B + 1} ${selectedUnit.big} ${part2S} ${selectedUnit.small}`,
        `${part2G} ${selectedUnit.big}`
      ];

      solutionSteps = `1. Convert the total to ${fullSmallLabel}: ${bTotal} ${selectedUnit.big} = ${totalG} ${selectedUnit.small}.\n2. Subtract Part A from the total to find Part B: ${totalG} - ${part1G} = ${part2G} ${selectedUnit.small}.\n3. Convert Part B back to compound units: ${part2G} ${selectedUnit.small} = ${answer}.`;
      hint = `Convert the total ${selectedUnit.big} into ${selectedUnit.small} first! Then subtract the known part to find the missing part.`;
      break;
    }

    case 'standard_reaching_target': {
      // Variant 10: Reaching the Target (Shortfall)
      const bTotal = Math.floor(Math.random() * 3) + 4; // 4 to 6
      const totalG = bTotal * 1000;
      
      const haveG = Math.floor(Math.random() * 8) * 100 + 2200; // 2200 to 2900
      const needG = totalG - haveG;
      
      answer = `${needG} ${selectedUnit.small}`;

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: `${haveG} ${selectedUnit.small}`, size: haveG, layoutSize: haveG, segments: 1 },
            { value: "?", size: needG, layoutSize: needG, segments: 1 }
          ],
          whole: `${bTotal} ${selectedUnit.big}`,
          wholeLayoutSize: totalG
        }
      });

      const makeAns = (val) => [`${val}`, `${val}${selectedUnit.small}`, `${val} ${selectedUnit.small}`];
      const makeEq = (a, op, b, c) => [
        `${a} ${op} ${b} = ${c}`,
        `${a}${op}${b}=${c}`,
        `${a} ${op} ${b} = ${c} ${selectedUnit.small}`,
        `${a}${selectedUnit.small} ${op} ${b}${selectedUnit.small} = ${c}${selectedUnit.small}`,
        `${a} ${selectedUnit.small} ${op} ${b} ${selectedUnit.small} = ${c} ${selectedUnit.small}`,
        ...(op === '+' ? [
          `${b} ${op} ${a} = ${c}`,
          `${b}${op}${a}=${c}`,
          `${b} ${op} ${a} = ${c} ${selectedUnit.small}`,
          `${b}${selectedUnit.small} ${op} ${a}${selectedUnit.small} = ${c}${selectedUnit.small}`,
          `${b} ${selectedUnit.small} ${op} ${a} ${selectedUnit.small} = ${c} ${selectedUnit.small}`
        ] : [])
      ];

      if (isStructure) {
        let story = "";
        if (selectedUnit.big === 'km') story = `A marathon target is ${bTotal} km. ${names[0]} has run ${haveG} m so far.`;
        else if (selectedUnit.big === 'kg') story = `A recipe needs exactly ${bTotal} kg of flour. ${names[0]} only has ${haveG} g.`;
        else story = `A bucket needs to hold ${bTotal} ℓ. It currently holds ${haveG} ml.`;

        askText = `${story} How many more ${fullSmallLabel} are needed to hit the target?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Convert the target amount into ${fullSmallLabel}:`, expectedAnswer: `${totalG} ${selectedUnit.small}`, acceptedAnswers: makeAns(totalG) },
            { label: `Write the working equation to find how much more is needed:`, expectedAnswer: `${totalG} - ${haveG} = ${needG}`, acceptedAnswers: makeEq(totalG, '-', haveG, needG) },
            { label: `So, how much further in ${selectedUnit.small}?`, expectedAnswer: answer, acceptedAnswers: makeAns(needG) }
          ]
        });
      } else {
        askText = `How many more ${selectedUnit.small} to make ${bTotal} ${selectedUnit.big} from ${haveG} ${selectedUnit.small}?`;
      }

      options = [
        answer,
        `${needG + 100} ${selectedUnit.small}`,
        `${needG - 100} ${selectedUnit.small}`,
        `${totalG + haveG} ${selectedUnit.small}`
      ];

      solutionSteps = `1. Convert the target to ${fullSmallLabel}: ${bTotal} ${selectedUnit.big} = ${totalG} ${selectedUnit.small}.\n2. Find out how much more is needed by subtracting what you have from the target.\n3. ${totalG} - ${haveG} = ${needG} ${selectedUnit.small}.`;
      hint = `To find how much more you need, subtract what you already have from the total target!`;
      break;
    }

    default:
      throw new Error(`Variant not found in Standard logic: ${activeVariant}`);
  }

  const generatedPrompt = getFormatInstructions(visualEngineStr, inputRequirementStr);

  return {
    aiPrompt: `
You are a Primary 3 Math Teacher. Generate a ${difficulty} difficulty question about ${subtopic}.

${askText}

CRITICAL INSTRUCTIONS:
1. The 'questionText' must match the story logic but be phrased engagingly. Keep names and exact mathematical values EXACTLY as requested.
2. NEVER add extra unrequested questions (e.g., do not add "How many altogether?").
   - Keep the final question sentence exactly as intended.
   - DO NOT include the word "STORY:" or any other prefixes in your final generated questionText.
3. If there is no 'STORY:', you MUST use the exact string provided in 'askText'. DO NOT paraphrase or rewrite it.
4. Generate a logical solution sequence for the 'solutionSteps' array that matches the finalAnswer. Ensure the steps explicitly address the conversion mathematics.
5. DO NOT alter or append numerical values to the strings inside visualEngine parts. Keep the exact text provided in the template.
6. The 'visualEngine' and 'inputRequirement' fields MUST match the provided JSON schema EXACTLY. DO NOT invent or generate your own visual engine objects (like BAR_MODEL) if the template says NONE. If the provided visualEngine is {"componentToRender": "NONE", "componentData": {}}, you MUST output that EXACT literal object without adding anything.

Inputs for your generation:
- askText: ${askText}

${generatedPrompt}
`
  };
};
