import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

old_snap = """    if (isPerim && perimSides.length === 1) {
      const pathWidth = perimSides[0] * 50;
      const targetX = -(pathWidth / 2) - 40; // -40 offset because the '0' tick is 40px inwards on the ruler
      const targetY = 135; // Snap the ruler just BELOW the path
      
      const dist = Math.sqrt(Math.pow(currentPos.current.x - targetX, 2) + Math.pow(currentPos.current.y - targetY, 2));
      if (dist < 80) { // 80px snap radius
        setRulerPos({ x: targetX, y: targetY });
        currentPos.current = { x: targetX, y: targetY };
      }
    }"""

new_snap = """    if (isPerim && perimSides.length === 1) {
      const pathWidth = perimSides[0] * 50;
      const startDotX = -(pathWidth / 2);
      const targetY = 135; // Snap the ruler just BELOW the path
      
      // All possible visual marks on the ruler that can snap to the Start Dot
      const maxTicks = perimSides[0] + 3;
      const validOffsets = [0]; // Left-most edge of the ruler
      for (let i = 0; i < maxTicks; i++) {
        validOffsets.push(40 + i * 50); // Each cm tick mark (0, 1, 2...)
      }

      let closestX = currentPos.current.x;
      let minDistance = 60; // Slightly tighter snap radius since there are many snap points
      let didSnap = false;

      // Check which ruler offset is closest to the Start Dot
      for (const offset of validOffsets) {
        const potentialTargetX = startDotX - offset;
        const dist = Math.sqrt(Math.pow(currentPos.current.x - potentialTargetX, 2) + Math.pow(currentPos.current.y - targetY, 2));
        if (dist < minDistance) {
          minDistance = dist;
          closestX = potentialTargetX;
          didSnap = true;
        }
      }

      if (didSnap) {
        setRulerPos({ x: closestX, y: targetY });
        currentPos.current = { x: closestX, y: targetY };
      }
    }"""

content = content.replace(old_snap, new_snap)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
