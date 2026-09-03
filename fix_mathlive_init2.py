import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# Wrap initialization in a requestAnimationFrame to ensure connectedCallback has run
old_init = """    try {
      // Enable focus only after internal initialization is safe
      setTimeout(() => {
        if (isActive && mfRef.current) {
          mfRef.current.tabIndex = 0;
        }
      }, 300);

      currentMf.setOptions({"""

new_init = """    try {
      // Enable focus only after internal initialization is safe
      setTimeout(() => {
        if (isActive && mfRef.current) {
          mfRef.current.tabIndex = 0;
        }
      }, 300);

      // MathLive's connectedCallback might be pending in the microtask queue.
      // We must wait for the next frame to safely apply configurations.
      requestAnimationFrame(() => {
        if (!isActive || !mfRef.current) return;
        try {
          mfRef.current.setOptions({"""

content = content.replace(old_init, new_init)

# Close the new try block
old_close = """    } catch (e) {
      console.warn("Could not setOptions early, retrying safely", e);
    }"""

new_close = """        } catch (e) {
          console.warn("Could not setOptions early, retrying safely", e);
        }
      });
    } catch (e) {
      console.warn("Outer init wrapper failed", e);
    }"""

content = content.replace(old_close, new_close)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
