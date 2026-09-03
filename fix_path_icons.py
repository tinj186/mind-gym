import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

old_code = """          <span className="text-slate-400 font-bold uppercase tracking-widest text-lg px-2 text-center">
            {data.items?.[0]?.label || "Path"}
          </span>
          
          {/* Top Side */}"""

new_code = """          <span className="text-slate-400 font-bold uppercase tracking-widest text-lg px-2 text-center">
            {data.items?.[0]?.label || "Path"}
          </span>
          
          {perimeterSides.length === 1 && (
            <>
              <div className="absolute -left-12 text-4xl -translate-y-1/2 top-1/2 drop-shadow-md">🏁</div>
              <div className="absolute -right-12 text-4xl -translate-y-1/2 top-1/2 drop-shadow-md">📍</div>
            </>
          )}

          {/* Top Side */}"""

content = content.replace(old_code, new_code)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
