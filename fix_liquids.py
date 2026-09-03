with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    content = f.read()

# Add LIQUIDS at the top of foundationLogic
old_top = """export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);

  let askText, answer, mcqOptions, solutionSteps, hint;"""

new_top = """export const foundationLogic = (activeVariant, difficulty, type, isMCQ, isShort, isStructure, zodType, zodDiff, level, topic, subtopic, getFormatInstructions) => {
  const names = getRandomNames(2);
  const LIQUIDS = ['sirap bandung', 'iced Milo', 'lemonade', 'orange juice', 'soya bean milk', 'milk', 'apple juice'];

  let askText, answer, mcqOptions, solutionSteps, hint;"""

content = content.replace(old_top, new_top)

# Remove the inline const LIQUIDS from Variant 1
old_v1 = "const LIQUIDS = ['sirap bandung', 'iced Milo', 'lemonade', 'orange juice', 'soya bean milk', 'milk', 'apple juice']; const liquid1 = LIQUIDS[Math.floor(Math.random() * LIQUIDS.length)];"
new_v1 = "const liquid1 = LIQUIDS[Math.floor(Math.random() * LIQUIDS.length)];"

content = content.replace(old_v1, new_v1)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(content)

print("Done")
