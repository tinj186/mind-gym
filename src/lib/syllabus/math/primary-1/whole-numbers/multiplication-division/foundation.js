import { numberToWords } from '@/lib/utils/math-helpers';

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual) {
  const commonMeta = { 
    level, 
    topic, 
    subtopic: 'Multiplication and Division',
    type: zodType, 
    difficulty: zodDiff,
    strand: 'Number and Algebra',
    subject: 'Math',
    gradeLevel: 'P1',
    heuristic: activeVariant.includes('multiplication') ? 'Multiplication' : 'Division'
  };
  const inputType = isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT';
  const isShortQ = zodType === 'SHORT_QUESTION';

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // Safety check for localization context
  const itemLabel = selectedContextItem?.item || 'items';

  // 1. Basic Multiplication & Division
  if (activeVariant === 'foundation_multiplication' || activeVariant === 'foundation_division') {
    const isMult = activeVariant.includes('multiplication');
    const groups = Math.floor(Math.random() * 4) + 2; // 2 to 5 groups
    const itemsPerGroup = Math.floor(Math.random() * 5) + 2; // 2 to 6 items per group
    const total = groups * itemsPerGroup;
    
    const answer = isMult ? String(total) : String(itemsPerGroup);
    const operator = isMult ? 'x' : '÷';
    const equationStr = isMult ? `${groups} x ${itemsPerGroup} = ?` : `${total} ÷ ${groups} = ?`;

    const options = isMCQ ? [answer, String(parseInt(answer) + 1), String(parseInt(answer) - 1), isMult ? String(groups + itemsPerGroup) : String(total)].sort(() => Math.random() - 0.5) : null;

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many are there ${isMult ? 'altogether' : 'in each group'}?`, equationStr),
        options: options,
        finalAnswer: answer,
        solutionSteps: isMult ? `${groups} groups of ${itemsPerGroup} makes ${total}.` : `${total} shared into ${groups} groups gives ${itemsPerGroup} in each group.`
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "EQUAL_GROUPS",
        componentData: { 
          numGroups: groups,
          itemsPerGroup: itemsPerGroup,
          emoji: selectedIcon,
          hideVisual: isShortQ
        }
      },
      inputRequirement: { inputType }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${context.name} and ${isMult ? `${groups} groups of ${itemsPerGroup} ${itemLabel}` : `sharing ${total} ${itemLabel} among ${groups} friends`}. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: hideVisual }
    };
  }

  // 2. Interactive Grouping/Sharing
  if (activeVariant === 'foundation_grouping_interactive' || activeVariant === 'foundation_sharing_interactive') {
    const isSharing = activeVariant.includes('sharing');
    const groups = Math.floor(Math.random() * 3) + 2; 
    const itemsPerGroup = Math.floor(Math.random() * 4) + 2; 
    const total = groups * itemsPerGroup;
    const answer = isSharing ? String(itemsPerGroup) : String(groups);

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: `[STORY] Use the grouping tool to find the answer.`,
        options: null, 
        finalAnswer: answer,
        solutionSteps: isSharing ? `Share ${total} items equally into ${groups} groups. There are ${answer} items in each group.` : `Group ${total} items into sets of ${itemsPerGroup}. You get ${answer} groups.`
      },
      visualEngine: {
        componentToRender: "GROUPING_WORKSPACE",
        componentData: { 
          totalItems: total, 
          groups: isSharing ? groups : null, 
          itemsPerGroup: isSharing ? null : itemsPerGroup,
          mode: isSharing ? 'SHARING' : 'GROUPING',
          icon: selectedIcon,
          items: Array(total).fill(selectedIcon),
          hideVisual: false 
        }
      },
      inputRequirement: { inputType: 'STANDARD_TEXT' }
    };

    return {
      aiPrompt: `${readingMandate}\nSTRICT: Return ONLY valid JSON. ${formatInstructions}\n${isShortQ 
        ? 'Task: Return the JSON exactly as provided. Do not add any text.' 
        : `Task: Replace the "[STORY]" tag with a 1-sentence Singaporean context about ${isSharing 
            ? `sharing ${total} ${itemLabel} equally into ${groups} groups` 
            : `putting ${total} ${itemLabel} into groups of ${itemsPerGroup}`
          }. Return the JSON exactly as provided.`
      }\n\nJSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: false }
    };
  }
}