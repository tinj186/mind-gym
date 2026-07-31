# Primary 2 vs. Primary 3 Syllabus Comparison

I've screened through both syllabuses to identify areas where we can simply reuse the Primary 2 AI generation logic and variants by increasing the numerical scope.

Overall, **Whole Numbers** and **Addition/Subtraction** are prime candidates for near 100% reuse. Other topics introduce entirely new concepts (like Area, Angles, and 24-Hour Clocks) that will require new logic.

---

## 🟢 HIGH REUSE POTENTIAL (Just scale numbers)

These subtopics are nearly identical in structure. We can reuse the same variants, system prompts, and visual engines by simply updating `maxNumber` bounds and digit constraints.

### 1. Whole Numbers & Place Values
* **Primary 2:** Numbers up to 1000 (Hundreds, Tens, Ones)
* **Primary 3:** Numbers up to 10 000 (Thousands, Hundreds, Tens, Ones)
* **Reusable Subtopics:** 
  - Number Notation (Word to numeral, numeral to word)
  - Number Comparison and Ordering (Sorting, identifying greatest/smallest)
  - Number Patterns (Sequences jumping by 10s, 100s, and now 1000s)
  - Counting & Place Values (Base ten block concepts scaled up)

### 2. Addition & Subtraction Algorithms
* **Primary 2:** Algorithms up to 3 digits
* **Primary 3:** Algorithms up to 4 digits
* **Reusable Subtopics:** 
  - We can reuse all the algorithm templates (with/without regrouping, word problems) simply by increasing the random number generation bounds to `1000-9999`.

### 3. Basic Multiplication/Division (Tables)
* **Primary 2:** Multiplication Tables (2, 3, 4, 5, 10)
* **Primary 3:** Multiplication Tables (6, 7, 8, 9)
* **Reusable Subtopics:** 
  - The variant logic for testing multiplication tables and mental calculation within tables can be reused perfectly by just swapping the allowed factors.

---

## 🟡 MODERATE REUSE POTENTIAL (Partial logic reuse)

These topics share DNA, but require some modifications to the rules or visual components.

### 1. Measurement (Length, Mass, Volume)
* **Primary 2:** Single units (m, g, kg, l), comparisons, abbreviations.
* **Primary 3:** Adds `km` and `ml`. Introduces **Compound Units** (e.g., 2 km 50 m) and compound conversions.
* **How to reuse:** Word problem structures and contexts can be reused, but the AI prompt must be updated to strictly enforce compound unit formatting and conversion rules.

### 2. Statistics (Graphs)
* **Primary 2:** Picture Graphs with Scales
* **Primary 3:** Bar Graphs (Interpretation, Axis Scales)
* **How to reuse:** The JSON output schema (asking for max, min, difference, sum) can be reused. However, the visual engine needs a new renderer for Bar Graphs instead of Picture Graphs.

---

## 🔴 LOW REUSE POTENTIAL (Entirely new scope)

These topics represent significant conceptual leaps and will require brand new variants, schemas, and AI prompts.

### 1. Fractions
* **Primary 2:** Like fraction addition/subtraction, comparing fractions up to denominator 12.
* **Primary 3:** Equivalent fractions, Simplest form, Unlike fraction comparison, Related fractions.
* **Why it's new:** Calculating equivalent fractions and simplifying requires distinct mathematical rules that P2 logic doesn't cover.

### 2. Time
* **Primary 2:** Telling time to the minute, basic conversions.
* **Primary 3:** Duration calculation (Elapsed Time) and the 24-Hour Clock.
* **Why it's new:** Calculating elapsed time requires complex cross-hour logic and new word problem structures (e.g., "A movie started at..."). 

### 3. Advanced Multiplication/Division
* **Primary 3 Only:** Division with Remainder, 3-Digit by 1-Digit Algorithms. 
* **Why it's new:** Division with remainders requires an entirely different JSON validation schema to handle "Quotient" and "Remainder" answers.

### 4. Geometry, Area, and Perimeter
* **Primary 2:** Basic 2D/3D shape identification and patterns.
* **Primary 3:** Area/Perimeter calculation, Angles, Parallel/Perpendicular lines.
* **Why it's new:** This is a massive new scope requiring totally new visual components (grids for area/perimeter, angle graphics) and new geometric logic.

---

## Conclusion & Recommendation

For a fast start on Primary 3, I recommend we begin with **Whole Numbers** and **Addition/Subtraction algorithms**. We can port the Primary 2 files over to Primary 3, simply change `maxNumber = 1000` to `maxNumber = 10000`, adjust the `topic` strings, and instantly have a massive chunk of Primary 3 fully operational. 

Would you like me to go ahead and implement the **Whole Numbers (Numbers up to 10 000)** section using the scaled-up variants from Primary 2?
