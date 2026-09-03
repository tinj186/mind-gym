import { getRandomNames, getKgItems, getGramItems, getRandomLiquids, getRandomLocations } from '@/lib/utils/variable-bank';

export const advancedLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const kgFoods = getKgItems(3);
  const liquids = getRandomLiquids(3);
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
    case 'advanced_three_part_total': {
      // Variant 11: The 3-Part Total (Mixed Formatting)
      const b1 = Math.floor(Math.random() * 2) + 1; // 1 to 2
      const s1 = Math.floor(Math.random() * 3) * 100 + 100; // 100 to 300
      const v1G = (b1 * 1000) + s1;
      
      const v2G = Math.floor(Math.random() * 5) * 100 + 400; // 400 to 800
      const v3G = Math.floor(Math.random() * 5) * 100 + 400; // 400 to 800
      
      const totalG = v1G + v2G + v3G;
      const totalB = Math.floor(totalG / 1000);
      const totalS = totalG % 1000;
      
      answer = `${totalB} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`;

      let label1, label2, label3;
      if (selectedUnit.big === 'km') {
        label1 = "Distance 1"; label2 = "Distance 2"; label3 = "Distance 3";
      } else if (selectedUnit.big === 'kg') {
        label1 = `${kgFoods[0].item}'s mass`; label2 = `${kgFoods[1].item}'s mass`; label3 = `${kgFoods[2].item}'s mass`;
      } else {
        label1 = `${liquids[0]}'s volume`; label2 = `${liquids[1]}'s volume`; label3 = `${liquids[2]}'s volume`;
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: label1, size: v1G, layoutSize: v1G, segments: 1 },
            { value: label2, size: v2G, layoutSize: v2G, segments: 1 },
            { value: label3, size: v3G, layoutSize: v3G, segments: 1 }
          ],
          whole: "?"
        }
      });

      const makeAns = (val) => [`${val}`, `${val}${selectedUnit.small}`, `${val} ${selectedUnit.small}`];
      const makeEq3 = (a, b, c, d) => {
        const perms = [
          `${a} + ${b} + ${c}`, `${a} + ${c} + ${b}`,
          `${b} + ${a} + ${c}`, `${b} + ${c} + ${a}`,
          `${c} + ${a} + ${b}`, `${c} + ${b} + ${a}`
        ];
        return perms.flatMap(p => [
          `${p} = ${d}`,
          `${p.replace(/ /g, '')}=${d}`,
          `${p} = ${d} ${selectedUnit.small}`,
          `${p.replace(/ /g, '')}=${d}${selectedUnit.small}`
        ]);
      };

      if (isStructure) {
        const stories = {
          "km": `${names[0]} walks ${b1} km ${s1} m, runs ${v2G} m, and sprints ${v3G} m. Find the total distance covered.`,
          "kg": `A chef uses ${b1} kg ${s1} g of ${kgFoods[0].item}, ${v2G} g of ${kgFoods[1].item}, and ${v3G} g of ${kgFoods[2].item}. Find the total mass of the items.`,
          "ℓ": `A recipe requires ${b1} ℓ ${s1} ml of ${liquids[0]}, ${v2G} ml of ${liquids[1]}, and ${v3G} ml of ${liquids[2]}. Find the total volume.`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask for the total in ${selectedUnit.big} and ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Convert the first item into ${fullSmallLabel}:`, expectedAnswer: `${v1G} ${selectedUnit.small}`, acceptedAnswers: makeAns(v1G) },
            { label: `Write the working equation to find the total in ${fullSmallLabel}:`, expectedAnswer: `${v1G} + ${v2G} + ${v3G} = ${totalG}`, acceptedAnswers: makeEq3(v1G, v2G, v3G, totalG) },
            { label: `Convert the total into ${selectedUnit.big} and ${selectedUnit.small}:`, expectedAnswer: answer, acceptedAnswers: [answer, answer.replace(/ /g, ""), `${totalB}${selectedUnit.big} ${totalS}${selectedUnit.small}`, `${totalB} ${selectedUnit.big} ${totalS}${selectedUnit.small}`, `${totalB}${selectedUnit.big} ${totalS} ${selectedUnit.small}`] }
          ]
        });
      } else {
        askText = `Total of ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}, ${v2G} ${selectedUnit.small}, and ${v3G} ${selectedUnit.small}.`;
      }

      options = [
        answer,
        `${totalB} ${selectedUnit.big} ${totalS + 100} ${selectedUnit.small}`,
        `${totalB + 1} ${selectedUnit.big} ${totalS} ${selectedUnit.small}`,
        `${totalG} ${selectedUnit.big}`
      ];

      solutionSteps = `1. Convert the compound unit to ${fullSmallLabel}: ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} = ${v1G} ${selectedUnit.small}.\n2. Add all three parts: ${v1G} + ${v2G} + ${v3G} = ${totalG} ${selectedUnit.small}.\n3. Convert back to compound units: ${totalG} ${selectedUnit.small} = ${answer}.`;
      hint = `Make sure ALL items are in ${selectedUnit.small} before you add them together!`;
      break;
    }

    case 'advanced_threshold_check': {
      // Variant 12: The Threshold Check
      const maxB = Math.floor(Math.random() * 3) + 3; // 3 to 5
      const maxG = maxB * 1000;
      
      const part1G = Math.floor(Math.random() * 5) * 100 + 1200; // 1200 to 1600
      const part2G = Math.floor(Math.random() * 5) * 100 + 1100; // 1100 to 1500
      const totalUsedG = part1G + part2G;
      const leftG = maxG - totalUsedG;
      
      answer = `${leftG} ${selectedUnit.small}`;

      let label1, label2, label3;
      if (selectedUnit.big === 'km') {
        label1 = "Distance 1"; label2 = "Distance 2"; label3 = "Remaining";
      } else if (selectedUnit.big === 'kg') {
        label1 = `${kgFoods[0].item}`; label2 = `${kgFoods[1].item}`; label3 = "Remaining safe limit";
      } else {
        label1 = `${liquids[0]}`; label2 = `${liquids[1]}`; label3 = "Room left";
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: label1, size: part1G, layoutSize: part1G, segments: 1 },
            { value: label2, size: part2G, layoutSize: part2G, segments: 1 },
            { value: "?", size: leftG, layoutSize: leftG, segments: 1 }
          ],
          whole: `${maxB} ${selectedUnit.big}`,
          wholeLayoutSize: maxG
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
        const stories = {
          "km": `A hiker has a strict limit of ${maxB} km to travel today. He has already walked ${part1G} m and run ${part2G} m. How much remaining distance can he safely travel?`,
          "kg": `A sturdy bag can carry exactly ${maxB} kg of groceries before breaking. ${names[0]} puts in a ${part1G} g ${kgFoods[0].item} and a ${part2G} g ${kgFoods[1].item}. How many more grams of groceries can she safely add?`,
          "ℓ": `A large bucket holds exactly ${maxB} ℓ. It already has ${part1G} ml of ${liquids[0]} and ${part2G} ml of ${liquids[1]} mixed in. How much room is left in ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask for the remaining safe limit in ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Convert the total limit into ${fullSmallLabel}:`, expectedAnswer: `${maxG} ${selectedUnit.small}`, acceptedAnswers: makeAns(maxG) },
            { label: `Write the working equation to find the total of the items inside:`, expectedAnswer: `${part1G} + ${part2G} = ${totalUsedG}`, acceptedAnswers: makeEq(part1G, '+', part2G, totalUsedG) },
            { label: `Write the working equation to find the remaining limit:`, expectedAnswer: `${maxG} - ${totalUsedG} = ${leftG}`, acceptedAnswers: makeEq(maxG, '-', totalUsedG, leftG) },
            { label: `So, the remaining limit in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(leftG) }
          ]
        });
      } else {
        askText = `Max limit is ${maxB} ${selectedUnit.big}. Already used ${part1G} ${selectedUnit.small} and ${part2G} ${selectedUnit.small}. How much is left in ${selectedUnit.small}?`;
      }

      options = [
        answer,
        `${leftG + 100} ${selectedUnit.small}`,
        `${leftG - 100} ${selectedUnit.small}`,
        `${totalUsedG} ${selectedUnit.small}`
      ];

      solutionSteps = `1. Convert the maximum limit to ${fullSmallLabel}: ${maxB} ${selectedUnit.big} = ${maxG} ${selectedUnit.small}.\n2. Find the total amount used so far: ${part1G} + ${part2G} = ${totalUsedG} ${selectedUnit.small}.\n3. Subtract the total used from the maximum limit: ${maxG} - ${totalUsedG} = ${answer}.`;
      hint = `First, convert the limit into ${selectedUnit.small}. Then find out the total you've used so far before subtracting!`;
      break;
    }

    case 'advanced_two_step_comparison': {
      // Variant 13: 2-Step Comparison
      const b1 = Math.floor(Math.random() * 3) + 1; // 1 to 3
      const s1 = Math.floor(Math.random() * 8) * 100 + 100;
      const valA_G = (b1 * 1000) + s1;
      
      const diffG = Math.floor(Math.random() * 6) * 100 + 200; // 200 to 700 diff
      const isLighter = Math.random() > 0.5;
      
      const valB_G = isLighter ? valA_G - diffG : valA_G + diffG;
      const totalG = valA_G + valB_G;
      
      answer = `${totalG} ${selectedUnit.small}`;

      const itemAName = selectedUnit.big === 'km' ? "Path 1" : selectedUnit.big === 'kg' ? "Box A" : "Jug A";
      const itemBName = selectedUnit.big === 'km' ? "Path 2" : selectedUnit.big === 'kg' ? "Box B" : "Jug B";
      const compWord = selectedUnit.big === 'km' ? (isLighter ? "shorter" : "longer") : selectedUnit.big === 'kg' ? (isLighter ? "lighter" : "heavier") : (isLighter ? "less" : "more");

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "COMPARISON",
          isStatic: true,
          bar1: { name: itemAName, size: valA_G, layoutSize: valA_G, value: `${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}`, segments: 1 },
          bar2: { name: itemBName, size: valB_G, layoutSize: valB_G, value: "?", segments: 1 },
          diff: `${diffG} ${selectedUnit.small}`,
          whole: "?"
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
        askText = `${itemAName} ${selectedUnit.big === 'km' ? 'is' : 'weighs/holds'} ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}. ${itemBName} ${selectedUnit.big === 'km' ? 'is' : 'weighs/holds'} ${diffG} ${selectedUnit.small} ${compWord}. What is the total in ${selectedUnit.small}?`;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Convert ${itemAName} into ${fullSmallLabel}:`, expectedAnswer: `${valA_G} ${selectedUnit.small}`, acceptedAnswers: makeAns(valA_G) },
            { label: `Write the working equation to find ${itemBName} in ${fullSmallLabel}:`, expectedAnswer: `${valA_G} ${isLighter ? '-' : '+'} ${diffG} = ${valB_G}`, acceptedAnswers: makeEq(valA_G, isLighter ? '-' : '+', diffG, valB_G) },
            { label: `Write the working equation to find the total in ${fullSmallLabel}:`, expectedAnswer: `${valA_G} + ${valB_G} = ${totalG}`, acceptedAnswers: makeEq(valA_G, '+', valB_G, totalG) },
            { label: `So, the total in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(totalG) }
          ]
        });
      } else {
        askText = `A is ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small}. B is ${diffG} ${selectedUnit.small} ${compWord}. Find total in ${selectedUnit.small}.`;
      }

      options = [
        answer,
        `${valA_G + diffG} ${selectedUnit.small}`,
        `${valB_G + diffG} ${selectedUnit.small}`,
        `${totalG + 100} ${selectedUnit.small}`
      ];

      solutionSteps = `1. Convert ${itemAName}: ${b1} ${selectedUnit.big} ${s1} ${selectedUnit.small} = ${valA_G} ${selectedUnit.small}.\n2. Find ${itemBName}: It is ${compWord}, so ${valA_G} ${isLighter ? '-' : '+'} ${diffG} = ${valB_G} ${selectedUnit.small}.\n3. Find total: ${valA_G} + ${valB_G} = ${totalG} ${selectedUnit.small}.`;
      hint = `First, convert Item A to ${selectedUnit.small}. Then calculate Item B. Don't forget the final step is to add them together!`;
      break;
    }

    case 'advanced_cutting_ribbon': {
      // Variant 14: Cutting a Ribbon
      const totalB = Math.floor(Math.random() * 2) + 4; // 4 to 5
      const totalG = totalB * 1000;
      
      const part1G = Math.floor(Math.random() * 5) * 100 + 1200; // 1200 to 1600
      const part2G = Math.floor(Math.random() * 5) * 100 + 1500; // 1500 to 1900
      
      const totalUsedG = part1G + part2G;
      const leftG = totalG - totalUsedG;
      
      const leftB = Math.floor(leftG / 1000);
      const leftS = leftG % 1000;
      
      answer = `${leftB} ${selectedUnit.big} ${leftS} ${selectedUnit.small}`;

      let label1, label2, label3;
      if (selectedUnit.big === 'km') {
        label1 = "Distance 1"; label2 = "Distance 2"; label3 = "Distance left";
      } else if (selectedUnit.big === 'kg') {
        label1 = `${kgFoods[0].item} used`; label2 = `${kgFoods[1].item} used`; label3 = "Left";
      } else {
        label1 = `${liquids[0]} used`; label2 = `${liquids[1]} used`; label3 = "Left";
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: label1, size: part1G, layoutSize: part1G, segments: 1 },
            { value: label2, size: part2G, layoutSize: part2G, segments: 1 },
            { value: "?", size: leftG, layoutSize: leftG, segments: 1 }
          ],
          whole: `${totalB} ${selectedUnit.big}`,
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
        const stories = {
          "km": `A hiker plans to walk ${totalB} km. He walks ${part1G} m before lunch, and ${part2G} m after lunch. How much distance is left in km and m?`,
          "kg": `A tailor has ${totalB} kg of heavy cloth. He uses ${part1G} g for a large coat and ${part2G} g for pants. How much cloth is left over in kg and g?`,
          "ℓ": `A tank has ${totalB} ℓ of water. ${names[0]} uses ${part1G} ml to wash a bike and ${part2G} ml for plants. How much water is left over in ℓ and ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask for the remaining amount in ${selectedUnit.big} and ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Convert the starting total into ${fullSmallLabel}:`, expectedAnswer: `${totalG} ${selectedUnit.small}`, acceptedAnswers: makeAns(totalG) },
            { label: `Write the working equation to find the total used parts in ${fullSmallLabel}:`, expectedAnswer: `${part1G} + ${part2G} = ${totalUsedG}`, acceptedAnswers: makeEq(part1G, '+', part2G, totalUsedG) },
            { label: `Write the working equation to find the remainder in ${fullSmallLabel}:`, expectedAnswer: `${totalG} - ${totalUsedG} = ${leftG}`, acceptedAnswers: makeEq(totalG, '-', totalUsedG, leftG) },
            { label: `Convert the remainder into ${selectedUnit.big} and ${selectedUnit.small}:`, expectedAnswer: answer, acceptedAnswers: [answer, answer.replace(/ /g, ""), `${leftB}${selectedUnit.big} ${leftS}${selectedUnit.small}`, `${leftB} ${selectedUnit.big} ${leftS}${selectedUnit.small}`, `${leftB}${selectedUnit.big} ${leftS} ${selectedUnit.small}`] }
          ]
        });
      } else {
        askText = `Start with ${totalB} ${selectedUnit.big}. Use ${part1G} ${selectedUnit.small} and ${part2G} ${selectedUnit.small}. Find remaining in ${selectedUnit.big} and ${selectedUnit.small}.`;
      }

      options = [
        answer,
        `${leftB} ${selectedUnit.big} ${leftS + 100} ${selectedUnit.small}`,
        `${leftB + 1} ${selectedUnit.big} ${leftS} ${selectedUnit.small}`,
        `${leftG} ${selectedUnit.small}`
      ];

      solutionSteps = `1. Convert total: ${totalB} ${selectedUnit.big} = ${totalG} ${selectedUnit.small}.\n2. Find total used: ${part1G} + ${part2G} = ${totalUsedG} ${selectedUnit.small}.\n3. Subtract from total: ${totalG} - ${totalUsedG} = ${leftG} ${selectedUnit.small}.\n4. Convert back: ${leftG} ${selectedUnit.small} = ${answer}.`;
      hint = `First, convert the starting amount to ${selectedUnit.small}. Then group the used pieces together before you subtract!`;
      break;
    }

    case 'advanced_hidden_base': {
      // Variant 15: The "Hidden Base" Conversion
      const totalB = Math.floor(Math.random() * 8) + 2; // 2 to 9
      const totalG = totalB * 1000;
      
      const uniqueG = Math.floor(Math.random() * 10) * 100 + 200; // 200 to 1100
      
      const remainingG = totalG - uniqueG;
      const itemCount = Math.floor(Math.random() * 5) + 2; // 2 to 6
      
      answer = `${remainingG} ${selectedUnit.small}`;

      let identicalName, uniqueName;
      if (selectedUnit.big === 'km') {
        identicalName = `${itemCount} Legs`; uniqueName = "Leg A";
      } else if (selectedUnit.big === 'kg') {
        identicalName = `${itemCount} Books`; uniqueName = "Toy";
      } else {
        identicalName = `${itemCount} Cups`; uniqueName = "Jug";
      }

      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          type: "PART_WHOLE",
          isStatic: true,
          parts: [
            { value: uniqueName, size: uniqueG, layoutSize: uniqueG, segments: 1 },
            { value: identicalName, size: remainingG, layoutSize: remainingG, segments: itemCount }
          ],
          whole: `${totalB} ${selectedUnit.big}`,
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
        const stories = {
          "km": `The total distance is ${totalB} km. Leg A is ${uniqueG} m. The other ${itemCount} legs are equal in length. What is the total distance of the ${itemCount} legs together in m?`,
          "kg": `The total mass of ${itemCount} identical books and 1 toy is ${totalB} kg. The toy weighs ${uniqueG} g. What is the total mass of the ${itemCount} books in grams?`,
          "ℓ": `${itemCount} identical cups and 1 jug hold ${totalB} ℓ. The jug holds ${uniqueG} ml. What is the total volume of the ${itemCount} cups together in ml?`
        };
        
        let structText = `STORY: ${stories[selectedUnit.big]}`;
        structText += `\n\nCRITICAL INSTRUCTION: Rewrite the story dynamically. Ask for the TOTAL mass/volume/distance of the ${itemCount} identical items together in ${selectedUnit.small}.`;
        askText = structText;

        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: `Convert the total into ${fullSmallLabel}:`, expectedAnswer: `${totalG} ${selectedUnit.small}`, acceptedAnswers: makeAns(totalG) },
            { label: `Write the working equation to find the total value of the identical items:`, expectedAnswer: `${totalG} - ${uniqueG} = ${remainingG}`, acceptedAnswers: makeEq(totalG, '-', uniqueG, remainingG) },
            { label: `So, the total value in ${fullSmallLabel} is:`, expectedAnswer: answer, acceptedAnswers: makeAns(remainingG) }
          ]
        });
      } else {
        askText = `Total is ${totalB} ${selectedUnit.big}. One part is ${uniqueG} ${selectedUnit.small}. The rest is ${itemCount} equal parts. Find total of ${itemCount} equal parts.`;
      }

      options = [
        answer,
        `${remainingG + 100} ${selectedUnit.small}`,
        `${totalG - uniqueG + 200} ${selectedUnit.small}`,
        `${uniqueG} ${selectedUnit.small}`
      ];

      solutionSteps = `1. Convert total: ${totalB} ${selectedUnit.big} = ${totalG} ${selectedUnit.small}.\n2. Subtract the unique part: ${totalG} - ${uniqueG} = ${remainingG} ${selectedUnit.small}.\n3. Since we want the total of the ${itemCount} identical items, ${remainingG} ${selectedUnit.small} is the answer.`;
      hint = `Don't be tricked by the ${itemCount} identical items! The question asks for their TOTAL value, so you just need to subtract the one unique item from the grand total.`;
      break;
    }

    default:
      throw new Error(`Variant not found in Advanced logic: ${activeVariant}`);
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
