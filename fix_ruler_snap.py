import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

# Fix snapping targetY
old_snap = """    if (isPerim && perimSides.length === 1) {
      const pathWidth = Math.max(200, perimSides[0] * 50);
      const targetX = -(pathWidth / 2) - 40; // -40 offset because the '0' tick is 40px inwards on the ruler
      const targetY = 90; // Approximate Y offset so the tick lines touch the path"""

new_snap = """    if (isPerim && perimSides.length === 1) {
      const pathWidth = Math.max(200, perimSides[0] * 50);
      const targetX = -(pathWidth / 2) - 40; // -40 offset because the '0' tick is 40px inwards on the ruler
      const targetY = 135; // Snap the ruler just BELOW the path"""

content = content.replace(old_snap, new_snap)

# Move ticks to the top of the ruler
old_ruler = """              <div className="relative bg-[#fdd835]/60 backdrop-blur-sm border-2 border-[#f57f17] shadow-xl flex items-end shadow-slate-900/30 rounded-sm"
                   style={{ width: `${Math.max(300, (perimeterSides[0] + 3) * 50)}px`, height: '50px' }}>
                <span className="absolute top-1 left-2 text-[10px] font-black text-slate-700/60 uppercase">cm</span>
                {Array.from({ length: perimeterSides[0] + 3 }).map((_, i) => (
                  <div key={i} className="absolute flex flex-col items-center bottom-0" style={{ left: `${(i) * 50 + 40}px`, transform: 'translateX(-50%)' }}>
                    <div className="w-[1.5px] h-4 bg-slate-900"></div>
                    <span className="text-[12px] font-bold text-slate-900 mb-1">{i}</span>
                  </div>
                ))}
              </div>"""

new_ruler = """              <div className="relative bg-[#fdd835]/60 backdrop-blur-sm border-2 border-[#f57f17] shadow-xl flex items-start shadow-slate-900/30 rounded-sm"
                   style={{ width: `${Math.max(300, (perimeterSides[0] + 3) * 50)}px`, height: '50px' }}>
                <span className="absolute bottom-1 left-2 text-[10px] font-black text-slate-700/60 uppercase">cm</span>
                {Array.from({ length: perimeterSides[0] + 3 }).map((_, i) => (
                  <div key={i} className="absolute flex flex-col items-center top-0" style={{ left: `${(i) * 50 + 40}px`, transform: 'translateX(-50%)' }}>
                    <div className="w-[1.5px] h-4 bg-slate-900"></div>
                    <span className="text-[12px] font-bold text-slate-900 mt-1">{i}</span>
                  </div>
                ))}
              </div>"""

content = content.replace(old_ruler, new_ruler)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
