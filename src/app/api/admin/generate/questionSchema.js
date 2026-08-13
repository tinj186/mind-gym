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
    questionText: z.union([z.string(), z.array(z.string())]),
    options: z.array(z.string()).nullable().optional(),
    finalAnswer: z.string(),
    acceptedAnswers: z.array(z.string()).optional(),
    solutionSteps: z.union([z.string(), z.array(z.string())]),
    hint: z.string().optional(),
    defectMap: z.record(z.string()).optional().nullable(),
  }),

  // 3. VISUAL ENGINE: The Polymorphic Payload
  visualEngine: z.object({
    componentToRender: z.enum([
      'COUNTING_OBJECTS',
      'OBJECT_COUNTING',
      'ICON_GRID',
      'TWO_SET_COMPARISON',
      'NUMBER_CARDS',
      'SINGAPORE_MONEY',
      'NUMBER_PATTERN',
      'EQUAL_GROUPS',
      'GROUPING_WORKSPACE',
      'ORDINAL_LINE',
      'BASE_TEN_BLOCKS',
      'NUMBER_BOND',
      'FACT_TRIANGLE',
      'SHAPE',
      'SHAPE_DISPLAY',
      'GRID_DISPLAY',
      'GRID_DRAWING_CANVAS',
      'PICTURE_GRAPH_DISPLAY',
      'MEASUREMENT_UNIT',
      'CLOCK_DISPLAY',
      'MULTI_COMPONENT',
      'FRACTION_DISPLAY',
      'BAR_MODEL',
      'VERTICAL_ALGORITHM',
      'LONG_DIVISION',
      'FRACTION_EQUIVALENCE',
      'NONE'
    ]), // Registered native visual engines
    componentData: z.record(z.any()).nullable(),
  }),

  // 4. INPUT REQUIREMENT: How the student answers
  inputRequirement: z.object({
    inputType: z.enum(['STANDARD_TEXT', 'MCQ_BUTTONS', 'MATH_KEYBOARD', 'FRACTION_PAD', 'MULTI_STEP_INPUT', 'INTERACTIVE_GRID']).default('STANDARD_TEXT'),
    steps: z.array(z.object({
      label: z.string(),
      expectedAnswer: z.string(),
      acceptedAnswers: z.array(z.string()).optional(),
      defectMap: z.record(z.string()).optional().nullable()
    })).optional()
  }).nullable().optional()
});