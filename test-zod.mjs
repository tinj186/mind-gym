import { UniversalQuestionSchema } from './src/app/api/admin/generate/questionSchema.js';

const q = {
  "meta": {
    "level": "Primary 3",
    "topic": "Whole Numbers - Addition and Subtraction",
    "type": "STRUCTURED",
    "difficulty": "Advanced"
  },
  "content": {
    "questionText": "A factory made 7570 pencils over two days. They made 3933 pencils on Monday. How many pencils did they make on Tuesday?",
    "options": null,
    "defectMap": null,
    "hint": "To find the number of pencils made on Tuesday, subtract the number of pencils made on Monday from the total number of pencils made over the two days.",
    "solutionSteps": "1. Identify the total number of pencils (7570) and the amount made on Monday (3933).\\n2. Subtract the Monday total from the overall total to find the Tuesday amount: 7570 - 3933 = 3637.",
    "finalAnswer": "3637"
  },
  "visualEngine": {
    "componentToRender": "BAR_MODEL",
    "componentData": {
      "type": "PART_WHOLE",
      "parts": ["?", "3933"],
      "whole": "7570"
    }
  },
  "inputRequirement": {
    "inputType": "MULTI_STEP_INPUT",
    "steps": [
      {
        "label": "Step 1 (Equation)",
        "expectedAnswer": "7570 - 3933 = 3637"
      },
      {
        "label": "Step 2 (Final Answer)",
        "expectedAnswer": "3637"
      }
    ]
  }
};

try {
  UniversalQuestionSchema.parse(q);
  console.log("Success!");
} catch (e) {
  console.error(JSON.stringify(e.errors, null, 2));
}
