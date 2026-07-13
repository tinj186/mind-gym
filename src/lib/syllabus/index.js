import { ordinalsBlueprint } from './math/primary-1/whole-numbers-numbers-up-to-100/ordinals';
import { countingBlueprint } from './math/primary-1/whole-numbers-numbers-up-to-100/counting';
import { placeValuesBlueprint } from './math/primary-1/whole-numbers-numbers-up-to-100/place_values';
import { comparingOrderingBlueprint } from './math/primary-1/whole-numbers-numbers-up-to-100/comparing_ordering';
import { numberPatternBlueprint } from './math/primary-1/whole-numbers-numbers-up-to-100/number_pattern';
import { additionSubtractionBlueprint } from './math/primary-1/whole-numbers-addition-and-subtraction/addition_subtraction';
import { multiplicationDivisionBlueprint } from './math/primary-1/whole-numbers-multiplication-and-division/multiplication_division';
import { moneyBlueprint } from './math/primary-1/money-money/money';
import { lengthBlueprint } from './math/primary-1/measurement-length/length';
import { timeBlueprint } from './math/primary-1/measurement-time/time';
import { pictureGraphsBlueprint } from './math/primary-1/data-representation-and-interpretation-picture-graphs/picture-graphs';
import { shapesBlueprint } from './math/primary-1/geometry-2d-shapes/shapes';

import { numberNotationBlueprint } from './math/primary-1/whole-numbers-numbers-up-to-100/number-notation';
import { setComparisonBlueprint } from './math/primary-1/whole-numbers-numbers-up-to-100/set-comparison';
import { additionAndSubtractionConceptsBlueprint } from './math/primary-1/whole-numbers-addition-and-subtraction/addition-and-subtraction-concepts';
import { operationSymbolsBlueprint } from './math/primary-1/whole-numbers-addition-and-subtraction/operation-symbols';
import { additionSubtractionRelationshipBlueprint } from './math/primary-1/whole-numbers-addition-and-subtraction/addition-subtraction-relationship';
import { multiDigitAdditionBlueprint } from './math/primary-1/whole-numbers-addition-and-subtraction/multi-digit-addition';
import { additionSubtractionAlgorithmsBlueprint } from './math/primary-1/whole-numbers-addition-and-subtraction/addition-subtraction-algorithms';
import { mentalCalculationAdditionSubtractionBlueprint } from './math/primary-1/whole-numbers-addition-and-subtraction/mental-calculation-addition-subtraction';
import { multiplicationSymbolXBlueprint } from './math/primary-1/whole-numbers-multiplication-and-division/multiplication-symbol-x';
import { multiplicationWithin40Blueprint } from './math/primary-1/whole-numbers-multiplication-and-division/multiplication-within-40';
import { divisionWithin20Blueprint } from './math/primary-1/whole-numbers-multiplication-and-division/division-within-20';
import { abbreviationCmBlueprint } from './math/primary-1/measurement-length/abbreviation-cm';
import { lengthComparisonCmBlueprint } from './math/primary-1/measurement-length/length-comparison-cm';
import { lineSegmentDrawingBlueprint } from './math/primary-1/measurement-length/line-segment-drawing';
import { amPmUsageBlueprint } from './math/primary-1/measurement-time/am-pm-usage';
import { abbreviationsHAndMinBlueprint } from './math/primary-1/measurement-time/abbreviations-h-and-min';
import { timeDurationBlueprint } from './math/primary-1/measurement-time/time-duration';
import { _2dFigureFormationBlueprint } from './math/primary-1/geometry-2d-shapes/2d-figure-formation';
import { _2dShapeIdentificationBlueprint } from './math/primary-1/geometry-2d-shapes/2d-shape-identification';
import { figureCopyingGridsBlueprint } from './math/primary-1/geometry-2d-shapes/figure-copying-grids';

