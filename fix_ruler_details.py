import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

# Fix initial state (lower right corner)
old_state = """  const [rulerPos, setRulerPos] = useState({ x: -100, y: 150 }); 
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: -100, y: 150 });"""

new_state = """  const [rulerPos, setRulerPos] = useState({ x: 150, y: 180 }); 
  const [isDragging, setIsDragging] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const currentPos = useRef({ x: 150, y: 180 });"""
content = content.replace(old_state, new_state)

# Replace CM with KM
old_cm = '<span className="absolute bottom-1 left-2 text-[10px] font-black text-slate-700/60 uppercase">cm</span>'
new_cm = '<span className="absolute bottom-1 left-2 text-[10px] font-black text-slate-700/60 uppercase">km</span>'
content = content.replace(old_cm, new_cm)

# Dynamic decorations based on mapTheme
old_decor = """            <div className="absolute bottom-8 right-[30%] text-5xl opacity-40 drop-shadow-sm">🌲</div>
            <div className="absolute top-10 left-[20%] text-6xl opacity-30 drop-shadow-sm">☁️</div>"""

new_decor = """            {data.mapTheme === 'park' && (
              <>
                <div className="absolute bottom-8 right-[30%] text-5xl opacity-40 drop-shadow-sm">🌲</div>
                <div className="absolute top-10 left-[20%] text-6xl opacity-30 drop-shadow-sm">☁️</div>
                <div className="absolute top-4 right-[15%] text-4xl opacity-30 drop-shadow-sm">🌳</div>
              </>
            )}
            {data.mapTheme === 'river' && (
              <>
                <div className="absolute bottom-12 right-[20%] text-5xl opacity-50 drop-shadow-sm">🦆</div>
                <div className="absolute top-12 left-[15%] text-6xl opacity-40 drop-shadow-sm">🛶</div>
                <div className="absolute bottom-6 left-[30%] text-5xl opacity-30 drop-shadow-sm">🐸</div>
              </>
            )}
            {data.mapTheme === 'road' && (
              <>
                <div className="absolute bottom-8 right-[25%] text-5xl opacity-40 drop-shadow-sm">🚗</div>
                <div className="absolute top-10 left-[20%] text-5xl opacity-40 drop-shadow-sm">🏢</div>
                <div className="absolute top-6 right-[15%] text-4xl opacity-30 drop-shadow-sm">🚦</div>
              </>
            )}
            {(!data.mapTheme || data.mapTheme === 'park') && (
              <div className="absolute bottom-8 left-[10%] text-4xl opacity-30 drop-shadow-sm">🦆</div>
            )}"""
content = content.replace(old_decor, new_decor)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
