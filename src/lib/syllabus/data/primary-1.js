import { QUESTION_TYPES } from '../constants.js';

export const primary1Syllabus = [
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
];
