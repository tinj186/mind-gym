import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

old_return = """    return (
      <div className={`${containerStyle} flex flex-col items-center justify-center py-20`}>
        <div className="relative border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50"
             style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}>
          <span className="text-slate-400 font-bold uppercase tracking-widest text-lg px-2 text-center">
            {data.items?.[0]?.label || "Path"}
          </span>
          
          {perimeterSides.length === 1 && (
            <>
              {/* Map Background Layer */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] min-w-[300px] h-[240px] bg-[#eef2f3] rounded-[3rem] border-4 border-slate-300 -z-10 shadow-inner overflow-hidden flex items-center justify-center">
                {/* Topographic SVG Pattern */}
                <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="topography" width="60" height="60" patternUnits="userSpaceOnUse">
                      <path d="M0 30 Q15 15, 30 30 T60 30" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                      <path d="M0 45 Q15 30, 30 45 T60 45" fill="none" stroke="#0f172a" strokeWidth="1" />
                      <path d="M0 15 Q15 0, 30 15 T60 15" fill="none" stroke="#0f172a" strokeWidth="1" />
                      <path d="M15 0 Q30 15, 45 0" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                      <path d="M15 60 Q30 45, 45 60" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#topography)" />
                </svg>
                {/* Map Compass/Grid aesthetics */}
                <div className="absolute top-4 left-6 border-l-2 border-t-2 border-slate-400 w-6 h-6 opacity-40"></div>
                <div className="absolute bottom-4 right-6 border-r-2 border-b-2 border-slate-400 w-6 h-6 opacity-40"></div>
                <div className="absolute top-6 right-8 text-slate-400 font-mono text-xs font-bold opacity-60 tracking-widest">N 1°18'</div>
                <div className="absolute bottom-6 left-8 text-slate-400 font-mono text-xs font-bold opacity-60 tracking-widest">E 103°51'</div>
              </div>
              <div className="absolute -left-12 text-4xl -translate-y-1/2 top-1/2 drop-shadow-md z-10">🏁</div>
              <div className="absolute -right-12 text-4xl -translate-y-1/2 top-1/2 drop-shadow-md z-10">📍</div>
            </>
          )}

          {/* Top Side */}
          {perimeterSides.length >= 1 && (
            <div className="absolute -top-[30px] left-0 w-full flex justify-center">
              {renderRulerSegment(perimeterSides[0], false)}
            </div>
          )}
          {/* Right Side */}
          {perimeterSides.length >= 2 && (
            <div className="absolute top-0 -right-[30px] h-full flex flex-col justify-center">
              {renderRulerSegment(perimeterSides[1], true)}
            </div>
          )}
          {/* Bottom Side */}
          {perimeterSides.length >= 3 && (
            <div className="absolute -bottom-[30px] left-0 w-full flex justify-center">
              {renderRulerSegment(perimeterSides[2], false)}
            </div>
          )}
          {/* Left Side */}
          {perimeterSides.length === 4 && (
            <div className="absolute top-0 -left-[30px] h-full flex flex-col justify-center">
              {renderRulerSegment(perimeterSides[3], true)}
            </div>
          )}
        </div>
      </div>
    );"""

