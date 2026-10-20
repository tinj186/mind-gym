const fs = require('fs');
const path = require('path');

const primary4Data = [
  {
    strand: "Number and Algebra",
    topic: "Whole Numbers - Numbers up to 100 000",
    slug: "whole-numbers-numbers-up-to-100000",
    subtopics: [
      {
        slug: "place-values-ten-thousands",
        varName: "p4PlaceValuesTenThousandsBlueprint",
        name: "Place Values (Ten Thousands)",
        moeDescription: "number notation, representations and place values (ten thousands, thousands, hundreds, tens, ones)",
        visualType: "PLACE_VALUE_DISCS",
        vocabulary: ["ten thousands", "thousands", "hundreds", "tens", "ones", "place value", "digit", "value"]
      },
      {
        slug: "number-notation",
        varName: "p4NumberNotationBlueprint",
        name: "Number Notation",
        moeDescription: "reading and writing numbers in numerals and in words",
        visualType: "NONE",
        vocabulary: ["numerals", "words", "write", "read"]
      },
      {
        slug: "number-comparison-and-ordering",
        varName: "p4NumberComparisonAndOrderingBlueprint",
        name: "Number Comparison and Ordering",
        moeDescription: "comparing and ordering numbers",
        visualType: "NUMBER_CARDS",
        vocabulary: ["greater than", "smaller than", "greatest", "smallest", "ascending", "descending", "order"]
      },
      {
        slug: "number-patterns",
        varName: "p4NumberPatternsBlueprint",
        name: "Number Patterns",
        moeDescription: "patterns in number sequences",
        visualType: "NUMBER_PATTERN",
        vocabulary: ["pattern", "rule", "sequence", "next", "more than", "less than"]
      },
      {
        slug: "number-rounding",
        varName: "p4NumberRoundingBlueprint",
        name: "Number Rounding",
        moeDescription: "rounding numbers to the nearest 10, 100 or 1000",
        visualType: "NUMBER_LINE",
        vocabulary: ["round off", "nearest 10", "nearest 100", "nearest 1000", "approximately"]
      },
      {
        slug: "approximation-symbol",
        varName: "p4ApproximationSymbolBlueprint",
        name: "Approximation Symbol (≈)",
        moeDescription: "use of ≈",
        visualType: "NONE",
        vocabulary: ["approximately equal to", "≈", "estimate", "approximation"]
      }
    ]
  },
  {
    strand: "Number and Algebra",
    topic: "Whole Numbers - Factors and Multiples",
    slug: "whole-numbers-factors-and-multiples",
    subtopics: [
      {
        slug: "factors-and-multiples",
        varName: "p4FactorsAndMultiplesBlueprint",
        name: "Factors and Multiples",
        moeDescription: "factors, multiples and their relationship",
        visualType: "FACTOR_TREE",
        vocabulary: ["factor", "multiple", "product", "divisible"]
      },
      {
        slug: "factor-determination",
        varName: "p4FactorDeterminationBlueprint",
        name: "Factor Determination",
        moeDescription: "determining if a 1-digit number is a factor of a given number within 100",
        visualType: "NONE",
        vocabulary: ["factor", "divisible", "remainder", "divide exactly"]
      },
      {
        slug: "common-factors",
        varName: "p4CommonFactorsBlueprint",
        name: "Common Factors",
        moeDescription: "finding the common factors of two given numbers",
        visualType: "VENN_DIAGRAM",
        vocabulary: ["common factor", "factors", "greatest common factor"]
      },
      {
        slug: "multiple-determination",
        varName: "p4MultipleDeterminationBlueprint",
        name: "Multiple Determination",
        moeDescription: "determining if a number is a multiple of a given 1-digit number",
        visualType: "NONE",
        vocabulary: ["multiple", "divisible", "multiplication table"]
      },
      {
        slug: "common-multiples",
        varName: "p4CommonMultiplesBlueprint",
        name: "Common Multiples",
        moeDescription: "finding the common multiples of two given 1-digit numbers",
        visualType: "NONE",
        vocabulary: ["common multiple", "lowest common multiple", "multiples"]
      }
    ]
  },
  {
    strand: "Number and Algebra",
    topic: "Whole Numbers - Four Operations",
    slug: "whole-numbers-four-operations",
    subtopics: [
      {
        slug: "multiplication-algorithms-advanced",
        varName: "p4MultiplicationAlgorithmsAdvancedBlueprint",
        name: "Multiplication Algorithms (Advanced)",
        moeDescription: "multiplication algorithm (up to 4 digits by 1 digit, and up to 3 digits by 2 digits)",
        visualType: "NONE",
        vocabulary: ["multiply", "product", "algorithm", "regrouping"]
      },
      {
        slug: "division-algorithms-advanced",
        varName: "p4DivisionAlgorithmsAdvancedBlueprint",
        name: "Division Algorithms (Advanced)",
        moeDescription: "division algorithm (up to 4 digits by 1 digit)",
        visualType: "NONE",
        vocabulary: ["divide", "quotient", "remainder", "dividend", "divisor", "long division"]
      }
    ]
  },
  {
    strand: "Number and Algebra",
    topic: "Fractions - Mixed Numbers and Improper Fractions",
    slug: "fractions-mixed-numbers-and-improper-fractions",
    subtopics: [
      {
        slug: "mixed-numbers-improper-fractions",
        varName: "p4MixedNumbersImproperFractionsBlueprint",
        name: "Mixed Numbers/Improper Fractions",
        moeDescription: "mixed numbers, improper fractions and their relationship",
        visualType: "FRACTION_MODEL",
        vocabulary: ["mixed number", "improper fraction", "proper fraction", "whole number", "numerator", "denominator"]
      }
    ]
  },
  {
    strand: "Number and Algebra",
    topic: "Fractions - Fraction of a Set",
    slug: "fractions-fraction-of-a-set",
    subtopics: [
      {
        slug: "fraction-of-a-set",
        varName: "p4FractionOfASetBlueprint",
        name: "Fraction of a Set",
        moeDescription: "fraction as part of a set",
        visualType: "FRACTION_OF_SET",
        vocabulary: ["fraction of a set", "part of a set", "groups", "items"]
      }
    ]
  },
  {
    strand: "Number and Algebra",
    topic: "Fractions - Addition and Subtraction",
    slug: "fractions-addition-and-subtraction",
    subtopics: [
      {
        slug: "fraction-addition-subtraction-different-denominators",
        varName: "p4FractionAdditionSubtractionDifferentDenominatorsBlueprint",
        name: "Fraction Addition/Subtraction (Different Denominators)",
        moeDescription: "adding and subtracting fractions with denominators of given fractions not exceeding 12 and not more than two different denominators",
        visualType: "FRACTION_MODEL",
        vocabulary: ["equivalent fractions", "common denominator", "add", "subtract", "simplest form"]
      }
    ]
  },
  {
    strand: "Number and Algebra",
    topic: "Decimals - Decimals up to 3 decimal places",
    slug: "decimals-decimals-up-to-3-decimal-places",
    subtopics: [
      {
        slug: "decimal-place-values",
        varName: "p4DecimalPlaceValuesBlueprint",
        name: "Decimal Place Values",
        moeDescription: "notation, representations and place values (tenths, hundredths, thousandths)",
        visualType: "DECIMAL_GRID",
        vocabulary: ["decimal", "decimal point", "tenths", "hundredths", "thousandths", "place value"]
      },
      {
        slug: "decimal-comparison-ordering",
        varName: "p4DecimalComparisonOrderingBlueprint",
        name: "Decimal Comparison/Ordering",
        moeDescription: "comparing and ordering decimals",
        visualType: "NUMBER_CARDS",
        vocabulary: ["greater than", "smaller than", "greatest", "smallest", "order", "ascending", "descending"]
      },
      {
        slug: "decimals-to-fractions",
        varName: "p4DecimalsToFractionsBlueprint",
        name: "Decimals to Fractions",
        moeDescription: "expressing decimals as fractions",
        visualType: "NONE",
        vocabulary: ["decimal", "fraction", "simplest form", "tenths", "hundredths", "thousandths"]
      },
      {
        slug: "fractions-to-decimals",
        varName: "p4FractionsToDecimalsBlueprint",
        name: "Fractions to Decimals",
        moeDescription: "expressing fractions as decimals when the denominator is a factor of 10 or 100",
        visualType: "NONE",
        vocabulary: ["fraction", "decimal", "denominator", "factor of 10", "factor of 100"]
      },
      {
        slug: "decimal-rounding",
        varName: "p4DecimalRoundingBlueprint",
        name: "Decimal Rounding",
        moeDescription: "rounding decimals to the nearest whole number, 1 decimal place, or 2 decimal places",
        visualType: "NUMBER_LINE",
        vocabulary: ["round off", "nearest whole number", "1 decimal place", "2 decimal places", "approximate"]
      }
    ]
  },
  {
    strand: "Number and Algebra",
    topic: "Decimals - Addition and Subtraction",
    slug: "decimals-addition-and-subtraction",
    subtopics: [
      {
        slug: "decimal-addition-subtraction",
        varName: "p4DecimalAdditionSubtractionBlueprint",
        name: "Decimal Addition/Subtraction",
        moeDescription: "adding and subtracting decimals (up to 2 decimal places)",
        visualType: "NONE",
        vocabulary: ["add", "subtract", "decimal point", "align", "sum", "difference"]
      }
    ]
  },
  {
    strand: "Number and Algebra",
    topic: "Decimals - Multiplication and Division",
    slug: "decimals-multiplication-and-division",
    subtopics: [
      {
        slug: "decimal-multiplication-division",
        varName: "p4DecimalMultiplicationDivisionBlueprint",
        name: "Decimal Multiplication/Division",
        moeDescription: "multiplying and dividing decimals (up to 2 decimal places) by a 1-digit whole number",
        visualType: "NONE",
        vocabulary: ["multiply", "divide", "decimal", "product", "quotient"]
      },
      {
        slug: "whole-number-division-decimal-quotient",
        varName: "p4WholeNumberDivisionDecimalQuotientBlueprint",
        name: "Whole Number Division (Decimal Quotient)",
        moeDescription: "dividing a whole number by a whole number with quotient as a decimal",
        visualType: "NONE",
        vocabulary: ["divide", "quotient", "decimal", "whole number"]
      },
      {
        slug: "answer-rounding",
        varName: "p4AnswerRoundingBlueprint",
        name: "Answer Rounding",
        moeDescription: "rounding answers to a specified degree of accuracy",
        visualType: "NONE",
        vocabulary: ["round off", "degree of accuracy", "nearest whole number", "nearest tenth"]
      }
    ]
  },
  {
    strand: "Measurement and Geometry",
    topic: "Area and Volume - Area and Perimeter",
    slug: "area-and-volume-area-and-perimeter",
    subtopics: [
      {
        slug: "rectangle-dimension-calculation",
        varName: "p4RectangleDimensionCalculationBlueprint",
        name: "Rectangle Dimension Calculation",
        moeDescription: "finding one dimension of a rectangle given the other dimension and its area/perimeter",
        visualType: "RECTANGLE_DIAGRAM",
        vocabulary: ["length", "breadth", "width", "perimeter", "area", "dimension"]
      },
      {
        slug: "square-dimension-calculation",
        varName: "p4SquareDimensionCalculationBlueprint",
        name: "Square Dimension Calculation",
        moeDescription: "finding the length of one side of a square given its area/perimeter",
        visualType: "SQUARE_DIAGRAM",
        vocabulary: ["side", "length", "perimeter", "area", "square"]
      },
      {
        slug: "composite-figure-area-perimeter",
        varName: "p4CompositeFigureAreaPerimeterBlueprint",
        name: "Composite Figure Area/Perimeter",
        moeDescription: "finding the area and perimeter of composite figures made up of rectangles and squares",
        visualType: "COMPOSITE_FIGURE",
        vocabulary: ["composite figure", "area", "perimeter", "split", "combine"]
      }
    ]
  },
  {
    strand: "Measurement and Geometry",
    topic: "Geometry - Angles",
    slug: "geometry-angles",
    subtopics: [
      {
        slug: "angle-notation",
        varName: "p4AngleNotationBlueprint",
        name: "Angle Notation",
        moeDescription: "using notation such as ∠ABC and ∠a to name angles",
        visualType: "ANGLE_DIAGRAM",
        vocabulary: ["angle", "∠", "vertex", "arms", "name"]
      },
      {
        slug: "angle-measurement-degrees",
        varName: "p4AngleMeasurementDegreesBlueprint",
        name: "Angle Measurement (Degrees)",
        moeDescription: "measuring angles in degrees",
        visualType: "PROTRACTOR_DIAGRAM",
        vocabulary: ["degrees", "°", "protractor", "inner scale", "outer scale", "acute", "obtuse", "right angle"]
      },
      {
        slug: "angle-drawing",
        varName: "p4AngleDrawingBlueprint",
        name: "Angle Drawing",
        moeDescription: "drawing an angle of given size",
        visualType: "PROTRACTOR_DIAGRAM",
        vocabulary: ["draw", "angle", "protractor", "degrees", "baseline"]
      }
    ]
  },
  {
    strand: "Measurement and Geometry",
    topic: "Geometry - Rectangle and Square",
    slug: "geometry-rectangle-and-square",
    subtopics: [
      {
        slug: "rectangle-square-properties",
        varName: "p4RectangleSquarePropertiesBlueprint",
        name: "Rectangle/Square Properties",
        moeDescription: "properties of rectangle and square, excluding diagonal properties",
        visualType: "GEOMETRY_PROPERTIES",
        vocabulary: ["rectangle", "square", "right angle", "opposite sides", "equal length", "parallel"]
      },
      {
        slug: "rectangle-square-drawing",
        varName: "p4RectangleSquareDrawingBlueprint",
        name: "Rectangle/Square Drawing",
        moeDescription: "drawing rectangles and squares",
        visualType: "GRID_DRAWING",
        vocabulary: ["draw", "grid", "ruler", "set square", "length", "breadth"]
      }
    ]
  },
  {
    strand: "Measurement and Geometry",
    topic: "Geometry - Line Symmetry",
    slug: "geometry-line-symmetry",
    subtopics: [
      {
        slug: "symmetric-figure-identification",
        varName: "p4SymmetricFigureIdentificationBlueprint",
        name: "Symmetric Figure Identification",
        moeDescription: "identifying symmetric figures",
        visualType: "SYMMETRY_FIGURE",
        vocabulary: ["symmetric", "symmetry", "line of symmetry", "fold"]
      },
      {
        slug: "line-of-symmetry-determination",
        varName: "p4LineOfSymmetryDeterminationBlueprint",
        name: "Line of Symmetry Determination",
        moeDescription: "determining whether a straight line is a line of symmetry of a symmetric figure",
        visualType: "SYMMETRY_FIGURE",
        vocabulary: ["line of symmetry", "mirror image", "fold", "halves match"]
      },
      {
        slug: "symmetric-figure-completion",
        varName: "p4SymmetricFigureCompletionBlueprint",
        name: "Symmetric Figure Completion",
        moeDescription: "completing a symmetric figure with respect to a given line of symmetry on square grid",
        visualType: "SYMMETRY_GRID",
        vocabulary: ["complete", "symmetric figure", "grid", "reflection", "line of symmetry"]
      }
    ]
  },
  {
    strand: "Measurement and Geometry",
    topic: "Geometry - Nets",
    slug: "geometry-nets",
    subtopics: [
      {
        slug: "3d-solid-identification-2d-reps",
        varName: "p43DSolidIdentification2DRepsBlueprint",
        name: "3D Solid Identification (2D Reps)",
        moeDescription: "identifying 2D representations of a cube, cuboid, cone, cylinder, prism, and pyramid",
        visualType: "NETS_3D",
        vocabulary: ["cube", "cuboid", "cone", "cylinder", "prism", "pyramid", "solid", "face", "edge", "vertex"]
      },
      {
        slug: "3d-solid-drawing",
        varName: "p43DSolidDrawingBlueprint",
        name: "3D Solid Drawing",
        moeDescription: "drawing 2D representations of a cube, cuboid, prism, and pyramid",
        visualType: "ISOMETRIC_GRID",
        vocabulary: ["draw", "isometric", "representation", "solid"]
      },
      {
        slug: "3d-solid-nets",
        varName: "p43DSolidNetsBlueprint",
        name: "3D Solid Nets",
        moeDescription: "identifying the nets of 3D solids (cube, cuboid, prism, pyramid)",
        visualType: "NETS_3D",
        vocabulary: ["net", "fold", "cube", "cuboid", "prism", "pyramid", "faces"]
      },
      {
        slug: "solid-identification-from-net",
        varName: "p4SolidIdentificationFromNetBlueprint",
        name: "Solid Identification from Net",
        moeDescription: "identifying the solid which can be formed by a given net",
        visualType: "NETS_3D",
        vocabulary: ["net", "solid", "fold", "forms", "cube", "cuboid"]
      }
    ]
  },
  {
    strand: "Statistics",
    topic: "Data Representation and Interpretation - Tables, Line Graphs and Pie Charts",
    slug: "data-representation-and-interpretation-tables-line-graphs-and-pie-charts",
    subtopics: [
      {
        slug: "table-completion",
        varName: "p4TableCompletionBlueprint",
        name: "Table Completion",
        moeDescription: "completing a table from given data",
        visualType: "DATA_TABLE",
        vocabulary: ["table", "data", "row", "column", "total", "complete"]
      },
      {
        slug: "data-interpretation-tables-graphs",
        varName: "p4DataInterpretationTablesGraphsBlueprint",
        name: "Data Interpretation (Tables/Graphs)",
        moeDescription: "reading and interpreting data from tables/line graphs/pie charts",
        visualType: "LINE_GRAPH",
        vocabulary: ["line graph", "pie chart", "table", "interpret", "read", "trend", "increase", "decrease"]
      }
    ]
  }
];

