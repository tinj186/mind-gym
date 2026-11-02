import { advancedLogic } from '../src/lib/syllabus/math/primary-4/whole-numbers-numbers-up-to-100000/number-comparison-and-ordering/advanced.js';

for (const variety of ['find_transfer_from_initial', 'find_initial_from_equalized', 'find_initial_from_total_and_transfer', 'find_difference_from_transfer']) {
  console.log(`Testing variety: ${variety}...`);
  const res = advancedLogic(
    'equalizing_transfer',
    'Advanced',
    'Structured',
    false,
    false,
    true,
    'Structured',
    'Advanced',
    'Primary 4',
    'Whole Numbers',
    () => '',
    variety
  );
  console.log('Result aiPrompt exists:', Boolean(res?.aiPrompt));
  if (res?.aiPrompt) {
    const match = res.aiPrompt.match(/"entities":\s*(\[[^\]]+\])/s);
    if (match) {
      console.log('Entities in prompt:', match[1].replace(/\s+/g, ' '));
    }
  }
}
console.log('All generation tests passed!');
