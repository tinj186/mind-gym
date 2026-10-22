function numberToWords(num) {
  if (num === 0) return 'zero';
  if (num === 100000) return 'one hundred thousand';

  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  function convertTwoDigits(n) {
    if (n < 20) return ones[n];
    const t = Math.floor(n / 10);
    const o = n % 10;
    return o > 0 ? tens[t] + '-' + ones[o] : tens[t];
  }

  let words = '';
  if (num >= 1000) {
    const th = Math.floor(num / 1000);
    words += convertTwoDigits(th) + ' thousand';
    num %= 1000;
    if (num > 0 && num < 100) {
      words += ' and ';
    } else if (num >= 100) {
      words += ', ';
    }
  }

  if (num >= 100) {
    const h = Math.floor(num / 100);
    words += ones[h] + ' hundred';
    num %= 100;
    if (num > 0) {
      words += ' and ';
    }
  }

  if (num > 0) {
    words += convertTwoDigits(num);
  }

  return words;
}

export function standardLogic(activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, levelName, topic, getFormatInstructions) {
  let promptInstruction = "";
  let visualEngineStr = `{\n    "componentToRender": "NONE",\n    "componentData": { "hideVisual": true }\n  }`;
  let finalAnswer = "";
  let options = [];
  let defectMap = {};

  if (!activeVariant || activeVariant === 'standard_default' || activeVariant === 'default') {
    const defaultVariants = [
      'standard_expanded_form_to_words',
      'standard_thousands_units_grouping_to_words',
      'standard_more_less_notation',
      'standard_simple_computation_to_words',
      'standard_word_notation_discrimination'
    ];
    activeVariant = defaultVariants[Math.floor(Math.random() * defaultVariants.length)];
  }

  if (activeVariant === 'standard_expanded_form_to_words') {
    // Variety:
    // 1) Presented in numbers, answer in words (50%)
    // 2) Presented in words, answer in numerical (50%)
    //    - 2a: Expanded parts in words -> numeral (e.g. forty thousand + seven thousand + fifty + two -> 47052)
    //    - 2b: Word equation with missing expanded blank -> numeral (e.g. forty-seven thousand and fifty-two = 40 000 + _____ + 50 + 2 -> 7000)

    const pattern = Math.floor(Math.random() * 3);
    let parts = [];
    let num = 0;
    let wrongNum1 = 0;
    let wrongNum2 = 0;
    let wrongNum3 = 0;

    if (pattern === 0) {
      // Zero hundreds: e.g. 40 000 + 7000 + 50 + 2 = 47 052
      const tth = (Math.floor(Math.random() * 8) + 1) * 10000;
      const th = (Math.floor(Math.random() * 8) + 1) * 1000;
      const t = (Math.floor(Math.random() * 8) + 2) * 10;
      const o = Math.floor(Math.random() * 9) + 1;
      parts = [tth, th, t, o];
      num = tth + th + t + o;
      wrongNum1 = tth + th + (t * 10) + o; // placed tens in hundreds
      wrongNum2 = tth + th + t; // dropped ones
      wrongNum3 = Math.floor(num / 10); // dropped a zero order
    } else if (pattern === 1) {
      // Zero tens and hundreds: e.g. 60 000 + 5000 + 9 = 65 009
      const tth = (Math.floor(Math.random() * 8) + 1) * 10000;
      const th = (Math.floor(Math.random() * 8) + 1) * 1000;
      const o = Math.floor(Math.random() * 9) + 1;
      parts = [tth, th, o];
      num = tth + th + o;
      wrongNum1 = tth + th + (o * 10); // placed ones in tens (65 090)
      wrongNum2 = tth + th + (o * 100); // placed ones in hundreds (65 900)
      wrongNum3 = tth + th + 10 + o; // added spurious ten
    } else {
      // Zero tens: e.g. 80 000 + 400 + 6 = 80 406 or 80 000 + 3000 + 400 + 6 = 83 406
      const hasThousands = Math.random() < 0.5;
      const tth = (Math.floor(Math.random() * 8) + 1) * 10000;
      const th = hasThousands ? (Math.floor(Math.random() * 8) + 1) * 1000 : 0;
      const h = (Math.floor(Math.random() * 8) + 1) * 100;
      const o = Math.floor(Math.random() * 9) + 1;
      parts = hasThousands ? [tth, th, h, o] : [tth, h, o];
      num = parts.reduce((a, b) => a + b, 0);
      wrongNum1 = tth + (th || 0) + h + (o * 10); // placed in tens
      wrongNum2 = tth + (th || 0) + (h * 10) + o; // shifted hundreds
      wrongNum3 = tth + (th || 0) + h; // omitted ones
    }

    const isToWords = Math.random() < 0.5;

    if (isToWords) {
      // Direction 1: Presented in numbers, answer in words
      finalAnswer = numberToWords(num);
      const partsStr = parts.map(p => p.toLocaleString()).join(' + ');
      promptInstruction = `- Question stem: "Write the value of ${partsStr} in words."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const d1 = numberToWords(wrongNum1);
        const d2 = numberToWords(wrongNum2);
        const d3 = numberToWords(wrongNum3);
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 100;
        while (set.size < 4) {
          set.add(numberToWords(num + offset));
          offset += 100;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "PLACE_VALUE_MISALIGNMENT",
          [d2]: "OMITTED_OR_SHIFTED_DIGIT",
          [d3]: "INCORRECT_EXPANDED_SUM"
        };
      }
    } else {
      // Direction 2: Presented in words, answer in numerical
      const subChoice = Math.random() < 0.5 ? 'expanded_words_to_numeral' : 'missing_blank_in_expanded';

      if (subChoice === 'expanded_words_to_numeral') {
        const wordsExpression = parts.map(p => numberToWords(p)).join(' + ');
        finalAnswer = num.toString();
        promptInstruction = `- Question stem: "Write ${wordsExpression} in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isMCQ) {
          const d1 = wrongNum1.toString();
          const d2 = wrongNum2.toString();
          const d3 = wrongNum3.toString();
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 100;
          while (set.size < 4) {
            set.add((num + offset).toString());
            offset += 100;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "PLACE_VALUE_MISALIGNMENT",
            [d2]: "OMITTED_OR_SHIFTED_DIGIT",
            [d3]: "INCORRECT_EXPANDED_SUM"
          };
        }
      } else {
        // Missing blank in expanded equation
        const blankIndex = Math.floor(Math.random() * parts.length);
        const missingPart = parts[blankIndex];
        const equationStr = parts.map((p, idx) => idx === blankIndex ? '_____' : p.toLocaleString()).join(' + ');
        finalAnswer = missingPart.toString();
        promptInstruction = `- Question stem: "${numberToWords(num)} = ${equationStr}. What is the missing number?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isMCQ) {
          const d1 = (missingPart * 10).toString();
          const d2 = (missingPart >= 10 ? Math.floor(missingPart / 10) : missingPart + 10).toString();
          const d3 = (missingPart + 100).toString();
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 10;
          while (set.size < 4) {
            set.add((missingPart + offset).toString());
            offset += 10;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "EXTRA_PLACE_VALUE_ZERO",
            [d2]: "DROPPED_PLACE_VALUE_ZERO",
            [d3]: "WRONG_PLACE_VALUE"
          };
        }
      }
    }
  } else if (activeVariant === 'standard_thousands_units_grouping_to_words') {
    // Singapore MOE Period Grouping (thousands group + units group)
    const subtype = Math.floor(Math.random() * 2); // 0: thousands + ones/tens, 1: thousands + hundreds
    const isToWords = Math.random() < 0.5;

    if (subtype === 0) {
      // e.g. 42 thousands and 35 ones = 42 035
      const th = Math.floor(Math.random() * 80) + 11;
      const onesVal = Math.floor(Math.random() * 90) + 1; // 1 to 90
      const num = (th * 1000) + onesVal;

      if (isToWords) {
        finalAnswer = numberToWords(num);
        promptInstruction = `- Question stem: "A number is made up of ${th} thousands and ${onesVal} ones. Write this number in words."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isMCQ) {
          const d1 = numberToWords(num + 100);
          const d2 = numberToWords((th * 1000) + (onesVal * 10));
          const d3 = numberToWords(num < 50000 ? num + 1000 : num - 1000);
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 200;
          while (set.size < 4) {
            set.add(numberToWords(num + offset));
            offset += 100;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "ADDED_UNWANTED_HUNDREDS",
            [d2]: "PLACE_VALUE_ZERO_OMISSION",
            [d3]: "OFF_BY_THOUSAND"
          };
        }
      } else {
        finalAnswer = num.toString();
        promptInstruction = `- Question stem: "A number is made up of ${th} thousands and ${onesVal} ones. Write this number in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isMCQ) {
          const d1 = ((th * 100) + onesVal).toString(); // dropped zero in hundreds
          const d2 = ((th * 1000) + (onesVal * 10)).toString(); // shifted
          const d3 = (num + 100).toString();
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 200;
          while (set.size < 4) {
            set.add((num + offset).toString());
            offset += 100;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "PLACE_VALUE_ZERO_OMISSION",
            [d2]: "PLACE_VALUE_MISALIGNMENT",
            [d3]: "ADDED_UNWANTED_HUNDREDS"
          };
        }
      }
    } else {
      // e.g. 58 thousands and 6 hundreds = 58 600
      const th = Math.floor(Math.random() * 80) + 11;
      const h = Math.floor(Math.random() * 8) + 1;
      const num = (th * 1000) + (h * 100);

      if (isToWords) {
        finalAnswer = numberToWords(num);
        promptInstruction = `- Question stem: "A number has ${th} thousands and ${h} hundreds. Write this number in words."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isMCQ) {
          const d1 = numberToWords((th * 1000) + (h * 10)); // tens instead of hundreds
          const d2 = numberToWords(num + 10);
          const d3 = numberToWords((th * 1000) + h); // ones instead of hundreds
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 200;
          while (set.size < 4) {
            set.add(numberToWords(num + offset));
            offset += 100;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "CONFUSED_HUNDREDS_WITH_TENS",
            [d2]: "ADDED_EXTRA_TENS",
            [d3]: "CONFUSED_HUNDREDS_WITH_ONES"
          };
        }
      } else {
        finalAnswer = num.toString();
        promptInstruction = `- Question stem: "A number has ${th} thousands and ${h} hundreds. Write this number in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isMCQ) {
          const d1 = ((th * 1000) + (h * 10)).toString();
          const d2 = ((th * 100) + h).toString();
          const d3 = ((th * 1000) + h).toString();
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 200;
          while (set.size < 4) {
            set.add((num + offset).toString());
            offset += 100;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "CONFUSED_HUNDREDS_WITH_TENS",
            [d2]: "PLACE_VALUE_ZERO_OMISSION",
            [d3]: "CONFUSED_HUNDREDS_WITH_ONES"
          };
        }
      }
    }
  } else if (activeVariant === 'standard_more_less_notation') {
    // 100 or 1000 more/less crossing place value boundary
    const isMore = Math.random() < 0.5;
    const isThousand = Math.random() < 0.5;
    const stepVal = isThousand ? 1000 : 100;
    const moreLessWord = isMore ? "more" : "less";
    const isToWords = Math.random() < 0.5;

    let baseNum = 0;
    let targetNum = 0;

    if (isThousand) {
      // Cross ten-thousands boundary: e.g. 49 250 + 1000 = 50 250 or 60 400 - 1000 = 59 400
      const tth = Math.floor(Math.random() * 7) + 2; // 2 to 8
      if (isMore) {
        baseNum = (tth * 10000) + 9000 + Math.floor(Math.random() * 800 + 100);
        targetNum = baseNum + 1000;
      } else {
        baseNum = (tth * 10000) + Math.floor(Math.random() * 800 + 100);
        targetNum = baseNum - 1000;
      }
    } else {
      // Cross thousands boundary: e.g. 54 030 - 100 = 53 930 or 38 920 + 100 = 39 020
      const thPrefix = Math.floor(Math.random() * 70) + 15;
      if (isMore) {
        baseNum = (thPrefix * 1000) + 900 + Math.floor(Math.random() * 80 + 10);
        targetNum = baseNum + 100;
      } else {
        baseNum = (thPrefix * 1000) + Math.floor(Math.random() * 80 + 10);
        targetNum = baseNum - 100;
      }
    }

    if (isToWords) {
      finalAnswer = numberToWords(targetNum);
      promptInstruction = `- Question stem: "What is ${stepVal.toLocaleString()} ${moreLessWord} than ${baseNum.toLocaleString()}? Write your answer in words."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const d1 = numberToWords(isMore ? baseNum - stepVal : baseNum + stepVal); // opposite operation
        const d2 = numberToWords(targetNum + (isThousand ? 100 : 10)); // wrong step
        const d3 = numberToWords(baseNum); // unadjusted base number
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 200;
        while (set.size < 4) {
          set.add(numberToWords(targetNum + offset));
          offset += 100;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: isMore ? "SUBTRACTED_INSTEAD_OF_ADDED" : "ADDED_INSTEAD_OF_SUBTRACTED",
          [d2]: "WRONG_PLACE_VALUE_STEP",
          [d3]: "DID_NOT_APPLY_OPERATION"
        };
      }
    } else {
      finalAnswer = targetNum.toString();
      promptInstruction = `- Question stem: "What is ${stepVal.toLocaleString()} ${moreLessWord} than ${numberToWords(baseNum)}? Write your answer in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const d1 = (isMore ? baseNum - stepVal : baseNum + stepVal).toString();
        const d2 = (targetNum + (isThousand ? 100 : 10)).toString();
        const d3 = baseNum.toString();
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 200;
        while (set.size < 4) {
          set.add((targetNum + offset).toString());
          offset += 100;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: isMore ? "SUBTRACTED_INSTEAD_OF_ADDED" : "ADDED_INSTEAD_OF_SUBTRACTED",
          [d2]: "WRONG_PLACE_VALUE_STEP",
          [d3]: "DID_NOT_APPLY_OPERATION"
        };
      }
    }
  } else if (activeVariant === 'standard_simple_computation_to_words') {
    // Compute place-value sum or difference with result in either words (50%) or numerical (50%)
    const isAdd = Math.random() < 0.5;
    const isToWords = Math.random() < 0.5;
    let n1 = 0;
    let n2 = 0;
    let result = 0;

    if (isAdd) {
      n1 = (Math.floor(Math.random() * 6) + 2) * 10000; // 20 000 to 70 000
      n2 = (Math.floor(Math.random() * 8) + 1) * 1000 + (Math.floor(Math.random() * 8) + 1) * 10; // e.g. 5060
      result = n1 + n2;

      if (isToWords) {
        finalAnswer = numberToWords(result);
        promptInstruction = `- Question stem: "Find the sum of ${n1.toLocaleString()} and ${n2.toLocaleString()}. Write your answer in words."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isMCQ) {
          const d1 = numberToWords(result + 100);
          const d2 = numberToWords(result - 10);
          const d3 = numberToWords(n1 + (n2 * 10 > 30000 ? n2 - 1000 : n2 * 10));
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 200;
          while (set.size < 4) {
            set.add(numberToWords(result + offset));
            offset += 100;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "OFF_BY_HUNDRED",
            [d2]: "OFF_BY_TEN",
            [d3]: "PLACE_VALUE_MISALIGNMENT"
          };
        }
      } else {
        finalAnswer = result.toString();
        const useWordsInput = Math.random() < 0.5;
        if (useWordsInput) {
          promptInstruction = `- Question stem: "Find the sum of ${numberToWords(n1)} and ${numberToWords(n2)}. Write your answer in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;
        } else {
          promptInstruction = `- Question stem: "Find the sum of ${n1.toLocaleString()} and ${n2.toLocaleString()}. Write your answer in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;
        }

        if (isMCQ) {
          const d1 = (result + 100).toString();
          const d2 = (result - 10).toString();
          const d3 = (n1 + (n2 * 10 > 30000 ? n2 - 1000 : n2 * 10)).toString();
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 200;
          while (set.size < 4) {
            set.add((result + offset).toString());
            offset += 100;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "OFF_BY_HUNDRED",
            [d2]: "OFF_BY_TEN",
            [d3]: "PLACE_VALUE_MISALIGNMENT"
          };
        }
      }
    } else {
      n1 = (Math.floor(Math.random() * 6) + 3) * 10000; // 30 000 to 80 000
      n2 = (Math.floor(Math.random() * 8) + 1) * 1000; // 1000 to 8000
      result = n1 - n2;

      if (isToWords) {
        finalAnswer = numberToWords(result);
        promptInstruction = `- Question stem: "Subtract ${n2.toLocaleString()} from ${n1.toLocaleString()}. Write your answer in words."\\n- The finalAnswer must be strictly "${finalAnswer}".`;

        if (isMCQ) {
          const d1 = numberToWords(n1 + n2); // added instead of subtracted
          const d2 = numberToWords(result - 1000);
          const d3 = numberToWords(result + 1000);
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 2000;
          while (set.size < 4) {
            set.add(numberToWords(result + offset));
            offset += 1000;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "ADDED_INSTEAD_OF_SUBTRACTED",
            [d2]: "OFF_BY_THOUSAND",
            [d3]: "OFF_BY_THOUSAND"
          };
        }
      } else {
        finalAnswer = result.toString();
        const useWordsInput = Math.random() < 0.5;
        if (useWordsInput) {
          promptInstruction = `- Question stem: "Subtract ${numberToWords(n2)} from ${numberToWords(n1)}. Write your answer in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;
        } else {
          promptInstruction = `- Question stem: "Subtract ${n2.toLocaleString()} from ${n1.toLocaleString()}. Write your answer in numerals."\\n- The finalAnswer must be strictly "${finalAnswer}".`;
        }

        if (isMCQ) {
          const d1 = (n1 + n2).toString(); // added instead of subtracted
          const d2 = (result - 1000).toString();
          const d3 = (result + 1000).toString();
          const set = new Set([finalAnswer, d1, d2, d3]);
          let offset = 2000;
          while (set.size < 4) {
            set.add((result + offset).toString());
            offset += 1000;
          }
          options = Array.from(set).sort(() => Math.random() - 0.5);
          defectMap = {
            [d1]: "ADDED_INSTEAD_OF_SUBTRACTED",
            [d2]: "OFF_BY_THOUSAND",
            [d3]: "OFF_BY_THOUSAND"
          };
        }
      }
    }
  } else {
    // standard_word_notation_discrimination
    // Discriminate between tricky homophone / zero-trap word notations for numbers with multiple zeroes
    const thPrefix = (Math.floor(Math.random() * 8) + 2) * 10; // 20, 30, ..., 90
    const tensOrOnes = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const isToNumeral = Math.random() < 0.5;

    // Target: e.g. 40 016 or 70 008 or 80 040
    const trapType = Math.floor(Math.random() * 3);
    let num = 0;
    let dist1 = 0;
    let dist2 = 0;
    let dist3 = 0;

    if (trapType === 0) {
      // e.g. 60 014 (teen) vs 60 040 vs 60 140 vs 60 004
      const teen = Math.floor(Math.random() * 7) + 13; // 13 to 19
      num = (thPrefix * 1000) + teen;
      dist1 = (thPrefix * 1000) + ((teen % 10) * 10); // e.g. 60 040
      dist2 = (thPrefix * 1000) + 100 + ((teen % 10) * 10); // 60 140
      dist3 = (thPrefix * 1000) + (teen % 10); // 60 004
    } else if (trapType === 1) {
      // e.g. 50 070 (exact tens) vs 50 007 vs 50 700 vs 57 000
      num = (thPrefix * 1000) + (tensOrOnes * 10);
      dist1 = (thPrefix * 1000) + tensOrOnes; // ones (50 007)
      dist2 = (thPrefix * 1000) + (tensOrOnes * 100); // hundreds (50 700)
      dist3 = ((thPrefix + tensOrOnes) * 1000); // thousands (57 000)
    } else {
      // e.g. 80 005 (exact ones) vs 80 050 vs 80 500 vs 85 000
      num = (thPrefix * 1000) + tensOrOnes;
      dist1 = (thPrefix * 1000) + (tensOrOnes * 10); // tens (80 050)
      dist2 = (thPrefix * 1000) + (tensOrOnes * 100); // hundreds (80 500)
      dist3 = ((thPrefix + tensOrOnes) * 1000); // thousands (85 000)
    }

    if (isToNumeral) {
      finalAnswer = num.toString();
      promptInstruction = `- Question stem: "Which of the following numerals represents '${numberToWords(num)}'?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const d1 = dist1.toString();
        const d2 = dist2.toString();
        const d3 = dist3.toString();
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 20;
        while (set.size < 4) {
          set.add((num + offset).toString());
          offset += 10;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "CONFUSED_TENS_AND_ONES_NOTATION",
          [d2]: "CONFUSED_HUNDREDS_AND_TENS_NOTATION",
          [d3]: "CONFUSED_THOUSANDS_AND_ONES_NOTATION"
        };
      }
    } else {
      finalAnswer = numberToWords(num);
      promptInstruction = `- Question stem: "Which of the following is the correct word representation of ${num.toLocaleString()}?"\\n- The finalAnswer must be strictly "${finalAnswer}".`;

      if (isMCQ) {
        const d1 = numberToWords(dist1);
        const d2 = numberToWords(dist2);
        const d3 = numberToWords(dist3);
        const set = new Set([finalAnswer, d1, d2, d3]);
        let offset = 20;
        while (set.size < 4) {
          set.add(numberToWords(num + offset));
          offset += 10;
        }
        options = Array.from(set).sort(() => Math.random() - 0.5);
        defectMap = {
          [d1]: "CONFUSED_TENS_AND_ONES_NOTATION",
          [d2]: "CONFUSED_HUNDREDS_AND_TENS_NOTATION",
          [d3]: "CONFUSED_THOUSANDS_AND_ONES_NOTATION"
        };
      }
    }
  }

  const inputRequirementStr = isStructure ? `{\n    "inputType": "MULTI_STEP_INPUT"\n  }` : null;
  const mcqInstruction = isMCQ ? `- Generate EXACTLY 4 options: ${JSON.stringify(options)}.\\n- Set defectMap to: ${JSON.stringify(defectMap)}.` : "";

  const aiPrompt = `You are an expert Singapore Primary 4 Math educator.
Generate a standard-level question for Singapore Primary 4 students.
Topic: Whole Numbers - Numbers up to 100 000
Subtopic: Number Notation
Difficulty: ${zodDiff}
Type: ${zodType}

CRITICAL INSTRUCTIONS:
1. ${promptInstruction}
2. The finalAnswer must be strictly "${finalAnswer}".
${mcqInstruction}
3. Provide step-by-step solution steps separated by \\n and an encouraging conceptual hint.
4. Forbid using "STORY:" or any instructional prefix in the output.

${getFormatInstructions(visualEngineStr, inputRequirementStr)}`;

  return { aiPrompt };
}