// Primary 2 Imports
import { countingByTensHundredsBlueprint } from './math/primary-2/whole-numbers-numbers-up-to-1000/counting-by-tens-hundreds';
import { placeValuesHundredsBlueprint } from './math/primary-2/whole-numbers-numbers-up-to-1000/place-values-hundreds';
import { numberNotationBlueprint as p2NumberNotationBlueprint } from './math/primary-2/whole-numbers-numbers-up-to-1000/number-notation';
import { numberComparisonAndOrderingBlueprint } from './math/primary-2/whole-numbers-numbers-up-to-1000/number-comparison-and-ordering';
import { numberPatternsBlueprint as p2NumberPatternsBlueprint } from './math/primary-2/whole-numbers-numbers-up-to-1000/number-patterns';
import { oddAndEvenNumbersBlueprint } from './math/primary-2/whole-numbers-numbers-up-to-1000/odd-and-even-numbers';
import { additionSubtractionBlueprint as p2AddSubBlueprint } from './math/primary-2/whole-numbers-addition-and-subtraction/addition-subtraction';
import { mentalCalculationBlueprint as p2MentalCalcBlueprint } from './math/primary-2/whole-numbers-addition-and-subtraction/mental-calculation';
import { multiplicationDivisionBlueprint as p2MultDivBlueprint } from './math/primary-2/whole-numbers-multiplication-and-division/multiplication-division';
import { multiplicationDivisionRelationshipBlueprint as p2MultDivRelationshipBlueprint } from './math/primary-2/whole-numbers-multiplication-and-division/multiplication-division-relationship';
import { multiplicationTablesBlueprint as p2MultTablesBlueprint } from './math/primary-2/whole-numbers-multiplication-and-division/multiplication-tables';
import { operationSymbolsBlueprint as p2OperationSymbolsBlueprint } from './math/primary-2/whole-numbers-multiplication-and-division/operation-symbols';
import { lengthBlueprint as p2LengthBlueprint } from './math/primary-2/measurement-length-mass-and-volume/length';
import { massBlueprint as p2MassBlueprint } from './math/primary-2/measurement-length-mass-and-volume/mass';
import { volumeBlueprint as p2VolumeBlueprint } from './math/primary-2/measurement-length-mass-and-volume/volume';
import { timeBlueprint as p2TimeBlueprint } from './math/primary-2/measurement-time/time';
import { moneyBlueprint as p2MoneyBlueprint } from './math/primary-2/money-money/money';
import { fractionsBlueprint as p2FractionsBlueprint } from './math/primary-2/fractions-fraction-of-a-whole/fractions';
import { d3dShapesBlueprint } from './math/primary-2/geometry-2d-shapes/2d-3d-shapes';
import { pictureGraphsBlueprint as p2PictureGraphsBlueprint } from './math/primary-2/data-representation-and-interpretation-picture-graphs-with-scales/picture-graphs';

/**
 * Registry mapping metadata to modular blueprints.
 */
