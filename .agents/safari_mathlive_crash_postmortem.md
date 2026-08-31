# Postmortem: Safari MathLive Virtual Keyboard Crash

## 🚨 The Error Signature
```
[browser] Uncaught TypeError: undefined is not an object (evaluating 'this.mathfield.options')
[browser] Stack Trace: atomToString -> onBlur -> onFocus
```

## 🐛 The Root Cause

The crash occurs exclusively in **Safari** when transitioning between components that contain multiple `<math-field>` elements (e.g., submitting a Multi-Step question to load the next one). 

It is caused by a fatal combination of three factors:
1. **MathLive's Private Global State:** MathLive tracks the currently focused mathfield in a completely hidden, private module variable (`_globallyFocusedMathfield`). This variable stores the internal `MathfieldPrivate` memory state, not the DOM element wrapper.
2. **Safari's Asynchronous Event Loop:** When React unmounts a component, Safari instantly removes it from the DOM. If there is a native `blur` event queued in the event loop for that element, Safari **cancels** the event because the element is no longer attached.
3. **The Focus Race Condition:** Because the `blur` event is cancelled, MathLive's internal `onBlur` listener never fires during the unmount. Consequently, it never clears `_globallyFocusedMathfield`. When the new question mounts and its first mathfield auto-focuses, MathLive's `onFocus` sees the old memory state still lingering in the global tracker and forcibly calls `onBlur` on it. Since the old element was already destroyed by React, it crashes looking for `.options` on undefined memory.

## ❌ Failed Attempts (What NOT to do)

1. **`document.activeElement.blur()`**
   - **Why it failed:** When you click "Submit", focus naturally moves to the button. `document.activeElement` becomes the button, not the mathfield. Calling `blur()` on the button does nothing to MathLive.
2. **Patching `disconnectedCallback`**
   - **Why it failed:** We tried to delay the custom element teardown. However, the crash happens deep inside MathLive's internal `ModelPrivate` state, not on the DOM element wrapper. 
3. **The "Dummy Tether" Hack (`window.mathVirtualKeyboard.activeMathfield = null`)**
   - **Why it failed:** MathLive intentionally ignores `activeMathfield` assignment when `<math-field math-virtual-keyboard-policy="manual">` is used. Furthermore, `onFocus` checks the internal `_globallyFocusedMathfield` variable, not the public `activeMathfield` getter.
4. **Patching `MathFieldElement.prototype.mathfield` (Getter Hack)**
   - **Why it failed:** MathLive's internal source code evaluates `this.mathfield` with `this` bound to the internal `ModelPrivate` object, not the `<math-field>` DOM node. Modifying the DOM node prototype was completely bypassed.

## ✅ The Final Solution: The Synchronous Blur Assassin

To fix this, we must force MathLive to execute its `onBlur` cleanup **synchronously**, before React has a chance to rip the component out of the DOM. 

### 1. Synchronous Event Dispatching
In `WorkoutSession.jsx` (inside the `handleAnswer` submission block), we manually construct and dispatch native `blur` and `focusout` events. 

```javascript
const allMathFields = document.querySelectorAll('math-field');
allMathFields.forEach((mf) => {
  try {
    // 1. Manually dispatch events to bypass Safari's event cancellation
    mf.dispatchEvent(new Event('blur', { bubbles: false }));
    mf.dispatchEvent(new Event('focusout', { bubbles: true }));
    mf.blur(); 
  } catch(e) {}
});
```
Because `dispatchEvent` executes synchronously, MathLive catches it instantly. It runs its cleanup and safely deletes the `_globallyFocusedMathfield` tracker while the component is still 100% healthy.

### 2. The 150ms Life-Support Yield
Even with synchronous dispatching, Safari requires a tiny window to finish processing the state transitions before the DOM nodes are violently destroyed.

```javascript
setTimeout(async () => {
  // Execute React state updates (unmounting the component) inside the timeout
  const nextProgress = await gradeMultiStepAction(...);
}, 150);
```

## 🧠 Lessons Learned
- **Never trust Safari's event loop during unmounts:** If an external library relies on native DOM events (like `blur` or `focus`) to perform critical memory cleanup, you **must** trigger those events synchronously before React unmounts the component.
- **Web Components vs React:** Web Components manage their own heavy internal memory. React's instant DOM manipulation is often too fast for Web Components to gracefully tear down, leading to memory leaks or ghost crashes. Always provide a "life-support" yield (`setTimeout`) during heavy page transitions.
- **Global Singletons are Dangerous:** MathLive's reliance on a global private variable (`_globallyFocusedMathfield`) makes it extremely fragile in Single Page Applications (SPAs) where the page never truly refreshes. Explicit teardowns are mandatory.
