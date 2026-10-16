import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing advanced_unit_value_financial across 100 runs...');

const scaleStepsSeen = new Set();
const orientationsSeen = new Set();
const themesSeen = new Set();

for (let i = 0; i < 100; i++) {
  const type = ['structured', 'mcq', 'short question'][i % 3];
  const res = p3BarGraphInterpretationBlueprint.generate('advanced', 'advanced_unit_value_financial', type);
  const prompt = res.aiPrompt;

  if (!prompt) {
    throw new Error(`Run ${i}: aiPrompt is undefined!`);
  }

  // Check askText
  const askMatch = prompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string[^\n]*\n"([^"]+)"/);
  if (!askMatch) {
    throw new Error(`Run ${i}: Failed to find questionText in prompt:\n${prompt}`);
  }
  const qText = askMatch[1];
  if (qText.includes('undefined') || qText.includes('NaN') || qText.includes('null')) {
    throw new Error(`Run ${i}: Corrupted questionText: ${qText}`);
  }

  // Check finalAnswer
  const ansMatch = prompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/);
  if (!ansMatch) {
    throw new Error(`Run ${i}: Failed to find EXACT FINAL ANSWER in prompt!`);
  }
  const finalAnswer = ansMatch[1];
  if (!finalAnswer || finalAnswer.includes('undefined') || finalAnswer.includes('NaN')) {
    throw new Error(`Run ${i}: Corrupted finalAnswer: ${finalAnswer}`);
  }

  // Parse visualEngine
  const visualMatch = prompt.match(/"visualEngine":\s*(\{[^\n]+\})/);
  if (!visualMatch) {
    throw new Error(`Run ${i}: Missing visualEngine JSON!`);
  }
  const visualEngine = JSON.parse(visualMatch[1]);
  scaleStepsSeen.add(visualEngine.componentData.scaleStep);
  orientationsSeen.add(visualEngine.componentData.orientation);
  themesSeen.add(visualEngine.componentData.title);

  // Parse inputRequirement
  const reqMatch = prompt.match(/"inputRequirement":\s*(\{[^\n]+\})/);
  if (!reqMatch) {
    throw new Error(`Run ${i}: Missing inputRequirement JSON!`);
  }
  const inputReq = JSON.parse(reqMatch[1]);

  if (type === 'structured') {
    if (inputReq.inputType !== 'MULTI_STEP_INPUT' || !Array.isArray(inputReq.steps) || inputReq.steps.length < 2) {
      throw new Error(`Run ${i}: Invalid structured inputRequirement: ${JSON.stringify(inputReq)}`);
    }
    for (const step of inputReq.steps) {
      if (!step.label || step.label.includes('undefined') || step.label.includes('NaN')) {
        throw new Error(`Run ${i}: Corrupted step label: ${step.label}`);
      }
      if (!step.expectedAnswer || step.expectedAnswer.includes('undefined') || step.expectedAnswer.includes('NaN')) {
        throw new Error(`Run ${i}: Corrupted expectedAnswer: ${step.expectedAnswer}`);
      }
    }
  } else if (type === 'mcq') {
    if (inputReq.inputType !== 'MCQ_BUTTONS') {
      throw new Error(`Run ${i}: Expected MCQ_BUTTONS but got ${inputReq.inputType}`);
    }
    const optionsMatch = prompt.match(/Generate EXACTLY 4 options in "content.options":\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"/);
    if (!optionsMatch) {
      throw new Error(`Run ${i}: Failed to match 4 MCQ options in prompt:\n${prompt}`);
    }
    const opts = [optionsMatch[1], optionsMatch[2], optionsMatch[3], optionsMatch[4]];
    if (!opts.includes(finalAnswer)) {
      throw new Error(`Run ${i}: Final answer "${finalAnswer}" not found among options: ${JSON.stringify(opts)}`);
    }
  } else {
    if (inputReq.inputType !== 'STANDARD_TEXT') {
      throw new Error(`Run ${i}: Expected STANDARD_TEXT but got ${inputReq.inputType}`);
    }
  }
}

console.log('Scale steps seen:', Array.from(scaleStepsSeen));
console.log('Orientations seen:', Array.from(orientationsSeen));
console.log(`Themes count seen: ${themesSeen.size}`, Array.from(themesSeen));
console.log('ALL 100 RUNS PASSED WITH FULL DIVERSITY!');
