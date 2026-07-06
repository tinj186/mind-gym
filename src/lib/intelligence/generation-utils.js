import { UniversalQuestionSchema } from '@/app/api/admin/generate/questionSchema';
import { DIFFICULTY_DEFINITIONS } from '@/lib/syllabus';

/**
 * Builds a specialized prompt for the AI based on Singapore MOE Syllabus constraints.
 */
export function getSyllabusPrompt(quantity, level, strand, topic, subtopic, heuristic, difficulty, type, blueprintData) {
  const p1Constraints = level === 'Primary 1' ? `
    - Sentences must be extremely short (maximum 10-12 words per sentence).
    - Use simple, active-voice sentence structures (e.g., "Siti has 5 apples. She gives 2 apples to Bala. How many apples are left?"). 
    - Avoid complex multi-clause sentences or advanced conjunctions.
    - Frame hints around concrete, visual items or actions (e.g., "Try counting the items in a group!", "Think about what happens when some items are given away!").
    - Avoid abstract math vocabulary for lower grades (avoid technical terms like "subtract", "variable", "equation", "operation").
    - Solutions must use straightforward step structures centered around visual models like "Number Bonds" or simple groups (e.g., "Step 1: Count the total blocks. Step 2: Take away 3 blocks.").` : '';

  const systemPrompt = `
You are an expert primary school math content generator specializing in the Singapore Math curriculum.
You are generating content strictly for a student at the following educational level: ${level}.

CRITICAL READABILITY CONSTRAINTS:
- You MUST adapt your entire tone, vocabulary, and sentence length to match a student at the ${level} tier.${p1Constraints}
- If the level is 'Primary 1', use short, punchy sentences. Do not use advanced words. Stick closely to the provided vocabulary terms.
- The question must read like a friendly, clear, level-appropriate word problem.

HINT GENERATION RULES:
- Never give away the answer.
- Provide a guiding hint using scaffolded, simple phrasing appropriate for a ${level} child.
- Avoid abstract math vocabulary for lower grades. Use concrete object imagery (e.g., apples, blocks, toys).

SOLUTION STEP RULES:
- Break down the solution step-by-step.
- Use primary school methodologies (like parts-and-whole or number bonds for Primary 1) to explain the math logically and clearly.
- Keep calculation breakdowns clean, minimal, and fully explained with elementary phrasing.
- Format each step strictly as a numbered list: "1. [Step description]", "2. [Step description]", etc. Each step MUST start on a new line (use the \\n character).
`;

  const instructions = [];
  instructions.push((() => {
    const diffKey = String(difficulty).charAt(0).toUpperCase() + String(difficulty).slice(1).toLowerCase();
    return DIFFICULTY_DEFINITIONS[diffKey] ? `DIFFICULTY CONSTRAINT (${diffKey}):\n` + JSON.stringify(DIFFICULTY_DEFINITIONS[diffKey], null, 2) : '';
  })());

  if (blueprintData) {
    instructions.push(`MANDATORY BLUEPRINT: ${blueprintData.blueprint}`);
    if (blueprintData.moeDescription) instructions.push(`MANDATORY MOE CONTEXT: ${blueprintData.moeDescription}`);
    instructions.push(`MANDATORY VOCABULARY: Use these words: ${blueprintData.vocabulary.join(', ')}`);
    instructions.push(`VISUAL STRATEGY: Ensure modelData uses ${blueprintData.visualType} logic.`);
  }

  return `
    ${systemPrompt}
    Output ONLY raw, valid JSON array. Do NOT include conversational text.
    Generate ${quantity} new math questions for ${level} based on:
    - Topic: ${topic}
    - Sub-topic: ${subtopic}
    - Difficulty: ${difficulty}
    - Type: ${type}

    Logical Integrity:
    - Zero-Correction Policy: Finalize all logic internally before starting the JSON block.
    - Ordinal Guardrail: If items are removed, the target item MUST remain in the list.
    - Division Guardrail: Ensure total items are perfectly divisible by group size.

    Output Format (JSON array of objects):
    {
      "question": "string",
      "options": ${type === 'MCQ' ? '["A: ...", "B: ...", "C: ...", "D: ..."]' : 'null'},
      "visualItems": "array of 5-8 emojis",
      "modelData": object,
      "solution": "step-by-step mathematical explanation formatted strictly as a numbered list (1. ..., 2. ..., 3. ...) with explicit \\n characters between steps",
      "finalAnswer": "string or JSON object",
      "hint": "MANDATORY: Provide a conceptual scaffolding hint (do NOT include the answer or specific numbers)",
      "context": {
        "item": "string name",
        "icon": "string emoji"
      }
    }`.trim();
}