const p4Root = path.resolve(__dirname, '../src/lib/syllabus/math/primary-4');
if (!fs.existsSync(p4Root)) {
  fs.mkdirSync(p4Root, { recursive: true });
}

function makeDifficultyLogicFile(level, topic, subtopicName, diffLevel) {
  return `export function ${diffLevel.toLowerCase()}Logic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  const visualEngineStr = \`{\\n    "componentToRender": "NONE",\\n    "componentData": { "hideVisual": true }\\n  }\`;
  const inputRequirementStr = isStructure ? \`{\\n    "inputType": "MULTI_STEP_INPUT"\\n  }\` : null;

  const aiPrompt = \`You are an expert Singapore Primary 4 Math educator.
Generate a ${diffLevel}-level question for Singapore Primary 4 students.
Topic: \${topic}
Subtopic: ${subtopicName}
Difficulty: \${zodDiff}
Type: \${zodType}

CRITICAL INSTRUCTIONS:
1. Ensure numerical values, contexts, and operations strictly adhere to the Singapore MOE Primary 4 Mathematics Syllabus.
2. If MCQ, generate exactly 4 options.
3. Provide step-by-step solution steps separated by \\\\n and an encouraging conceptual hint.

\${getFormatInstructions(visualEngineStr, inputRequirementStr)}\`;

  return { aiPrompt };
}
`;
}