new_return = """    return (
      <div className={`${containerStyle} flex flex-col items-center justify-center py-10 relative`}>
        {perimeterSides.length === 1 ? (
          <div className="relative w-full max-w-[85%] h-[260px] bg-[#eef2f3] rounded-[3rem] border-4 border-slate-300 shadow-inner overflow-hidden flex items-center justify-center">
            {/* Topographic SVG Pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="topography" width="60" height="60" patternUnits="userSpaceOnUse">
                  <path d="M0 30 Q15 15, 30 30 T60 30" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                  <path d="M0 45 Q15 30, 30 45 T60 45" fill="none" stroke="#0f172a" strokeWidth="1" />
                  <path d="M0 15 Q15 0, 30 15 T60 15" fill="none" stroke="#0f172a" strokeWidth="1" />
                  <path d="M15 0 Q30 15, 45 0" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                  <path d="M15 60 Q30 45, 45 60" fill="none" stroke="#0f172a" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#topography)" />
            </svg>
            
            {/* Map Compass/Grid aesthetics */}
            <div className="absolute top-4 left-6 border-l-4 border-t-4 border-slate-400 w-8 h-8 opacity-40 rounded-tl-lg"></div>
            <div className="absolute bottom-4 right-6 border-r-4 border-b-4 border-slate-400 w-8 h-8 opacity-40 rounded-br-lg"></div>
            <div className="absolute top-6 right-8 text-slate-400 font-mono text-sm font-bold opacity-60 tracking-widest">N 1°18'</div>
            <div className="absolute bottom-6 left-8 text-slate-400 font-mono text-sm font-bold opacity-60 tracking-widest">E 103°51'</div>
            <div className="absolute bottom-8 right-[30%] text-5xl opacity-40 drop-shadow-sm">🌲</div>
            <div className="absolute top-10 left-[20%] text-6xl opacity-30 drop-shadow-sm">☁️</div>

            {/* The Trail Path */}
            <div className="relative flex items-center" style={{ width: `${Math.max(300, perimeterSides[0] * 50)}px` }}>
              <div className="absolute inset-0 top-1/2 -translate-y-1/2 border-t-8 border-dashed border-slate-600/60 drop-shadow-sm"></div>
              
              <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">🏁</div>
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 text-5xl bg-white/80 rounded-full p-2 shadow-lg z-20 border-2 border-slate-200">📍</div>
              
              {/* Distance Markers */}
              <div className="absolute top-0 left-0 w-full h-full flex items-center">
                {Array.from({ length: perimeterSides[0] + 1 }).map((_, i) => (
                  <div key={i} className="absolute flex flex-col items-center" style={{ left: `${(i / perimeterSides[0]) * 100}%`, transform: 'translateX(-50%)' }}>
                    <div className="w-1.5 h-6 bg-slate-800 rounded-full shadow-sm z-10"></div>
                    <div className="mt-2 text-sm font-black text-slate-800 bg-white/90 px-2 py-0.5 rounded-lg shadow-sm border border-slate-200">{i}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-black tracking-widest text-slate-800 bg-white/80 px-6 py-2 rounded-xl border-2 border-slate-200 shadow-sm uppercase">{data.items?.[0]?.label || "Distance"}</div>
          </div>
        ) : (
          <div className="relative border-4 border-dashed border-slate-300 rounded-2xl flex items-center justify-center bg-slate-50"
               style={{ width: `${frameWidth}px`, height: `${frameHeight}px` }}>
            <span className="text-slate-400 font-bold uppercase tracking-widest text-lg px-2 text-center">
              {data.items?.[0]?.label || "Path"}
            </span>
            
            {/* Top Side */}
            {perimeterSides.length >= 2 && (
              <div className="absolute -top-[30px] left-0 w-full flex justify-center">
                {renderRulerSegment(perimeterSides[0], false)}
              </div>
            )}
            {/* Right Side */}
            {perimeterSides.length >= 2 && (
              <div className="absolute top-0 -right-[30px] h-full flex flex-col justify-center">
                {renderRulerSegment(perimeterSides[1], true)}
              </div>
            )}
            {/* Bottom Side */}
            {perimeterSides.length >= 3 && (
              <div className="absolute -bottom-[30px] left-0 w-full flex justify-center">
                {renderRulerSegment(perimeterSides[2], false)}
              </div>
            )}
            {/* Left Side */}
            {perimeterSides.length === 4 && (
              <div className="absolute top-0 -left-[30px] h-full flex flex-col justify-center">
                {renderRulerSegment(perimeterSides[3], true)}
              </div>
            )}
          </div>
        )}
      </div>
    );"""

content = content.replace(old_return, new_return)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
