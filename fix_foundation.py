import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    content = f.read()

# Variant 1
v1_old = """        let structText = `STORY: ${names[0]} pours some sirap bandung into a measuring cylinder. Look at the beaker model. How many millilitres of sirap bandung did ${names[0]} pour?`;
        let shortText = `Read the volume of the liquid in the beaker in ml.`;
        askText = isStructure ? structText : shortText;

        solutionSteps = ["""
v1_new = """        let structText = `STORY: ${names[0]} pours some sirap bandung into a beaker. Look at the visual model. What is the volume of the drink?`;
        let shortText = `Read the volume of the liquid in the beaker in ml.`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Look at the beaker. What number does the liquid reach?", expectedAnswer: valueStr },
              { label: "Write the volume with the correct unit symbol for millilitres:", expectedAnswer: "ml", acceptedAnswers: ["mL"] }
            ]
          });
        }

        solutionSteps = ["""

content = content.replace(v1_old, v1_new)

# Variant 2
v2_old = """        let structText = `STORY: ${names[1]} is making iced Milo and needs to measure water accurately. The water level is exactly halfway between ${lowerTick} ml and ${upperTick} ml. What is the volume in ml?`;
        let shortText = `What is the volume of the liquid in ml?`;
        askText = isStructure ? structText : shortText;

        solutionSteps = ["""
v2_new = """        let structText = `STORY: ${names[1]} is making iced Milo. The water level in his beaker is exactly halfway between ${lowerTick} ml and ${upperTick} ml. What is the volume?`;
        let shortText = `What is the volume of the liquid in ml?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "The water is above which major marking?", expectedAnswer: lowerTick.toString() },
              { label: "The water is below which major marking?", expectedAnswer: upperTick.toString() },
              { label: `What number is exactly halfway between ${lowerTick} and ${upperTick}?`, expectedAnswer: valueStr }
            ]
          });
        }

        solutionSteps = ["""

content = content.replace(v2_old, v2_new)

# Variant 3
v3_old = """        let structText = `STORY: The map shows the jogging path at East Coast Park. The distance from the starting point to the rest stop is marked above. What is the distance in kilometres?`;
        let shortText = `What is the distance of the path shown in km?`;
        askText = isStructure ? structText : shortText;

        solutionSteps = ["""
v3_new = """        let structText = `STORY: The map shows the jogging path at East Coast Park. Read the total distance from the start point to the rest stop.`;
        let shortText = `What is the distance of the path shown in km?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: "Look at the map path. What is the total distance?", expectedAnswer: distanceStr },
              { label: "Write the correct unit symbol for kilometres:", expectedAnswer: "km" }
            ]
          });
        }

        solutionSteps = ["""
content = content.replace(v3_old, v3_new)

# Variant 4 scenario update
v4_old_scenarios = """      const scenarios = [
        { desc: "distance between two towns", short: "distance between towns", unit: "kilometres", alt1: "metres", alt2: "centimetres", alt3: "millimetres" },
        { desc: "water in a swimming pool", short: "swimming pool", unit: "litres", alt1: "millilitres", alt2: "grams", alt3: "kilograms" },
        { desc: "medicine in a small spoon", short: "spoonful of medicine", unit: "millilitres", alt1: "litres", alt2: "metres", alt3: "kilometres" },
        { desc: "length of a school field", short: "school field", unit: "metres", alt1: "kilometres", alt2: "centimetres", alt3: "millilitres" }
      ];"""

v4_new_scenarios = """      const scenarios = [
        { desc: "distance between two towns", short: "distance between towns", unit: "km", alt1: "m", alt2: "cm", alt3: "mm", longUnit: "kilometres", longAlt1: "metres" },
        { desc: "water in a swimming pool", short: "swimming pool", unit: "l", alt1: "ml", alt2: "g", alt3: "kg", longUnit: "litres", longAlt1: "millilitres" },
        { desc: "medicine in a small spoon", short: "spoonful of medicine", unit: "ml", alt1: "l", alt2: "m", alt3: "km", longUnit: "millilitres", longAlt1: "litres" },
        { desc: "length of a school field", short: "school field", unit: "m", alt1: "km", alt2: "cm", alt3: "ml", longUnit: "metres", longAlt1: "kilometres" }
      ];"""

content = content.replace(v4_old_scenarios, v4_new_scenarios)

