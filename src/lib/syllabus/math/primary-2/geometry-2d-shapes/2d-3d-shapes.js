import { foundationLogic } from './2d-3d-shapes/foundation';
import { standardLogic } from './2d-3d-shapes/standard';
import { advancedLogic } from './2d-3d-shapes/advanced';

export const d3dShapesBlueprint = {
  title: 'd3dShapes', // Must match subtopic exactly if dynamic
  variants: {
    // Add variants here later
    // e.g., 'standard_variant_name': 'description'
  },
  generate: function (difficulty, activeVariant, type) {
    const level = 'Primary 2';
    // Dummy topic/subtopic for now, will be overridden dynamically by engine
    const topic = 'Topic'; 
    const isMCQ = type === 'MCQ';
    const isShort = type === 'Short Question';
    const isStructure = type === 'Structured';
    
    // Zod formatting strings
    const zodType = type;
    const zodDiff = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    
    // Helper to switch text based on type
    const getQText = (structureText, shortText) => {
      if (isStructure) return structureText;
      return shortText || structureText;
    };
    
    // Default system instructions segment
    const formatInstructions = "OUTPUT FORMAT (Return ONLY valid JSON matching this schema):";
    
    // Dummy context (will be replaced by Universal Engine localization)
    const context = { name: "Ahmad", setting: "the library" };
    const selectedContextItem = "books";

    if (difficulty === 'foundation') {
      return foundationLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText);
    } else if (difficulty === 'standard') {
      return standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText);
    } else if (difficulty === 'advanced') {
      return advancedLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, formatInstructions, context, selectedContextItem, getQText);
    }
    
    throw new Error(`Unknown difficulty ${difficulty}`);
  }
};