/**
 * Returns age-appropriate system instructions for the AI generation path.
 */
export function getBaseSystemInstructions(level, difficulty) {
  const p1Constraints = level === 'Primary 1' ? `
    - Sentences must be extremely short (maximum 10-12 words per sentence).
    - Use simple, active-voice sentence structures.
    - Avoid technical math terms in hints (avoid "subtract", "variable", "equation").
    - Solutions must use straightforward step structures centered around visual models like "Number Bonds".` : '';

  const systemInstructions = `
You are an expert primary school math content generator specializing in the Singapore Math curriculum.
You are generating content strictly for a student at the following educational level: ${level}.

CRITICAL READABILITY CONSTRAINTS:
- You MUST adapt your entire tone, vocabulary, and sentence length to match a student at the ${level} tier.${p1Constraints}
- If the level is 'Primary 1', use short, punchy sentences. Do not use advanced words.
- The question must read like a friendly, clear, level-appropriate word problem.

HINT GENERATION RULES:
- Never give away the answer.
- Provide a guiding hint using scaffolded, simple phrasing appropriate for a ${level} child.
- Avoid abstract math vocabulary for lower grades. Use concrete object imagery.
- Format solution steps strictly as a numbered list: "1. ..., 2. ..., 3. ...". Each step MUST start on a new line (use the \\n character).
`;
}

/**
 * Robustly extracts and parses JSON from AI response text, handling markdown blocks.
 */
export function parseAiResponse(text) {
  try {
    const jsonBlockMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
    let jsonText = jsonBlockMatch ? jsonBlockMatch[1] : text;
    const firstBrace = jsonText.indexOf('{');
    const firstBracket = jsonText.indexOf('[');
    const lastBrace = jsonText.lastIndexOf('}');
    const lastBracket = jsonText.lastIndexOf(']');
    let start = -1;
    let end = -1;

    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = lastBracket;
    } else if (firstBrace !== -1) {
      start = firstBrace;
      end = lastBrace;
    }

    if (start !== -1 && end !== -1) {
      jsonText = jsonText.substring(start, end + 1);
    }
    if (!jsonText) throw new Error("Empty JSON block");

    return JSON.parse(jsonText);
  } catch (e) {
    console.error("Failed to parse AI JSON. Error:", e.message, "Raw text:", text);
    throw new Error(`AI returned invalid JSON format: ${e.message}`);
  }
}

/**
 * Safely parses the 'options' field from AI response.
 */
export function parseAiOptions(optionsData) {
  let parsed = optionsData;
  if (typeof optionsData === 'string') {
    try {
      parsed = JSON.parse(optionsData);
    } catch (e) {
      return null;
    }
  }

  if (Array.isArray(parsed)) {
    return parsed.map(opt => {
      if (opt === null || opt === undefined) return "";
      if (typeof opt === 'object' && opt !== null) {
        return opt.text || opt.value || opt.label || JSON.stringify(opt);
      }
      return String(opt);
    });
  }
  return null;
}

/**
 * Ensures componentData is a plain object before spreading.
 */
export function sanitizeComponentData(data) {
  if (data === null || data === undefined) return {};
  if (typeof data === 'object' && !Array.isArray(data)) return data;
  return {};
}

/**
 * Processes raw AI JSON into a unified Prisma schema format using Zod validation with fallback.
 */