v4_old = """      if (isMCQ) {
        askText = `Which unit of measurement is most suitable for the ${selected.short}?`;
        mcqOptions = [selected.unit, selected.alt1, selected.alt2, selected.alt3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Think about how large or small the ${selected.short} is.`,
          `${selected.unit.charAt(0).toUpperCase() + selected.unit.slice(1)} is the standard unit to measure this.`
        ];
        hint = `Is it very big or very small? Choose the unit that matches.`;
      } else {
        let structText = `STORY: ${names[0]} wants to measure the ${selected.desc}. Which unit of measurement is the most suitable: ${selected.alt1}, ${selected.unit}, or ${selected.alt2}?`;
        let shortText = `Would you measure the ${selected.short} in ${selected.alt1} or ${selected.unit}?`;
        askText = isStructure ? structText : shortText;

        solutionSteps = [
          `The ${selected.short} requires an appropriate unit for its size.`,
          `Therefore, ${selected.unit} is the correct unit.`
        ];
        hint = `Think about whether it is long/heavy/large or short/light/small.`;
      }"""

v4_new = """      if (isMCQ) {
        askText = `Which unit of measurement is most suitable for the ${selected.short}?`;
        mcqOptions = [selected.unit, selected.alt1, selected.alt2, selected.alt3].sort(() => 0.5 - Math.random());
        solutionSteps = [
          `Think about how large or small the ${selected.short} is.`,
          `${selected.unit} is the standard unit to measure this.`
        ];
        hint = `Is it very big or very small? Choose the unit that matches.`;
      } else {
        let structText = `STORY: ${names[0]} wants to measure the ${selected.desc}. Which unit of measurement is the most suitable: ${selected.alt1} or ${selected.unit}?`;
        let shortText = `Would you measure the ${selected.short} in ${selected.alt1} or ${selected.unit}?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          const conversionLabel = selected.unit === 'km' || selected.alt1 === 'km' 
            ? "How many metres are in 1 kilometre?"
            : "How many millilitres are in 1 litre?";
          const conversionAns = "1000";
          const descriptionLabel = selected.unit === 'km' 
            ? `For very long distances like towns, type the correct unit (${selected.alt1} or ${selected.unit}):`
            : selected.unit === 'l'
              ? `For very large volumes like a swimming pool, type the correct unit (${selected.alt1} or ${selected.unit}):`
              : selected.unit === 'ml'
                ? `For very small volumes like a spoon, type the correct unit (${selected.alt1} or ${selected.unit}):`
                : `For short distances like a school field, type the correct unit (${selected.alt1} or ${selected.unit}):`;

          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: conversionLabel, expectedAnswer: conversionAns },
              { label: descriptionLabel, expectedAnswer: selected.unit }
            ]
          });
        }

        solutionSteps = [
          `The ${selected.short} requires an appropriate unit for its size.`,
          `Therefore, ${selected.unit} is the correct unit.`
        ];
        hint = `Think about whether it is long/heavy/large or short/light/small.`;
      }"""

content = content.replace(v4_old, v4_new)


# Variant 5
v5_old = """        let structText = `STORY: Beaker A and Beaker B contain some water. Look at the visual models. Write down which beaker has a larger volume of water.`;
        let shortText = `Which beaker contains more liquid, Beaker A or Beaker B?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Volume of Beaker A (ml)`, expectedAnswer: valA.toString() },
              { label: `Volume of Beaker B (ml)`, expectedAnswer: valB.toString() },
              { label: `Which beaker has more?`, expectedAnswer: moreBeaker }
            ]
          });
        }

        solutionSteps = ["""
v5_new = """        let structText = `STORY: Beaker A and Beaker B contain some water. Look at the visual models to find out which beaker holds more water.`;
        let shortText = `Which beaker contains more liquid, Beaker A or Beaker B?`;
        askText = isStructure ? structText : shortText;

        if (isStructure) {
          inputRequirementStr = JSON.stringify({
            inputType: "MULTI_STEP_INPUT",
            steps: [
              { label: `Read the volume of Beaker A (in ml):`, expectedAnswer: valA.toString() },
              { label: `Read the volume of Beaker B (in ml):`, expectedAnswer: valB.toString() },
              { label: `Which beaker has a larger volume of water? (Type A or B)`, expectedAnswer: moreBeaker.replace('Beaker ', '') }
            ]
          });
        }

        solutionSteps = ["""

content = content.replace(v5_old, v5_new)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(content)

print("Done")
