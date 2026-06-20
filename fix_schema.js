const fs = require('fs');
let code = fs.readFileSync('src/app/api/admin/generate/questionSchema.js', 'utf8');

// Insert steps array to inputRequirement
code = code.replace(/inputType:\s*z\.enum\([^)]+\)\.default\('STANDARD_TEXT'\),/g, `inputType: z.enum(['STANDARD_TEXT', 'MCQ_BUTTONS', 'MATH_KEYBOARD', 'FRACTION_PAD', 'MULTI_STEP_INPUT']).default('STANDARD_TEXT'),
    steps: z.array(z.object({
      label: z.string(),
      expectedAnswer: z.string(),
      defectMap: z.record(z.string()).optional().nullable(),
    })).optional(),`);
fs.writeFileSync('src/app/api/admin/generate/questionSchema.js', code);
