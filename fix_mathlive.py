import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'r') as f:
    content = f.read()

# Fix Value Sync
old_sync = """      if (!isFocused && value !== undefined && (mfe.value + "") !== (value + "")) {
        console.log('🔄 [MathInput] Syncing external value:', value);
        mfe.value = value || "";
      }"""
new_sync = """      if (!isFocused && value !== undefined) {
        try {
          if ((mfe.value + "") !== (value + "")) {
            console.log('🔄 [MathInput] Syncing external value:', value);
            mfe.value = value || "";
          }
        } catch (e) {
          console.warn('⚠️ [MathInput] Mathfield not fully initialized for value sync, retrying...', e);
          setTimeout(() => {
            if (isActive && mfRef.current) {
               try { mfRef.current.value = value || ""; } catch(err) {}
            }
          }, 100);
        }
      }"""
content = content.replace(old_sync, new_sync)

# Fix autofocus
old_focus = """  useEffect(() => {
    if (isLoaded && autoFocus && mfRef.current) {
      setTimeout(() => {
        try {
          if (mfRef.current) {
            mfRef.current.focus();
          }
        } catch (e: any) {
          if (e?.message && e.message.includes('mathfield')) {
            // Silently ignore: Mathfield internal focus error on initial mount
          } else {
            console.warn('⚠️ [MathInput] Auto-focus skipped (likely blocked by mobile Safari security policy):', e);
          }
        }
      }, 100);
    }
  }, [isLoaded, autoFocus]);"""

new_focus = """  useEffect(() => {
    if (isLoaded && autoFocus && mfRef.current) {
      setTimeout(() => {
        try {
          if (mfRef.current) {
            // Guard against calling focus before MathLive internal setup
            if (mfRef.current.mathVirtualKeyboard || mfRef.current.executeCommand) {
              mfRef.current.focus();
            }
          }
        } catch (e: any) {
          console.warn('⚠️ [MathInput] Auto-focus skipped safely.');
        }
      }, 150);
    }
  }, [isLoaded, autoFocus]);"""
content = content.replace(old_focus, new_focus)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/MathInput.tsx', 'w') as f:
    f.write(content)

print("Done")
