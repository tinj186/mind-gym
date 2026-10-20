const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('src/lib/syllabus.js', 'utf8');
const lines = content.split('\n');

const dataDir = 'src/lib/syllabus/data';
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Write src/lib/syllabus/constants.js
const constantsContent = `export const QUESTION_TYPES = {
  MCQ: "MCQ",
  SHORT: "Short Question",
  STRUCTURED: "Structured"
};

export const DEFAULT_TYPES = Object.values(QUESTION_TYPES);
export const DEFAULT_DIFFICULTIES = ["Foundation", "Standard", "Advanced"];

export const DIFFICULTY_DEFINITIONS = {
  Foundation: {
    label: "Foundation",
    tagline: "Core Mastery & Careless Error Prevention",
    description: "Builds absolute automaticity on standard single-step textbook models. Focuses on preventing careless errors and testing direct recognition.",
    defectFocus: "Distractors match immediate mechanical oversights (e.g., misreading operation, single calculation slips).",
    example: "A baker has 24 buns. He puts 4 buns in each box. How many boxes does he need? (Direct single-operation division)."
  },
  Standard: {
    label: "Standard",
    tagline: "Multi-Step Proficiency & Word Problem Execution",
    description: "Challenges students with standard 2-step to 3-step school exam problems. Requires bridging hidden intermediary quantities and setting up multi-part bar models.",
    defectFocus: "Distractors match intermediary step errors, such as completing Step 1 but failing to complete Step 2.",
    example: "Ali has $15. Bala has twice as much money as Ali. How much money do they have altogether? (Requires finding Bala's amount first, then adding Ali's amount)."
  },
  Advanced: {
    label: "Advanced",
    tagline: "Non-Routine Heuristics & Deep Conceptual Transfer",
    description: "Tests high-order problem solving and non-routine heuristics (Before-and-After, Equal Stages, Grouping/Supposition, and Complex Visual Part-Whole analysis).",
    defectFocus: "Distractors represent deep logical traps. Errors trigger conceptual defect codes like HEURISTIC_MISAPPLICATION, UNEQUAL_SHARING_ERROR, or CONCEPTUAL_MISUNDERSTANDING.",
    example: "A curry puff costs $2. A piece of cake costs $3. Mrs. Tan bought an equal number of curry puffs and cakes. She spent $20 in total. How many items did she buy altogether? (Requires grouping items into a single $5 set before dividing)."
  }
};

export const FOUNDATION_MAPPING = {
  "Primary 5": "Primary 5 (Foundation)",
  "Primary 6": "Primary 6 (Foundation)"
};
`;

fs.writeFileSync('src/lib/syllabus/constants.js', constantsContent);

function addImportToData(filename) {
  const filePath = path.join(dataDir, filename);
  let c = fs.readFileSync(filePath, 'utf8');
  if (!c.includes('QUESTION_TYPES')) {
    c = `import { QUESTION_TYPES } from '../constants.js';\n\n` + c;
    fs.writeFileSync(filePath, c);
  } else if (!c.startsWith('import { QUESTION_TYPES }')) {
    c = `import { QUESTION_TYPES } from '../constants.js';\n\n` + c;
    fs.writeFileSync(filePath, c);
  }
}

['primary-1.js', 'primary-2.js', 'primary-3.js', 'primary-4.js', 'primary-5.js', 'primary-6.js'].forEach(addImportToData);

// Now write clean src/lib/syllabus.js
const newSyllabusContent = `export * from './syllabus/constants.js';

import { DEFAULT_TYPES } from './syllabus/constants.js';
import { primary1Syllabus } from './syllabus/data/primary-1.js';
import { primary2Syllabus } from './syllabus/data/primary-2.js';
import { primary3Syllabus } from './syllabus/data/primary-3.js';
import { primary4Syllabus } from './syllabus/data/primary-4.js';
import { primary5Syllabus } from './syllabus/data/primary-5.js';
import { primary6Syllabus } from './syllabus/data/primary-6.js';

export const SYLLABUS_DATA = {
  "Primary 1": primary1Syllabus,
  "Primary 2": primary2Syllabus,
  "Primary 3": primary3Syllabus,
  "Primary 4": primary4Syllabus,
  "Primary 5": primary5Syllabus,
  "Primary 6": primary6Syllabus
};

export function getSyllabusRows() {
  const rows = [];
  Object.entries(SYLLABUS_DATA).forEach(([level, strands]) => {
    strands.forEach(strandData => {
      strandData.subtopics.forEach(st => {
        const allowedTypes = st.allowedTypes || DEFAULT_TYPES;
        allowedTypes.forEach(type => {
          rows.push({
            level,
            strand: strandData.strand,
            topic: strandData.topic,
            subtopic: st.name,
            blueprint: st.blueprint,
            visualType: st.visualType,
            vocabulary: st.vocabulary,
            type
          });
        });
      });
    });
  });
  return rows;
}

export const GET_DISTINCT = (key, filters = {}) => {
  const { level, strand, topic, subtopic, type } = filters;

  if (key === 'level') {
    return Object.keys(SYLLABUS_DATA);
  }

  if (key === 'strand') {
    if (!level || !SYLLABUS_DATA[level]) return [];
    return Array.from(new Set(SYLLABUS_DATA[level].map(t => t.strand)));
  }

  if (key === 'topic') {
    if (!level || !SYLLABUS_DATA[level]) return [];
    return Array.from(new Set(SYLLABUS_DATA[level].map(t => t.topic)));
  }

  if (key === 'subtopic') {
    if (!level || !topic || !SYLLABUS_DATA[level]) return [];
    const subtopics = new Set();
    SYLLABUS_DATA[level].forEach(t => {
      if (t.topic === topic) {
        t.subtopics.forEach(st => {
          const allowed = st.allowedTypes || DEFAULT_TYPES;
          if (!type || allowed.includes(type)) {
            subtopics.add(st.name);
          }
        });
      }
    });
    return Array.from(subtopics);
  }

  if (key === 'type') {
    const types = new Set();
    getSyllabusRows().forEach(r => {
      if (level && r.level !== level) return;
      if (topic && r.topic !== topic) return;
      if (subtopic && r.subtopic !== subtopic) return;
      types.add(r.type);
    });
    return Array.from(types).sort();
  }

  return [];
};
`;

fs.writeFileSync('src/lib/syllabus.js', newSyllabusContent);
console.log('✅ syllabus.js partitioned cleanly with constants.js!');
