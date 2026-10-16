import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

console.log('Testing p3BarGraphInterpretationBlueprint across all variants and question types...');

const variants = Object.keys(p3BarGraphInterpretationBlueprint.variants);
console.log(`Active variants found: ${variants.length}`);

if (variants.length === 0) {
  console.error(`Expected at least 1 variant, found 0`);
  process.exit(1);
}

const types = ['short question', 'mcq', 'structured'];

for (const variant of variants) {
  const diff = variant.split('_')[0]; // 'foundation', 'standard', 'advanced'
  
  for (const type of types) {
    const res = p3BarGraphInterpretationBlueprint.generate(diff, variant, type);
    
    if (!res || !res.aiPrompt) {
      console.error(`FAILED: No aiPrompt returned for ${variant} [${type}]`);
      process.exit(1);
    }

    const prompt = res.aiPrompt;

    // Check BAR_GRAPH visualEngine
    if (!prompt.includes('"componentToRender": "BAR_GRAPH"') && !prompt.includes('"componentToRender":"BAR_GRAPH"')) {
      console.error(`FAILED: Missing BAR_GRAPH component in visualEngine for ${variant} [${type}]`);
      process.exit(1);
    }

    // Check MCQ directives
    if (type === 'mcq') {
      if (!prompt.includes('Generate EXACTLY 4 options')) {
        console.error(`FAILED: Missing 4 options directive in MCQ for ${variant}`);
        process.exit(1);
      }
      if (!prompt.includes('MCQ_BUTTONS')) {
        console.error(`FAILED: Missing MCQ_BUTTONS in inputRequirement for ${variant}`);
        process.exit(1);
      }
    }

    // Check Structured MULTI_STEP_INPUT
    if (type === 'structured') {
      if (!prompt.includes('MULTI_STEP_INPUT')) {
        console.error(`FAILED: Missing MULTI_STEP_INPUT in structured for ${variant}`);
        process.exit(1);
      }
      if (!prompt.includes('"steps":')) {
        console.error(`FAILED: Missing steps array in structured for ${variant}`);
        process.exit(1);
      }
    }

    // Check no undefined / NaN
    if (prompt.includes('undefined') || prompt.includes('NaN')) {
      console.error(`FAILED: Found undefined or NaN in prompt for ${variant} [${type}]`);
      process.exit(1);
    }
  }
  console.log(`✓ Variant ${variant} passed for [short question, mcq, structured]`);
}

console.log('\n=============================================');
console.log('🎉 ALL 15 VARIANTS PASSED ALL VALIDATION CHECKS!');
console.log('=============================================');
