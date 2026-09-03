import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

old_cond = "if (isPerimeter && perimeterSides.length >= 2) {"
new_cond = "if (isPerimeter && perimeterSides.length >= 1) {"

content = content.replace(old_cond, new_cond)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
