import { p3BarGraphInterpretationBlueprint } from '../src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation.js';

const types = ['structured', 'mcq', 'short question'];

console.log('=== SAMPLES OF ADVANCED REPACKING / GROUPING FROM TOTAL DATA ===\n');

for (let i = 0; i < 6; i++) {
  const type = types[i % types.length];
  const { aiPrompt } = p3BarGraphInterpretationBlueprint.generate('advanced', 'advanced_repacking_grouping', type);

  const visualMatch = aiPrompt.match(/"visualEngine":\s*(\{[^\n]+\})/);
  const visualEngine = visualMatch ? JSON.parse(visualMatch[1]) : null;

  const reqMatch = aiPrompt.match(/"inputRequirement":\s*(\{[^\n]+\})/);
  const inputReq = reqMatch ? JSON.parse(reqMatch[1]) : null;

  const qMatch = aiPrompt.match(/CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string\. DO NOT ADD OR CHANGE A SINGLE WORD:\n"([^"]+)"/);
  const questionText = qMatch ? qMatch[1] : 'N/A';

  const ansMatch = aiPrompt.match(/EXACT FINAL ANSWER:\s*"([^"]+)"/);
  const finalAnswer = ansMatch ? ansMatch[1] : 'N/A';

  console.log(`--- SAMPLE ${i + 1} (${type.toUpperCase()}) ---`);
  console.log(`Title: ${visualEngine?.componentData?.title}`);
  console.log(`Orientation: ${visualEngine?.componentData?.orientation}, ScaleStep: ${visualEngine?.componentData?.scaleStep}`);
  console.log(`Data:`, visualEngine?.componentData?.data);
  console.log(`Question: ${questionText}`);
  console.log(`Final Answer: ${finalAnswer}`);
  if (type === 'structured' && inputReq?.steps) {
    console.log(`Steps:`);
    inputReq.steps.forEach((s, idx) => {
      console.log(`  Step ${idx + 1}: ${s.label} -> ${s.expectedAnswer}`);
    });
  } else if (type === 'mcq') {
    const optsMatch = aiPrompt.match(/Generate EXACTLY 4 options in "content.options":\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"\n- "([^"]+)"/);
    if (optsMatch) {
      console.log(`MCQ Options:`, [optsMatch[1], optsMatch[2], optsMatch[3], optsMatch[4]]);
    }
  }
  console.log('\n');
}
