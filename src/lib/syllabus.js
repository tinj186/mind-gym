export const QUESTION_TYPES = {
  SHORT_QUESTION: { label: "Short Question", description: "Pure equations (e.g., 12 + 5 = ?)" },
  STRUCTURED: { label: "Structured", description: "Word problems requiring logic/modeling" },
  MCQ: { label: "MCQ", description: "Multiple choice with 4 options" }
};

export const SYLLABUS_DATA = {
  "Primary 1": [
    {
      topic: "Numbers to 20",
      subtopics: ["Counting", "Number Bonds", "Comparing Numbers"],
      heuristics: ["PART_WHOLE"]
    },
    {
      topic: "Addition & Subtraction",
      subtopics: ["Making Addition Stories", "Ways to Subtract", "Solving Problems"],
      heuristics: ["PART_WHOLE", "COMPARISON"]
    },
    {
      topic: "Shapes & Patterns",
      subtopics: ["Identifying Shapes", "Repeating Patterns"],
      heuristics: ["LOGIC_CANVAS"]
    }
  ]
};

/**
 * Returns a flattened array of Level + Topic + Type combinations.
 */
export const getSyllabusRows = () => {
  const rows = [];
  Object.entries(SYLLABUS_DATA).forEach(([level, topics]) => {
    topics.forEach(t => {
      Object.values(QUESTION_TYPES).forEach(typeInfo => {
        rows.push({
          level,
          topic: t.topic,
          type: typeInfo.label,
          heuristics: t.heuristics,
          subtopics: t.subtopics
        });
      });
    });
  });
  return rows;
};

// Maintaining legacy exports for backward compatibility during refactor
export const FULL_SYLLABUS = getSyllabusRows();
export const DEFAULT_TYPES = Object.values(QUESTION_TYPES).map(t => t.label);
export const DEFAULT_DIFFICULTIES = ["Easy", "Medium", "Hard"];

export const GET_DISTINCT = (key) => {
  if (key === 'level') return Object.keys(SYLLABUS_DATA);
  if (key === 'topic') {
    const topics = new Set();
    Object.values(SYLLABUS_DATA).forEach(levelTopics => {
      levelTopics.forEach(t => topics.add(t.topic));
    });
    return Array.from(topics);
  }
  if (key === 'subtopic') {
    const subtopics = new Set();
    Object.values(SYLLABUS_DATA).forEach(levelTopics => {
      levelTopics.forEach(t => t.subtopics.forEach(st => subtopics.add(st)));
    });
    return Array.from(subtopics);
  }
  return [];
};