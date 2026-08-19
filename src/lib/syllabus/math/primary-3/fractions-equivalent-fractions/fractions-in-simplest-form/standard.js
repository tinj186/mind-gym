import { getRandomCountableItems, getRandomDivisibleFoods } from '../../../../../utils/variable-bank.js';

export const standardLogic = {
  generate: function (difficulty, activeVariant, type, context, selectedContextItem, getQText) {
    let askText = "";
    let hint = "";
    let solutionSteps = [];
    let answer = "";
    let customConstraints = "";
    let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
    let inputRequirementStr = null;

    if (activeVariant === 'standard_even_denominators') {
      const options = [
        { num: 2, denom: 10, div: 2 }, // 1/5
        { num: 4, denom: 10, div: 2 }, // 2/5
        { num: 6, denom: 10, div: 2 }, // 3/5
        { num: 8, denom: 10, div: 2 }, // 4/5
        { num: 2, denom: 12, div: 2 }, // 1/6
        { num: 10, denom: 12, div: 2 }, // 5/6
        { num: 4, denom: 12, div: 4 }, // 1/3
        { num: 8, denom: 12, div: 4 }, // 2/3
        { num: 6, denom: 12, div: 6 }  // 1/2
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { num, denom, div } = selected;
      const simpleNum = num / div;
      const simpleDenom = denom / div;
      answer = `${simpleNum}/${simpleDenom}`;
      
      const isFood = Math.random() > 0.5;
      let structText, shortText;
      if (isFood) {
        const food = getRandomDivisibleFoods(1)[0];
        structText = `A baker bakes ${denom} ${food}s. ${num} of them are chocolate. Express the fraction of chocolate ${food}s in its simplest form.`;
      } else {
        const item = getRandomCountableItems(1)[0];
        structText = `${context.name} has ${denom} ${item}s. ${num} of them are blue. Express the fraction of blue ${item}s in its simplest form.`;
      }
      shortText = `Express ${num}/${denom} in its simplest form.`;

      hint = `What is the highest common number you can divide both the top and bottom by?`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "FRACTION_EQUIVALENCE",
        componentData: {
          before: { num: num, denom: denom },
          after: { num: "?", denom: "?" },
          operator: "÷",
          factor: "?"
        }
      });

      if (type === 'Structured') {
        askText = structText;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Number to divide to simplify the fraction", expectedAnswer: String(div) },
            { label: "Simplified numerator", expectedAnswer: String(simpleNum) },
            { label: "Simplified denominator", expectedAnswer: String(simpleDenom) },
            { label: "Simplified fraction", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `1. Write the starting fraction: ${num}/${denom}.`,
          `2. What is the highest common number you can divide both by? It's ${div}.`,
          `3. Write the simplest form: ${num} ÷ ${div} = ${simpleNum} and ${denom} ÷ ${div} = ${simpleDenom}.`,
          `4. The simplest form is ${answer}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `Divide the top and bottom numbers by ${div}.`,
          `${num} ÷ ${div} = ${simpleNum}`,
          `${denom} ÷ ${div} = ${simpleDenom}`,
          `The simplest form is ${answer}.`
        ];
      }
      
    } else if (activeVariant === 'standard_odd_denominators') {
      const options = [
        { num: 3, denom: 9, div: 3 }, // 1/3
        { num: 6, denom: 9, div: 3 }, // 2/3
        { num: 3, denom: 15, div: 3 }, // 1/5
        { num: 6, denom: 15, div: 3 }, // 2/5
        { num: 9, denom: 15, div: 3 }, // 3/5
        { num: 12, denom: 15, div: 3 }, // 4/5
        { num: 5, denom: 15, div: 5 }, // 1/3
        { num: 10, denom: 15, div: 5 } // 2/3
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { num, denom, div } = selected;
      const simpleNum = num / div;
      const simpleDenom = denom / div;
      answer = `${simpleNum}/${simpleDenom}`;
      
      let structText, shortText;
      const item = getRandomCountableItems(1)[0];
      structText = `${context.name} has ${denom} ${item}s. ${num} of them are blue. What fraction of the ${item}s are blue? Express your answer in its simplest form.`;
      shortText = `Simplify ${num}/${denom}.`;

      hint = `Find a number that can divide both the top and bottom numbers perfectly.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "FRACTION_EQUIVALENCE",
        componentData: {
          before: { num: num, denom: denom },
          after: { num: "?", denom: "?" },
          operator: "÷",
          factor: "?"
        }
      });

      if (type === 'Structured') {
        askText = structText;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Number to divide to simplify the fraction", expectedAnswer: String(div) },
            { label: "Simplified numerator", expectedAnswer: String(simpleNum) },
            { label: "Simplified denominator", expectedAnswer: String(simpleDenom) },
            { label: "Simplified fraction", expectedAnswer: answer }
          ]
        });
      } else {
        askText = getQText(structText, shortText);
      }
      
      solutionSteps = [
        `Divide both numbers by ${div}.`,
        `${num} ÷ ${div} = ${simpleNum}`,
        `${denom} ÷ ${div} = ${simpleDenom}`,
        `The simplest form is ${answer}.`
      ];
      
    } else if (activeVariant === 'standard_add_and_simplify') {
      const options = [
        { num1: 1, num2: 3, denom: 8, div: 4 }, // 4/8 -> 1/2
        { num1: 2, num2: 4, denom: 10, div: 2 }, // 6/10 -> 3/5
        { num1: 1, num2: 5, denom: 12, div: 6 }, // 6/12 -> 1/2
        { num1: 2, num2: 6, denom: 12, div: 4 }, // 8/12 -> 2/3
        { num1: 4, num2: 2, denom: 10, div: 2 }, // 6/10 -> 3/5
        { num1: 3, num2: 3, denom: 9, div: 3 } // 6/9 -> 2/3
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { num1, num2, denom, div } = selected;
      const sum = num1 + num2;
      const simpleNum = sum / div;
      const simpleDenom = denom / div;
      answer = `${simpleNum}/${simpleDenom}`;
      
      let structText, shortText;
      const food = getRandomDivisibleFoods(1)[0];
      structText = `${context.name} ate ${num1}/${denom} of a ${food} on Monday and ${num2}/${denom} of the ${food} on Tuesday. What fraction of the ${food} did ${context.pronoun} eat altogether? Express your answer in its simplest form.`;
      shortText = `Add ${num1}/${denom} and ${num2}/${denom}. Express the answer in its simplest form.`;

      hint = `First add the fractions, then simplify your answer.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: [
            {
              modelType: "PART_WHOLE",
              topBrackets: [
                { size: sum, label: "?" },
                { size: denom - sum, label: "" }
              ],
              parts: [
                { value: "", segments: num1, layoutSize: num1, bgClass: "bg-amber-500 text-white" }, 
                { value: "", segments: num2, layoutSize: num2, bgClass: "bg-emerald-500 text-white" }, 
                { value: "", segments: denom - sum, layoutSize: denom - sum, bgClass: "bg-slate-200 text-slate-800" }
              ],
              whole: "?",
              barLabel: "Total",
              isStatic: true
            }
          ]
        }
      });

      if (type === 'Structured') {
        askText = structText;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Add the fractions", expectedAnswer: `${sum}/${denom}` },
            { label: "Simplify the result", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `1. Add the fractions: ${num1}/${denom} + ${num2}/${denom} = ${sum}/${denom}.`,
          `2. Simplify the result by dividing top and bottom by ${div}.`,
          `3. ${sum} ÷ ${div} = ${simpleNum} and ${denom} ÷ ${div} = ${simpleDenom}.`,
          `4. The simplest form is ${answer}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `First, add the fractions together: ${num1}/${denom} + ${num2}/${denom} = ${sum}/${denom}.`,
          `Then, simplify by dividing the numerator and denominator by ${div}.`,
          `${sum} ÷ ${div} = ${simpleNum}`,
          `${denom} ÷ ${div} = ${simpleDenom}`,
          `The final answer is ${answer}.`
        ];
      }
      
    } else if (activeVariant === 'standard_subtract_and_simplify') {
      const options = [
        { num1: 8, num2: 2, denom: 10, div: 2 }, // 6/10 -> 3/5
        { num1: 7, num2: 3, denom: 8, div: 4 }, // 4/8 -> 1/2
        { num1: 11, num2: 5, denom: 12, div: 6 }, // 6/12 -> 1/2
        { num1: 7, num2: 1, denom: 9, div: 3 }, // 6/9 -> 2/3
        { num1: 10, num2: 2, denom: 12, div: 4 } // 8/12 -> 2/3
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { num1, num2, denom, div } = selected;
      const diff = num1 - num2;
      const simpleNum = diff / div;
      const simpleDenom = denom / div;
      answer = `${simpleNum}/${simpleDenom}`;
      
      let structText, shortText;
      const fluids = ["juice", "milk", "water", "tea", "sirap bandung"];
      const liquid = fluids[Math.floor(Math.random() * fluids.length)];
      structText = `A jug is ${num1}/${denom} full of ${liquid}. ${context.name} pours out ${num2}/${denom} of the ${liquid}. What fraction of the ${liquid} is left? Express your answer in its simplest form.`;
      shortText = `Subtract ${num2}/${denom} from ${num1}/${denom}. Express the answer in its simplest form.`;

      hint = `First subtract the fractions, then simplify your answer.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: [
            {
              modelType: "PART_WHOLE",
              topBrackets: [
                { size: diff, label: "?" },
                { size: num2, label: "" },
                { size: denom - num1, label: "" }
              ],
              parts: [
                { value: "", segments: diff, layoutSize: diff, bgClass: "bg-emerald-500 text-white" }, 
                { value: "", segments: num2, layoutSize: num2, bgClass: "bg-amber-500 text-white" }, 
                { value: "", segments: denom - num1, layoutSize: denom - num1, bgClass: "bg-slate-200 text-slate-800" }
              ],
              whole: "?",
              barLabel: liquid,
              isStatic: true
            }
          ]
        }
      });

      if (type === 'Structured') {
        askText = structText;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Subtract the fractions", expectedAnswer: `${diff}/${denom}` },
            { label: "Simplify the result", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `1. Subtract the fractions: ${num1}/${denom} - ${num2}/${denom} = ${diff}/${denom}.`,
          `2. Simplify the result by dividing top and bottom by ${div}.`,
          `3. ${diff} ÷ ${div} = ${simpleNum} and ${denom} ÷ ${div} = ${simpleDenom}.`,
          `4. The simplest form is ${answer}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `First, subtract the fractions: ${num1}/${denom} - ${num2}/${denom} = ${diff}/${denom}.`,
          `Then, simplify by dividing the numerator and denominator by ${div}.`,
          `${diff} ÷ ${div} = ${simpleNum}`,
          `${denom} ÷ ${div} = ${simpleDenom}`,
          `The final answer is ${answer}.`
        ];
      }
      
    } else if (activeVariant === 'standard_missing_divisor') {
      const options = [
        { num: 6, denom: 12, div: 6, simpleNum: 1, simpleDenom: 2 },
        { num: 8, denom: 12, div: 4, simpleNum: 2, simpleDenom: 3 },
        { num: 6, denom: 10, div: 2, simpleNum: 3, simpleDenom: 5 },
        { num: 6, denom: 9, div: 3, simpleNum: 2, simpleDenom: 3 },
        { num: 10, denom: 15, div: 5, simpleNum: 2, simpleDenom: 3 }
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { num, denom, div, simpleNum, simpleDenom } = selected;
      answer = String(div);
      
      let structText, shortText;
      structText = `${context.name} simplified ${num}/${denom} and got ${simpleNum}/${simpleDenom}. To do this, ${context.pronoun} divided the numerator and denominator by the exact same number. What number did ${context.pronoun} divide by?`;
      shortText = `${num}/${denom} is simplified to ${simpleNum}/${simpleDenom} by dividing the top and bottom by what number?`;

      hint = `Divide the starting numerator by the simplified numerator.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "FRACTION_EQUIVALENCE",
        componentData: {
          before: { num: num, denom: denom },
          after: { num: simpleNum, denom: simpleDenom },
          operator: "÷",
          factor: "?"
        }
      });

      if (type === 'Structured') {
        askText = structText;
        inputRequirementStr = JSON.stringify({
          inputType: "MULTI_STEP_INPUT",
          steps: [
            { label: "Numerator working", expectedAnswer: `${num} / ${simpleNum} = ${div}` },
            { label: "Denominator working", expectedAnswer: `${denom} / ${simpleDenom} = ${div}` },
            { label: "Divided number", expectedAnswer: String(div) }
          ]
        });
        solutionSteps = [
          `1. Divide the original numerator by the simplified numerator to find the divisor.`,
          `2. ${num} ÷ ${simpleNum} = ${div}`,
          `3. Check with the bottom numbers: ${denom} ÷ ${simpleDenom} = ${div}`,
          `4. So, the number you divide by is ${div}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `Divide the original numerator by the simplified numerator to find the divisor.`,
          `${num} ÷ ${simpleNum} = ${div}`,
          `Check with the bottom numbers: ${denom} ÷ ${simpleDenom} = ${div}`,
          `So, the number you divide by is ${div}.`
        ];
      }
    }

    return {
      askText,
      hint,
      solutionSteps,
      answer,
      customConstraints,
      visualEngineStr,
      inputRequirementStr
    };
  }
};
