import re

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'r') as f:
    content = f.read()

old_bg = """              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] min-w-[300px] h-[240px] bg-[#dcedc8] rounded-[3rem] border-4 border-[#aed581] -z-10 shadow-inner overflow-hidden">
                <div className="absolute top-6 left-8 text-4xl opacity-80 drop-shadow-sm">🌲</div>
                <div className="absolute bottom-8 left-[30%] text-3xl opacity-80 drop-shadow-sm">🌳</div>
                <div className="absolute top-8 right-[25%] text-5xl opacity-50 drop-shadow-sm">☁️</div>
                <div className="absolute bottom-6 right-10 text-4xl opacity-80 drop-shadow-sm">🌲</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[8rem] opacity-10 rotate-12 select-none pointer-events-none">🗺️</div>
                <div className="absolute bottom-4 left-[60%] text-2xl opacity-60">🦆</div>
              </div>"""

new_bg = """              {/* SVG Topographic Map Background Layer */}
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
              </div>"""

content = content.replace(old_bg, new_bg)

with open('/Users/jwoshiteng/Downloads/mind-gym/src/components/math/modules/MeasurementRuler.jsx', 'w') as f:
    f.write(content)

print("Done")