function makeRouterFile(topic, subtopic) {
  return `import { foundationLogic } from './${subtopic.slug}/foundation.js';
import { standardLogic } from './${subtopic.slug}/standard.js';
import { advancedLogic } from './${subtopic.slug}/advanced.js';

export const ${subtopic.varName} = {
  id: 'p4-${subtopic.slug}',
  title: '${subtopic.name}',
  strand: '${topic.strand}',
  visualType: '${subtopic.visualType}',

  difficultyLevels: {
    foundation: {
      name: 'Basic Mastery',
      steps: 1,
      logicDescription: '${subtopic.moeDescription.replace(/'/g, "\\'")}'
    },
    standard: {
      name: 'Grade Level Expectation',
      steps: 2,
      logicDescription: '${subtopic.moeDescription.replace(/'/g, "\\'")}'
    },
    advanced: {
      name: 'Integrated Logic',
      steps: 2,
      logicDescription: '${subtopic.moeDescription.replace(/'/g, "\\'")}'
    }
  },

  variants: {
    foundation_default: 'Basic conceptual understanding and direct computation.',
    standard_default: 'Standard syllabus-aligned application and multi-step reasoning.',
    advanced_default: 'Challenging heuristic and integrated problem-solving.'
  },

  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 4';
    const topic = '${topic.topic.replace(/'/g, "\\'")}';
    const subtopic = '${subtopic.name.replace(/'/g, "\\'")}';
    const safeType = String(type || 'short question').toLowerCase();
    const isMCQ = safeType === 'mcq';
    const isShort = safeType === 'short question';
    const isStructure = !isMCQ && !isShort;

    const zodType = isMCQ ? 'MCQ' : isShort ? 'SHORT_QUESTION' : 'STRUCTURED';
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const getFormatInstructions = (visualEngineStr = '{\\n    "componentToRender": "NONE",\\n    "componentData": { "hideVisual": true }\\n  }', inputRequirementStr = null) => \`CRITICAL INSTRUCTION: You MUST use the EXACT "visualEngine" and "inputRequirement" JSON objects provided in the template below.
OUTPUT FORMAT (Return ONLY valid JSON matching this schema, with NO markdown formatting and NO trailing characters):
{
  "meta": {
    "level": "\${level}",
    "topic": "\${topic}",
    "subtopic": "\${subtopic}",
    "difficulty": "\${zodDiff}",
    "type": "\${zodType}",
    "variant": "\${activeVariant || 'default'}"
  },
  "visualEngine": \${visualEngineStr},
  "inputRequirement": \${inputRequirementStr || \`{ "inputType": "\${isMCQ ? 'MCQ_BUTTONS' : isShort ? 'STANDARD_TEXT' : 'MULTI_STEP_INPUT'}" }\`},
  "content": {
    "questionText": "string (the exact question stem)",
    "options": \${isMCQ ? '["Option A", "Option B", "Option C", "Option D"]' : 'null'},
    "defectMap": \${isMCQ ? '{"wrong_option_1": "CARELESS_CALCULATION"}' : '{}'},
    "finalAnswer": "string (the final correct answer)",
    "solutionSteps": "string (step-by-step logic, separate steps using \\\\\\\\n)",
    "hint": "string (a helpful conceptual clue)"
  }
}\`;

    const diff = String(difficulty || 'foundation').toLowerCase();
    if (diff === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    } else if (diff === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, getFormatInstructions);
    }

    throw new Error(\`Unsupported difficulty '\${difficulty}' for \${subtopic}\`);
  }
};
`;
}

