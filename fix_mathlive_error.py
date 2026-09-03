import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# Fix onFocusIn
old_focusin = """    const onFocusIn = () => {
      // Guard against MathLive internal race conditions
      if (!currentMf || !currentMf.mathVirtualKeyboard) return;
      
      if (isDesktop && (window as any).mathVirtualKeyboard) {"""

new_focusin = """    const onFocusIn = () => {
      // Guard against MathLive internal race conditions
      if (!currentMf || !currentMf.executeCommand) return;
      
      if (isDesktop && (window as any).mathVirtualKeyboard) {"""
content = content.replace(old_focusin, new_focusin)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
