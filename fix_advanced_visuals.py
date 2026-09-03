import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/money-money/money-addition-subtraction-decimals/advanced.js', 'r') as f:
    content = f.read()

# Define the 5 regex replacements
# We want to find the visualEngineStr = JSON.stringify({ ... }); block
# inside the else block, and move it to right before if (isMCQ) {

def move_visual_engine(match):
    pre_mcq = match.group(1)
    if_mcq = match.group(2)
    else_block = match.group(3)
    visual_engine = match.group(4)
    post_visual = match.group(5)
    
    # We remove visual_engine from inside the else_block, and place it before if_mcq
    new_content = f"{pre_mcq}\n{visual_engine}\n\n{if_mcq}{else_block}{post_visual}"
    return new_content

pattern = r'(.*?)(      if \(isMCQ\) \{.*?)(      \} else \{.*?)(        visualEngineStr = JSON\.stringify\(\{.*?\}\);\n)(.*?\} *?\n      break;\n    \})'

# Wait, this regex is too greedy and might cross variant boundaries.
# Let's split by `case 'advanced_` and process each.

variants = content.split('    case \'advanced_')

for i in range(1, len(variants)):
    v = variants[i]
    
    # Extract the visualEngineStr block
    visual_match = re.search(r'(\s+visualEngineStr = JSON\.stringify\(\{.*?\n\s+\}\);\n)', v, re.DOTALL)
    if visual_match:
        visual_block = visual_match.group(1)
        
        # Remove it from its current location
        v = v.replace(visual_block, '')
        
        # Insert it before `if (isMCQ) {`
        v = v.replace('      if (isMCQ) {', visual_block.lstrip('\n') + '      if (isMCQ) {')
        
        variants[i] = v

new_content = '    case \'advanced_'.join(variants)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-3/money-money/money-addition-subtraction-decimals/advanced.js', 'w') as f:
    f.write(new_content)

print("Done")
