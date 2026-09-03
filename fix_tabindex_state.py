import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# 1. Add state variable
old_state = """  const mfRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);"""
new_state = """  const mfRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [tabIndex, setTabIndex] = useState(-1);"""
content = content.replace(old_state, new_state)

# 2. Update the JSX to use the state
old_jsx = """          <math-field
            id={id}
            ref={mfRef}
            tabIndex={-1}"""
new_jsx = """          <math-field
            id={id}
            ref={mfRef}
            tabIndex={tabIndex}"""
content = content.replace(old_jsx, new_jsx)

# 3. Update the setTimeout to use setTabIndex
old_timeout = """      // Enable focus only after internal initialization is safe
      setTimeout(() => {
        if (isActive && mfRef.current) {
          mfRef.current.tabIndex = 0;
        }
      }, 300);"""
new_timeout = """      // Enable focus only after internal initialization is safe
      setTimeout(() => {
        if (isActive) {
          setTabIndex(0);
        }
      }, 300);"""
content = content.replace(old_timeout, new_timeout)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
