import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

const types = ['structured', 'mcq', 'short question'];

for (const type of types) {
  console.log(`\n=================== TYPE: ${type.toUpperCase()} ===================`);
  const { aiPrompt } = p3BarGraphInterpretationBlueprint.generate('advanced', 'advanced_equalizing_quantities', type);

  const qMatch = aiPrompt.match(/DO NOT ADD OR CHANGE A SINGLE WORD:\n"([^"]+)"/);
  console.log('QUESTION:\n', qMatch ? qMatch[1] : 'NOT FOUND');

  const aMatch = aiPrompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/);
  console.log('FINAL ANSWER:', aMatch ? aMatch[1] : 'NOT FOUND');

  const reqMatch = aiPrompt.match(/"inputRequirement":\s*(\{[^\n]+\})/);
  if (reqMatch) {
    const ir = JSON.parse(reqMatch[1]);
    console.log('INPUT REQUIREMENT:\n', JSON.stringify(ir, null, 2));
  }

  const visMatch = aiPrompt.match(/"visualEngine":\s*(\{[^\n]+\})/);
  if (visMatch) {
    const ve = JSON.parse(visMatch[1]);
    console.log('VISUAL ENGINE:\n', JSON.stringify(ve, null, 2));
  }

  if (type === 'mcq') {
    const optMatches = [...aiPrompt.matchAll(/- "([^"]+)"/g)].map(m => m[1]);
    console.log('MCQ OPTIONS:', optMatches);
  }
}
