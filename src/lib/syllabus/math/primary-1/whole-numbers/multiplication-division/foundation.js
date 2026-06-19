import { numberToWords } from '@/lib/utils/math-helpers';

// Robust extraction helper for localized context objects
const extract = (val) => {
  if (typeof val !== 'object' || val === null) return String(val);
  return val.item || val.singular || val.name?.singular || val.text || val.val || String(val);
};

export function foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText, selectedIcon, hideVisual, supportsStructured) {
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
  const inputType = isStructure ? 'MULTI_STEP_INPUT' : (isMCQ ? 'MCQ_BUTTONS' : 'STANDARD_TEXT');
  const isShortQ = zodType === 'SHORT_QUESTION';

  const levelNum = parseInt(level.replace('Primary ', ''));
  const readingMandate = levelNum <= 2 
    ? "STRICT READING LEVEL: Use sentences with maximum 10-12 words. Use simple nouns and verbs (Sight Words). No words with more than 2 syllables."
    : (levelNum >= 5 
        ? "ADVANCED READING LEVEL: You may use complex sentences and technical Singaporean context (e.g., GST, interest rates, or logistics). Use a professional, descriptive tone."
        : "");

  // 1. Basic Multiplication & Division
  if (activeVariant === 'foundation_multiplication' || activeVariant === 'foundation_division') {
    const isMult = activeVariant.includes('multiplication');
    const itemLabel = extract(selectedContextItem);
    const groups = Math.floor(Math.random() * 4) + 2; // 2 to 5 groups
    const itemsPerGroup = Math.floor(Math.random() * 5) + 2; // 2 to 6 items per group
    const total = groups * itemsPerGroup;
    
    const answer = isMult ? String(total) : String(itemsPerGroup);
    const operator = isMult ? 'x' : '÷';
    const equationStr = isMult ? `${groups} x ${itemsPerGroup} = ?` : `${total} ÷ ${groups} = ?`;

    let defectMap = null;
    let options = null;
    if (isMCQ) {
      options = Array.from(new Set([answer, String(parseInt(answer) + 1), String(parseInt(answer) - 1), isMult ? String(groups + itemsPerGroup) : String(total)])).slice(0, 4);
      while(options.length < 4) { options.push(String(parseInt(answer) + Math.floor(Math.random() * 5) + 2)); options = Array.from(new Set(options)); }
      options = options.sort(() => Math.random() - 0.5);
      
      defectMap = {};
      if (isMult) defectMap[String(groups + itemsPerGroup)] = "CONFUSED_OPERATION";
      else defectMap[String(total)] = "CONSTANT_VIOLATION";
      options.forEach(opt => { if (opt !== answer && !defectMap[opt]) defectMap[opt] = "CARELESS_CALCULATION"; });
    }

    const promptObject = {
      meta: commonMeta,
      content: {
        questionText: getQText(`[STORY] How many are there ${isMult ? 'altogether' : 'in each group'}?`, equationStr, zodType),
        options: options,
        defectMap: defectMap,
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: isMult ? `1. ${groups} groups of ${itemsPerGroup} makes ${total}.` : `1. ${total} shared into ${groups} groups gives ${itemsPerGroup} in each group.`,
      },
      visualEngine: {
        componentToRender: isShortQ ? "NUMBER_CARDS" : "NONE",
        componentData: isShortQ 
          ? { items: isMult ? [String(groups), 'x', String(itemsPerGroup), '=', '?'] : [String(total), '÷', String(groups), '=', '?'] }
          : {}
      },
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      ${isShortQ 
        ? `STRICT: Provide a direct mathematical equation (${equationStr}). NO story context or names.` 
        : `STRICT: Replace the "[STORY]" tag in "questionText" with a unique and creative 1-sentence localized Singaporean math story about ${extract(context.name)} and ${itemLabel} (visually represented by the emoji "${selectedIcon}") using ${isMult ? 'equal groups' : 'sharing equally'}. 
        
        MANDATORY: You MUST use the name "${extract(context.name)}" and the item "${itemLabel}". 
        VARIETY GUARDRAIL: Do NOT default to common clichés like "pencils", "apples", or "oranges". 
        Creative Examples: distributing prizes at a community event, organizing a hobby collection, preparing materials for a craft project, or sorting items for a school drive.`
      }

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
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
        questionText: getQText(`[STORY] Use the grouping tool to find the answer.`, isSharing ? `${total} ÷ ${groups} = ?` : `${total} ÷ ${itemsPerGroup} = ?`, zodType),
        options: null, 
        hint: "[AI: PROVIDE A CONCEPTUAL HINT]",
        finalAnswer: answer,
        solutionSteps: isSharing ? `1. Share ${total} items equally into ${groups} groups.\n2. There are ${answer} items in each group.` : `1. Group ${total} items into sets of ${itemsPerGroup}.\n2. You get ${answer} groups.`
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
      inputRequirement: { inputType, ...(isStructure ? { steps: "[AI: INJECT ARRAY OF { label: string, expectedAnswer: string } OBJECTS HERE BREAKING DOWN THE SOLUTION STEPS]" } : {}) }
    };

    return {
      aiPrompt: `You are an expert Primary 1 math generator. ${formatInstructions}
      STRICT: This is an interactive ${isSharing ? 'sharing' : 'grouping'} variant. Replace the "[STORY]" tag in "questionText" with a highly unique and creative 1-sentence localized Singaporean story involving ${extract(context.name)} and ${extract(selectedContextItem)} (visually represented by "${selectedIcon}").
      
      MANDATORY: You MUST use the name "${extract(context.name)}" and the item "${extract(selectedContextItem)}". 
      VARIETY GUARDRAIL: Avoid repetitive themes like "star stickers" or "pencils". 
      The story should give a fresh and engaging reason for ${isSharing ? 'sharing' : 'grouping'} the ${total} items.
      Creative Contexts: materials for a puppet show, resources for a science experiment, items for a charitable donation, or treats for a festive celebration.

      CRITICAL VISUAL RULE: "componentData" MUST be an object. NEVER return it as a string.

      JSON TEMPLATE:\n${JSON.stringify(promptObject)}`,
      metadata: { difficulty: 'foundation', logic: activeVariant, hideVisual: false }
    };
  }
}