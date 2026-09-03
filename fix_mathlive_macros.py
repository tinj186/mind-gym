import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# Replace direct assignments with setOptions
old_init = """    currentMf.macros = {
      ...currentMf.macros,
      cm2: '{cm}^2',
      m2: '{m}^2',
      kg: '\\text{kg}',
      ml: '\\text{ml}',
      "m/s": '\\text{m/s}',
    };

    // Replace all default inline shortcuts to prevent words like "or" and "and" 
    // from automatically turning into \lor and \land math symbols.
    // We only define the specific physical keyboard shortcuts we want to allow.
    currentMf.mathModeInlineShortcuts = { 
      '*': '\\times',
      '/': '\\div',
      "'": "’" // Prevent apostrophe from turning into a math prime
    };
    currentMf.inlineShortcuts = { 
      '*': '\\times',
      '/': '\\div',
      "'": "’"
    };

    if (currentMf.value !== value) {
      currentMf.value = value || "";
    }"""

new_init = """    try {
      currentMf.setOptions({
        macros: {
          ...currentMf.getOption('macros'),
          cm2: '{cm}^2',
          m2: '{m}^2',
          kg: '\\\\text{kg}',
          ml: '\\\\text{ml}',
          "m/s": '\\\\text{m/s}',
        },
        inlineShortcuts: {
          '*': '\\\\times',
          '/': '\\\\div',
          "'": "’"
        }
      });
      // MathLive < 0.94 compat
      if (currentMf.mathModeInlineShortcuts !== undefined) {
         currentMf.mathModeInlineShortcuts = { '*': '\\\\times', '/': '\\\\div', "'": "’" };
      }
    } catch(e) {}

    try {
      if (currentMf.value !== value) {
        currentMf.value = value || "";
      }
    } catch(e) {}"""

content = content.replace(old_init, new_init)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
