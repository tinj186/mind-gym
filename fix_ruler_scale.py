import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

# Fix targetX logic to remove Math.max
old_snap = """    if (isPerim && perimSides.length === 1) {
      const pathWidth = Math.max(200, perimSides[0] * 50);
      const targetX = -(pathWidth / 2) - 40; // -40 offset because the '0' tick is 40px inwards on the ruler"""
new_snap = """    if (isPerim && perimSides.length === 1) {
      const pathWidth = perimSides[0] * 50;
      const targetX = -(pathWidth / 2) - 40; // -40 offset because the '0' tick is 40px inwards on the ruler"""
content = content.replace(old_snap, new_snap)

# Fix Path Width to remove Math.max
old_path = """            {/* The Trail Path */}
            <div className="relative flex items-center" style={{ width: `${Math.max(200, perimeterSides[0] * 50)}px` }}>"""
new_path = """            {/* The Trail Path */}
            <div className="relative flex items-center" style={{ width: `${perimeterSides[0] * 50}px` }}>"""
content = content.replace(old_path, new_path)

# Remove scale transforms from Ruler
old_ruler_container = """            {/* Draggable Interactive Ruler */}
            <div 
              className={`absolute top-0 left-1/2 z-30 cursor-grab touch-none ${isDragging ? 'cursor-grabbing opacity-90 scale-105' : 'opacity-100 hover:scale-[1.02]'} transition-transform duration-75`}
              style={{ transform: `translate(${rulerPos.x}px, ${rulerPos.y}px)` }}"""

new_ruler_container = """            {/* Draggable Interactive Ruler */}
            <div 
              className={`absolute top-0 left-1/2 z-30 cursor-grab touch-none ${isDragging ? 'cursor-grabbing opacity-90' : 'opacity-100 hover:brightness-105'} transition-all duration-75`}
              style={{ transform: `translate(${rulerPos.x}px, ${rulerPos.y}px)` }}"""

content = content.replace(old_ruler_container, new_ruler_container)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
