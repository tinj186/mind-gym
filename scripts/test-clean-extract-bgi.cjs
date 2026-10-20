const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function getCleanLines(rel) {
  return execSync(`git show HEAD:${rel}`, { encoding: 'utf8' }).split('\n');
}

function findBlock(lines, startMarker, endMarker) {
  const startIdx = lines.findIndex(l => l.includes(startMarker));
  if (startIdx === -1) throw new Error('Start marker not found: ' + startMarker);

  let start = startIdx;
  while (!lines[start].includes('{')) start++;
  start++; // first line inside {

  let endIdx;
  if (endMarker) {
    const nextMarkerIdx = lines.findIndex((l, idx) => idx > start && l.includes(endMarker));
    if (nextMarkerIdx === -1) throw new Error('End marker not found: ' + endMarker);
    let curr = nextMarkerIdx;
    while (lines[curr].trim() !== '}' && !lines[curr].includes('} else')) curr--;
    endIdx = curr;
  } else {
    const aiPromptIdx = lines.findIndex((l, idx) => idx > start && l.includes('const aiPrompt ='));
    let curr = aiPromptIdx;
    while (lines[curr].trim() !== '}') curr--;
    endIdx = curr;
  }

  const slice = lines.slice(start, endIdx);
  const code = `
function testFunc({ isMCQ, isShort, isStructure, studentName }) {
  let askText = '';
  let finalAnswer = '';
  let visualEngineStr = '';
  let inputRequirementStr = '';
  let mcqOptionsPrompt = '';
${slice.join('\n')}
  return { askText, finalAnswer, visualEngineStr, inputRequirementStr, mcqOptionsPrompt };
}
`;
  try {
    new Function(code);
    console.log(`✅ [${startMarker}] OK! lines ${start}..${endIdx} (${slice.length} lines)`);
  } catch (err) {
    console.error(`❌ [${startMarker}] ERR: ${err.message}`);
    console.error('First line:', slice[0]);
    console.error('Last line:', slice[slice.length - 1]);
  }
  return { start, end: endIdx };
}

console.log('Testing FOUNDATION:');
const fnd = getCleanLines('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation/foundation.js');
findBlock(fnd, "'foundation_direct_combination'", "'foundation_finding_difference'");
findBlock(fnd, "'foundation_finding_difference'", "'foundation_threshold_filtering'");
findBlock(fnd, "'foundation_threshold_filtering'", "'foundation_reverse_category_deduction'");
findBlock(fnd, "'foundation_reverse_category_deduction'", "'foundation_remainder_calculation'");
findBlock(fnd, "'foundation_remainder_calculation'", null);

console.log('\nTesting STANDARD:');
const std = getCleanLines('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation/standard.js');
findBlock(std, "'standard_halfway_computations'", "'standard_two_step_comparison'");
findBlock(std, "'standard_two_step_comparison'", "'standard_external_multiplier'");
findBlock(std, "'standard_external_multiplier'", "'standard_subgroup_part_whole'");
findBlock(std, "'standard_subgroup_part_whole'", "'standard_before_after_adjustments'");
// For before & after adjustments, replace `const studentName =` with `studentName =` before syntax check
const v5Slice = findBlock(std, "'standard_before_after_adjustments'", null);

console.log('\nTesting ADVANCED:');
const adv = getCleanLines('src/lib/syllabus/math/primary-3/data-representation-and-interpretation-bar-graphs/bar-graph-interpretation/advanced.js');
findBlock(adv, "'advanced_unit_value_financial'", "'advanced_algebraic_multiplier_deduction'");
findBlock(adv, "'advanced_algebraic_multiplier_deduction'", "'advanced_equalizing_quantities'");
findBlock(adv, "'advanced_equalizing_quantities'", "'advanced_target_shortfall_analysis'");
findBlock(adv, "'advanced_target_shortfall_analysis'", "'advanced_repacking_grouping'");
findBlock(adv, "'advanced_repacking_grouping'", null);
