import { z } from 'zod';

export const UniversalQuestionSchema = z.object({
  // 1. META: Tags and Routing data
  meta: z.object({
    level: z.string(),
    topic: z.string(),
    type: z.enum(['SHORT_QUESTION', 'STRUCTURED', 'MCQ']),
    difficulty: z.enum(['Foundation', 'Standard', 'Advanced']),
  }),

  // 2. CONTENT: What the student reads and solves
  content: z.object({
    questionText: z.string(),
    options: z.array(z.string()).nullable().optional(),
    finalAnswer: z.string(),
    solutionSteps: z.string(),
  }),

  // 3. VISUAL ENGINE: The Polymorphic Payload
  visualEngine: z.object({
    componentToRender: z.string(), // e.g., 'GROUPING_WORKSPACE', 'NUMBER_CARDS', 'NONE'
    componentData: z.record(z.any()).nullable(), // Component-specific props
  }),

  // 4. INPUT REQUIREMENT: How the student answers
  inputRequirement: z.object({
    inputType: z.enum(['STANDARD_TEXT', 'MCQ_BUTTONS', 'MATH_KEYBOARD', 'FRACTION_PAD']).default('STANDARD_TEXT'),
  })
});