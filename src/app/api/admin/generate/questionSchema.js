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
    hint: z.string().optional(),
  }),

  // 3. VISUAL ENGINE: The Polymorphic Payload
  visualEngine: z.object({
    componentToRender: z.enum([
      'COUNTING_OBJECTS',
      'NUMBER_CARDS',
      'SINGAPORE_MONEY',
      'NUMBER_PATTERN',
      'EQUAL_GROUPS',
      'GROUPING_WORKSPACE',
      'ORDINAL_LINE',
      'BASE_TEN_BLOCKS',
      'NUMBER_BOND',
      'SHAPE',
      'SHAPE_DISPLAY',
      'PICTURE_GRAPH_DISPLAY',
      'MEASUREMENT_UNIT',
      'CLOCK_DISPLAY',
      'NONE'
    ]), // Registered native visual engines
    componentData: z.record(z.any()).nullable(),
  }),

  // 4. INPUT REQUIREMENT: How the student answers
  inputRequirement: z.object({
    inputType: z.enum(['STANDARD_TEXT', 'MCQ_BUTTONS', 'MATH_KEYBOARD', 'FRACTION_PAD']).default('STANDARD_TEXT'),
  })
});