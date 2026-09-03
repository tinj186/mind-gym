import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# Remove tabIndex={0}
old_math_field = """          <math-field
            id={id}
            ref={mfRef}
            tabIndex={0}
            style={{
              display: 'block',"""
new_math_field = """          <math-field
            id={id}
            ref={mfRef}
            style={{
              display: 'block',"""
content = content.replace(old_math_field, new_math_field)

# Fix onFocusIn
old_focusin = """    const onFocusIn = () => {
      if (isDesktop && (window as any).mathVirtualKeyboard) {
        // Give the browser a moment to settle focus before connecting the VK
        setTimeout(() => {
          const mvk = (window as any).mathVirtualKeyboard;
          if (mvk) {
            // Explicitly set the active mathfield to prevent desync
            mvk.activeMathfield = currentMf;
            mvk.show();
          }
        }, 10);
      }
    };"""

new_focusin = """    const onFocusIn = () => {
      // Guard against MathLive internal race conditions
      if (!currentMf || !currentMf.mathVirtualKeyboard) return;
      
      if (isDesktop && (window as any).mathVirtualKeyboard) {
        // Give the browser a moment to settle focus before connecting the VK
        setTimeout(() => {
          const mvk = (window as any).mathVirtualKeyboard;
          if (mvk) {
            try {
              // Explicitly set the active mathfield to prevent desync
              mvk.activeMathfield = currentMf;
              mvk.show();
            } catch(e) {}
          }
        }, 10);
      }
    };"""
content = content.replace(old_focusin, new_focusin)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
