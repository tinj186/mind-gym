import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getBestModel, modelCooldowns, COOLDOWN_MS, refreshModelPriority, modelPriorityList } from '@/lib/ai-config';
import { SYLLABUS_DATA } from '@/lib/syllabus';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const AI_TIMEOUT_MS = 25000;

/**
 * Builds a specialized prompt for the AI based on Singapore MOE Syllabus constraints.
 */
function getSyllabusPrompt(quantity, level, strand, topic, subtopic, heuristic, difficulty, type, blueprintData) {
  const instructions = [];
  const isP1P2 = level?.includes('1') || level?.includes('2');

  instructions.push(`QUESTION TYPES DEFINITION:
    - SHORT: 1-mark questions (Short Question). Goal: Quick answer (e.g., "How many?", "Which is greater?"). 'finalAnswer' is just the value (string).
    - STRUCTURED: 2-mark word problems (Structured). Goal: Show logic. 'finalAnswer' MUST be a JSON object: { "equation": "string (e.g., 12 + 5 = 17)", "value": "string (e.g., 17)", "statement": "string (e.g., She has 17 stickers now.)" }.`);

  // TONE AND VOCABULARY GUARDRAILS
  instructions.push(`TONE AND VOCABULARY GUARDRAILS:
    - CRITICAL: You are writing for a 7-year-old child. NEVER use internal system labels, code names, or technical jargon in the question text.
    - NEVER use words like "BASE_TEN_BLOCKS", "NUMBER_PATTERN", "COUNTING_OBJECTS", or "COMPARISON".
    - Instead, use simple, natural language. For example, say "Look at the blocks" (not base ten blocks), "Look at the numbers", or "Study the pattern".
    - If the question asks to fill in tens and ones, ensure your finalAnswer is a single string formatted exactly like "5 tens 4 ones".
    - If the question asks to arrange numbers in order, your finalAnswer MUST be a comma-separated string of the correct sequence (e.g., "12, 18, 24, 30"). Make sure the NUMBER_CARDS data outputs an array of those 4 numbers in a RANDOM, unsorted order so the student has to do the sorting.
    - CRITICAL formatting rule: If the finalAnswer is an equation string (Type 6), it MUST follow this strict standard format for evaluation: Use the standard '+', '-', and '=' operators with exactly one space around each operator (e.g., "A + B = C" or "C - B = A"). Ensure the mathematics is correct (Part+Part=Whole or Whole-Part=Part).`);

  if (blueprintData) {
    instructions.push(`MANDATORY BLUEPRINT: ${blueprintData.blueprint}`);
    instructions.push(`MANDATORY VOCABULARY: Use these words: ${blueprintData.vocabulary.join(', ')}`);
    instructions.push(`VISUAL STRATEGY: Ensure modelData uses ${blueprintData.visualType} logic.`);
  }

  // Apply modeling instructions to all types to ensure visualization logic is always present
  if (heuristic === 'PART_WHOLE') {
    instructions.push(isP1P2 
      ? "Modeling (P1/P2): Focus on putting items together for 'Altogether'. Example: 'Put 8 and 5 together. Now there are 13 altogether!'"
      : "Modeling: Ensure the logic allows for a clear 'Total' and at least two distinct 'Parts'. In the solution, describe joining or separating bars.");
  } else if (heuristic === 'COMPARISON') {
    instructions.push(isP1P2
      ? "Modeling (P1/P2): Use simple comparison logic. Phrasing: '[Name] has more, so their bar is longer' or '[Name] has fewer, so their bar is shorter'."
      : "Modeling: Ensure the logic involves comparing two values. In the solution, describe drawing bars of different lengths to show 'more' or 'fewer'.");
  }

  if (type === 'Short Question') {
    instructions.push("STRICT CONSTRAINT (Short Question): Goal: Quick answer. The question can be a simple equation (e.g., '15 + 5 = ?') or a direct task (e.g., 'How many?', 'Which is greater?'). No complex stories.");
    instructions.push("Final Answer (Short Question): The 'finalAnswer' field must be a string containing the numeric or text result (e.g., '20' or 'first').");
    instructions.push(isP1P2
      ? "Mathematical Logic: Explain simply without jargon. Use words like 'together' or 'altogether'. Example: 'Put 8 and 5 together. Now there are 13 altogether!'"
      : "Mathematical Logic: Explain the relationship using Bar Model concepts (e.g., 'Part 1 is 12, Part 2 is 6, the whole is the sum of these parts').");
  } else {
    // Only apply pedagogy and modeling instructions for word problems (Structured/MCQ)
    if (isP1P2) {
      instructions.push("Pedagogy: Use concrete objects (toys, sweets, fruits) and keep all numbers < 30.");
      instructions.push("Vocabulary: Use simple words ('Altogether', 'Left', 'More', 'Fewer'). Avoid abstract words ('Combining', 'Whole value', 'Sum', 'Remaining section').");
      instructions.push("Sentence Structure: Use short, punchy sentences (maximum 10 words per sentence).");
      instructions.push("Story Connection: Always refer back to the objects or names in the question (e.g., 'the apples', 'Ali') instead of 'the parts' or 'the units'.");
    }

    if (type === 'MCQ') {
      instructions.push("Format: You MUST provide exactly 4 distinct options in the 'options' array, labeled 'A: ...', 'B: ...', 'C: ...', and 'D: ...'.");
      instructions.push("Final Answer: The 'finalAnswer' must match the text of the correct option exactly (excluding the 'A: ', 'B: ', etc. prefix).");
    } else if (type === 'Structured') {
      instructions.push("STRICT CONSTRAINT (Structured): Goal: Word problems where students provide logic. The question text MUST be a word problem scenario.");
      instructions.push("Final Answer (Structured): The 'finalAnswer' MUST be a JSON object: { \"equation\": \"string (e.g., 12 + 5 = 17)\", \"value\": \"string (e.g., 17)\", \"statement\": \"string (e.g., She has 17 stickers now.)\" }.");
    }
  }

  // Apply Visual Modeling Data instructions to ALL types (including Short Question)
  instructions.push(`Visual Modeling Data: You MUST populate the 'modelData' field based on the required visualType for the sub-topic.
    - Rule for PART_WHOLE / COMPARISON: Use { "type": "PART_WHOLE" | "COMPARISON", "whole": number, "parts": [val1, val2] }
    - Rule for PLACE_VALUE_CHART: Use { "type": "PLACE_VALUE_CHART", "tens": number, "ones": number, "hundreds": number (optional) }
    - Rule for COUNTING_OBJECTS: Use { "type": "COUNTING_OBJECTS", "icons": ["emoji1", "emoji2"], "groups": [count1, count2], "crossOut": number }. Use 1 or 2 emojis. If joining different sets, provide 2 different emojis. Ensure story text EXACTLY matches the emojis (do not call fruits "animals"). Use crossOut > 0 only for subtraction.
    - Rule for EQUAL_GROUPS: Use { "type": "EQUAL_GROUPS", "icon": "emoji", "groups": number, "itemsPerGroup": number }
    - Rule for BASE_TEN_BLOCKS: Use { "type": "BASE_TEN_BLOCKS", "tens": number, "ones": number }
    - Rule for NUMBER_PATTERN: Use { "type": "NUMBER_PATTERN", "sequence": [item1, item2, item3, item4, item5], "rule": "string" }. Exactly one item in the sequence MUST be "?". The jump 'rule' MUST scale based on the requested difficulty (${difficulty}) as defined in the blueprint.
    - Rule for NUMBER_CARDS: Use { "type": "NUMBER_CARDS", "numbers": [num1, num2] }
    - Rule for NUMBER_BOND: Output { "type": "NUMBER_BOND", "whole": number, "part1": number, "part2": string "?" }. Exactly one of the three values (whole, part1, or part2) MUST be the string "?".
    - Rule for COMPARE_OBJECTS: Output an array of 2 to 4 objects called sets. Each object must have a label (e.g., "A", "B", "C"), an icon (a single emoji, keep it consistent across sets if comparing the same item), and a count (number between 1 and 20). Example: { "type": "COMPARE_OBJECTS", "sets": [{ "label": "A", "count": 5, "icon": "🍎" }, { "label": "B", "count": 8, "icon": "🍎" }] }
    - Rule for ORDINAL_LINE: CRITICAL for ORDINAL_LINE: Output items: array of 5 to 8 STRICTLY UNIQUE AND DIFFERENT emojis (e.g., ["🚗", "🚕", "🚙", "🚌", "🚎"]). YOU MUST NEVER USE THE SAME EMOJI TWICE IN THE ARRAY. The question text must ask for the position of ONE specific emoji from that exact array. CRITICAL: For ordinal questions, the finalAnswer MUST be formatted as an ordinal string with its suffix (e.g., "1st", "2nd", "3rd", "4th", "5th"). NEVER output a raw integer like "1" or "4" for the answer.
    - Rule for NONE: If the visualType is 'NONE' or the blueprint requires an abstract question without a diagram, set 'modelData' to null or omit it.`);

  return `
    You are a Singapore MOE Mathematics specialist. 
    Generate ${quantity} new math questions based on the following metadata.

    Context:
    - Strand: ${strand || 'N/A'}
    - Level: ${level}
    - Topic: ${topic}
    - Sub-topic: ${subtopic || 'N/A'}
    - Difficulty: ${difficulty}
    - Type: ${type}
    - Heuristic: ${heuristic}

    Expert Instructions:
    ${instructions.join('\n    ')}
    - CRITICAL: The 'solution' field MUST be formatted with each step on a new line.
    - CRITICAL: When generating visual questions (COUNTING_OBJECTS, BASE_TEN_BLOCKS, EQUAL_GROUPS, SHAPE), write the question text assuming the image is displayed directly below it (e.g., "Look at the picture below. How many umbrellas are there?").
    - CRITICAL: For P1/P2 numbers up to 20, ensure 'modelData' values are whole integers to allow for unit subdivision.
    - CRITICAL: The 'solution' field should focus on mathematical logic and calculation steps. Since a visual bar model is provided separately via 'modelData', do NOT include instructions on how to draw the bars (e.g., avoid 'Draw a bar...', 'Sketch a box...') in the solution text.
    - CRITICAL: If the question asks the student to write their answer "in words", your finalAnswer MUST be the spelled-out English word, entirely in lowercase (e.g., "twenty-one", "first", "twelfth").
    - CRITICAL: The 'finalAnswer' field must ALWAYS contain the actual numerical or text result (e.g., '120' or '3 1/2').
    - CRITICAL: Do NOT put just 'A', 'B', 'C', or 'D' in 'finalAnswer'. It must be the value itself.

    Output Format:
    Return ONLY a JSON array of objects matching this schema:
    {
      "subject": "Math",
      "level": "${level}",
      "gradeLevel": "P${level?.match(/\d/)?.[0] || '?'}",
      "strand": "${strand || ''}",
      "heuristic": "${heuristic}",
      "topic": "${topic}",
      "subtopic": "${subtopic || ''}",
      "type": "${type}",
      "difficulty": "${difficulty}",
      "question": "string",
      "options": ${type === 'MCQ' ? '["A: ...", "B: ...", "C: ...", "D: ..."]' : 'null'},
      "modelData": { ... }, // Flexible object structure matching the visualType instructions above
      "solution": "string (step-by-step mathematical explanation with each step on a new line. Focus on logic and calculations; do not include drawing instructions.)",
      "finalAnswer": "string or JSON object (For Structured: { \"equation\": \"...\", \"value\": \"...\", \"statement\": \"...\" })",
      "isApproved": false
    }
  `.trim();
}