export const blueprintRegistry = {
  // Primary 1
  'Primary 1-Whole Numbers - Numbers up to 100-Number Notation': numberNotationBlueprint,
  'Primary 1-Whole Numbers - Numbers up to 100-Set Comparison': setComparisonBlueprint,
  'Primary 1-Whole Numbers - Addition and Subtraction-Addition and Subtraction Concepts': additionAndSubtractionConceptsBlueprint,
  'Primary 1-Whole Numbers - Addition and Subtraction-Operation Symbols (+, -, =)': operationSymbolsBlueprint,
  'Primary 1-Whole Numbers - Addition and Subtraction-Addition/Subtraction Relationship': additionSubtractionRelationshipBlueprint,
  'Primary 1-Whole Numbers - Addition and Subtraction-Multi-Digit Addition': multiDigitAdditionBlueprint,
  'Primary 1-Whole Numbers - Addition and Subtraction-Addition/Subtraction Algorithms': additionSubtractionAlgorithmsBlueprint,
  'Primary 1-Whole Numbers - Addition and Subtraction-Mental Calculation (Addition/Subtraction)': mentalCalculationAdditionSubtractionBlueprint,
  'Primary 1-Whole Numbers - Multiplication and Division-Multiplication Symbol (x)': multiplicationSymbolXBlueprint,
  'Primary 1-Whole Numbers - Multiplication and Division-Multiplication Within 40': multiplicationWithin40Blueprint,
  'Primary 1-Whole Numbers - Multiplication and Division-Division Within 20': divisionWithin20Blueprint,
  "Primary 1-Measurement - Length-Abbreviation 'cm'": abbreviationCmBlueprint,
  'Primary 1-Measurement - Length-Length Comparison (cm)': lengthComparisonCmBlueprint,
  'Primary 1-Measurement - Length-Line Segment Drawing': lineSegmentDrawingBlueprint,
  "Primary 1-Measurement - Time-AM/PM Usage": amPmUsageBlueprint,
  "Primary 1-Measurement - Time-Abbreviations 'h' and 'min'": abbreviationsHAndMinBlueprint,
  'Primary 1-Measurement - Time-Time Duration': timeDurationBlueprint,
  'Primary 1-Geometry - 2D Shapes-2D Figure Formation': _2dFigureFormationBlueprint,
  'Primary 1-Geometry - 2D Shapes-2D Shape Identification': _2dShapeIdentificationBlueprint,
  'Primary 1-Geometry - 2D Shapes-Figure Copying (Grids)': figureCopyingGridsBlueprint,
  'Primary 1-Whole Numbers - Numbers up to 100-Ordinal Numbers (Up to 10th)': ordinalsBlueprint,
  'Primary 1-Whole Numbers - Numbers up to 100-Object Counting': countingBlueprint,
  'Primary 1-Whole Numbers - Numbers up to 100-Place Values (Tens, Ones)': placeValuesBlueprint,
  'Primary 1-Whole Numbers - Numbers up to 100-Number Comparison and Ordering': comparingOrderingBlueprint,
  'Primary 1-Whole Numbers - Numbers up to 100-Number Patterns': numberPatternBlueprint,
  'Primary 1-Whole Numbers - Addition and Subtraction-Addition/Subtraction Within 100': additionSubtractionBlueprint,
  'Primary 1-Whole Numbers - Multiplication and Division-Multiplication/Division Concepts': multiplicationDivisionBlueprint,
  'Primary 1-Money - Money-Money Counting': moneyBlueprint,
  'Primary 1-Measurement - Length-Length Measurement (cm)': lengthBlueprint,
  'Primary 1-Measurement - Time-Time to 5 Minutes': timeBlueprint,
  'Primary 1-Data Representation and Interpretation - Picture Graphs-Picture Graph Interpretation': pictureGraphsBlueprint,
  'Primary 1-Geometry - 2D Shapes-2D Shape Classification': shapesBlueprint,

  // Primary 2
  'Primary 2-Whole Numbers - Numbers up to 1000-Counting by Tens/Hundreds': countingByTensHundredsBlueprint,
  'Primary 2-Whole Numbers - Numbers up to 1000-Place Values (Hundreds)': placeValuesHundredsBlueprint,
  'Primary 2-Whole Numbers - Numbers up to 1000-Number Notation': p2NumberNotationBlueprint,
  'Primary 2-Whole Numbers - Numbers up to 1000-Number Comparison and Ordering': numberComparisonAndOrderingBlueprint,
  'Primary 2-Whole Numbers - Numbers up to 1000-Number Patterns': p2NumberPatternsBlueprint,
  'Primary 2-Whole Numbers - Numbers up to 1000-Odd and Even Numbers': oddAndEvenNumbersBlueprint,
  
  'Primary 2-Whole Numbers - Addition and Subtraction-Addition/Subtraction Algorithms (3-Digit)': p2AddSubBlueprint,
  'Primary 2-Whole Numbers - Addition and Subtraction-Mental Calculation (3-Digit)': p2MentalCalcBlueprint,
  
  'Primary 2-Whole Numbers - Multiplication and Division-Multiplication Tables (2-5, 10)': p2MultTablesBlueprint,
  'Primary 2-Whole Numbers - Multiplication and Division-Operation Symbols (x, ÷, =)': p2OperationSymbolsBlueprint,
  'Primary 2-Whole Numbers - Multiplication and Division-Multiplication/Division Relationship': p2MultDivRelationshipBlueprint,
  'Primary 2-Whole Numbers - Multiplication and Division-Multiplication/Division (Tables)': p2MultDivBlueprint,
  'Primary 2-Whole Numbers - Multiplication and Division-Mental Calculation (Multiplication/Division)': p2MultDivBlueprint,
  
  'Primary 2-Measurement - Length, Mass and Volume-Measurement (Length, Mass, Volume)': p2LengthBlueprint,
  'Primary 2-Measurement - Length, Mass and Volume-Measurement Abbreviations': p2MassBlueprint,
  'Primary 2-Measurement - Length, Mass and Volume-Measurement Comparison': p2VolumeBlueprint,
  
  'Primary 2-Money - Money-Money Counting (Dollars/Cents)': p2MoneyBlueprint,
  'Primary 2-Money - Money-Money Notation (Decimals)': p2MoneyBlueprint,
  'Primary 2-Money - Money-Money Comparison': p2MoneyBlueprint,
  'Primary 2-Money - Money-Money Conversion (Cents/Decimals)': p2MoneyBlueprint,
  
  'Primary 2-Fractions - Fraction of a Whole-Fraction as Part of a Whole': p2FractionsBlueprint,
  'Primary 2-Fractions - Fraction of a Whole-Fraction Notation': p2FractionsBlueprint,
  'Primary 2-Fractions - Fraction of a Whole-Fraction Comparison (Up to Denominator 12)': p2FractionsBlueprint,
  
  'Primary 2-Fractions - Addition and Subtraction-Like Fraction Addition/Subtraction': p2FractionsBlueprint,
  
  'Primary 2-Measurement - Time-Time to the Minute': p2TimeBlueprint,
  'Primary 2-Measurement - Time-Time Measurement (Hours/Minutes)': p2TimeBlueprint,
  'Primary 2-Measurement - Time-Time Conversion': p2TimeBlueprint,
  
  'Primary 2-Geometry - 2D Shapes-2D Shape Patterns': d3dShapesBlueprint,
  'Primary 2-Geometry - 3D Shapes-3D Shape Classification': d3dShapesBlueprint,
  
  'Primary 2-Data Representation and Interpretation - Picture Graphs with Scales-Picture Graph Interpretation (With Scales)': p2PictureGraphsBlueprint,
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