// Generate directory and files for each topic and subtopic
let subtopicCount = 0;
const allExportLines = [];
const allRegistryLines = [];

primary4Data.forEach(t => {
  const topicDir = path.join(p4Root, t.slug);
  if (!fs.existsSync(topicDir)) {
    fs.mkdirSync(topicDir, { recursive: true });
  }

  t.subtopics.forEach(st => {
    // 1. Router file: <topicDir>/<st.slug>.js
    const routerFile = path.join(topicDir, `${st.slug}.js`);
    fs.writeFileSync(routerFile, makeRouterFile(t, st), 'utf8');

    // 2. Subtopic folder: <topicDir>/<st.slug>/
    const subtopicDir = path.join(topicDir, st.slug);
    if (!fs.existsSync(subtopicDir)) {
      fs.mkdirSync(subtopicDir, { recursive: true });
    }

    // 3. Difficulty files: foundation.js, standard.js, advanced.js
    ['foundation', 'standard', 'advanced'].forEach(d => {
      const diffFile = path.join(subtopicDir, `${d}.js`);
      fs.writeFileSync(diffFile, makeDifficultyLogicFile('Primary 4', t.topic, st.name, d), 'utf8');
    });

    allExportLines.push(`export { ${st.varName} } from './${t.slug}/${st.slug}.js';`);
    allRegistryLines.push(`  'Primary 4-${t.topic}-${st.name}': ${st.varName},`);

    subtopicCount++;
  });
});

