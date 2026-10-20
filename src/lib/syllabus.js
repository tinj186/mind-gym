export * from './syllabus/constants.js';

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
