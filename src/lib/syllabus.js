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

export const DIFFICULTY_DEFINITIONS = {
  Foundation: {
    objective: "Procedural fluency and basic conceptual recall. This maps to the 20% Warm-up block, targeting students with lower mastery or those needing to build early momentum.",
    cognitiveLoad: "Single-step execution. The problem explicitly states the operation required (either directly or through extremely direct keywords like 'total' or 'left').",
    abstraction: "Zero. Problems are highly concrete. If a word problem is used, it strictly follows the LOWER_BLOCK reading mandate (tangible items, simple sentences).",
    protocolMapping: "Almost exclusively utilizes the Short Question (Pure Math) format or a very basic MCQ where distractors are obvious visually or numerically.",
    defectFocus: "Errors here usually trigger basic mechanical defect codes (e.g., ADDITION_FACT_ERROR, PLACE_VALUE_MISALIGNMENT).",
    example: "What is 345+122? or Siti has 4 apples. She buys 3 more. How many apples does she have in total?"
  },
  Standard: {
    objective: "Application of concepts in familiar, routine contexts. This is the baseline expectation of the MOE syllabus and forms the 60% Core Workout.",
    cognitiveLoad: "Routine, multi-step tasks. The student must read a scenario, determine the correct mathematical model (e.g., part-whole, comparison), and execute two or more operations.",
    abstraction: "Moderate. Introduces standard 'Singapore Flavor' word problems utilizing local names and contexts. Students must translate English into math equations.",
    protocolMapping: "Utilizes the 3-Type Protocol. Standard questions frequently deploy the Structured Question format or complex MCQs.",
    defectFocus: "Distractors in MCQs are purposefully engineered to catch common procedural slips. Errors trigger codes like INCOMPLETE_STEP_ERROR (stopping after step 1 of a 2-step problem) or WRONG_OPERATION_CHOSEN.",
    example: "Ali has 150 marbles. He has 45 fewer marbles than Muthu. How many marbles do they have altogether? (Requires finding Muthu's marbles first, then the total)."
  },
  Advanced: {
    objective: "Strategic thinking, logical reasoning, and tackling non-routine tasks. This serves the 20% Challenge block for high-synapse students.",
    cognitiveLoad: "High. Requires the application of problem-solving strategies (Pólya's 4 steps, heuristics). The path to the solution is deliberately obscured. Information may be presented out of order, or require working backwards.",
    abstraction: "High. Relies heavily on visual models (e.g., complex Bar Models) to resolve unequal sharing or proportional relationships.",
    protocolMapping: "Strictly Structured Questions or high-tier MCQs. The defectMap here must be highly sophisticated.",
    defectFocus: "Distractors represent deep logical traps. Errors trigger conceptual defect codes like HEURISTIC_MISAPPLICATION, UNEQUAL_SHARING_ERROR, or CONCEPTUAL_MISUNDERSTANDING.",
    example: "A curry puff costs $2. A piece of cake costs $3. Mrs. Tan bought an equal number of curry puffs and cakes. She spent $20 in total. How many items did she buy altogether? (Requires grouping items into a single $5 set before dividing)."
  }
};


export const FOUNDATION_MAPPING = {
  "Primary 5": "Primary 5 (Foundation)",
  "Primary 6": "Primary 6 (Foundation)"
};

