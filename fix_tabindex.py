import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# Add tabIndex={-1} to math-field
old_math_field = """          <math-field
            id={id}
            ref={mfRef}
            style={{
              display: 'block',"""
new_math_field = """          <math-field
            id={id}
            ref={mfRef}
            tabIndex={-1}
            style={{
              display: 'block',"""
content = content.replace(old_math_field, new_math_field)

# Add code to set tabindex=0 safely after initialization
old_init = """    try {
      currentMf.setOptions({"""
new_init = """    try {
      // Enable focus only after internal initialization is safe
      setTimeout(() => {
        if (isActive && mfRef.current) {
          mfRef.current.tabIndex = 0;
        }
      }, 300);

      currentMf.setOptions({"""
content = content.replace(old_init, new_init)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