export function processAiQuestion(q, context) {
  const { level, topic, subtopic, heuristic, difficulty, gradeLevel, type, strand, blueprintMeta, stepResult } = context;

  try {
    // Try strict Zod validation first
    const validatedData = UniversalQuestionSchema.parse(q);
    const safeData = sanitizeComponentData(validatedData.visualEngine.componentData);
    
    return {
      level, topic, subtopic: subtopic || "", heuristic: heuristic || null,
      difficulty, gradeLevel, subject: "Math",
      type: validatedData.meta.type === 'SHORT_QUESTION' ? 'Short Question' :
        validatedData.meta.type === 'STRUCTURED' ? 'Structured' :
          validatedData.meta.type,
      strand: strand || blueprintMeta?.strand || "Number and Algebra",
      isApproved: false,
      finalAnswer: validatedData.content.finalAnswer,
      options: validatedData.meta.type === 'MCQ' ? (validatedData.content.options || []) : [],
      question: validatedData.content.questionText,
      solution: validatedData.content.solutionSteps,
      hint: validatedData.content.hint || null,
      modelData: {
        ...safeData,
        type: validatedData.visualEngine.componentToRender,
        hideVisual: stepResult?.metadata?.hideVisual ? true : (safeData?.hideVisual !== undefined 
          ? safeData.hideVisual 
          : validatedData.visualEngine.componentToRender === 'NONE'),
        inputRequirement: validatedData.inputRequirement,
        finalAnswer: validatedData.content.finalAnswer,
        items: Array.isArray(safeData?.items) ? safeData.items : [],
        defectMap: validatedData.content.defectMap || null
      }
    };
  } catch (zodError) {
    // Fallback manual mapping to prevent crash on slight Zod mismatches
    const { visualItems, modelData, questionText, solutionSteps, meta, content, visualEngine, inputRequirement, defectMap, ...cleanQ } = q;
    
    // Safely extract from nested schema if present
    const qContent = content || {};
    const qVisual = visualEngine || {};
    const safeModelData = modelData || qVisual.componentData || {};

    const hideVisualVal = stepResult?.metadata?.hideVisual ? true : !!safeModelData?.hideVisual;
    const typeVal = blueprintMeta?.visualType === 'DYNAMIC' ? (safeModelData?.type || qVisual.componentToRender || "NONE") : (blueprintMeta?.visualType || safeModelData?.type || qVisual.componentToRender || "NONE");

    const prismaModelData = {
      ...(safeModelData),
      type: typeVal,
      items: (Array.isArray(visualItems) && visualItems.length > 0) ? visualItems : (safeModelData?.items || []),
      hideVisual: hideVisualVal,
      defectMap: qContent.defectMap || safeModelData.defectMap || null,
      inputRequirement: inputRequirement || qVisual.inputRequirement || null
    };
    
    if (prismaModelData.type === undefined) delete prismaModelData.type;
    if (prismaModelData.items === undefined) delete prismaModelData.items;
    if (prismaModelData.hideVisual === undefined) delete prismaModelData.hideVisual;

      let rawSolution = cleanQ.solution || solutionSteps || qContent.solutionSteps || q.solution || "No solution provided";
      if (Array.isArray(rawSolution)) {
        rawSolution = rawSolution.map((s, i) => {
          if (typeof s === 'object') return `${i + 1}. ` + Object.entries(s).map(([k, v]) => `${k}: ${v}`).join(', ');
          return `${i + 1}. ${String(s)}`;
        }).join('\n');
      } else if (typeof rawSolution === 'object') {
        rawSolution = JSON.stringify(rawSolution);
      } else {
        rawSolution = String(rawSolution);
      }

      return {
        level, topic, subtopic: subtopic || "", heuristic: heuristic || "Standard",
        difficulty, gradeLevel, subject: "Math",
        type: type === 'MCQ' ? 'MCQ' : (type.toLowerCase().includes('short') ? 'Short Question' : 'Structured'),
        strand: strand || blueprintMeta?.strand || "Number and Algebra",
        isApproved: false,
        finalAnswer: typeof (q.finalAnswer || qContent.finalAnswer) === 'object' ? JSON.stringify(q.finalAnswer || qContent.finalAnswer) : String(q.finalAnswer || qContent.finalAnswer || ""),
        options: (meta?.type === 'MCQ' || type === 'MCQ') ? parseAiOptions(q.options || qContent.options) : null,
        question: cleanQ.question || questionText || qContent.questionText || q.question || cleanQ.problem || "Problem data missing",
        solution: rawSolution,
        hint: qContent.hint || q.hint || q.conceptualHint || null,
        modelData: prismaModelData
      };
    }
}