export async function POST(req) {
  try {
    await refreshModelPriority();
    const body = await req.json();
    const { quantity, metadata } = body;
    const { level, strand, topic, subtopic, type, difficulty } = metadata || {};
    const heuristic = metadata?.heuristic || topic;

    const levelData = SYLLABUS_DATA[level] || [];
    const topicEntry = levelData.find(t => t.topic === topic);
    const blueprintData = topicEntry?.subtopics.find(s => s.name === subtopic);

    const systemPrompt = getSyllabusPrompt(quantity, level, strand, topic, subtopic, heuristic, difficulty, type, blueprintData);
    let attempts = 0;
    const maxAttempts = modelPriorityList.length;
    let lastError = null;

    while (attempts < maxAttempts) {
      const selectedModelId = getBestModel();
      console.log(`🤖 [AI Generate] Attempt ${attempts + 1}/${maxAttempts} using: ${selectedModelId}`);
      
      try {
        const model = genAI.getGenerativeModel({ model: selectedModelId }, { apiVersion: 'v1beta' });
        const aiResult = await Promise.race([
          model.generateContent(systemPrompt),
          new Promise((_, reject) => setTimeout(() => reject(new Error("AI_TIMEOUT")), AI_TIMEOUT_MS))
        ]);

        const aiResponseText = aiResult.response.text();
        const jsonMatch = aiResponseText.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error("INVALID_JSON_FORMAT");
        
        // Map finalAnswer to string if it's an object (for DB storage)
        const parsedQuestions = JSON.parse(jsonMatch[0]).map(q => ({
          ...q,
          finalAnswer: typeof q.finalAnswer === 'object' ? JSON.stringify(q.finalAnswer) : String(q.finalAnswer)
        }));

        await prisma.questionBank.createMany({ data: parsedQuestions });
        return NextResponse.json({ success: true, count: parsedQuestions.length });
      } catch (err) {
        console.warn(`⚠️ [AI Failover] Model ${selectedModelId} failed: ${err.message}`);
        modelCooldowns[selectedModelId] = Date.now() + COOLDOWN_MS;
        attempts++;
        lastError = err;
      }
    }
    throw lastError;
  } catch (error) {
    console.error("❌ Generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}