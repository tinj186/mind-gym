import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing advanced_equalizing_quantities across 100 runs...');

const scaleStepsSeen = new Set();
const orientationsSeen = new Set();
const themesSeen = new Set();

const types = ['structured', 'mcq', 'short question'];

for (let i = 1; i <= 100; i++) {
  const type = types[i % types.length];
  const { aiPrompt } = p3BarGraphInterpretationBlueprint.generate('advanced', 'advanced_equalizing_quantities', type);

  if (!aiPrompt) {
    throw new Error(`Run ${i}: aiPrompt is undefined!`);
  }

  // Parse visualEngine
  const visualMatch = aiPrompt.match(/"visualEngine":\s*(\{[^\n]+\})/);
  if (!visualMatch) {
    throw new Error(`Run ${i}: Missing visualEngine JSON!`);
  }
  const visualEngine = JSON.parse(visualMatch[1]);
  if (visualEngine.componentToRender !== 'BAR_GRAPH') {
    throw new Error(`Run ${i}: Invalid componentToRender: ${visualEngine.componentToRender}`);
  }
  if (!Array.isArray(visualEngine.componentData.data) || visualEngine.componentData.data.length < 3) {
    throw new Error(`Run ${i}: Invalid bar graph data length: ${visualEngine.componentData.data.length}`);
  }

  scaleStepsSeen.add(visualEngine.componentData.scaleStep);
  orientationsSeen.add(visualEngine.componentData.orientation);
  themesSeen.add(visualEngine.componentData.title);

  // Parse inputRequirement
  const reqMatch = aiPrompt.match(/"inputRequirement":\s*(\{[^\n]+\})/);
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
      // Check that label has NO formula hints or parentheticals with numbers
      if (step.label.includes('(') || step.label.includes(')')) {
        throw new Error(`Run ${i}: Label contains parenthetical hint: ${step.label}`);
      }
      if (!step.expectedAnswer || step.expectedAnswer.includes('undefined') || step.expectedAnswer.includes('NaN')) {
        throw new Error(`Run ${i}: Corrupted expectedAnswer: ${step.expectedAnswer}`);
      }
    }
  } else if (type === 'mcq') {
    if (inputReq.inputType !== 'MCQ_BUTTONS') {
      throw new Error(`Run ${i}: Invalid MCQ inputType: ${inputReq.inputType}`);
    }
    const optionsMatch = aiPrompt.match(/Generate EXACTLY 4 options in "content.options":\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"/);
    if (!optionsMatch) {
      throw new Error(`Run ${i}: Failed to match 4 MCQ options in prompt:\n${aiPrompt}`);
    }
    const opts = [optionsMatch[1], optionsMatch[2], optionsMatch[3], optionsMatch[4]];
    const ansMatch = aiPrompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/);
    if (!ansMatch) {
      throw new Error(`Run ${i}: Missing EXACT FINAL ANSWER in prompt!`);
    }
    const finalAns = ansMatch[1];
    if (!opts.includes(finalAns)) {
      throw new Error(`Run ${i}: None of MCQ options match finalAnswer (${finalAns})! Options: ${JSON.stringify(opts)}`);
    }
  } else {
    if (inputReq.inputType !== 'STANDARD_TEXT') {
      throw new Error(`Run ${i}: Invalid short question inputType: ${inputReq.inputType}`);
    }
  }
}

console.log('Scale steps seen:', Array.from(scaleStepsSeen));
console.log('Orientations seen:', Array.from(orientationsSeen));
console.log('Themes count seen:', themesSeen.size, Array.from(themesSeen));

if (scaleStepsSeen.size < 4) {
  throw new Error(`Expected all 4 scale steps to be seen, saw ${scaleStepsSeen.size}`);
}
if (orientationsSeen.size < 2) {
  throw new Error(`Expected both orientations to be seen, saw ${orientationsSeen.size}`);
}
if (themesSeen.size < 8) {
  throw new Error(`Expected at least 8 themes to be seen across 100 runs, saw ${themesSeen.size}`);
}

console.log('ALL 100 RUNS PASSED WITH FULL DIVERSITY AND NO HINTS IN LABELS!');