console.log(`Successfully generated Primary 4 folder structure:`);
console.log(`- ${primary4Data.length} topics`);
console.log(`- ${subtopicCount} subtopics with router + difficulty level folders (foundation/standard/advanced)`);

// Generate src/lib/syllabus/math/primary-4/index.js
const p4IndexFile = path.join(p4Root, 'index.js');
const p4IndexContent = `// Primary 4 Blueprints and Registry Index
${primary4Data.map(t => t.subtopics.map(st => `import { ${st.varName} } from './${t.slug}/${st.slug}.js';`).join('\n')).join('\n')}

${allExportLines.join('\n')}

export const primary4Registry = {
${allRegistryLines.join('\n')}
};
`;
fs.writeFileSync(p4IndexFile, p4IndexContent, 'utf8');
console.log('Generated src/lib/syllabus/math/primary-4/index.js with clean re-exports and registry map.');

// Now generate the updated src/lib/syllabus/data/primary-4.js
const syllabusDataFile = path.resolve(__dirname, '../src/lib/syllabus/data/primary-4.js');
let rawJson = JSON.stringify(primary4Data.map(t => ({
  strand: t.strand,
  topic: t.topic,
  subtopics: t.subtopics.map(st => ({
    name: st.name,
    allowedTypes: [
      "__SHORT_QUESTION__",
      "__MCQ__"
    ],
    blueprint: `Focus on ${st.name.toLowerCase()} in accordance with Singapore MOE syllabus learning outcomes.`,
    visualType: st.visualType,
    vocabulary: st.vocabulary,
    moeDescription: st.moeDescription
  }))
})), null, 2);

