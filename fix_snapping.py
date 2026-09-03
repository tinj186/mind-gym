import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

# Replace handlePointerUp
old_pointer = """  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);
  };"""

new_pointer = """  const handlePointerUp = (e) => {
    setIsDragging(false);
    e.target.releasePointerCapture(e.pointerId);

    // Snap Logic for 1-Sided Map Path
    const isPerim = data?.isPerimeter === true || data?.isPerimeter === "true";
    let perimSides = [];
    if (Array.isArray(data?.sides)) { perimSides = data.sides.map(Number); }
    else if (typeof data?.sides === 'string') { perimSides = data.sides.replace(/[\[\]]/g, '').split(',').map(s => parseInt(s.trim())); }
    
    if (isPerim && perimSides.length === 1) {
      const pathWidth = Math.max(200, perimSides[0] * 50);
      const targetX = -(pathWidth / 2) - 40; // -40 offset because the '0' tick is 40px inwards on the ruler
      const targetY = 90; // Approximate Y offset so the tick lines touch the path
      
      const dist = Math.sqrt(Math.pow(currentPos.current.x - targetX, 2) + Math.pow(currentPos.current.y - targetY, 2));
      if (dist < 80) { // 80px snap radius
        setRulerPos({ x: targetX, y: targetY });
        currentPos.current = { x: targetX, y: targetY };
      }
    }
  };"""

content = content.replace(old_pointer, new_pointer)

# Replace Map points to add exact red dot markers
old_map_points = """              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">🏁</div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">📍</div>"""

new_map_points = """              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">🏁</div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">📍</div>
              {/* Exact Coordinate Markers */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm z-30 border-2 border-white -translate-x-1/2 ring-2 ring-red-500/30"></div>
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-red-500 rounded-full shadow-sm z-30 border-2 border-white translate-x-1/2 ring-2 ring-red-500/30"></div>"""

content = content.replace(old_map_points, new_map_points)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
