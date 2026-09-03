import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/utils/variable-bank.js', 'r') as f:
    content = f.read()

new_liquids = """export const getRandomHeightSubjects = (count = 1) => {
  const shuffled = [...HEIGHT_SUBJECTS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const LIQUIDS_POOL = [
  "sirap bandung", "iced Milo", "lemonade", "orange juice", 
  "soya bean milk", "milk", "apple juice", "water", "tea"
];

export const getRandomLiquids = (count = 1) => {
  const shuffled = [...LIQUIDS_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};"""

content = content.replace("export const getRandomHeightSubjects = (count = 1) => {\n  const shuffled = [...HEIGHT_SUBJECTS_POOL].sort(() => 0.5 - Math.random());\n  return shuffled.slice(0, count);\n};", new_liquids)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/utils/variable-bank.js', 'w') as f:
    f.write(content)

# Now update foundation.js to import and use it
with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'r') as f:
    f_content = f.read()

f_content = f_content.replace("import { getRandomNames } from '@/lib/utils/variable-bank';", "import { getRandomNames, getRandomLiquids } from '@/lib/utils/variable-bank';")
f_content = f_content.replace("  const LIQUIDS = ['sirap bandung', 'iced Milo', 'lemonade', 'orange juice', 'soya bean milk', 'milk', 'apple juice'];", "  const liquids = getRandomLiquids(2);")

f_content = f_content.replace("const liquid1 = LIQUIDS[Math.floor(Math.random() * LIQUIDS.length)];", "const liquid1 = liquids[0];")
f_content = f_content.replace("const liquid2 = LIQUIDS[Math.floor(Math.random() * LIQUIDS.length)];", "const liquid2 = liquids[1];")

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/measurement-length-mass-and-volume/measurement-km-ml/foundation.js', 'w') as f:
    f.write(f_content)

print("Done")
