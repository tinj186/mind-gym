import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Performs a Stealth AI Diagnostic to assign a Defect Code for incorrect attempts.
 * 
 * @param {Object} params
 * @param {string} params.question - The original question text.
 * @param {string} params.expectedAnswer - The correct final answer.
 * @param {string} params.studentAnswer - What the student submitted.
 * @param {string} params.modelDescription - Serialized description of the student's bar model.
 * @returns {Promise<string>} The defect code (e.g., 'CARELESS_CALCULATION').
 */
export async function runStealthDiagnostic({ question, expectedAnswer, studentAnswer, modelDescription }) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    As a Singapore Math specialist, diagnose the learner's error.
    
    QUESTION: ${question}
    EXPECTED ANSWER: ${expectedAnswer}
    STUDENT'S NUMERIC ANSWER: ${studentAnswer}
    STUDENT'S VISUAL BAR MODEL: ${modelDescription}
    
    DEFECT CODES:
    - CARELESS_CALCULATION: Logic is perfect, but arithmetic failed.
    - UNIT_MISMATCH: Student used the wrong values (e.g., adding centimeters to meters).
    - CONCEPTUAL_ERROR: Logic in the bar model is flawed (e.g., used subtraction when addition was needed).
    - CONSTANT_VIOLATION: The student ignored a constraint mentioned in the question.
    - MODEL_ACCURACY_MISMATCH: Numeric answer is correct, but the bar model logic contradicts it.
    - UNKNOWN: Logic and error cannot be clearly categorized.

    TASK: Return ONLY the DEFECT CODE string. No explanation.
  `.trim();

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const code = response.text().trim();
    
    const validCodes = [
      'CARELESS_CALCULATION', 'UNIT_MISMATCH', 'CONCEPTUAL_ERROR', 
      'CONSTANT_VIOLATION', 'MODEL_ACCURACY_MISMATCH', 'UNKNOWN'
    ];

    return validCodes.includes(code) ? code : 'UNKNOWN';
  } catch (error) {
    console.error("Diagnostic AI failed:", error);
    return 'UNKNOWN';
  }
}