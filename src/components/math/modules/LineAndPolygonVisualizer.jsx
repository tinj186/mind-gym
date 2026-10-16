import React, { useState } from 'react';
import { MousePointer2, Eraser } from 'lucide-react';

const LineAndPolygonVisualizer = ({ data }) => {
  const { polygons = [], showGrid = false, hideToolbar = false, drawMode = false, gridBounds = null, expectedLines = [], drawLabels = [] } = data;
  
  const width = 450;
  const height = 350;
  
  // Interactive state
  const [selectedTool, setSelectedTool] = useState(drawMode ? 'draw' : '1_arrow');
  const [userEdges, setUserEdges] = useState({}); // 'polyIdx-edgeIdx' -> '1_arrow', '2_arrow', '3_arrow'
  const [userVertices, setUserVertices] = useState({}); // 'polyIdx-vIdx' -> true

  // Drawing state
  const [userDrawnLines, setUserDrawnLines] = useState([]);
  const [drawingStart, setDrawingStart] = useState(null);
  const [mousePos, setMousePos] = useState(null);
  const [userLabels, setUserLabels] = useState({});

  const handleEdgeClick = (polyIdx, edgeIdx) => {
    if (hideToolbar && !drawMode) return;
    const key = `${polyIdx}-${edgeIdx}`;
    if (selectedTool && selectedTool.includes('arrow')) {
      setUserEdges(prev => ({ ...prev, [key]: selectedTool }));
    } else if (selectedTool === 'eraser') {
      setUserEdges(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleVertexClick = (polyIdx, vIdx) => {
    if (hideToolbar && !drawMode) return;
    const key = `${polyIdx}-${vIdx}`;
    if (selectedTool === 'perp') {
      setUserVertices(prev => ({ ...prev, [key]: true }));
    } else if (selectedTool === 'eraser') {
      setUserVertices(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Validation logic
  React.useEffect(() => {
    let isValid = true;
    
    polygons.forEach((poly, i) => {
      const { parallelPairs = [], perpendicularPairs = [] } = poly;
      
      // Check if user marked all required parallel pairs with the correct arrow counts
      parallelPairs.forEach(pair => {
        const eIdx = pair[0];
        const arrowCount = pair[1]; // 1, 2, or 3
        const expectedTool = `${arrowCount}_arrow`;
        if (userEdges[`${i}-${eIdx}`] !== expectedTool) {
          isValid = false;
        }
      });
      
      // Check if user marked all required perpendicular pairs
      perpendicularPairs.forEach(vIdx => {
        if (!userVertices[`${i}-${vIdx}`]) {
          isValid = false;
        }
      });
    });

    // Also check for extraneous/wrong markings
    Object.keys(userEdges).forEach(key => {
      const [polyIdx, edgeIdx] = key.split('-');
      const poly = polygons[parseInt(polyIdx)];
      if (!poly) return;
      const expectedPair = (poly.parallelPairs || []).find(p => p[0] === parseInt(edgeIdx));
      if (!expectedPair || `${expectedPair[1]}_arrow` !== userEdges[key]) {
        isValid = false;
      }
    });

    Object.keys(userVertices).forEach(key => {
      const [polyIdx, vIdx] = key.split('-');
      const poly = polygons[parseInt(polyIdx)];
      if (!poly) return;
      if (!(poly.perpendicularPairs || []).includes(parseInt(vIdx))) {
        isValid = false;
      }
    });
    
    // Default to true if there are no polygons or pairs to check
    const hasPairs = polygons.some(p => (p.parallelPairs && p.parallelPairs.length) || (p.perpendicularPairs && p.perpendicularPairs.length));
    
    if (drawMode) {
      if (userDrawnLines.length !== expectedLines.length) {
        isValid = false;
      } else {
        const allMatched = expectedLines.every(exp => {
          return userDrawnLines.some(user => {
            const m1 = user.p1.x === exp.p1.x && user.p1.y === exp.p1.y && user.p2.x === exp.p2.x && user.p2.y === exp.p2.y;
            const m2 = user.p1.x === exp.p2.x && user.p1.y === exp.p2.y && user.p2.x === exp.p1.x && user.p2.y === exp.p1.y;
            return m1 || m2;
          });
        });
        if (!allMatched) isValid = false;
      }

      if (data.expectedLabels && isValid) {
        const allLabelsMatch = Object.entries(data.expectedLabels).every(([lbl, expPt]) => {
          const userPt = userLabels[lbl];
          return userPt && userPt.x === expPt.x && userPt.y === expPt.y;
        });
        if (!allLabelsMatch) isValid = false;
      }

      window.__polygonMarkingsValid = isValid;
    } else {
      window.__polygonMarkingsValid = hasPairs ? isValid : true;
    }
    
    return () => {
      window.__polygonMarkingsValid = true;
    };
  }, [userEdges, userVertices, polygons, userDrawnLines, drawMode, expectedLines, userLabels, data.expectedLabels]);
  
  // Calculate bounding box
  let minX = gridBounds?.minX ?? Infinity;
  let minY = gridBounds?.minY ?? Infinity;
  let maxX = gridBounds?.maxX ?? -Infinity;
  let maxY = gridBounds?.maxY ?? -Infinity;
  
  if (!gridBounds) {
    let rawMinX = Infinity, rawMaxX = -Infinity, rawMinY = Infinity, rawMaxY = -Infinity;
    polygons.forEach(poly => {
      (poly.vertices || []).forEach(v => {
        rawMinX = Math.min(rawMinX, v.x);
        rawMinY = Math.min(rawMinY, v.y);
        rawMaxX = Math.max(rawMaxX, v.x);
        rawMaxY = Math.max(rawMaxY, v.y);
      });
    });
    (expectedLines || []).forEach(l => {
      [l.p1, l.p2].forEach(v => {
        if (!v) return;
        rawMinX = Math.min(rawMinX, v.x);
        rawMinY = Math.min(rawMinY, v.y);
        rawMaxX = Math.max(rawMaxX, v.x);
        rawMaxY = Math.max(rawMaxY, v.y);
      });
    });
    if (rawMinX !== Infinity) {
      minX = rawMinX - 40;
      minY = rawMinY - 40;
      maxX = rawMaxX + 40;
      maxY = rawMaxY + 40;
    }
  }
  
  if (minX === Infinity) {
    minX = 0; minY = 0; maxX = 300; maxY = 300;
  }
  
  const padding = 50;
  const rangeX = maxX - minX || 100;
  const rangeY = maxY - minY || 100;
  const maxRange = Math.max(rangeX, rangeY);
  const scale = (Math.min(width, height) - padding * 2) / maxRange;
  
  const transformPoint = (x, y) => {
    return {
      x: (x - minX) * scale + (width - rangeX * scale) / 2,
      y: (y - minY) * scale + (height - rangeY * scale) / 2
    };
  };

  const untransformPoint = (sx, sy) => {
    return {
      x: (sx - (width - rangeX * scale) / 2) / scale + minX,
      y: (sy - (height - rangeY * scale) / 2) / scale + minY
    };
  };

  const snapToGrid = (pt) => {
    return {
      x: Math.round(pt.x / 20) * 20,
      y: Math.round(pt.y / 20) * 20
    };
  };

  const handleSvgMouseMove = (e) => {
    if (selectedTool !== 'draw' && !selectedTool.startsWith('label_')) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const sx = (e.clientX - rect.left) * (width / rect.width);
    const sy = (e.clientY - rect.top) * (height / rect.height);
    const raw = untransformPoint(sx, sy);
    setMousePos(snapToGrid(raw));
  };

  const handleSvgClick = (e) => {
    if (!mousePos) return;

    if (selectedTool.startsWith('label_')) {
      const lbl = selectedTool.split('_')[1];
      setUserLabels(prev => ({ ...prev, [lbl]: mousePos }));
      return;
    }

    if (selectedTool !== 'draw') return;
    
    if (drawingStart) {
      if (drawingStart.x !== mousePos.x || drawingStart.y !== mousePos.y) {
        setUserDrawnLines(prev => [...prev, { p1: drawingStart, p2: mousePos }]);
      }
      setDrawingStart(null);
    } else {
      setDrawingStart(mousePos);
    }
  };

  const handleSvgMouseLeave = () => {
    setMousePos(null);
  };

  const handleDrawnLineClick = (idx, e) => {
    e.stopPropagation();
    if (selectedTool === 'eraser') {
      setUserDrawnLines(prev => prev.filter((_, i) => i !== idx));
    }
  };

  const renderArrowPath = (count, angle, ax, ay) => {
    return Array.from({ length: count }).map((_, aIdx) => {
      const offset = (aIdx - (count - 1) / 2) * 8;
      const x = ax + offset * Math.cos(angle);
      const y = ay + offset * Math.sin(angle);
      return (
        <path
          key={`arrow-${aIdx}`}
          d="M -6 -6 L 0 0 L -6 6"
          fill="none"
          stroke="#ef4444"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          transform={`translate(${x}, ${y}) rotate(${(angle * 180) / Math.PI})`}
          pointerEvents="none"
        />
      );
    });
  };

  return (
    <div className="w-full flex flex-col items-center p-4">
      {/* Interactive Toolbar */}
      {!hideToolbar && !drawMode && (
        <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-100 rounded-xl border border-slate-200">
          <button 
            onClick={() => setSelectedTool('1_arrow')} 
            className={`px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors ${selectedTool === '1_arrow' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <span className="text-red-500">➜</span> 1 Arrow
          </button>
          <button 
            onClick={() => setSelectedTool('2_arrow')} 
            className={`px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors ${selectedTool === '2_arrow' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <span className="text-red-500">⇛</span> 2 Arrows
          </button>
          <button 
            onClick={() => setSelectedTool('3_arrow')} 
            className={`px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors ${selectedTool === '3_arrow' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <span className="text-red-500 font-serif leading-none tracking-tighter">⇛<span className="-ml-1">›</span></span> 3 Arrows
          </button>
          <button 
            onClick={() => setSelectedTool('perp')} 
            className={`px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors ${selectedTool === 'perp' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <span className="text-red-500 text-lg leading-none">└</span> Perpendicular
          </button>
          <div className="w-px h-8 bg-slate-300 mx-1 self-center"></div>
          <button 
            onClick={() => setSelectedTool('eraser')} 
            className={`px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors ${selectedTool === 'eraser' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <Eraser size={16} /> Erase
          </button>
        </div>
      )}
      
      {drawMode && (
        <div className="flex flex-wrap gap-2 mb-4 p-2 bg-slate-100 rounded-xl border border-slate-200">
          <button 
            onClick={() => { setSelectedTool('draw'); setDrawingStart(null); }} 
            className={`px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors ${selectedTool === 'draw' ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <MousePointer2 size={16} /> Draw Line
          </button>
          {drawLabels && drawLabels.map(lbl => (
            <button 
              key={`tool-label-${lbl}`}
              onClick={() => { setSelectedTool(`label_${lbl}`); setDrawingStart(null); }} 
              className={`px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors ${selectedTool === `label_${lbl}` ? 'bg-purple-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
            >
              <span className="font-serif italic font-bold">Label {lbl}</span>
            </button>
          ))}
          <div className="w-px h-8 bg-slate-300 mx-1 self-center"></div>
          <button 
            onClick={() => { setSelectedTool('eraser'); setDrawingStart(null); }} 
            className={`px-3 py-2 rounded-lg flex items-center gap-1 font-bold text-sm transition-colors ${selectedTool === 'eraser' ? 'bg-rose-500 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
          >
            <Eraser size={16} /> Erase
          </button>
        </div>
      )}

      <div className="w-full max-w-[500px] aspect-[4/3] bg-white rounded-2xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] overflow-hidden relative touch-none select-none">
        <svg 
          width="100%" 
          height="100%" 
          viewBox={`0 0 ${width} ${height}`}
          onMouseMove={handleSvgMouseMove}
          onClick={handleSvgClick}
          onMouseLeave={handleSvgMouseLeave}
          className={selectedTool === 'draw' ? 'cursor-crosshair' : ''}
        >
          {showGrid && (
            <pattern 
              id="grid" 
              width={40 * scale} 
              height={40 * scale} 
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${(width - rangeX * scale) / 2 - minX * scale}, ${(height - rangeY * scale) / 2 - minY * scale})`}
            >
              <rect x={20 * scale} y={0} width={20 * scale} height={20 * scale} fill="#f1f5f9" />
              <rect x={0} y={20 * scale} width={20 * scale} height={20 * scale} fill="#f1f5f9" />
              <path d={`M 0 0 L ${40 * scale} 0 M 0 ${20 * scale} L ${40 * scale} ${20 * scale} M 0 0 L 0 ${40 * scale} M ${20 * scale} 0 L ${20 * scale} ${40 * scale}`} fill="none" stroke="#e5e7eb" strokeWidth="1"/>
            </pattern>
          )}
          {showGrid && (
            <pattern 
              id="majorGrid" 
              width={100 * scale} 
              height={100 * scale} 
              patternUnits="userSpaceOnUse"
              patternTransform={`translate(${(width - rangeX * scale) / 2 - minX * scale}, ${(height - rangeY * scale) / 2 - minY * scale})`}
            >
              <path d={`M ${100 * scale} 0 L 0 0 0 ${100 * scale}`} fill="none" stroke="#cbd5e1" strokeWidth="2"/>
            </pattern>
          )}
          {showGrid && <rect width="100%" height="100%" fill="url(#grid)" />}
          {showGrid && <rect width="100%" height="100%" fill="url(#majorGrid)" pointerEvents="none" />}
          
          {polygons.map((poly, i) => {
            const { vertices, parallelPairs = [], perpendicularPairs = [], strokeColor = "#3b82f6", fillColor = "rgba(59, 130, 246, 0.2)", isDashed = false, isOpen = false } = poly;
            
            if (!vertices || vertices.length < 2) return null;
            
            const pts = vertices.map(v => transformPoint(v.x, v.y));
            const pointsStr = pts.map(p => `${p.x},${p.y}`).join(' ');
            
            return (
              <g key={`poly-${i}`}>
                {/* Polygon Fill */}
                {!isOpen && <polygon points={pointsStr} fill={fillColor} stroke="none" />}

                {/* Edges & User Marked Parallel Arrows */}
                {pts.map((p1, edgeIdx) => {
                  if (isOpen && edgeIdx === pts.length - 1) return null;
                  const p2 = pts[(edgeIdx + 1) % pts.length];
                  const key = `${i}-${edgeIdx}`;
                  const markedTool = userEdges[key];
                  
                  return (
                    <g key={`edge-${i}-${edgeIdx}`}>
                      {/* Visible Edge */}
                      <line 
                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                        stroke={markedTool ? "#2563eb" : strokeColor} 
                        strokeWidth={markedTool ? "4" : "3"} 
                        strokeLinecap="round"
                        strokeDasharray={isDashed ? "8 8" : "none"}
                        pointerEvents="none"
                      />

                      {/* Clickable Invisible Hitbox */}
                      <line 
                        x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                        stroke="transparent" 
                        strokeWidth="20" 
                        className={hideToolbar ? "pointer-events-none" : `cursor-pointer hover:stroke-blue-200/50 transition-colors ${selectedTool && selectedTool.includes('arrow') || selectedTool === 'eraser' ? 'pointer-events-auto' : 'pointer-events-none'}`}
                        onClick={() => handleEdgeClick(i, edgeIdx)}
                      />

                      {/* Render User Arrow */}
                      {markedTool && markedTool.includes('arrow') && (
                        <g pointerEvents="none">
                          {renderArrowPath(parseInt(markedTool[0]), Math.atan2(p2.y - p1.y, p2.x - p1.x), (p1.x + p2.x) / 2, (p1.y + p2.y) / 2)}
                        </g>
                      )}
                    </g>
                  );
                })}

                {/* Vertices & User Marked Perpendicular Corners */}
                {pts.map((p2, vIdx) => {
                  if (isOpen && (vIdx === 0 || vIdx === pts.length - 1)) return null;
                  const key = `${i}-${vIdx}`;
                  const marked = userVertices[key];
                  
                  const p1 = pts[(vIdx - 1 + pts.length) % pts.length];
                  const p3 = pts[(vIdx + 1) % pts.length];
                  const d1 = { x: p1.x - p2.x, y: p1.y - p2.y };
                  const d2 = { x: p3.x - p2.x, y: p3.y - p2.y };
                  const l1 = Math.hypot(d1.x, d1.y);
                  const l2 = Math.hypot(d2.x, d2.y);
                  const size = 15;
                  const n1 = { x: (d1.x / l1) * size, y: (d1.y / l1) * size };
                  const n2 = { x: (d2.x / l2) * size, y: (d2.y / l2) * size };
                  const cornerPts = `${p2.x + n1.x},${p2.y + n1.y} ${p2.x + n1.x + n2.x},${p2.y + n1.y + n2.y} ${p2.x + n2.x},${p2.y + n2.y}`;

                  return (
                    <g key={`vert-${i}-${vIdx}`}>
                      {/* Render User Perpendicular Square */}
                      {marked && (
                        <polyline points={cornerPts} fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="miter" pointerEvents="none" />
                      )}
                      
                      {/* Clickable Invisible Hitbox on Vertex */}
                      <circle 
                        cx={p2.x} 
                        cy={p2.y} 
                        r="16" 
                        fill="transparent" 
                        className={hideToolbar ? "pointer-events-none" : `cursor-pointer hover:fill-red-200/50 transition-colors ${selectedTool === 'perp' || selectedTool === 'eraser' ? 'pointer-events-auto' : 'pointer-events-none'}`}
                        onClick={() => handleVertexClick(i, vIdx)}
                      />
                      
                      {/* Vertex Label */}
                      {poly.vertexLabels && poly.vertexLabels[vIdx] && (
                        (() => {
                          const cx = pts.reduce((sum, p) => sum + p.x, 0) / pts.length;
                          const cy = pts.reduce((sum, p) => sum + p.y, 0) / pts.length;
                          const vx = p2.x - cx;
                          const vy = p2.y - cy;
                          const len = Math.hypot(vx, vy) || 1;
                          const offset = 20;
                          return (
                            <text
                              x={(p2.x + (vx / len) * offset).toFixed(2)}
                              y={(p2.y + (vy / len) * offset).toFixed(2)}
                              fill="#1e293b"
                              fontSize="14"
                              fontWeight="bold"
                              textAnchor="middle"
                              alignmentBaseline="middle"
                              pointerEvents="none"
                            >
                              {poly.vertexLabels[vIdx]}
                            </text>
                          );
                        })()
                      )}
                    </g>
                  );
                })}

                {/* Polygon Label */}
                {poly.label && (
                  <text 
                    x={pts.reduce((sum, p) => sum + p.x, 0) / pts.length} 
                    y={Math.max(...pts.map(p => p.y)) + 25} 
                    fill={strokeColor} 
                    fontSize="16" 
                    fontWeight="bold" 
                    textAnchor="middle" 
                    alignmentBaseline="middle"
                    pointerEvents="none"
                  >
                    {poly.label}
                  </text>
                )}

              </g>
            );
          })}
          {/* User Drawn Lines */}
          {userDrawnLines.map((line, idx) => {
            const p1 = transformPoint(line.p1.x, line.p1.y);
            const p2 = transformPoint(line.p2.x, line.p2.y);
            const colors = ["#ef4444", "#8b5cf6", "#f59e0b", "#10b981"];
            const strokeColor = colors[idx % colors.length];
            return (
              <g key={`drawn-${idx}`}>
                <line 
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                  stroke={strokeColor} 
                  strokeWidth="3" 
                  strokeLinecap="round" 
                  pointerEvents="none"
                />
                <line 
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} 
                  stroke="transparent" 
                  strokeWidth="20" 
                  className={selectedTool === 'eraser' ? "cursor-pointer hover:stroke-rose-200/50" : "pointer-events-none"}
                  onClick={(e) => handleDrawnLineClick(idx, e)}
                />
                <circle cx={p1.x} cy={p1.y} r={4} fill={strokeColor} pointerEvents="none" />
                <circle cx={p2.x} cy={p2.y} r={4} fill={strokeColor} pointerEvents="none" />
              </g>
            );
          })}

          {/* User Placed Labels */}
          {Object.entries(userLabels).map(([lbl, pos]) => {
            const pt = transformPoint(pos.x, pos.y);
            return (
              <g 
                key={`user-label-${lbl}`} 
                onClick={() => {
                  if (selectedTool === 'eraser') {
                    setUserLabels(prev => {
                      const next = { ...prev };
                      delete next[lbl];
                      return next;
                    });
                  }
                }}
                className={selectedTool === 'eraser' ? 'cursor-pointer hover:opacity-50' : ''}
              >
                <circle cx={pt.x} cy={pt.y} r={5} fill="#8b5cf6" />
                <rect x={pt.x + 8} y={pt.y - 28} width={24} height={24} rx={6} fill="#ffffff" stroke="#cbd5e1" strokeWidth={2} />
                <text x={pt.x + 20} y={pt.y - 15} fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle" alignmentBaseline="central">
                  {lbl}
                </text>
              </g>
            );
          })}
          
          {/* Drawing Preview */}
          {selectedTool === 'draw' && drawingStart && mousePos && (
            <line
              x1={transformPoint(drawingStart.x, drawingStart.y).x}
              y1={transformPoint(drawingStart.x, drawingStart.y).y}
              x2={transformPoint(mousePos.x, mousePos.y).x}
              y2={transformPoint(mousePos.x, mousePos.y).y}
              stroke="#ef4444"
              strokeWidth="3"
              strokeDasharray="5,5"
              pointerEvents="none"
              opacity="0.5"
            />
          )}
          {(selectedTool === 'draw' || selectedTool.startsWith('label_')) && mousePos && (
             <circle 
               cx={transformPoint(mousePos.x, mousePos.y).x} 
               cy={transformPoint(mousePos.x, mousePos.y).y} 
               r={selectedTool.startsWith('label_') ? 8 : 5} 
               fill={selectedTool.startsWith('label_') ? "#8b5cf6" : "#ef4444"} 
               pointerEvents="none" 
               opacity="0.5" 
             />
          )}
        </svg>
      </div>
    </div>
  );
};

export default LineAndPolygonVisualizer;
