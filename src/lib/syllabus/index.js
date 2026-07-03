import { ordinalsBlueprint } from './math/primary-1/whole-numbers/ordinals';
import { countingBlueprint } from './math/primary-1/whole-numbers/counting';
import { placeValuesBlueprint } from './math/primary-1/whole-numbers/place_values';
import { comparingOrderingBlueprint } from './math/primary-1/whole-numbers/comparing_ordering';
import { numberPatternBlueprint } from './math/primary-1/whole-numbers/number_pattern';
import { additionSubtractionBlueprint } from './math/primary-1/whole-numbers/addition_subtraction';
import { multiplicationDivisionBlueprint } from './math/primary-1/whole-numbers/multiplication_division';
import { moneyBlueprint } from './math/primary-1/money/money';
import { lengthBlueprint } from './math/primary-1/measurement/length'; // Import the new length blueprint
import { timeBlueprint } from './math/primary-1/measurement/time'; // Import the new time blueprint
import { pictureGraphsBlueprint } from './math/primary-1/data-representation/picture-graphs'; // Import the new picture graphs blueprint
import { shapesBlueprint } from './math/primary-1/geometry/shapes'; // Import the new shapes blueprint

// Primary 2 Imports
import { numbersTo1000Blueprint } from './math/primary-2/whole-numbers/numbers-to-1000';
import { additionSubtractionBlueprint as p2AddSubBlueprint } from './math/primary-2/whole-numbers/addition-subtraction';
import { multiplicationDivisionBlueprint as p2MultDivBlueprint } from './math/primary-2/whole-numbers/multiplication-division';
import { lengthBlueprint as p2LengthBlueprint } from './math/primary-2/measurement/length';
import { massBlueprint as p2MassBlueprint } from './math/primary-2/measurement/mass';
import { volumeBlueprint as p2VolumeBlueprint } from './math/primary-2/measurement/volume';
import { moneyBlueprint as p2MoneyBlueprint } from './math/primary-2/money/money';
import { fractionsBlueprint as p2FractionsBlueprint } from './math/primary-2/fractions/fractions';
import { timeBlueprint as p2TimeBlueprint } from './math/primary-2/measurement/time';
import { d3dShapesBlueprint } from './math/primary-2/geometry/2d-3d-shapes';
import { pictureGraphsBlueprint as p2PictureGraphsBlueprint } from './math/primary-2/data-representation/picture-graphs';

/**
 * Registry mapping metadata to modular blueprints.
 */
export const blueprintRegistry = {
  'Primary 1-Whole Numbers-Ordinal Numbers': ordinalsBlueprint,
  'Primary 1-Whole Numbers-Counting to 100': countingBlueprint,
  'Primary 1-Whole Numbers-Place Value (Tens/Ones)': placeValuesBlueprint,
  'Primary 1-Whole Numbers-Comparing and Ordering': comparingOrderingBlueprint, // Slug format: "Level-Topic-Subtopic"
  'Primary 1-Whole Numbers-Number Patterns': numberPatternBlueprint,
  'Primary 1-Whole Numbers-Addition and Subtraction': additionSubtractionBlueprint,
  'Primary 1-Whole Numbers-Multiplication and Division': multiplicationDivisionBlueprint,
  'Primary 1-Money-Money': moneyBlueprint,
  'Primary 1-Measurement-Length': lengthBlueprint, // Add the new length blueprint
  'Primary 1-Measurement-Time': timeBlueprint, // Add the new time blueprint
  'Primary 1-Data Representation-Picture Graphs': pictureGraphsBlueprint, // Add the new picture graphs blueprint
  'Primary 1-Geometry-2D Shapes': shapesBlueprint, // Add the new shapes blueprint
  // Slug format: "Level-Topic-Subtopic"

  // Primary 2
  'Primary 2-Numbers to 1000-Counting': numbersTo1000Blueprint,
  'Primary 2-Numbers to 1000-Place values (hundreds, tens, ones)': numbersTo1000Blueprint,
  'Primary 2-Numbers to 1000-Comparing': numbersTo1000Blueprint,
  'Primary 2-Numbers to 1000-Ordering': numbersTo1000Blueprint,
  'Primary 2-Numbers to 1000-Number patterns': numbersTo1000Blueprint,
  
  'Primary 2-Addition & Subtraction-Algorithms within 1000': p2AddSubBlueprint,
  'Primary 2-Addition & Subtraction-Mental calculation': p2AddSubBlueprint,
  'Primary 2-Addition & Subtraction-2-step word problems': p2AddSubBlueprint,
  
  'Primary 2-Multiplication & Division-2, 3, 4, 5, and 10 times tables': p2MultDivBlueprint,
  'Primary 2-Multiplication & Division-Concept of sharing equally and grouping': p2MultDivBlueprint,
  
  'Primary 2-Length-Measuring in meters (m) and centimeters (cm)': p2LengthBlueprint,
  'Primary 2-Length-Estimating': p2LengthBlueprint,
  'Primary 2-Length-Comparing': p2LengthBlueprint,
  'Primary 2-Length-Drawing lines': p2LengthBlueprint,
  
  'Primary 2-Mass-Measuring in kilograms (kg) and grams (g)': p2MassBlueprint,
  'Primary 2-Mass-Reading scales': p2MassBlueprint,
  'Primary 2-Mass-Comparing masses': p2MassBlueprint,
  
  'Primary 2-Volume-Measuring in liters (l)': p2VolumeBlueprint,
  'Primary 2-Volume-Comparing capacities': p2VolumeBlueprint,
  'Primary 2-Volume-Basic word problems': p2VolumeBlueprint,
  
  'Primary 2-Money-Dollars and cents': p2MoneyBlueprint,
  'Primary 2-Money-Converting': p2MoneyBlueprint,
  'Primary 2-Money-Adding/subtracting money': p2MoneyBlueprint,
  'Primary 2-Money-Exact change': p2MoneyBlueprint,
  
  'Primary 2-Fractions-Equal parts': p2FractionsBlueprint,
  'Primary 2-Fractions-Naming fractions': p2FractionsBlueprint,
  'Primary 2-Fractions-Comparing like fractions': p2FractionsBlueprint,
  'Primary 2-Fractions-Adding/subtracting like fractions': p2FractionsBlueprint,
  
  'Primary 2-Time-Reading/writing time to 5 minutes': p2TimeBlueprint,
  'Primary 2-Time-Duration (hours/mins)': p2TimeBlueprint,
  'Primary 2-Time-a.m./p.m.': p2TimeBlueprint,
  
  'Primary 2-2D & 3D Shapes-Properties of straight/curve lines': d3dShapesBlueprint,
  'Primary 2-2D & 3D Shapes-Forming 2D shapes': d3dShapesBlueprint,
  'Primary 2-2D & 3D Shapes-Identifying 3D shapes': d3dShapesBlueprint,
  
  'Primary 2-Picture Graphs-Reading/interpreting graphs with scales': p2PictureGraphsBlueprint,
};

/**
 * Global helper to call a blueprint with standard parameters.
 * Supports both AI-guided (legacy) and local generator (new) blueprints.
 */
export function getGeneratedQuestion(level, topic, subtopic, difficulty, variant, type) {
  const blueprintId = `${level}-${topic}-${subtopic}`;
  const blueprint = blueprintRegistry[blueprintId];
  
  if (blueprint && typeof blueprint.generate === 'function') {
    return blueprint.generate(difficulty?.toLowerCase() || 'foundation', variant, type);
  }
  
  return null;
}