import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# Replace direct assignments with setOptions
old_init = """    currentMf.menuToggleVisibility = "hidden";
    currentMf.virtualKeyboardToggleVisibility = "hidden"; // Hide toggle to prevent focus loop glitch on mobile
    currentMf.mathVirtualKeyboardPolicy = isDesktop ? "manual" : "auto"; 
    
    currentMf.readOnly = disabled;
    currentMf.letterShapeStyle = "upright"; // Disguise math variables as normal text
    currentMf.smartMode = false; // Disable unpredictable auto-guessing
    currentMf.defaultMode = "math"; // Stay in native math mode to prevent text-block placeholder bugs
    currentMf.smartFence = false;
    currentMf.mathModeSpace = "\\ ";
    currentMf.popoverPolicy = "none"; // Disable error toasts
    currentMf.plonkSound = null; // Disable error sounds
    currentMf.keypressSound = null; // Disable keypress sounds

    // Remove tab from keybindings so users can tab between multiple inputs natively
    if (currentMf.keybindings) {
      currentMf.keybindings = currentMf.keybindings.filter((kb: any) => kb.key !== 'tab' && kb.key !== 'shift+[Tab]' && kb.key !== '[Tab]');
    }"""

new_init = """    // Safely set options to prevent corrupting MathLive internal initialization
    try {
      currentMf.setOptions({
        menuToggleVisibility: "hidden",
        virtualKeyboardToggleVisibility: "hidden",
        mathVirtualKeyboardPolicy: isDesktop ? "manual" : "auto",
        readOnly: disabled,
        letterShapeStyle: "upright",
        smartMode: false,
        defaultMode: "math",
        smartFence: false,
        mathModeSpace: "\\\\ ",
        popoverPolicy: "none",
        plonkSound: null,
        keypressSound: null
      });
      
      if (currentMf.keybindings) {
        currentMf.setOptions({
          keybindings: currentMf.keybindings.filter((kb: any) => kb.key !== 'tab' && kb.key !== 'shift+[Tab]' && kb.key !== '[Tab]')
        });
      }
    } catch (e) {
      console.warn("Could not setOptions early, retrying safely", e);
    }"""

content = content.replace(old_init, new_init)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
