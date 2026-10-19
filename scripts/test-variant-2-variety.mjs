import { p3GraphAxisScalesBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/graph-axis-scales.js';

console.log('Generating 8 samples of foundation_large_scale_summation to test all varieties (forward & reverse)...');

for (let i = 1; i <= 8; i++) {
  console.log(`\n=================== SAMPLE ${i} (STRUCTURED) ===================`);
  const res = p3GraphAxisScalesBlueprint.generate('foundation', 'foundation_large_scale_summation', 'structured');
  const prompt = res.aiPrompt;

  const askMatch = prompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string[^\n]*\n"([^"]+)"/);
  if (askMatch) console.log('QUESTION:\n', askMatch[1]);

  const ansMatch = prompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/);
  if (ansMatch) console.log('FINAL ANSWER:', ansMatch[1]);

  const reqMatch = prompt.match(/"inputRequirement":\s*(\{[^\n]+\})/);
  if (reqMatch) console.log('INPUT REQUIREMENT:\n', JSON.stringify(JSON.parse(reqMatch[1]), null, 2));

  const visualMatch = prompt.match(/"visualEngine":\s*(\{[^\n]+\})/);
  if (visualMatch) {
    const v = JSON.parse(visualMatch[1]);
    console.log('VISUAL ENGINE (showScaleNumbers, scaleStep, title):', {
      title: v.componentData.title,
      scaleStep: v.componentData.scaleStep,
      showScaleNumbers: v.componentData.showScaleNumbers ?? true,
      data: v.componentData.data.map(d => ({ category: d.category, value: d.value, color: d.color }))
    });
  }
}
