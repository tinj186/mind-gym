import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

for (const type of ['structured', 'mcq', 'short question']) {
  console.log(`\n=================== TYPE: ${type.toUpperCase()} ===================`);
  const res = p3BarGraphInterpretationBlueprint.generate('standard', 'standard_external_multiplier', type);
  const prompt = res.aiPrompt;

  const askMatch = prompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string[^\n]*\n"([^"]+)"/);
  if (askMatch) console.log('QUESTION:\n', askMatch[1]);

  const ansMatch = prompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/);
  if (ansMatch) console.log('FINAL ANSWER:', ansMatch[1]);

  const reqMatch = prompt.match(/"inputRequirement":\s*(\{[^\n]+\})/);
  if (reqMatch) console.log('INPUT REQUIREMENT:\n', JSON.stringify(JSON.parse(reqMatch[1]), null, 2));

  const visualMatch = prompt.match(/"visualEngine":\s*(\{[^\n]+\})/);
  if (visualMatch) console.log('VISUAL ENGINE:\n', JSON.stringify(JSON.parse(visualMatch[1]), null, 2));
}