export const SYLLABUS_DATA = {
  "Primary 1": [
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Numbers up to 100",
      "subtopics": [
        {
          "name": "Object Counting",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Focus on counting sets of objects. Output groups in tens and ones. CRITICAL: Randomly vary the required answer format between numeral and word. 50% of the time, ask for numerals (e.g., \"How many [objects] are there?\"). The finalAnswer must be digits (e.g., \"34\"). 50% of the time, ask for words (e.g., \"Count and write the number of [objects] in words.\"). The finalAnswer must be spelled out (e.g., \"thirty-four\"). CRITICAL HINT PROTOCOL: You MUST provide a conceptual \"hint\" field in your JSON. Required: Point to counting strategies (e.g. \"Count the groups of 10 first\") without giving away the answer.",
          "visualType": "COUNTING_OBJECTS",
          "vocabulary": [
            "count",
            "how many",
            "altogether"
          ],
          "advancedIntegration": [
            "Addition and Subtraction"
          ],
          "moeDescription": "counting to tell the number of objects in a given set"
        },
        {
          "name": "Place Values (Tens, Ones)",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Focus on place value and notation. NO addition stories. NEVER say \"base ten blocks\". CRITICAL: Randomly vary between these 3 question types: Type 1 (Total): \"Look at the blocks. What number do they show?\" (Answer: numeral, e.g., \"34\") Type 2 (Digit Value): \"What is the value of the digit [X] in the number shown?\" (Answer: numeral, e.g., \"30\") Type 3 (Decomposition): \"Fill in the blanks: The blocks show ___ tens and ___ ones.\" (Answer MUST be formatted exactly as \"X tens Y ones\", e.g., \"3 tens 4 ones\")",
          "visualType": "BASE_TEN_BLOCKS",
          "vocabulary": [
            "digit",
            "value",
            "place",
            "stand for"
          ],
          "moeDescription": "number notation, representations and place values (tens, ones)"
        },
        {
          "name": "Number Notation",
          "moeDescription": "reading and writing numbers in numerals and in words",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Set Comparison",
          "moeDescription": "comparing the number of objects in two or more sets",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Number Comparison and Ordering",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Focus on comparing and sorting numbers up to 100. Randomly vary between these 3 question types: Type 1 (Comparing): Use NUMBER_CARDS. Generate 2 to 3 numbers. Ask \"Which number is greater/smaller/greatest/smallest?\". Answer is a single numeral. Type 2 (Ordering): Use NUMBER_CARDS. Generate EXACTLY 4 distinct numbers. Ask \"Arrange the numbers in order. Begin with the smallest.\" OR \"Arrange the numbers in order. Begin with the greatest.\". The finalAnswer MUST be the 4 numbers sorted correctly, separated by commas and a space (e.g., \"28, 32, 47, 51\"). Type 3 (Object Groups): Use the COMPARE_OBJECTS visualType. Ask \"Which group has the most/fewest [item]?\" OR \"Arrange the groups in order, beginning with the smallest/greatest.\" The finalAnswer MUST be the correct label (e.g., \"B\") or comma-separated labels (e.g., \"C, A, B\"). NEVER generate True/False questions. Always replace the final answer value in the diagram with a \"?\" string.",
          "visualType": "NUMBER_CARDS",
          "vocabulary": [
            "greater",
            "smaller",
            "greatest",
            "smallest"
          ],
          "advancedIntegration": [
            "Number Patterns"
          ],
          "moeDescription": "comparing and ordering numbers"
        },
        {
          "name": "Number Patterns",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Provide a number sequence of 5 items up to 100. Exactly ONE item must be \"?\". Do NOT write the missing number in the question text. CRITICAL: The sequence rule MUST scale based on the difficulty level: Foundation: Use jumps of +1, -1, +2, or -2. Standard: Use jumps of +5, -5, or simple +3, -3. Advanced: Use complex rules: Crossing Tens (e.g., -4 jumps crossing boundaries), Two-Step Alternating Grow-Shrink patterns (e.g., +5, -2), or Double-Digit steps (+11 or +12). CRITICAL: The \"?\" MUST be in the 2nd or 3rd position (NEVER the last) and numbers must regularly reach between 80 and 100.",
          "visualType": "NUMBER_PATTERN",
          "vocabulary": [
            "pattern",
            "next",
            "missing"
          ],
          "moeDescription": "patterns in number sequences"
        },
        {
          "name": "Ordinal Numbers (Up to 10th)",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Focus on positions. Use a queue of 4 to 8 STRICTLY UNIQUE emojis. CRITICAL: Randomly vary the required answer format. 50% of the time, ask normally. The finalAnswer must be an ordinal numeral (e.g., \"1st\", \"3rd\", \"5th\"). 50% of the time, explicitly ask for words (e.g., \"Write the position of the [Emoji] in words.\"). The finalAnswer must be spelled out (e.g., \"first\", \"third\", \"fifth\"). NEVER use identical items in the queue.",
          "visualType": "ORDINAL_LINE",
          "vocabulary": [
            "position",
            "left",
            "right",
            "first",
            "second",
            "third",
            "fourth",
            "fifth"
          ],
          "advancedIntegration": [
            "Addition and Subtraction"
          ],
          "moeDescription": "ordinal numbers (first, second, up to tenth) and symbols (1st, 2nd, 3rd, etc.)"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Addition and Subtraction",
      "subtopics": [
        {
          "name": "Addition and Subtraction Concepts",
          "moeDescription": "concepts of addition and subtraction",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Operation Symbols (+, -, =)",
          "moeDescription": "use of +, - and =",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Addition/Subtraction Relationship",
          "moeDescription": "relationship between addition and subtraction",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Multi-Digit Addition",
          "moeDescription": "adding more than two 1-digit numbers",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Addition/Subtraction Within 100",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.STRUCTURED.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "CRITICAL: Randomly vary the question format between these 6 types: Type 1 (Word Problem): Use COUNTING_OBJECTS. Write a logical addition/subtraction story. Type 2 (Missing Addend Equation): Use visualType: \"NONE\". Ask a direct math equation where the blank is not the final answer (e.g., \"5 + ___ = 9\" or \"___ - 2 = 6\"). Type 3 (Number Bonds): Use visualType: \"NUMBER_BOND\". Ask \"Study the number bond. What is the missing number?\". Type 4 (More/Less Than): Strictly abstract, no diagram (visualType: \"NONE\"). Ask questions using \"more than\" or \"less than\". For example: \"What is 4 more than 12?\" or \"3 less than 18 is ___.\" The finalAnswer is the calculated numeral. Type 5 (Place Value Addition/Subtraction): Strictly abstract, no diagram (visualType: \"NONE\"). Combine place value with operations. For example: \"2 tens and 4 ones is added to 50. What is the answer?\" or \"Subtract 3 tens from 85.\" The finalAnswer is the calculated numeral. Type 6 (Equation Formation): Abstract, no diagram (visualType: \"NONE\"). Provide a set of 3 numbers from a fact family (e.g., 3, 5, 8). Ask the student to write one addition or subtraction equation using those numbers. Example: \"Use the numbers 5, 4, 9 to form an addition equation.\" The finalAnswer MUST be the full string (e.g., \"5 + 4 = 9\" or \"4 + 5 = 9\"). NEVER generate True/False questions. Always replace the final answer value in the diagram with a \"?\" string.",
          "visualType": "COUNTING_OBJECTS",
          "vocabulary": [
            "plus",
            "minus",
            "equals",
            "more than",
            "less than",
            "added to",
            "subtract",
            "mental calculation",
            "algorithm",
            "renaming"
          ],
          "moeDescription": "adding and subtracting within 100"
        },
        {
          "name": "Addition/Subtraction Algorithms",
          "moeDescription": "adding and subtracting using algorithms",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Mental Calculation (Addition/Subtraction)",
          "moeDescription": "mental calculation involving addition and subtraction within 20, of a 2-digit number and ones without renaming, and of a 2-digit number and tens",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Multiplication and Division",
      "subtopics": [
        {
          "name": "Multiplication/Division Concepts",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.STRUCTURED.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Concepts of mult/div. Use of x. Multiply within 40. Divide within 20.",
          "visualType": "EQUAL_GROUPS",
          "vocabulary": [
            "multiply",
            "divide",
            "equal groups",
            "times"
          ],
          "moeDescription": "concepts of multiplication and division"
        },
        {
          "name": "Multiplication Symbol (x)",
          "moeDescription": "use of x",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Multiplication Within 40",
          "moeDescription": "multiplying within 40",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Division Within 20",
          "moeDescription": "dividing within 20",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Money - Money",
      "subtopics": [
        {
          "name": "Money Counting",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.STRUCTURED.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Counting amount of money in cents up to $1, and dollars up to $100.",
          "visualType": "PART_WHOLE",
          "vocabulary": [
            "cents",
            "dollars",
            "amount"
          ],
          "moeDescription": "counting amount of money in cents up to $1, and in dollars up to $100"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Measurement - Length",
      "subtopics": [
        {
          "name": "Length Measurement (cm)",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.STRUCTURED.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Measure in cm. Use abbreviation cm. Compare/order lengths. Draw line segment to nearest cm.",
          "visualType": "RULER_CM",
          "vocabulary": [
            "centimetre",
            "cm",
            "measure",
            "length",
            "compare"
          ],
          "moeDescription": "measuring length in centimetres"
        },
        {
          "name": "Abbreviation 'cm'",
          "moeDescription": "use of abbreviation cm",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Length Comparison (cm)",
          "moeDescription": "comparing and ordering lengths in cm",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Line Segment Drawing",
          "moeDescription": "measuring and drawing a line segment to the nearest cm",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Measurement - Time",
      "subtopics": [
        {
          "name": "Time to 5 Minutes",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.STRUCTURED.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Tell time to 5 minutes. Use am/pm, h, min. Duration of 1 hour/half hour.",
          "visualType": "CLOCK",
          "vocabulary": [
            "am",
            "pm",
            "hour",
            "minute",
            "duration"
          ],
          "moeDescription": "telling time to 5 minutes"
        },
        {
          "name": "AM/PM Usage",
          "moeDescription": "use of 'am' and 'pm'",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Abbreviations 'h' and 'min'",
          "moeDescription": "use of abbreviations h and min",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Time Duration",
          "moeDescription": "duration of one hour/half hour",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - 2D Shapes",
      "subtopics": [
        {
          "name": "2D Shape Classification",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Identify/name/classify rectangle, square, triangle, circle, half/quarter circle. Form figures. Copy on grid.",
          "visualType": "SHAPE",
          "vocabulary": [
            "rectangle",
            "square",
            "triangle",
            "circle",
            "half circle",
            "quarter circle"
          ],
          "moeDescription": "identifying, naming, describing and classifying 2D shapes (rectangle, square, triangle, circle, half circle, quarter circle)"
        },
        {
          "name": "2D Figure Formation",
          "moeDescription": "forming different 2D figures with rectangle, square, triangle, half circle, quarter circle",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "2D Shape Identification",
          "moeDescription": "identifying the 2D shapes that make up a given figure",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        },
        {
          "name": "Figure Copying (Grids)",
          "moeDescription": "copying figures on dot grid or square grid",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Pending implementation.",
          "visualType": "NONE",
          "vocabulary": []
        }
      ]
    },
    {
      "strand": "Statistics",
      "topic": "Data Representation and Interpretation - Picture Graphs",
      "subtopics": [
        {
          "name": "Picture Graph Interpretation",
          "allowedTypes": [
            QUESTION_TYPES.SHORT_QUESTION.label,
            QUESTION_TYPES.MCQ.label
          ],
          "blueprint": "Read and interpret data from picture graphs.",
          "visualType": "GRAPH",
          "vocabulary": [
            "picture graph",
            "data",
            "interpret"
          ],
          "moeDescription": "reading and interpreting data from picture graphs"
        }
      ]
    }
  ],
  "Primary 2": [
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Numbers up to 1000",
      "subtopics": [
        {
          "name": "Counting by Tens/Hundreds",
          "moeDescription": "counting in tens/hundreds"
        },
        {
          "name": "Place Values (Hundreds)",
          "moeDescription": "number notation, representations and place values (hundreds, tens, ones)"
        },
        {
          "name": "Number Notation",
          "moeDescription": "reading and writing numbers in numerals and in words"
        },
        {
          "name": "Number Comparison and Ordering",
          "moeDescription": "comparing and ordering numbers"
        },
        {
          "name": "Number Patterns",
          "moeDescription": "patterns in number sequences"
        },
        {
          "name": "Odd and Even Numbers",
          "moeDescription": "odd and even numbers"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Addition and Subtraction",
      "subtopics": [
        {
          "name": "Addition/Subtraction Algorithms (3-Digit)",
          "moeDescription": "addition and subtraction algorithms (up to 3 digits)"
        },
        {
          "name": "Mental Calculation (3-Digit)",
          "moeDescription": "mental calculation involving addition and subtraction of a 3-digit number and ones/tens/hundreds"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Multiplication and Division",
      "subtopics": [
        {
          "name": "Multiplication Tables (2-5, 10)",
          "moeDescription": "multiplication tables of 2, 3, 4, 5 and 10"
        },
        {
          "name": "Operation Symbols (x, ÷, =)",
          "moeDescription": "use of x, ÷ and ="
        },
        {
          "name": "Multiplication/Division Relationship",
          "moeDescription": "relationship between multiplication and division"
        },
        {
          "name": "Multiplication/Division (Tables)",
          "moeDescription": "multiplying and dividing within the multiplication tables"
        },
        {
          "name": "Mental Calculation (Multiplication/Division)",
          "moeDescription": "mental calculation involving multiplication and division within multiplication tables of 2, 3, 4, 5 and 10"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Fraction of a Whole",
      "subtopics": [
        {
          "name": "Fraction as Part of a Whole",
          "moeDescription": "fraction as part of a whole"
        },
        {
          "name": "Fraction Notation",
          "moeDescription": "notation and representations of fractions"
        },
        {
          "name": "Fraction Comparison (Up to Denominator 12)",
          "moeDescription": "comparing and ordering fractions with denominators of given fractions not exceeding 12 (unit fractions, like fractions)"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Addition and Subtraction",
      "subtopics": [
        {
          "name": "Like Fraction Addition/Subtraction",
          "moeDescription": "adding and subtracting like fractions within one whole with denominators of given fractions not exceeding 12"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Money - Money",
      "subtopics": [
        {
          "name": "Money Counting (Dollars/Cents)",
          "moeDescription": "counting amount of money in dollars and cents"
        },
        {
          "name": "Money Notation (Decimals)",
          "moeDescription": "reading and writing money in decimal notation"
        },
        {
          "name": "Money Comparison",
          "moeDescription": "comparing two or three amounts of money"
        },
        {
          "name": "Money Conversion (Cents/Decimals)",
          "moeDescription": "converting an amount of money in decimal notation to cents only, and vice versa"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Measurement - Length, Mass and Volume",
      "subtopics": [
        {
          "name": "Measurement (Length, Mass, Volume)",
          "moeDescription": "measuring length in metres, mass in kilograms/grams, and volume of liquid in litres"
        },
        {
          "name": "Measurement Abbreviations",
          "moeDescription": "using appropriate units of measurement and their abbreviations m, g, kg, l"
        },
        {
          "name": "Measurement Comparison",
          "moeDescription": "comparing and ordering lengths, masses, and volumes"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Measurement - Time",
      "subtopics": [
        {
          "name": "Time to the Minute",
          "moeDescription": "telling time to the minute"
        },
        {
          "name": "Time Measurement (Hours/Minutes)",
          "moeDescription": "measuring time in hours and minutes"
        },
        {
          "name": "Time Conversion",
          "moeDescription": "converting time in hours and minutes to minutes only, and vice versa"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - 2D Shapes",
      "subtopics": [
        {
          "name": "2D Shape Patterns",
          "moeDescription": "making/completing patterns with 2D shapes according to one or two of the following attributes: size, shape, colour, orientation"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - 3D Shapes",
      "subtopics": [
        {
          "name": "3D Shape Classification",
          "moeDescription": "identifying, naming, describing and classifying 3D shapes (cube, cuboid, cone, cylinder, sphere)"
        }
      ]
    },
    {
      "strand": "Statistics",
      "topic": "Data Representation and Interpretation - Picture Graphs with Scales",
      "subtopics": [
        {
          "name": "Picture Graph Interpretation (With Scales)",
          "moeDescription": "reading and interpreting data from picture graphs with scales"
        }
      ]
    }
  ],
  "Primary 3": [
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Numbers up to 10 000",
      "subtopics": [
        {
          "name": "Counting by Hundreds/Thousands",
          "moeDescription": "counting in hundreds/thousands"
        },
        {
          "name": "Place Values (Thousands)",
          "moeDescription": "number notation, representations and place values (thousands, hundreds, tens, ones)"
        },
        {
          "name": "Number Notation",
          "moeDescription": "reading and writing numbers in numerals and in words"
        },
        {
          "name": "Number Comparison and Ordering",
          "moeDescription": "comparing and ordering numbers"
        },
        {
          "name": "Number Patterns",
          "moeDescription": "patterns in number sequences"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Addition and Subtraction",
      "subtopics": [
        {
          "name": "Addition/Subtraction Algorithms (4-Digit)",
          "moeDescription": "addition and subtraction algorithms (up to 4 digits)"
        },
        {
          "name": "Mental Calculation (2-Digit Add/Sub)",
          "moeDescription": "mental calculation involving addition and subtraction of two 2-digit numbers"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Multiplication and Division",
      "subtopics": [
        {
          "name": "Multiplication Tables (6-9)",
          "moeDescription": "multiplication tables of 6, 7, 8 and 9"
        },
        {
          "name": "Multiplication/Division (Tables)",
          "moeDescription": "multiplying and dividing within the multiplication tables"
        },
        {
          "name": "Division with Remainder",
          "moeDescription": "division with remainder"
        },
        {
          "name": "Multiplication/Division Algorithms",
          "moeDescription": "multiplication and division algorithms (up to 3 digits by 1 digit)"
        },
        {
          "name": "Mental Calculation (Multiplication Tables)",
          "moeDescription": "mental calculation involving multiplication and division within multiplication tables"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Equivalent fractions",
      "subtopics": [
        {
          "name": "Equivalent Fractions",
          "moeDescription": "equivalent fractions"
        },
        {
          "name": "Fractions in Simplest Form",
          "moeDescription": "expressing a fraction in its simplest form"
        },
        {
          "name": "Unlike Fraction Comparison",
          "moeDescription": "comparing and ordering unlike fractions with denominators of given fractions not exceeding 12"
        },
        {
          "name": "Equivalent Fraction Writing",
          "moeDescription": "writing the equivalent fraction of a fraction given the denominator or the numerator"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Addition and Subtraction",
      "subtopics": [
        {
          "name": "Related Fraction Addition/Subtraction",
          "moeDescription": "adding and subtracting two related fractions within one whole with denominators of given fractions not exceeding 12"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Money - Money",
      "subtopics": [
        {
          "name": "Money Addition/Subtraction (Decimals)",
          "moeDescription": "adding and subtracting money in decimal notation"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Measurement - Length, Mass and Volume",
      "subtopics": [
        {
          "name": "Measurement (km, ml)",
          "moeDescription": "measuring length in kilometres (km), and volume of liquid in millilitres (ml)"
        },
        {
          "name": "Compound Unit Measurement",
          "moeDescription": "measuring length/mass/volume (of liquid) in compound units"
        },
        {
          "name": "Compound Unit Conversion",
          "moeDescription": "converting a measurement in compound units to the smaller unit, and vice versa (kilometres and metres, metres and centimetres, kilograms and grams, litres and millilitres)"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Measurement - Time",
      "subtopics": [
        {
          "name": "Time Measurement (Seconds)",
          "moeDescription": "measuring time in seconds"
        },
        {
          "name": "Time Duration Calculation",
          "moeDescription": "finding the starting time, finishing time or duration given the other two quantities"
        },
        {
          "name": "24-Hour Clock",
          "moeDescription": "24-hour clock"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Area and Perimeter - Area and Perimeter",
      "subtopics": [
        {
          "name": "Area/Perimeter Concepts",
          "moeDescription": "concepts of area and perimeter of a plane figure"
        },
        {
          "name": "Area Measurement (cm², m²)",
          "moeDescription": "measuring area in square units, cm² and m² excluding conversion between cm² and m²"
        },
        {
          "name": "Perimeter Calculation",
          "moeDescription": "perimeter of a rectilinear figure, rectangle, and square"
        },
        {
          "name": "Area Calculation (Rectangle/Square)",
          "moeDescription": "area of rectangle/square"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Angles",
      "subtopics": [
        {
          "name": "Angle Concepts",
          "moeDescription": "concepts of angle"
        },
        {
          "name": "Angle Comparison",
          "moeDescription": "right angles, and angles greater than/smaller than a right angle"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Perpendicular and Parallel Lines",
      "subtopics": [
        {
          "name": "Perpendicular/Parallel Lines",
          "moeDescription": "perpendicular and parallel lines"
        },
        {
          "name": "Line Drawing (Perpendicular/Parallel)",
          "moeDescription": "drawing perpendicular and parallel lines"
        }
      ]
    },
    {
      "strand": "Statistics",
      "topic": "Data Representation and Interpretation - Bar Graphs",
      "subtopics": [
        {
          "name": "Bar Graph Interpretation",
          "moeDescription": "reading and interpreting data from bar graphs"
        },
        {
          "name": "Graph Axis Scales",
          "moeDescription": "using different scales on axis"
        }
      ]
    }
  ],
  "Primary 4": [
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Numbers up to 100 000",
      "subtopics": [
        {
          "name": "Place Values (Ten Thousands)",
          "moeDescription": "number notation, representations and place values (ten thousands, thousands, hundreds, tens, ones)"
        },
        {
          "name": "Number Notation",
          "moeDescription": "reading and writing numbers in numerals and in words"
        },
        {
          "name": "Number Comparison and Ordering",
          "moeDescription": "comparing and ordering numbers"
        },
        {
          "name": "Number Patterns",
          "moeDescription": "patterns in number sequences"
        },
        {
          "name": "Number Rounding",
          "moeDescription": "rounding numbers to the nearest 10, 100 or 1000"
        },
        {
          "name": "Approximation Symbol (≈)",
          "moeDescription": "use of ≈"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Factors and Multiples",
      "subtopics": [
        {
          "name": "Factors and Multiples",
          "moeDescription": "factors, multiples and their relationship"
        },
        {
          "name": "Factor Determination",
          "moeDescription": "determining if a 1-digit number is a factor of a given number within 100"
        },
        {
          "name": "Common Factors",
          "moeDescription": "finding the common factors of two given numbers"
        },
        {
          "name": "Multiple Determination",
          "moeDescription": "determining if a number is a multiple of a given 1-digit number"
        },
        {
          "name": "Common Multiples",
          "moeDescription": "finding the common multiples of two given 1-digit numbers"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Four Operations",
      "subtopics": [
        {
          "name": "Multiplication Algorithms (Advanced)",
          "moeDescription": "multiplication algorithm (up to 4 digits by 1 digit, and up to 3 digits by 2 digits)"
        },
        {
          "name": "Division Algorithms (Advanced)",
          "moeDescription": "division algorithm (up to 4 digits by 1 digit)"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Mixed Numbers and Improper Fractions",
      "subtopics": [
        {
          "name": "Mixed Numbers/Improper Fractions",
          "moeDescription": "mixed numbers, improper fractions and their relationship"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Fraction of a Set",
      "subtopics": [
        {
          "name": "Fraction of a Set",
          "moeDescription": "fraction as part of a set"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Addition and Subtraction",
      "subtopics": [
        {
          "name": "Fraction Addition/Subtraction (Different Denominators)",
          "moeDescription": "adding and subtracting fractions with denominators of given fractions not exceeding 12 and not more than two different denominators"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Decimals - Decimals up to 3 decimal places",
      "subtopics": [
        {
          "name": "Decimal Place Values",
          "moeDescription": "notation, representations and place values (tenths, hundredths, thousandths)"
        },
        {
          "name": "Decimal Comparison/Ordering",
          "moeDescription": "comparing and ordering decimals"
        },
        {
          "name": "Decimals to Fractions",
          "moeDescription": "expressing decimals as fractions"
        },
        {
          "name": "Fractions to Decimals",
          "moeDescription": "expressing fractions as decimals when the denominator is a factor of 10 or 100"
        },
        {
          "name": "Decimal Rounding",
          "moeDescription": "rounding decimals to the nearest whole number, 1 decimal place, or 2 decimal places"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Decimals - Addition and Subtraction",
      "subtopics": [
        {
          "name": "Decimal Addition/Subtraction",
          "moeDescription": "adding and subtracting decimals (up to 2 decimal places)"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Decimals - Multiplication and Division",
      "subtopics": [
        {
          "name": "Decimal Multiplication/Division",
          "moeDescription": "multiplying and dividing decimals (up to 2 decimal places) by a 1-digit whole number"
        },
        {
          "name": "Whole Number Division (Decimal Quotient)",
          "moeDescription": "dividing a whole number by a whole number with quotient as a decimal"
        },
        {
          "name": "Answer Rounding",
          "moeDescription": "rounding answers to a specified degree of accuracy"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Area and Volume - Area and Perimeter",
      "subtopics": [
        {
          "name": "Rectangle Dimension Calculation",
          "moeDescription": "finding one dimension of a rectangle given the other dimension and its area/perimeter"
        },
        {
          "name": "Square Dimension Calculation",
          "moeDescription": "finding the length of one side of a square given its area/perimeter"
        },
        {
          "name": "Composite Figure Area/Perimeter",
          "moeDescription": "finding the area and perimeter of composite figures made up of rectangles and squares"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Angles",
      "subtopics": [
        {
          "name": "Angle Notation",
          "moeDescription": "using notation such as ∠ABC and ∠a to name angles"
        },
        {
          "name": "Angle Measurement (Degrees)",
          "moeDescription": "measuring angles in degrees"
        },
        {
          "name": "Angle Drawing",
          "moeDescription": "drawing an angle of given size"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Rectangle and Square",
      "subtopics": [
        {
          "name": "Rectangle/Square Properties",
          "moeDescription": "properties of rectangle and square, excluding diagonal properties"
        },
        {
          "name": "Rectangle/Square Drawing",
          "moeDescription": "drawing rectangles and squares"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Line Symmetry",
      "subtopics": [
        {
          "name": "Symmetric Figure Identification",
          "moeDescription": "identifying symmetric figures"
        },
        {
          "name": "Line of Symmetry Determination",
          "moeDescription": "determining whether a straight line is a line of symmetry of a symmetric figure"
        },
        {
          "name": "Symmetric Figure Completion",
          "moeDescription": "completing a symmetric figure with respect to a given line of symmetry on square grid"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Nets",
      "subtopics": [
        {
          "name": "3D Solid Identification (2D Reps)",
          "moeDescription": "identifying 2D representations of a cube, cuboid, cone, cylinder, prism, and pyramid"
        },
        {
          "name": "3D Solid Drawing",
          "moeDescription": "drawing 2D representations of a cube, cuboid, prism, and pyramid"
        },
        {
          "name": "3D Solid Nets",
          "moeDescription": "identifying the nets of 3D solids (cube, cuboid, prism, pyramid)"
        },
        {
          "name": "Solid Identification from Net",
          "moeDescription": "identifying the solid which can be formed by a given net"
        }
      ]
    },
    {
      "strand": "Statistics",
      "topic": "Data Representation and Interpretation - Tables, Line Graphs and Pie Charts",
      "subtopics": [
        {
          "name": "Table Completion",
          "moeDescription": "completing a table from given data"
        },
        {
          "name": "Data Interpretation (Tables/Graphs)",
          "moeDescription": "reading and interpreting data from tables/line graphs/pie charts"
        }
      ]
    }
  ],
  "Primary 5": [
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Numbers up to 10 million",
      "subtopics": [
        {
          "name": "Number Notation",
          "moeDescription": "reading and writing numbers in numerals and in words"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Whole Numbers - Four Operations",
      "subtopics": [
        {
          "name": "Multiplication/Division (Powers of 10)",
          "moeDescription": "multiplying and dividing by 10, 100, 1000 and their multiples without calculator"
        },
        {
          "name": "Order of Operations",
          "moeDescription": "order of operations without calculator"
        },
        {
          "name": "Bracket Usage",
          "moeDescription": "use of brackets without calculator"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Fraction and Division",
      "subtopics": [
        {
          "name": "Whole Number Division (Fraction Quotient)",
          "moeDescription": "dividing a whole number by a whole number with quotient as a fraction"
        },
        {
          "name": "Fractions to Decimals",
          "moeDescription": "expressing fractions as decimals"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Four Operations",
      "subtopics": [
        {
          "name": "Mixed Number Addition/Subtraction",
          "moeDescription": "adding and subtracting mixed numbers"
        },
        {
          "name": "Fraction/Whole Number Multiplication",
          "moeDescription": "multiplying a proper/improper fraction and a whole number without calculator"
        },
        {
          "name": "Fraction Multiplication",
          "moeDescription": "multiplying a proper fraction and a proper/improper fraction without calculator"
        },
        {
          "name": "Improper Fraction Multiplication",
          "moeDescription": "multiplying two improper fractions"
        },
        {
          "name": "Mixed/Whole Number Multiplication",
          "moeDescription": "multiplying a mixed number and a whole number"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Decimals - Four Operations",
      "subtopics": [
        {
          "name": "Decimal Multiplication/Division (Powers of 10)",
          "moeDescription": "multiplying and dividing decimals (up to 3 decimal places) by 10, 100, 1000 and their multiples without calculator"
        },
        {
          "name": "Decimal Unit Conversion",
          "moeDescription": "converting a measurement from a smaller unit to a larger unit in decimal form, and vice versa (kilometres and metres, metres and centimetres, kilograms and grams, litres and millilitres)"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Percentage - Percentage",
      "subtopics": [
        {
          "name": "Percentage Expression",
          "moeDescription": "expressing a part of a whole as a percentage"
        },
        {
          "name": "Percentage Symbol (%)",
          "moeDescription": "use of %"
        },
        {
          "name": "Percentage of a Whole",
          "moeDescription": "finding a percentage part of a whole"
        },
        {
          "name": "Discount, GST, Interest",
          "moeDescription": "finding discount, GST and annual interest"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Rate - Rate",
      "subtopics": [
        {
          "name": "Rate Concepts",
          "moeDescription": "rate as the amount of a quantity per unit of another quantity"
        },
        {
          "name": "Rate Calculation",
          "moeDescription": "finding rate, total amount or number of units given the other two quantities"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Area and Volume - Area of Triangle",
      "subtopics": [
        {
          "name": "Triangle Base/Height",
          "moeDescription": "concepts of base and height of a triangle"
        },
        {
          "name": "Triangle Area",
          "moeDescription": "area of triangle"
        },
        {
          "name": "Composite Figure Area (Triangles)",
          "moeDescription": "finding the area of composite figures made up of rectangles, squares and triangles"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Area and Volume - Volume of Cube and Cuboid",
      "subtopics": [
        {
          "name": "Solid Building (Cubes)",
          "moeDescription": "building solids with unit cubes"
        },
        {
          "name": "Volume Measurement (cm³/m³)",
          "moeDescription": "measuring volume in cubic units, cm³/m³, excluding conversion between cm³ and m³"
        },
        {
          "name": "Cube/Cuboid Drawing (Isometric)",
          "moeDescription": "drawing cubes and cuboids on isometric grid"
        },
        {
          "name": "Cube/Cuboid Volume",
          "moeDescription": "volume of a cube/cuboid"
        },
        {
          "name": "Liquid Volume Calculation",
          "moeDescription": "finding the volume of liquid in a rectangular tank"
        },
        {
          "name": "Volume Capacity Relationship",
          "moeDescription": "relationship between l (or ml) with cm³"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Angles",
      "subtopics": [
        {
          "name": "Straight Line Angles",
          "moeDescription": "angles on a straight line"
        },
        {
          "name": "Point Angles",
          "moeDescription": "angles at a point"
        },
        {
          "name": "Vertically Opposite Angles",
          "moeDescription": "vertically opposite angles"
        },
        {
          "name": "Unknown Angle Calculation",
          "moeDescription": "finding unknown angles"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Triangle",
      "subtopics": [
        {
          "name": "Special Triangle Properties",
          "moeDescription": "properties of an isosceles triangle, equilateral triangle, and right-angled triangle"
        },
        {
          "name": "Triangle Angle Sum",
          "moeDescription": "angle sum of a triangle"
        },
        {
          "name": "Unknown Angle Calculation (No Construction)",
          "moeDescription": "finding unknown angles without additional construction of lines"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Parallelogram, Rhombus and Trapezium",
      "subtopics": [
        {
          "name": "Quadrilateral Properties",
          "moeDescription": "properties of a parallelogram, rhombus, and trapezium"
        },
        {
          "name": "Unknown Angle Calculation (No Construction)",
          "moeDescription": "finding unknown angles without additional construction of lines"
        }
      ]
    }
  ],
  "Primary 6": [
    {
      "strand": "Number and Algebra",
      "topic": "Fractions - Four Operations",
      "subtopics": [
        {
          "name": "Fraction/Whole Number Division",
          "moeDescription": "dividing a proper fraction by a whole number without calculator"
        },
        {
          "name": "Fraction Division",
          "moeDescription": "dividing a whole number/proper fraction by a proper fraction without calculator"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Percentage - Percentage",
      "subtopics": [
        {
          "name": "Finding Whole from Percentage",
          "moeDescription": "finding the whole given a part and the percentage"
        },
        {
          "name": "Percentage Increase/Decrease",
          "moeDescription": "finding percentage increase/decrease"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Ratio - Ratio",
      "subtopics": [
        {
          "name": "Ratio Notation",
          "moeDescription": "notation, representations and interpretation of a:b and a:b:c, where a, b and c are whole numbers, excluding ratios involving fractions and decimals"
        },
        {
          "name": "Equivalent Ratios",
          "moeDescription": "equivalent ratios"
        },
        {
          "name": "Ratio Division",
          "moeDescription": "dividing a quantity in a given ratio"
        },
        {
          "name": "Ratio Simplification",
          "moeDescription": "expressing a ratio in its simplest form"
        },
        {
          "name": "Ratio Calculation",
          "moeDescription": "finding the ratio of two or three given quantities"
        },
        {
          "name": "Missing Term in Equivalent Ratios",
          "moeDescription": "finding the missing term in a pair of equivalent ratios"
        },
        {
          "name": "Fraction/Ratio Relationship",
          "moeDescription": "relationship between fraction and ratio"
        }
      ]
    },
    {
      "strand": "Number and Algebra",
      "topic": "Algebra - Algebra",
      "subtopics": [
        {
          "name": "Algebraic Unknowns",
          "moeDescription": "using a letter to represent an unknown number"
        },
        {
          "name": "Algebraic Expressions Notation",
          "moeDescription": "notation, representations and interpretation of simple algebraic expressions such as a±3, a×3 or 3a, a/3 or a÷3"
        },
        {
          "name": "Linear Expression Simplification",
          "moeDescription": "simplifying simple linear expressions excluding brackets"
        },
        {
          "name": "Linear Expression Evaluation",
          "moeDescription": "evaluating simple linear expressions by substitution"
        },
        {
          "name": "Simple Linear Equations",
          "moeDescription": "simple linear equations involving whole number coefficient only"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Area and Volume - Area and Circumference of Circle",
      "subtopics": [
        {
          "name": "Circle Area/Circumference",
          "moeDescription": "area and circumference of circle"
        },
        {
          "name": "Semicircle/Quarter Circle Area/Perimeter",
          "moeDescription": "finding the area and perimeter of a semicircle and quarter circle"
        },
        {
          "name": "Composite Figure Area/Perimeter (Circles)",
          "moeDescription": "finding the area and perimeter of composite figures made up of square, rectangle, triangle, semicircle and quarter circle"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Area and Volume - Volume of Cube and Cuboid",
      "subtopics": [
        {
          "name": "Cuboid Dimension Calculation",
          "moeDescription": "finding one dimension of a cuboid given its volume and the other dimensions"
        },
        {
          "name": "Cube Edge Calculation",
          "moeDescription": "finding the length of one edge of a cube given its volume"
        },
        {
          "name": "Cuboid Height Calculation",
          "moeDescription": "finding the height of a cuboid given its volume and base area"
        },
        {
          "name": "Cuboid Face Area Calculation",
          "moeDescription": "finding the area of a face of a cuboid given its volume and one dimension"
        },
        {
          "name": "Pi (π) Usage",
          "moeDescription": "use of π"
        }
      ]
    },
    {
      "strand": "Measurement and Geometry",
      "topic": "Geometry - Special Quadrilaterals",
      "subtopics": [
        {
          "name": "Composite Figure Unknown Angles",
          "moeDescription": "finding unknown angles, without additional construction of lines, in composite geometric figures involving a square, rectangle, triangle, parallelogram, rhombus, and trapezium"
        }
      ]
    },
    {
      "strand": "Statistics",
      "topic": "Data Analysis - Average of a Set of Data",
      "subtopics": [
        {
          "name": "Average Concept",
          "moeDescription": "average as 'total value ÷ number of data'"
        },
        {
          "name": "Average Relationships",
          "moeDescription": "relationship between average, total value and number of data"
        }
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