rawJson = rawJson
  .replace(/"__SHORT_QUESTION__"/g, "QUESTION_TYPES.SHORT_QUESTION.label")
  .replace(/"__MCQ__"/g, "QUESTION_TYPES.MCQ.label");

const primary4SyllabusExport = `import { QUESTION_TYPES } from '../constants.js';

export const primary4Syllabus = ${rawJson};
`;

fs.writeFileSync(syllabusDataFile, primary4SyllabusExport, 'utf8');
console.log('Updated src/lib/syllabus/data/primary-4.js with full metadata.');

// Wire Primary 4 into src/lib/syllabus/index.js
const mainIndexFile = path.resolve(__dirname, '../src/lib/syllabus/index.js');
let mainIndexContent = fs.readFileSync(mainIndexFile, 'utf8');

if (!mainIndexContent.includes("from './math/primary-4/index.js'")) {
  // Add import near top
  mainIndexContent = `import { primary4Registry } from './math/primary-4/index.js';\n` + mainIndexContent;
  
  // Add into blueprintRegistry before closing '};'
  mainIndexContent = mainIndexContent.replace(/(\n};\n\n\/\*\*[\s\S]*?Global helper)/, `,\n\n  // Primary 4\n  ...primary4Registry$1`);
  
  fs.writeFileSync(mainIndexFile, mainIndexContent, 'utf8');
  console.log('Successfully wired primary4Registry into src/lib/syllabus/index.js');
} else {
  console.log('src/lib/syllabus/index.js already contains primary4Registry import.');
}
