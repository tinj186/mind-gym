import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

old_code = """          {perimeterSides.length === 1 && (
            <>
              <div className="absolute -left-12 text-4xl -translate-y-1/2 top-1/2 drop-shadow-md">🏁</div>
              <div className="absolute -right-12 text-4xl -translate-y-1/2 top-1/2 drop-shadow-md">📍</div>
            </>
          )}"""

new_code = """          {perimeterSides.length === 1 && (
            <>
              {/* Map Background Layer */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] min-w-[300px] h-[240px] bg-[#dcedc8] rounded-[3rem] border-4 border-[#aed581] -z-10 shadow-inner overflow-hidden">
                <div className="absolute top-6 left-8 text-4xl opacity-80 drop-shadow-sm">🌲</div>
                <div className="absolute bottom-8 left-[30%] text-3xl opacity-80 drop-shadow-sm">🌳</div>
                <div className="absolute top-8 right-[25%] text-5xl opacity-50 drop-shadow-sm">☁️</div>
                <div className="absolute bottom-6 right-10 text-4xl opacity-80 drop-shadow-sm">🌲</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] opacity-10 rotate-12 select-none pointer-events-none">🗺️</div>
                <div className="absolute bottom-4 left-[60%] text-2xl opacity-60">🦆</div>
              </div>
              <div className="absolute -left-12 text-4xl -translate-y-1/2 top-1/2 drop-shadow-md z-10">🏁</div>
              <div className="absolute -right-12 text-4xl -translate-y-1/2 top-1/2 drop-shadow-md z-10">📍</div>
            </>
          )}"""

content = content.replace(old_code, new_code)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
