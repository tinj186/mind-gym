import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# Fix onFocusIn
old_focusin = """              // Explicitly set the active mathfield to prevent desync
              mvk.activeMathfield = currentMf;
              mvk.show();"""

new_focusin = """              // Let MathLive handle its own activeMathfield natively on focus
              // mvk.activeMathfield = currentMf; // THIS CAUSES CRASHES ON RAPID TABBING
              mvk.show();"""
content = content.replace(old_focusin, new_focusin)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
