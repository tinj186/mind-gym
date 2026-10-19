import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

const advancedVariants = [
  'advanced_missing_scale_value_difference_deduction',
  'advanced_scale_translation_block_projection',
  'advanced_blank_axis_financial_application',
  'advanced_equalizing_transfer_grid_block_shift',
  'advanced_target_shortfall_bar_height_prediction'
];

for (const variant of advancedVariants) {
  console.log(`\n================================================================================`);
  console.log(`VARIANT: ${variant} (${p3GraphAxisScalesBlueprint.variants[variant]})`);
  console.log(`================================================================================`);

  for (const type of ['structured', 'mcq', 'short question']) {
    console.log(`\n--- [${type.toUpperCase()}] ---`);
    const res = p3GraphAxisScalesBlueprint.generate('advanced', variant, type);
    const prompt = res.aiPrompt;

    const qTextMatch = prompt.match(/QUESTION TEXT SPECIFICATION:\nCRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"([\s\S]*?)"\n/);
    console.log(`QUESTION TEXT:\n${qTextMatch ? qTextMatch[1] : 'N/A'}`);

    const faMatch = prompt.match(/EXACT FINAL ANSWER:\n"([^"]+)"/);
    console.log(`FINAL ANSWER: ${faMatch ? faMatch[1] : 'N/A'}`);

    if (type === 'mcq') {
      const optMatch = prompt.match(/Generate EXACTLY 4 options in "content\.options":\n([\s\S]*?)\nCRITICAL:/);
      console.log(`MCQ OPTIONS:\n${optMatch ? optMatch[1] : 'N/A'}`);
    }

    if (type === 'structured') {
      const inputReqMatch = prompt.match(/"inputRequirement":\s*(\{[\s\S]*?"inputType":\s*"MULTI_STEP_INPUT"[\s\S]*?\})\s*,\s*"content"/);
      if (inputReqMatch) {
        try {
          const parsed = JSON.parse(inputReqMatch[1]);
          console.log(`STEPS:`);
          for (const s of parsed.steps) {
            console.log(`  - [${s.label}] => Expected: "${s.expectedAnswer}"`);
          }
        } catch (e) {
          console.log('Error parsing steps JSON');
        }
      }
    }

    const visualMatch = prompt.match(/"visualEngine":\s*(\{[\s\S]*?"componentToRender":\s*"BAR_GRAPH"[\s\S]*?\})\s*,\s*"inputRequirement"/);
    if (visualMatch) {
      try {
        const visual = JSON.parse(visualMatch[1]);
        console.log(`GRAPH DATA: ${JSON.stringify(visual.componentData.data.map(d => ({ cat: d.category, val: d.value })))}`);
        console.log(`SCALE STEP: ${visual.componentData.scaleStep}, SHOW NUMBERS: ${visual.componentData.showScaleNumbers ?? true}, MISSING BAR: ${visual.componentData.missingBar ?? 'none'}`);
      } catch (e) {
        console.log('Error parsing visualEngine JSON');
      }
    }
  }
}
