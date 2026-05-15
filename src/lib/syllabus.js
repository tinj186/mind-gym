/**
 * SOURCE: MOE 2021 Primary Mathematics Syllabus (Updated Oct 2025)
 * This file acts as the single source of truth for the curriculum grid
 * and AI generation constraints.
 */

export const QUESTION_TYPES = {
  SHORT_QUESTION: {
    label: "Short Question",
    description: "Pure equations/notation (e.g., 12 + 5 = ?)"
  },
  STRUCTURED: {
    label: "Structured",
    description: "Word problems for Bar Modeling"
  },
  MCQ: {
    label: "MCQ",
    description: "Multiple choice with 4 options"
  }
};

/**
 * Single source of truth for type labels
 */
export const DEFAULT_TYPES = Object.values(QUESTION_TYPES).map(t => t.label);
export const DEFAULT_DIFFICULTIES = ["Foundation", "Standard", "Advanced"];

export const FOUNDATION_MAPPING = {
  "Primary 5": "Primary 5 (Foundation)",
  "Primary 6": "Primary 6 (Foundation)"
};

export const SYLLABUS_DATA = {
  "Primary 1": [
    {
      strand: "Number and Algebra",
      topic: "Whole Numbers",
      subtopics: [
        { name: "Counting to 100", allowedTypes: [QUESTION_TYPES.SHORT_QUESTION.label, QUESTION_TYPES.MCQ.label], blueprint: "Focus on counting sets of objects. Output groups in tens and ones. CRITICAL: Randomly vary the required answer format between numeral and word. 50% of the time, ask for numerals (e.g., \"How many [objects] are there?\"). The finalAnswer must be digits (e.g., \"34\"). 50% of the time, ask for words (e.g., \"Count and write the number of [objects] in words.\"). The finalAnswer must be spelled out (e.g., \"thirty-four\"). CRITICAL HINT PROTOCOL: You MUST provide a conceptual \"hint\" field in your JSON. Required: Point to counting strategies (e.g. \"Count the groups of 10 first\") without giving away the answer.", visualType: "COUNTING_OBJECTS", vocabulary: ["count", "how many", "altogether"], advancedIntegration: ['Addition and Subtraction'] },
        { name: "Ordinal Numbers", allowedTypes: [QUESTION_TYPES.SHORT_QUESTION.label, QUESTION_TYPES.MCQ.label], blueprint: "Focus on positions. Use a queue of 4 to 8 STRICTLY UNIQUE emojis. CRITICAL: Randomly vary the required answer format. 50% of the time, ask normally. The finalAnswer must be an ordinal numeral (e.g., \"1st\", \"3rd\", \"5th\"). 50% of the time, explicitly ask for words (e.g., \"Write the position of the [Emoji] in words.\"). The finalAnswer must be spelled out (e.g., \"first\", \"third\", \"fifth\"). NEVER use identical items in the queue.", visualType: "ORDINAL_LINE", vocabulary: ["position", "left", "right", "first", "second", "third", "fourth", "fifth"], advancedIntegration: ['Addition and Subtraction'] },
        { name: "Place Value (Tens/Ones)", allowedTypes: [QUESTION_TYPES.SHORT_QUESTION.label, QUESTION_TYPES.MCQ.label], blueprint: 'Focus on place value and notation. NO addition stories. NEVER say "base ten blocks". CRITICAL: Randomly vary between these 3 question types: Type 1 (Total): "Look at the blocks. What number do they show?" (Answer: numeral, e.g., "34") Type 2 (Digit Value): "What is the value of the digit [X] in the number shown?" (Answer: numeral, e.g., "30") Type 3 (Decomposition): "Fill in the blanks: The blocks show ___ tens and ___ ones." (Answer MUST be formatted exactly as "X tens Y ones", e.g., "3 tens 4 ones")', visualType: "BASE_TEN_BLOCKS", vocabulary: ["digit", "value", "place", "stand for"] },
        { name: "Comparing and Ordering", allowedTypes: [QUESTION_TYPES.SHORT_QUESTION.label, QUESTION_TYPES.MCQ.label], blueprint: 'Focus on comparing and sorting numbers up to 100. Randomly vary between these 3 question types: Type 1 (Comparing): Use NUMBER_CARDS. Generate 2 to 3 numbers. Ask "Which number is greater/smaller/greatest/smallest?". Answer is a single numeral. Type 2 (Ordering): Use NUMBER_CARDS. Generate EXACTLY 4 distinct numbers. Ask "Arrange the numbers in order. Begin with the smallest." OR "Arrange the numbers in order. Begin with the greatest.". The finalAnswer MUST be the 4 numbers sorted correctly, separated by commas and a space (e.g., "28, 32, 47, 51"). Type 3 (Object Groups): Use the COMPARE_OBJECTS visualType. Ask "Which group has the most/fewest [item]?" OR "Arrange the groups in order, beginning with the smallest/greatest." The finalAnswer MUST be the correct label (e.g., "B") or comma-separated labels (e.g., "C, A, B"). NEVER generate True/False questions. Always replace the final answer value in the diagram with a "?" string.', visualType: "NUMBER_CARDS", vocabulary: ["greater", "smaller", "greatest", "smallest"], advancedIntegration: ['Number Patterns'] },
        { name: "Number Patterns", allowedTypes: [QUESTION_TYPES.SHORT_QUESTION.label, QUESTION_TYPES.MCQ.label], blueprint: 'Provide a number sequence of 5 items up to 100. Exactly ONE item must be "?". Do NOT write the missing number in the question text. CRITICAL: The sequence rule MUST scale based on the difficulty level: Foundation: Use jumps of +1, -1, +2, or -2. Standard: Use jumps of +5, -5, or simple +3, -3. Advanced: Use complex rules: Crossing Tens (e.g., -4 jumps crossing boundaries), Two-Step Alternating Grow-Shrink patterns (e.g., +5, -2), or Double-Digit steps (+11 or +12). CRITICAL: The "?" MUST be in the 2nd or 3rd position (NEVER the last) and numbers must regularly reach between 80 and 100.', visualType: "NUMBER_PATTERN", vocabulary: ["pattern", "next", "missing"] },
        { name: "Addition and Subtraction", allowedTypes: [QUESTION_TYPES.SHORT_QUESTION.label, QUESTION_TYPES.STRUCTURED.label, QUESTION_TYPES.MCQ.label], blueprint: 'CRITICAL: Randomly vary the question format between these 6 types: Type 1 (Word Problem): Use COUNTING_OBJECTS. Write a logical addition/subtraction story. Type 2 (Missing Addend Equation): Use visualType: "NONE". Ask a direct math equation where the blank is not the final answer (e.g., "5 + ___ = 9" or "___ - 2 = 6"). Type 3 (Number Bonds): Use visualType: "NUMBER_BOND". Ask "Study the number bond. What is the missing number?". Type 4 (More/Less Than): Strictly abstract, no diagram (visualType: "NONE"). Ask questions using "more than" or "less than". For example: "What is 4 more than 12?" or "3 less than 18 is ___." The finalAnswer is the calculated numeral. Type 5 (Place Value Addition/Subtraction): Strictly abstract, no diagram (visualType: "NONE"). Combine place value with operations. For example: "2 tens and 4 ones is added to 50. What is the answer?" or "Subtract 3 tens from 85." The finalAnswer is the calculated numeral. Type 6 (Equation Formation): Abstract, no diagram (visualType: "NONE"). Provide a set of 3 numbers from a fact family (e.g., 3, 5, 8). Ask the student to write one addition or subtraction equation using those numbers. Example: "Use the numbers 5, 4, 9 to form an addition equation." The finalAnswer MUST be the full string (e.g., "5 + 4 = 9" or "4 + 5 = 9"). NEVER generate True/False questions. Always replace the final answer value in the diagram with a "?" string.', visualType: "COUNTING_OBJECTS", vocabulary: ["plus", "minus", "equals", "more than", "less than", "added to", "subtract", "mental calculation", "algorithm", "renaming"] },
        { name: "Multiplication and Division", allowedTypes: [QUESTION_TYPES.SHORT_QUESTION.label, QUESTION_TYPES.STRUCTURED.label, QUESTION_TYPES.MCQ.label], blueprint: "Concepts of mult/div. Use of x. Multiply within 40. Divide within 20.", visualType: "EQUAL_GROUPS", vocabulary: ["multiply", "divide", "equal groups", "times"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Money",
      subtopics: [
        { name: "Money", blueprint: "Counting amount of money in cents up to $1, and dollars up to $100.", visualType: "PART_WHOLE", vocabulary: ["cents", "dollars", "amount"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Measurement",
      subtopics: [
        { name: "Length", blueprint: "Measure in cm. Use abbreviation cm. Compare/order lengths. Draw line segment to nearest cm.", visualType: "RULER_CM", vocabulary: ["centimetre", "cm", "measure", "length", "compare"] },
        { name: "Time", blueprint: "Tell time to 5 minutes. Use am/pm, h, min. Duration of 1 hour/half hour.", visualType: "CLOCK", vocabulary: ["am", "pm", "hour", "minute", "duration"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Geometry",
      subtopics: [
        { name: "2D Shapes", blueprint: "Identify/name/classify rectangle, square, triangle, circle, half/quarter circle. Form figures. Copy on grid.", visualType: "SHAPE", vocabulary: ["rectangle", "square", "triangle", "circle", "half circle", "quarter circle"] }
      ]
    },
    {
      strand: "Statistics",
      topic: "Data Representation",
      subtopics: [
        { name: "Picture Graphs", blueprint: "Read and interpret data from picture graphs.", visualType: "GRAPH", vocabulary: ["picture graph", "data", "interpret"] }
      ]
    }
  ],
  "Primary 2": [
    {
      strand: "Number and Algebra",
      topic: "Whole Numbers",
      subtopics: [
        { name: "Numbers up to 1000", blueprint: "Count in tens/hundreds. Notation (hundreds, tens, ones). Compare/order, patterns, odd/even numbers.", visualType: "PLACE_VALUE_CHART", vocabulary: ["hundreds", "odd", "even", "pattern"] },
        { name: "Addition and Subtraction", blueprint: "Algorithms up to 3 digits. Mental calc of 3-digit and ones/tens/hundreds. NEVER generate True/False questions. Always replace the final answer value in the diagram with a \"?\" string.", visualType: "PART_WHOLE", vocabulary: ["algorithm", "mental calculation", "hundreds"] },
        { name: "Multiplication and Division", blueprint: "Tables 2, 3, 4, 5, 10. Use of ÷. Relationship between mult/div. Mental calc within these tables.", visualType: "PART_WHOLE", vocabulary: ["divide", "multiplication tables", "relationship"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Fractions",
      subtopics: [
        { name: "Fraction of a Whole", blueprint: "Part of a whole. Notation. Compare/order unit/like fractions (denominators <= 12).", visualType: "FRACTION_BAR", vocabulary: ["fraction", "numerator", "denominator", "unit fraction", "like fraction"] },
        { name: "Addition and Subtraction", blueprint: "Add/sub like fractions within one whole (denominators <= 12).", visualType: "FRACTION_BAR", vocabulary: ["add", "subtract", "like fractions", "whole"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Money",
      subtopics: [
        { name: "Money", blueprint: "Dollars and cents. Decimal notation. Compare 2-3 amounts. Convert decimal to cents and vice versa.", visualType: "COMPARISON", vocabulary: ["decimal notation", "convert", "cents", "dollars"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Measurement",
      subtopics: [
        { name: "Length, Mass and Volume", blueprint: "Measure in m, kg/g, litres. Use m, g, kg, l. Compare/order lengths, masses, volumes.", visualType: "WEIGHING_SCALE", vocabulary: ["metre", "kilogram", "gram", "litre", "mass", "volume"] },
        { name: "Time", blueprint: "Tell time to the minute. Measure in hours/mins. Convert hours/mins to mins and vice versa.", visualType: "CLOCK", vocabulary: ["convert", "minute", "hour"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Geometry",
      subtopics: [
        { name: "2D Shapes", blueprint: "Make/complete patterns with 2D shapes by size, shape, colour, orientation.", visualType: "SHAPE", vocabulary: ["pattern", "orientation", "attribute"] },
        { name: "3D Shapes", blueprint: "Identify/name/describe cube, cuboid, cone, cylinder, sphere.", visualType: "SHAPE", vocabulary: ["cube", "cuboid", "cone", "cylinder", "sphere", "3D shape"] }
      ]
    },
    {
      strand: "Statistics",
      topic: "Data Representation",
      subtopics: [
        { name: "Picture Graphs with Scales", blueprint: "Read and interpret data from picture graphs with scales.", visualType: "GRAPH", vocabulary: ["scale", "picture graph", "interpret"] }
      ]
    }
  ],
  "Primary 3": [
    {
      strand: "Number and Algebra",
      topic: "Whole Numbers",
      subtopics: [
        { name: "Numbers up to 10 000", blueprint: "Count hundreds/thousands. Notation (thousands, hundreds, tens, ones). Compare/order, patterns.", visualType: "PLACE_VALUE_CHART", vocabulary: ["thousands", "notation", "pattern"] },
        { name: "Addition and Subtraction", blueprint: "Algorithms up to 4 digits. Mental calc of two 2-digit numbers. NEVER generate True/False questions. Always replace the final answer value in the diagram with a \"?\" string.", visualType: "PART_WHOLE", vocabulary: ["algorithm", "mental calculation"] },
        { name: "Multiplication and Division", blueprint: "Tables 6, 7, 8, 9. Div with remainder. Algorithms (3-digit by 1-digit). Mental calc within tables.", visualType: "PART_WHOLE", vocabulary: ["remainder", "algorithm", "multiplication tables"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Fractions",
      subtopics: [
        { name: "Equivalent fractions", blueprint: "Simplest form. Compare/order unlike fractions (denominators <= 12). Write equivalent fractions.", visualType: "FRACTION_BAR", vocabulary: ["equivalent", "simplest form", "unlike fractions"] },
        { name: "Addition and Subtraction", blueprint: "Add/sub two related fractions within one whole (denominators <= 12).", visualType: "FRACTION_BAR", vocabulary: ["related fractions", "add", "subtract"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Money",
      subtopics: [
        { name: "Money", blueprint: "Add and subtract money in decimal notation.", visualType: "EQUATION", vocabulary: ["decimal notation", "subtract", "add"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Measurement",
      subtopics: [
        { name: "Length, Mass and Volume", blueprint: "Measure km, ml. Compound units. Convert compound to smaller unit (km/m, m/cm, kg/g, l/ml).", visualType: "COMPARISON", vocabulary: ["kilometre", "millilitre", "compound unit", "convert"] },
        { name: "Time", blueprint: "Seconds. Find start, finish, or duration. 24-hour clock.", visualType: "CLOCK", vocabulary: ["seconds", "duration", "24-hour clock", "starting time"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Area and Volume",
      subtopics: [
        { name: "Area and Perimeter", blueprint: "Concepts of area/perimeter. Measure in cm2, m2. Perimeter of rectilinear/rect/square. Area of rect/square.", visualType: "GRID_RENDERER", vocabulary: ["area", "perimeter", "square units", "cm2", "m2", "rectilinear"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Geometry",
      subtopics: [
        { name: "Angles", blueprint: "Concepts of angle. Right angles, greater/smaller than right angle.", visualType: "SHAPE", vocabulary: ["angle", "right angle"] },
        { name: "Perpendicular and Parallel Lines", blueprint: "Identify and draw perpendicular and parallel lines.", visualType: "SHAPE", vocabulary: ["perpendicular", "parallel", "draw"] }
      ]
    },
    {
      strand: "Statistics",
      topic: "Data Representation",
      subtopics: [
        { name: "Bar Graphs", blueprint: "Read and interpret data from bar graphs using different scales on axis.", visualType: "GRAPH", vocabulary: ["bar graph", "scale", "axis"] }
      ]
    }
  ],
  "Primary 4": [
    {
      strand: "Number and Algebra",
      topic: "Whole Numbers",
      subtopics: [
        { name: "Numbers up to 100 000", blueprint: "Notation to ten thousands. Compare/order. Patterns. Round to nearest 10, 100, 1000. Use of ≈.", visualType: "PLACE_VALUE_CHART", vocabulary: ["ten thousands", "rounding", "approximate"] },
        { name: "Factors and Multiples", blueprint: "Factors, multiples. 1-digit factor within 100. Common factors. Common multiples of two 1-digit numbers.", visualType: "EQUATION", vocabulary: ["factor", "multiple", "common factor", "common multiple"] },
        { name: "Four Operations", blueprint: "Mult algorithm (up to 4x1 digit, 3x2 digits). Div algorithm (up to 4x1 digit).", visualType: "EQUATION", vocabulary: ["algorithm", "multiply", "divide"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Fractions",
      subtopics: [
        { name: "Mixed Numbers & Improper Fractions", blueprint: "Relationship between mixed numbers and improper fractions. Fraction as part of a set.", visualType: "FRACTION_BAR", vocabulary: ["mixed number", "improper fraction", "set"] },
        { name: "Addition and Subtraction", blueprint: "Add/sub fractions (denominators <= 12, max two different denominators). NEVER generate True/False questions. Always replace the final answer value in the diagram with a \"?\" string.", visualType: "FRACTION_BAR", vocabulary: ["denominators", "add", "subtract"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Decimals",
      subtopics: [
        { name: "Decimals up to 3 decimal places", blueprint: "Tenths, hundredths, thousandths. Compare/order. Convert decimal/fraction. Rounding to nearest whole, 1dp, 2dp.", visualType: "PLACE_VALUE_CHART", vocabulary: ["tenths", "hundredths", "thousandths", "rounding", "decimal place"] },
        { name: "Addition and Subtraction", blueprint: "Add/sub decimals up to 2 decimal places. NEVER generate True/False questions. Always replace the final answer value in the diagram with a \"?\" string.", visualType: "EQUATION", vocabulary: ["decimals", "add", "subtract"] },
        { name: "Multiplication and Division", blueprint: "Mult/div decimals (up to 2dp) by 1-digit whole. Whole/whole div with decimal quotient. Round answers.", visualType: "EQUATION", vocabulary: ["quotient", "multiply", "divide", "degree of accuracy"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Area and Volume",
      subtopics: [
        { name: "Area and Perimeter", blueprint: "Find 1 dimension of rect/square given area/perimeter. Area/perimeter of composite rect/square figures.", visualType: "SHAPE", vocabulary: ["dimension", "composite figure", "area", "perimeter"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Geometry",
      subtopics: [
        { name: "Angles", blueprint: "Notation ∠ABC. Measure in degrees. Draw angle of given size.", visualType: "SHAPE", vocabulary: ["degrees", "notation", "measure", "draw"] },
        { name: "Rectangle and Square", blueprint: "Properties excluding diagonals. Drawing rectangles and squares.", visualType: "SHAPE", vocabulary: ["properties", "rectangle", "square"] },
        { name: "Line Symmetry", blueprint: "Identify symmetric figures, line of symmetry. Complete symmetric figure on square grid.", visualType: "SHAPE", vocabulary: ["symmetry", "symmetric", "line of symmetry"] },
        { name: "Nets", blueprint: "Identify/draw 2D reps of cube, cuboid, cone, cylinder, prism, pyramid. Identify nets and solids.", visualType: "SHAPE", vocabulary: ["net", "prism", "pyramid", "solid", "2D representation"] }
      ]
    },
    {
      strand: "Statistics",
      topic: "Data Representation",
      subtopics: [
        { name: "Tables, Line Graphs and Pie Charts", blueprint: "Complete tables. Read/interpret data from tables, line graphs, pie charts.", visualType: "GRAPH", vocabulary: ["line graph", "pie chart", "table", "interpret"] }
      ]
    }
  ],
  "Primary 5 (Standard)": [
    {
      strand: "Number and Algebra",
      topic: "Whole Numbers",
      subtopics: [
        { name: "Numbers up to 10 million", blueprint: "Reading and writing to 10 million. Mult/div by 10, 100, 1000 without calc. Order of operations, brackets.", visualType: "EQUATION", vocabulary: ["million", "order of operations", "brackets", "multiples"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Fractions",
      subtopics: [
        { name: "Fraction and Division", blueprint: "Divide whole by whole with fraction quotient. Express fractions as decimals.", visualType: "FRACTION_BAR", vocabulary: ["quotient", "convert", "decimal"] },
        { name: "Four Operations", blueprint: "Add/sub mixed numbers. Mult proper/improper/mixed by whole. Mult proper by proper/improper. Mult two improper.", visualType: "EQUATION", vocabulary: ["multiply", "mixed number", "proper fraction", "improper fraction"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Decimals",
      subtopics: [
        { name: "Four Operations", blueprint: "Mult/div decimals (up to 3dp) by 10, 100, 1000. Convert smaller to larger units in decimal form.", visualType: "EQUATION", vocabulary: ["decimal form", "convert unit", "multiply", "divide"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Percentage & Rate",
      subtopics: [
        { name: "Percentage", blueprint: "Express part as %. Use of %. Find % part. Discount, GST, annual interest.", visualType: "PERCENTAGE_BAR", vocabulary: ["percentage", "discount", "GST", "annual interest"] },
        { name: "Rate", blueprint: "Amount per unit. Find rate, total amount, or number of units.", visualType: "COMPARISON", vocabulary: ["rate", "unit", "quantity"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Area and Volume",
      subtopics: [
        { name: "Area of Triangle", blueprint: "Base and height. Area of triangle. Composite figures (rect, square, tri).", visualType: "SHAPE", vocabulary: ["base", "height", "area of triangle", "composite figure"] },
        { name: "Volume of Cube and Cuboid", blueprint: "Unit cubes. cm3/m3. Draw on isometric grid. Volume formula. Liquid in rectangular tank. Relation between l/ml and cm3.", visualType: "SHAPE", vocabulary: ["volume", "cubic units", "cm3", "m3", "isometric grid", "rectangular tank"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Geometry",
      subtopics: [
        { name: "Angles & Triangles", blueprint: "Straight line, at a point, vertically opposite. Isosceles, equilateral, right-angled. Angle sum. Unknown angles.", visualType: "SHAPE", vocabulary: ["vertically opposite", "isosceles", "equilateral", "angle sum"] },
        { name: "Parallelogram, Rhombus and Trapezium", blueprint: "Properties of parallelogram, rhombus, trapezium. Finding unknown angles.", visualType: "SHAPE", vocabulary: ["parallelogram", "rhombus", "trapezium", "properties"] }
      ]
    }
  ],
  "Primary 5 (Foundation)": [
    {
      strand: "Number and Algebra",
      topic: "Whole Numbers",
      subtopics: [
        { name: "Numbers up to 10 million", blueprint: "Read/write. Compare/order up to 100k. Round 10/100/1000. Patterns. Use ≈.", visualType: "PLACE_VALUE_CHART", vocabulary: ["million", "round", "approximate"] },
        { name: "Four Operations", blueprint: "Add/sub algorithms (3 digits). Mult/div (2x1 digit). By 10/100/1000. Order of ops, brackets. Mental calc.", visualType: "EQUATION", vocabulary: ["algorithm", "order of operations", "brackets"] },
        { name: "Factors and Multiples", blueprint: "Factors/multiples relationship. Common factors. Common multiples (1-digit numbers).", visualType: "EQUATION", vocabulary: ["factor", "multiple", "common"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Fractions",
      subtopics: [
        { name: "Concepts & Equivalent", blueprint: "Part of whole/set. Equivalent, simplest form. Compare unlike (denominators <= 12).", visualType: "FRACTION_BAR", vocabulary: ["part of set", "simplest form", "unlike fractions"] },
        { name: "Mixed Numbers & Operations", blueprint: "Mixed/improper relationships. Add/sub fractions/mixed (denominators <= 12). Mult fraction by whole/fraction.", visualType: "EQUATION", vocabulary: ["mixed number", "improper fraction", "multiply"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Decimals & Rate",
      subtopics: [
        { name: "Decimals up to 3 places", blueprint: "Notation, compare. Decimal/fraction conversions. Rounding to whole, 1dp, 2dp.", visualType: "PLACE_VALUE_CHART", vocabulary: ["tenths", "hundredths", "thousandths", "rounding"] },
        { name: "Four operations & Rate", blueprint: "Add/sub (2dp). Mult/div by 10/100/1000. Convert units in decimal. Basic rate finding.", visualType: "EQUATION", vocabulary: ["rate", "convert", "decimal form"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Measurement, Area, Volume",
      subtopics: [
        { name: "Time", blueprint: "Measure hours/mins. Convert. Start/finish/duration. 24-hour clock.", visualType: "CLOCK", vocabulary: ["duration", "24-hour clock"] },
        { name: "Area, Perimeter, Volume", blueprint: "Area/perimeter of rect/square. Find 1 dimension. Volume of cube/cuboid (cm3/m3, isometric grid).", visualType: "SHAPE", vocabulary: ["area", "perimeter", "volume", "isometric grid"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Geometry",
      subtopics: [
        { name: "Lines, Angles, Shapes", blueprint: "Perpendicular/parallel. Notation, measure, draw angles. Straight line, point, vertically opp. Rect/square properties.", visualType: "SHAPE", vocabulary: ["perpendicular", "parallel", "vertically opposite", "properties"] }
      ]
    },
    {
      strand: "Statistics",
      topic: "Data Representation",
      subtopics: [
        { name: "Tables, Bar Graphs and Line Graphs", blueprint: "Read/interpret data. Complete table from data.", visualType: "GRAPH", vocabulary: ["bar graph", "line graph", "interpret"] }
      ]
    }
  ],
  "Primary 6 (Standard)": [
    {
      strand: "Number and Algebra",
      topic: "Fractions, Percentage, Ratio",
      subtopics: [
        { name: "Fractions", blueprint: "Divide proper fraction by whole. Divide whole/proper by proper fraction.", visualType: "FRACTION_BAR", vocabulary: ["divide", "proper fraction"] },
        { name: "Percentage", blueprint: "Find whole given part and %. Find percentage increase/decrease.", visualType: "PERCENTAGE_BAR", vocabulary: ["increase", "decrease", "percentage"] },
        { name: "Ratio", blueprint: "a:b and a:b:c. Equivalent ratios. Divide quantity in ratio. Simplest form, missing term. Fraction/ratio relationship.", visualType: "RATIO_UNITS", vocabulary: ["ratio", "equivalent", "simplest form", "missing term"] }
      ]
    },
    {
      strand: "Number and Algebra",
      topic: "Algebra",
      subtopics: [
        { name: "Algebra", blueprint: "Letter for unknown. Notation (a+3, 3a, a/3). Simplify linear expressions. Evaluate. Simple linear equations.", visualType: "EQUATION", vocabulary: ["algebra", "unknown", "expression", "evaluate", "equation"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Area and Volume",
      subtopics: [
        { name: "Area and Circumference of Circle", blueprint: "Area/circumference. Semicircle, quarter circle. Composite figures (square, rect, tri, circles).", visualType: "SHAPE", vocabulary: ["circumference", "semicircle", "quarter circle", "pi"] },
        { name: "Volume of Cube and Cuboid", blueprint: "Find unknown dimension given volume. Find edge given volume (cube root). Base area, face area.", visualType: "SHAPE", vocabulary: ["dimension", "base area", "face area", "cube root"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Geometry",
      subtopics: [
        { name: "Special Quadrilaterals", blueprint: "Find unknown angles in composite geometric figures (square, rect, tri, parallelogram, rhombus, trapezium).", visualType: "SHAPE", vocabulary: ["composite geometric figures", "unknown angles", "quadrilateral"] }
      ]
    },
    {
      strand: "Statistics",
      topic: "Data Analysis",
      subtopics: [
        { name: "Average of a Set of Data", blueprint: "Average as total value / number of data. Relationship between average, total, and number.", visualType: "COMPARISON", vocabulary: ["average", "total value", "number of data"] }
      ]
    }
  ],
  "Primary 6 (Foundation)": [
    {
      strand: "Number and Algebra",
      topic: "Fractions, Decimals, Percentage",
      subtopics: [
        { name: "Fractions", blueprint: "Whole/whole = fraction. Fraction as decimal. Divide proper by whole. Divide whole/proper by proper.", visualType: "FRACTION_BAR", vocabulary: ["divide", "fraction", "decimal"] },
        { name: "Decimals", blueprint: "Multiply/divide. Divide whole by whole with decimal quotient. Round answers.", visualType: "EQUATION", vocabulary: ["decimal quotient", "round", "degree of accuracy"] },
        { name: "Percentage", blueprint: "Express part as %. Find % part. Discount, GST, annual interest.", visualType: "PERCENTAGE_BAR", vocabulary: ["discount", "GST", "interest", "percent"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Area and Volume",
      subtopics: [
        { name: "Area of Triangle", blueprint: "Base and height. Area of triangle. Area/perimeter of composite (square, rect, tri).", visualType: "SHAPE", vocabulary: ["base", "height", "composite figure"] },
        { name: "Volume of cube and cuboid", blueprint: "Volume. Liquid in rectangular tank (relation between l/ml and cm3).", visualType: "SHAPE", vocabulary: ["rectangular tank", "capacity", "volume"] }
      ]
    },
    {
      strand: "Measurement and Geometry",
      topic: "Geometry",
      subtopics: [
        { name: "Rectangle, square and triangle", blueprint: "Isosceles, equilateral, right-angled. Angle sum. Unknown angles in composite figures.", visualType: "SHAPE", vocabulary: ["isosceles", "equilateral", "right-angled", "angle sum"] }
      ]
    },
    {
      strand: "Statistics",
      topic: "Data Analysis",
      subtopics: [
        { name: "Pie Charts & Average", blueprint: "Read pie charts. Average as total value / number of data.", visualType: "GRAPH", vocabulary: ["pie chart", "average", "total value"] }
      ]
    }
  ]
};

/**
 * Flattens the syllabus into rows for the Admin Dashboard table.
 */
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
  const { level, topic, strand, type, subtopic } = filters;

  if (key === 'level') return Object.keys(SYLLABUS_DATA);

  if (key === 'strand') {
    if (!level || !SYLLABUS_DATA[level]) return [];
    const strands = new Set();
    SYLLABUS_DATA[level].forEach(s => strands.add(s.strand));
    return Array.from(strands);
  }

  if (key === 'topic') {
    if (!level || !SYLLABUS_DATA[level]) return [];
    const topics = new Set();
    SYLLABUS_DATA[level].forEach(t => {
      if (strand && t.strand !== strand) return;
      
      // Filter topics: Only show if at least one subtopic supports the selected type
      const hasAllowedType = t.subtopics.some(st => {
        const allowed = st.allowedTypes || DEFAULT_TYPES;
        return !type || allowed.includes(type);
      });

      if (hasAllowedType) topics.add(t.topic);
    });
    return Array.from(topics);
  }

  if (key === 'subtopic') {
    if (!level || !topic || !SYLLABUS_DATA[level]) return [];
    const subtopics = new Set();
    SYLLABUS_DATA[level].forEach(t => {
      if (t.topic === topic) {
        t.subtopics.forEach(st => {
          const allowed = st.allowedTypes || DEFAULT_TYPES;
          // Only show subtopics that support the currently selected Type
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