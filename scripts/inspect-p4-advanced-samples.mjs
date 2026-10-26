import { p4NumberComparisonAndOrderingBlueprint } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering.js';

const newAdvancedVariants = [
  'advanced_equalizing_transfer',
  'advanced_three_entity_grand_total',
  'advanced_shifting_difference_transfer',
  'advanced_overlapping_target_deduction',
  'advanced_two_tiered_difference'
];

for (const variant of newAdvancedVariants) {
  console.log(`\n================================================================================`);
  console.log(`ADVANCED VARIANT: ${variant}`);
  console.log(`DESCRIPTION: ${p4NumberComparisonAndOrderingBlueprint.variants[variant]}`);
  console.log(`================================================================================`);

  for (const type of ['structured', 'mcq', 'short question']) {
    console.log(`\n--- [${type.toUpperCase()}] ---`);
    const res = p4NumberComparisonAndOrderingBlueprint.generate('advanced', variant, type);
    const prompt = res.aiPrompt;

    const stemMatch = prompt.match(/Question stem: "([^"]+)"/);
    console.log(`STEM: ${stemMatch ? stemMatch[1] : 'N/A'}`);

    const faMatch = prompt.match(/The finalAnswer must be strictly "([^"]+)"/);
    console.log(`FINAL ANSWER: ${faMatch ? faMatch[1] : 'N/A'}`);

    if (type === 'mcq') {
      const optMatch = prompt.match(/- Generate EXACTLY 4 options: (\[[^\]]+\])/);
      console.log(`MCQ OPTIONS: ${optMatch ? optMatch[1] : 'N/A'}`);
      const defMatch = prompt.match(/- Set defectMap to: (\{[^\}]+\})/);
      console.log(`DEFECT MAP: ${defMatch ? defMatch[1] : 'N/A'}`);
    }

    if (type === 'structured') {
      const stepMatch = prompt.match(/"steps": (\[[\s\S]*?\])\n\s*\}/);
      if (stepMatch) {
        try {
          const steps = JSON.parse(stepMatch[1]);
          console.log(`STRUCTURED STEPS (${steps.length}):`);
          steps.forEach((s, idx) => {
            console.log(`  Step ${idx + 1}: [${s.label}] => Expected: "${s.expectedAnswer}"`);
          });
        } catch (e) {
          console.log('Error parsing steps JSON');
        }
      }
    }

    const visualMatch = prompt.match(/"visualEngine":\s*(\{[\s\S]*?\})\s*,\s*"inputRequirement"/);
    if (visualMatch) {
      try {
        const visual = JSON.parse(visualMatch[1]);
        console.log(`VISUAL COMPONENT: ${visual.componentToRender} (modelType: ${visual.componentData?.modelType || 'N/A'})`);
      } catch (e) {
        console.log('Error parsing visualEngine JSON');
      }
    }
  }
}
