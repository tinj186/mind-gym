import { getRandomCountableItems } from '../../../../../utils/variable-bank.js';

export const advancedLogic = {
  generate: function (difficulty, activeVariant, type, context, selectedContextItem, getQText) {
    let askText = "";
    let hint = "";
    let solutionSteps = [];
    let answer = "";
    let customConstraints = "";
    let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: { hideVisual: true } });
    let inputRequirementStr = null;

    if (activeVariant === 'advanced_remaining_amount') {
      const options = [
        { total: 12, used: 4, diff: 8, div: 4 }, // 8/12 -> 2/3
        { total: 12, used: 3, diff: 9, div: 3 }, // 9/12 -> 3/4
        { total: 10, used: 6, diff: 4, div: 2 }, // 4/10 -> 2/5
        { total: 10, used: 2, diff: 8, div: 2 }, // 8/10 -> 4/5
        { total: 15, used: 5, diff: 10, div: 5 } // 10/15 -> 2/3
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { total, used, diff, div } = selected;
      const simpleNum = diff / div;
      const simpleDenom = total / div;
      answer = `${simpleNum}/${simpleDenom}`;
      
      const item = getRandomCountableItems(1)[0];
      let structText = `${context.name} buys a pack of ${total} ${item}s. ${context.name} gives ${used} ${item}s to a sibling. What fraction of the ${item}s are left? Express your answer in its simplest form.`;
      let shortText = `Total ${total} items. ${used} are used. What fraction is left over, in simplest form?`;

      hint = `First, find out how many are left. Then write it as a fraction out of the total and simplify.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: [
            {
              modelType: "PART_WHOLE",
              topBrackets: [
                { size: diff, label: "?" },
                { size: used, label: "" }
              ],
              parts: [
                { value: "", segments: diff, layoutSize: diff, bgClass: "bg-emerald-500 text-white" }, 
                { value: "", segments: used, layoutSize: used, bgClass: "bg-amber-500 text-white" }
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
            { label: "Number of items left", expectedAnswer: `${total} - ${used} = ${diff}` },
            { label: "Fraction left", expectedAnswer: `${diff}/${total}` },
            { label: "Simplest form", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `1. Find the number of items left: ${total} - ${used} = ${diff}.`,
          `2. Write this as a fraction out of ${total}: ${diff}/${total}.`,
          `3. Simplify the fraction by dividing top and bottom by ${div}.`,
          `4. The simplest form is ${answer}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `Find the number of items left: ${total} - ${used} = ${diff}.`,
          `Write this as a fraction out of ${total}: ${diff}/${total}.`,
          `Simplify the fraction: ${diff}/${total} = ${answer}.`
        ];
      }
      
    } else if (activeVariant === 'advanced_grouping') {
      const options = [
        { g1: 4, g2: 6, total: 10, div: 2 }, // 4/10 -> 2/5 (g1)
        { g1: 6, g2: 6, total: 12, div: 6 }, // 6/12 -> 1/2 (g1)
        { g1: 8, g2: 4, total: 12, div: 4 }, // 8/12 -> 2/3 (g1)
        { g1: 5, g2: 10, total: 15, div: 5 }, // 5/15 -> 1/3 (g1)
        { g1: 3, g2: 9, total: 12, div: 3 } // 3/12 -> 1/4 (g1)
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { g1, g2, total, div } = selected;
      const simpleNum = g1 / div;
      const simpleDenom = total / div;
      answer = `${simpleNum}/${simpleDenom}`;
      
      const animalPairs = [
        ["cat", "dog"],
        ["rabbit", "hamster"],
        ["parrot", "canary"],
        ["turtle", "goldfish"]
      ];
      const animals = animalPairs[Math.floor(Math.random() * animalPairs.length)];
      const a1 = animals[0];
      const a2 = animals[1];
      
      let structText = `A pet store has ${g1} ${a1}s and ${g2} ${a2}s. What fraction of the animals are ${a1}s? Express your answer in its simplest form.`;
      let shortText = `${g1} ${a1}s and ${g2} ${a2}s. What fraction of the animals are ${a1}s? (Simplest form).`;

      hint = `First, find the total number of animals. Then, write the fraction for the ${a1}s and simplify it.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: [
            {
              modelType: "PART_WHOLE",
              parts: [
                { value: `${g1} ${a1}s`, segments: g1, layoutSize: g1 }, 
                { value: `${g2} ${a2}s`, segments: g2, layoutSize: g2 }
              ],
              whole: "?",
              barLabel: "Animals",
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
            { label: "Total number of animals", expectedAnswer: `${g1} + ${g2} = ${total}` },
            { label: `Fraction of ${a1}s`, expectedAnswer: `${g1}/${total}` },
            { label: "Simplest form", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `1. Total number of animals: ${g1} + ${g2} = ${total}.`,
          `2. Fraction of ${a1}s: ${g1}/${total}.`,
          `3. Simplify the fraction by dividing top and bottom by ${div}.`,
          `4. The simplest form is ${answer}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `Total number of animals: ${g1} + ${g2} = ${total}.`,
          `Fraction of ${a1}s: ${g1}/${total}.`,
          `Simplify the fraction: ${g1}/${total} = ${answer}.`
        ];
      }

    } else if (activeVariant === 'advanced_reverse_simplification') {
      const options = [
        { num: 6, denom: 9, simpleNum: 2, simpleDenom: 3, div: 3 },
        { num: 8, denom: 12, simpleNum: 2, simpleDenom: 3, div: 4 },
        { num: 6, denom: 10, simpleNum: 3, simpleDenom: 5, div: 2 },
        { num: 5, denom: 15, simpleNum: 1, simpleDenom: 3, div: 5 },
        { num: 9, denom: 12, simpleNum: 3, simpleDenom: 4, div: 3 }
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { num, denom, simpleNum, simpleDenom, div } = selected;
      answer = String(num);
      
      const item = getRandomCountableItems(1)[0];
      let structText = `${context.name} took some ${item}s from a packet of ${denom}. ${context.name} calculated that ${context.pronoun} took exactly ${simpleNum}/${simpleDenom} of the packet. How many ${item}s did ${context.pronoun} actually take?`;
      let shortText = `A fraction simplifies to ${simpleNum}/${simpleDenom}. Its denominator was ${denom}. What was the numerator?`;

      hint = `Think about equivalent fractions. What do you multiply ${simpleDenom} by to get ${denom}? Multiply the top number by the same amount.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "FRACTION_EQUIVALENCE",
        componentData: {
          before: { num: "?", denom: denom },
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
            { label: "Multiplier for the denominator", expectedAnswer: `${denom} / ${simpleDenom} = ${div}` },
            { label: "Multiply the numerator", expectedAnswer: `${simpleNum} x ${div} = ${num}` },
            { label: "Final answer", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `1. Write the equivalent fractions: ?/${denom} = ${simpleNum}/${simpleDenom}.`,
          `2. Find the multiplier for the denominator: ${denom} ÷ ${simpleDenom} = ${div}.`,
          `3. Multiply the numerator by the same amount: ${simpleNum} × ${div} = ${num}.`,
          `4. The numerator is ${num}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `Write the equivalent fractions: ?/${denom} = ${simpleNum}/${simpleDenom}.`,
          `Find the multiplier for the denominator: ${denom} ÷ ${simpleDenom} = ${div}.`,
          `Multiply the numerator by the same amount: ${simpleNum} × ${div} = ${num}.`,
          `The numerator is ${num}.`
        ];
      }

    } else if (activeVariant === 'advanced_money_context') {
      const options = [
        { spend: 4, total: 10, div: 2 }, // 4/10 -> 2/5
        { spend: 2, total: 10, div: 2 }, // 2/10 -> 1/5
        { spend: 6, total: 10, div: 2 }, // 6/10 -> 3/5
        { spend: 8, total: 10, div: 2 }, // 8/10 -> 4/5
        { spend: 5, total: 15, div: 5 }  // 5/15 -> 1/3
      ];
      
      const selected = options[Math.floor(Math.random() * options.length)];
      const { spend, total, div } = selected;
      const simpleNum = spend / div;
      const simpleDenom = total / div;
      answer = `${simpleNum}/${simpleDenom}`;
      
      const item = getRandomCountableItems(1)[0];
      let structText = `${context.name} had $${total}. ${context.name} spent $${spend} on a ${item}. What fraction of ${context.pronoun === 'they' ? 'their' : context.pronoun === 'he' ? 'his' : 'her'} money did ${context.pronoun} spend? Express your answer in its simplest form.`;
      let shortText = `Spent $${spend} out of $${total}. Express the fraction of money spent in its simplest form.`;

      hint = `Write the amount spent over the total amount, then simplify the fraction.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: [
            {
              modelType: "PART_WHOLE",
              parts: [
                { value: `$${spend}`, segments: spend, layoutSize: spend }, 
                { value: "", segments: total - spend, layoutSize: total - spend }
              ],
              whole: `$${total}`,
              barLabel: "Money",
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
            { label: "Fraction of money spent", expectedAnswer: `${spend}/${total}` },
            { label: "Simplest form", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `1. Write the fraction of money spent: ${spend}/${total}.`,
          `2. Simplify the fraction by dividing top and bottom by ${div}.`,
          `3. The simplest form is ${answer}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `Write the fraction of money spent: ${spend}/${total}.`,
          `Simplify the fraction by dividing top and bottom by ${div}.`,
          `The simplest form is ${answer}.`
        ];
      }

    } else if (activeVariant === 'advanced_time_context') {
      const contexts = [
        {
          denom: 24,
          label: "the day",
          totalLabel: "1 Day",
          introText: "There are 24 hours in a day.",
          step1Label: "Total hours in a day",
          options: [
            { hours: 8, div: 8, activity: "sleeps" },
            { hours: 6, div: 6, activity: "reads" },
            { hours: 4, div: 4, activity: "plays sports" },
            { hours: 2, div: 2, activity: "does homework" },
            { hours: 12, div: 12, activity: "is awake" }
          ]
        },
        {
          denom: 6,
          label: "the school day",
          totalLabel: "School Day",
          introText: "A school day is 6 hours long.",
          step1Label: "Total hours in a school day",
          options: [
            { hours: 1, div: 1, activity: "has recess" },
            { hours: 2, div: 2, activity: "studies math" },
            { hours: 3, div: 3, activity: "does art" }
          ]
        },
        {
          denom: 16,
          label: "their waking hours",
          totalLabel: "Waking Hrs",
          introText: `${context.name} has 16 waking hours in a day.`,
          step1Label: "Total waking hours",
          options: [
            { hours: 4, div: 4, activity: "plays outside" },
            { hours: 2, div: 2, activity: "watches TV" },
            { hours: 8, div: 8, activity: "is at school" }
          ]
        },
        {
          denom: 8,
          label: "the workday",
          totalLabel: "Workday",
          introText: "A typical workday is 8 hours long.",
          step1Label: "Total hours in a workday",
          options: [
            { hours: 2, div: 2, activity: "is in meetings" },
            { hours: 4, div: 4, activity: "works on a computer" }
          ]
        }
      ];
      
      const contextSelected = contexts[Math.floor(Math.random() * contexts.length)];
      const { denom, label, totalLabel, introText, step1Label } = contextSelected;
      
      const option = contextSelected.options[Math.floor(Math.random() * contextSelected.options.length)];
      const { hours, div, activity } = option;

      const simpleNum = hours / div;
      const simpleDenom = denom / div;
      answer = `${simpleNum}/${simpleDenom}`;
      
      let structText = `${introText} ${context.name} ${activity} for ${hours} hours. What fraction of ${label} does ${context.pronoun} spend on this? Express your answer in its simplest form.`;
      let shortText = `${introText} An activity takes ${hours} hours. What fraction of ${label} is this?`;

      hint = `Write the hours spent over the total hours (${denom}), then simplify.`;
      
      visualEngineStr = JSON.stringify({
        componentToRender: "BAR_MODEL",
        componentData: {
          models: [
            {
              modelType: "PART_WHOLE",
              topBrackets: [
                { size: hours, label: "?" }
              ],
              parts: [
                { value: "", segments: hours, layoutSize: hours, bgClass: "bg-emerald-500 text-white" }, 
                { value: "", segments: denom - hours, layoutSize: denom - hours, bgClass: "bg-slate-200 text-slate-800" }
              ],
              whole: "?",
              barLabel: totalLabel,
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
            { label: step1Label, expectedAnswer: String(denom) },
            { label: `Fraction of ${label}`, expectedAnswer: `${hours}/${denom}` },
            { label: "Simplest form", expectedAnswer: answer }
          ]
        });
        solutionSteps = [
          `1. From the question, the total is ${denom} hours.`,
          `2. Write the fraction of ${label}: ${hours}/${denom}.`,
          `3. Simplify the fraction by dividing top and bottom by ${div}.`,
          `4. The simplest form is ${answer}.`
        ];
      } else {
        askText = getQText(structText, shortText);
        solutionSteps = [
          `From the question, the total is ${denom} hours.`,
          `Write the fraction of ${label}: ${hours}/${denom}.`,
          `Simplify the fraction by dividing top and bottom by ${div}.`,
          `The simplest form is ${answer}.`
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
