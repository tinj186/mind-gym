import React from 'react';

const AngleVisualizer = ({ data }) => {
  if (!data) return null;

  // Render different SVGs based on data payload
  
  if (data.shapeName !== undefined) {
    // 1. foundation_classifying_polygon (Irregular polygon with visual angle markings)
    return <PolygonVisualizer data={data} />;
  }
  
  if (data.word) {
    // 2. foundation_capital_letters
    return <WordVisualizer data={data} />;
  }
  
  if (data.otherType) {
    // 3. foundation_comparing_categories (Star-like or complex shape with distinct colored markings)
    return <ComparingCategoriesVisualizer data={data} />;
  }
  
  if (data.cutRectangle) {
    // 4. advanced_corner_cut
    return <CutRectangleVisualizer />;
  }
  
  if (data.outer && data.inner && data.count) {
    // 5. advanced_shapes_inside_shapes
    return <ShapesInsideShapesVisualizer data={data} />;
  }
  
  if (data.overlappingRectangles) {
    // 6. advanced_overlapping_rectangles (plus shape)
    return <OverlappingRectanglesVisualizer />;
  }
  
  if (data.foldedCorner) {
    // 7. advanced_folded_corner
    return <FoldedCornerVisualizer />;
  }

  if (data.lines) {
    return <SubdividedRectangleVisualizer data={data} />;
  }

  if (data.squares) {
    return <GridSquaresVisualizer data={data} />;
  }

  if (data.path) {
    return <GridPathVisualizer data={data} />;
  }

  if (data.shapeA && data.shapeB) {
    return <DeductiveTotalsVisualizer data={data} />;
  }

  if (data.dynamicShapeA && data.dynamicShapeB) {
    return <DeductiveTotalsVisualizer data={data} />;
  }

  return (
    <div className="flex justify-center items-center p-4">
      <p className="text-sm text-slate-500">Angle Visualizer (Fallback)</p>
    </div>
  );
};

// ----------------------------------------------------------------------------
// Sub-components for specific variants
// ----------------------------------------------------------------------------

const PolygonVisualizer = ({ data }) => {
  // Irregular polygon with markings
  let points = "";
  if (data.shapeName.includes('pentagon')) {
    points = "50,10 90,40 70,90 30,90 10,40";
  } else if (data.shapeName.includes('hexagon')) {
    points = "30,10 70,10 90,50 70,90 30,90 10,50";
  } else if (data.shapeName.includes('quadrilateral') || data.shapeName.includes('kite')) {
    points = "50,10 90,50 50,90 10,50"; // Kite shape
  } else {
    points = "50,10 90,40 70,90 30,90 10,40"; // Default
  }

  // A very simplified representation: Just drawing the polygon
  // Ideally, actual markings for angles are drawn via SVG arcs or squares
  // For the sake of P3 syllabus, a clear geometric shape outline.
  return (
    <div className="flex justify-center items-center p-8">
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-md">
        <polygon points={points} fill="rgba(100,150,250,0.15)" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Decorative corner markers could go here */}
      </svg>
    </div>
  );
};

const WordVisualizer = ({ data }) => {
  const letterData = {
    E: {
      lines: [[20,10, 20,90], [20,10, 80,10], [20,50, 70,50], [20,90, 80,90]],
      right: [{x:20,y:10, dx1:1,dy1:0, dx2:0,dy2:1}, {x:20,y:50, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:20,y:50, dx1:1,dy1:0, dx2:0,dy2:1}, {x:20,y:90, dx1:1,dy1:0, dx2:0,dy2:-1}],
      acute: [], obtuse: []
    },
    T: {
      lines: [[20,10, 80,10], [50,10, 50,90]],
      right: [{x:50,y:10, dx1:-1,dy1:0, dx2:0,dy2:1}, {x:50,y:10, dx1:1,dy1:0, dx2:0,dy2:1}],
      acute: [], obtuse: []
    },
    L: {
      lines: [[20,10, 20,90], [20,90, 80,90]],
      right: [{x:20,y:90, dx1:1,dy1:0, dx2:0,dy2:-1}],
      acute: [], obtuse: []
    },
    H: {
      lines: [[20,10, 20,90], [80,10, 80,90], [20,50, 80,50]],
      right: [{x:20,y:50, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:20,y:50, dx1:1,dy1:0, dx2:0,dy2:1}, {x:80,y:50, dx1:-1,dy1:0, dx2:0,dy2:-1}, {x:80,y:50, dx1:-1,dy1:0, dx2:0,dy2:1}],
      acute: [], obtuse: []
    },
    F: {
      lines: [[20,10, 20,90], [20,10, 80,10], [20,50, 70,50]],
      right: [{x:20,y:10, dx1:1,dy1:0, dx2:0,dy2:1}, {x:20,y:50, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:20,y:50, dx1:1,dy1:0, dx2:0,dy2:1}],
      acute: [], obtuse: []
    },
    A: {
      lines: [[50,10, 20,90], [50,10, 80,90], [35,50, 65,50]],
      right: [],
      acute: [{x:50,y:10, a1:69.4, a2:110.5, size: 28}, {x:35,y:50, a1:290.5, a2:360}, {x:65,y:50, a1:180, a2:249.4}],
      obtuse: [{x:35,y:50, a1:0, a2:110.5}, {x:65,y:50, a1:69.4, a2:180}]
    },
    X: {
      lines: [[20,10, 80,90], [80,10, 20,90]],
      right: [],
      acute: [{x:50,y:50, a1:233.1, a2:306.9, size: 20}, {x:50,y:50, a1:53.1, a2:126.9, size: 20}],
      obtuse: [{x:50,y:50, a1:126.9, a2:233.1, size: 20}, {x:50,y:50, a1:306.9, a2:413.1, size: 20}]
    },
    Y: {
      lines: [[20,10, 50,50], [80,10, 50,50], [50,50, 50,90]],
      right: [],
      acute: [{x:50,y:50, a1:233.1, a2:306.9, size: 20}],
      obtuse: [{x:50,y:50, a1:90, a2:233.1, size: 16}, {x:50,y:50, a1:306.9, a2:450, size: 16}]
    }
  };

  const drawRight = (p, i) => {
    const size = p.size || 16;
    const p1x = p.x + p.dx1 * size;
    const p1y = p.y + p.dy1 * size;
    const p2x = p.x + p.dx2 * size;
    const p2y = p.y + p.dy2 * size;
    const px = p.x + p.dx1 * size + p.dx2 * size;
    const py = p.y + p.dy1 * size + p.dy2 * size;
    return <polyline key={`r-${i}`} points={`${p1x},${p1y} ${px},${py} ${p2x},${p2y}`} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinejoin="round" />
  };

  const drawArc = (p, i) => {
    const size = p.size || 18;
    const rad1 = p.a1 * Math.PI / 180;
    const rad2 = p.a2 * Math.PI / 180;
    const pt1x = p.x + size * Math.cos(rad1);
    const pt1y = p.y + size * Math.sin(rad1);
    const pt2x = p.x + size * Math.cos(rad2);
    const pt2y = p.y + size * Math.sin(rad2);
    return <path key={`a-${i}`} d={`M ${pt1x},${pt1y} A ${size} ${size} 0 0 1 ${pt2x},${pt2y}`} fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
  };

  return (
    <div className="flex justify-center items-center p-8 space-x-6 flex-wrap">
      {data.word.split('').map((char, index) => {
        const d = letterData[char];
        if (!d) return <span key={index} className="text-7xl font-mono font-bold text-slate-700 tracking-widest drop-shadow-sm">{char}</span>;
        
        return (
          <svg key={index} viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-sm">
            {/* Draw angle markers first so they sit cleanly under the thick letter strokes */}
            {d.right.map((p, i) => drawRight(p, i))}
            {d.acute.map((p, i) => drawArc(p, i))}
            {d.obtuse.map((p, i) => drawArc(p, i))}
            {/* Draw the letter strokes over the markers */}
            {d.lines.map((l, i) => (
              <line key={`l-${i}`} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#334155" strokeWidth="8" strokeLinecap="round" />
            ))}
          </svg>
        );
      })}
    </div>
  );
};

const ComparingCategoriesVisualizer = ({ data }) => {
  // Complex polygon (e.g. star) to represent different categories
  return (
    <div className="flex justify-center items-center p-8">
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-md">
        <polygon points="50,5 61,35 95,35 68,57 79,90 50,70 21,90 32,57 5,35 39,35" fill="rgba(250,150,100,0.15)" stroke="#f97316" strokeWidth="2.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const CutRectangleVisualizer = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-md">
        <polygon points="10,10 90,10 90,60 60,90 10,90" fill="rgba(100,200,150,0.15)" stroke="#10b981" strokeWidth="2.5" strokeLinejoin="round" />
        <line x1="90" y1="60" x2="60" y2="90" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" />
      </svg>
    </div>
  );
};

const ShapesInsideShapesVisualizer = ({ data }) => {
  // e.g., squares inside a hexagon
  return (
    <div className="flex justify-center items-center p-8 relative w-48 h-48 mx-auto">
      <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-md">
        <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="#64748b" strokeWidth="2" />
        
        {/* Draw a few inner shapes manually as representation */}
        {[...Array(Math.min(data.count, 6))].map((_, i) => {
          const angle = (i * 2 * Math.PI) / Math.min(data.count, 6);
          const cx = 50 + 20 * Math.cos(angle);
          const cy = 50 + 20 * Math.sin(angle);
          if (data.inner === 'square' || data.inner === 'rectangle') {
            return <rect key={i} x={cx - 5} y={cy - 5} width="10" height="10" fill="rgba(100,150,250,0.4)" stroke="#3b82f6" strokeWidth="1" />;
          } else {
            return <polygon key={i} points={`${cx},${cy-6} ${cx+6},${cy+4} ${cx-6},${cy+4}`} fill="rgba(250,150,100,0.4)" stroke="#f97316" strokeWidth="1" />;
          }
        })}
      </svg>
    </div>
  );
};

const OverlappingRectanglesVisualizer = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <svg viewBox="0 0 100 100" className="w-48 h-48 drop-shadow-md">
        {/* Plus sign boundary */}
        <polygon points="35,10 65,10 65,35 90,35 90,65 65,65 65,90 35,90 35,65 10,65 10,35 35,35" fill="rgba(200,100,250,0.15)" stroke="#a855f7" strokeWidth="2.5" strokeLinejoin="miter" />
        {/* Marking one of the outer right angles as an example */}
        <rect x="59" y="10" width="6" height="6" fill="none" stroke="#ef4444" strokeWidth="1.5" />
      </svg>
    </div>
  );
};

const SubdividedRectangleVisualizer = ({ data }) => {
  const drawRight = (p, i) => {
    const size = p.size || 4;
    const p1x = p.x + p.dx1 * size;
    const p1y = p.y + p.dy1 * size;
    const p2x = p.x + p.dx2 * size;
    const p2y = p.y + p.dy2 * size;
    const px = p.x + p.dx1 * size + p.dx2 * size;
    const py = p.y + p.dy1 * size + p.dy2 * size;
    return <polyline key={`r-${i}`} points={`${p1x},${p1y} ${px},${py} ${p2x},${p2y}`} fill="none" stroke="#ef4444" strokeWidth="1" strokeLinejoin="round" />
  };

  const drawArc = (p, i) => {
    const size = p.size || 4;
    const rad1 = p.a1 * Math.PI / 180;
    const rad2 = p.a2 * Math.PI / 180;
    const pt1x = p.x + size * Math.cos(rad1);
    const pt1y = p.y + size * Math.sin(rad1);
    const pt2x = p.x + size * Math.cos(rad2);
    const pt2y = p.y + size * Math.sin(rad2);
    return <path key={`a-${i}`} d={`M ${pt1x},${pt1y} A ${size} ${size} 0 0 1 ${pt2x},${pt2y}`} fill="none" stroke="#ef4444" strokeWidth="1" strokeLinecap="round" />
  };

  return (
    <div className="flex justify-center items-center p-8 w-full max-w-md mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-auto max-w-[300px] drop-shadow-md bg-white rounded-lg border border-slate-200">
        {/* Draw markers first */}
        {data.right?.map((p, i) => drawRight(p, i))}
        {data.acute?.map((p, i) => drawArc(p, i))}
        {data.obtuse?.map((p, i) => drawArc(p, i))}
        {/* Draw lines on top */}
        {data.lines?.map((l, i) => (
          <line 
            key={`l-${i}`} 
            x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} 
            stroke={i < 4 ? "#334155" : "#3b82f6"} 
            strokeWidth="3" 
            strokeLinecap="round" 
          />
        ))}
      </svg>
    </div>
  );
};

const GridSquaresVisualizer = ({ data }) => {
  const { squares } = data;
  if (!squares || squares.length === 0) return null;

  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  squares.forEach(sq => {
    if (sq.r < minR) minR = sq.r;
    if (sq.r > maxR) maxR = sq.r;
    if (sq.c < minC) minC = sq.c;
    if (sq.c > maxC) maxC = sq.c;
  });

  const gridRows = maxR - minR + 1;
  const gridCols = maxC - minC + 1;
  const cellSize = 70 / Math.max(gridRows, gridCols, 4); 
  const totalWidth = gridCols * cellSize;
  const totalHeight = gridRows * cellSize;

  const startX = (100 - totalWidth) / 2;
  const startY = (100 - totalHeight) / 2;

  const squareSet = new Set(squares.map(sq => `${sq.r},${sq.c}`));

  const rects = squares.map((sq, i) => (
    <rect 
      key={`rect-${i}`}
      x={startX + (sq.c - minC) * cellSize}
      y={startY + (sq.r - minR) * cellSize}
      width={cellSize}
      height={cellSize}
      fill="rgba(100,150,250,0.15)"
      stroke="#94a3b8"
      strokeWidth="1"
      strokeDasharray="4 4"
    />
  ));

  const boundaries = [];
  squares.forEach((sq, i) => {
    const x = startX + (sq.c - minC) * cellSize;
    const y = startY + (sq.r - minR) * cellSize;
    
    if (!squareSet.has(`${sq.r-1},${sq.c}`)) {
      boundaries.push(<line key={`t-${i}`} x1={x} y1={y} x2={x+cellSize} y2={y} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />);
    }
    if (!squareSet.has(`${sq.r+1},${sq.c}`)) {
      boundaries.push(<line key={`b-${i}`} x1={x} y1={y+cellSize} x2={x+cellSize} y2={y+cellSize} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />);
    }
    if (!squareSet.has(`${sq.r},${sq.c-1}`)) {
      boundaries.push(<line key={`l-${i}`} x1={x} y1={y} x2={x} y2={y+cellSize} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />);
    }
    if (!squareSet.has(`${sq.r},${sq.c+1}`)) {
      boundaries.push(<line key={`r-${i}`} x1={x+cellSize} y1={y} x2={x+cellSize} y2={y+cellSize} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />);
    }
  });

  let vertices = new Set();
  squares.forEach(sq => {
    vertices.add(`${sq.r},${sq.c}`);
    vertices.add(`${sq.r+1},${sq.c}`);
    vertices.add(`${sq.r},${sq.c+1}`);
    vertices.add(`${sq.r+1},${sq.c+1}`);
  });

  return (
    <div className="flex justify-center items-center p-8 w-full max-w-md mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-auto max-w-[300px] drop-shadow-md bg-white rounded-lg border border-slate-200">
        {rects}
        {boundaries}
      </svg>
    </div>
  );
};

const GridPathVisualizer = ({ data }) => {
  const { path } = data;
  if (!path || path.length === 0) return null;

  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  path.forEach(p => {
    if (p.x < minX) minX = p.x;
    if (p.x > maxX) maxX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.y > maxY) maxY = p.y;
  });

  const width = maxX - minX;
  const height = maxY - minY;
  const cellSize = 80 / Math.max(width, height, 4); 
  const totalWidth = width * cellSize;
  const totalHeight = height * cellSize;

  const startX = (100 - totalWidth) / 2;
  const startY = (100 - totalHeight) / 2;

  const gridLines = [];
  for (let i = 0; i <= width; i++) {
    const x = startX + i * cellSize;
    gridLines.push(<line key={`gv-${i}`} x1={x} y1={startY} x2={x} y2={startY + totalHeight} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />);
  }
  for (let j = 0; j <= height; j++) {
    const y = startY + j * cellSize;
    gridLines.push(<line key={`gh-${j}`} x1={startX} y1={y} x2={startX + totalWidth} y2={y} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="2 2" />);
  }

  const points = path.map(p => `${startX + (p.x - minX) * cellSize},${startY + (p.y - minY) * cellSize}`).join(' ');

  return (
    <div className="flex justify-center items-center p-8 w-full max-w-md mx-auto">
      <svg viewBox="0 0 100 100" className="w-full h-auto max-w-[300px] drop-shadow-md bg-white rounded-lg border border-slate-200">
        {gridLines}
        <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="miter" />
        <circle cx={startX + (path[0].x - minX) * cellSize} cy={startY + (path[0].y - minY) * cellSize} r="2.5" fill="#ef4444" />
        <circle cx={startX + (path[path.length-1].x - minX) * cellSize} cy={startY + (path[path.length-1].y - minY) * cellSize} r="2.5" fill="#ef4444" />
      </svg>
    </div>
  );
};

const getShapePath = (type) => {
  switch (type) {
    case 'triangle':
      return "M 20 80 L 80 80 L 20 20 Z"; 
    case 'square':
      return "M 20 20 L 80 20 L 80 80 L 20 80 Z"; 
    case 't-shape':
      return "M 10 20 L 90 20 L 90 45 L 65 45 L 65 90 L 35 90 L 35 45 L 10 45 Z"; 
    case 'plus':
      return "M 35 10 L 65 10 L 65 35 L 90 35 L 90 65 L 65 65 L 65 90 L 35 90 L 35 65 L 10 65 L 10 35 L 35 35 Z"; 
    default:
      return "";
  }
};

const renderDynamicShape = (squares) => {
  if (!squares || squares.length === 0) return null;

  let minR = Infinity, maxR = -Infinity, minC = Infinity, maxC = -Infinity;
  squares.forEach(sq => {
    if (sq.r < minR) minR = sq.r;
    if (sq.r > maxR) maxR = sq.r;
    if (sq.c < minC) minC = sq.c;
    if (sq.c > maxC) maxC = sq.c;
  });

  const gridRows = maxR - minR + 1;
  const gridCols = maxC - minC + 1;
  const cellSize = 70 / Math.max(gridRows, gridCols, 4); 
  const totalWidth = gridCols * cellSize;
  const totalHeight = gridRows * cellSize;

  const startX = (100 - totalWidth) / 2;
  const startY = (100 - totalHeight) / 2;

  const squareSet = new Set(squares.map(sq => `${sq.r},${sq.c}`));

  const rects = squares.map((sq, i) => (
    <rect 
      key={`rect-${i}`}
      x={startX + (sq.c - minC) * cellSize}
      y={startY + (sq.r - minR) * cellSize}
      width={cellSize}
      height={cellSize}
      fill="rgba(100,150,250,0.15)"
      stroke="#94a3b8"
      strokeWidth="1"
      strokeDasharray="4 4"
    />
  ));

  const boundaries = [];
  squares.forEach((sq, i) => {
    const x = startX + (sq.c - minC) * cellSize;
    const y = startY + (sq.r - minR) * cellSize;
    
    if (!squareSet.has(`${sq.r-1},${sq.c}`)) {
      boundaries.push(<line key={`t-${i}`} x1={x} y1={y} x2={x+cellSize} y2={y} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />);
    }
    if (!squareSet.has(`${sq.r+1},${sq.c}`)) {
      boundaries.push(<line key={`b-${i}`} x1={x} y1={y+cellSize} x2={x+cellSize} y2={y+cellSize} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />);
    }
    if (!squareSet.has(`${sq.r},${sq.c-1}`)) {
      boundaries.push(<line key={`l-${i}`} x1={x} y1={y} x2={x} y2={y+cellSize} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />);
    }
    if (!squareSet.has(`${sq.r},${sq.c+1}`)) {
      boundaries.push(<line key={`r-${i}`} x1={x+cellSize} y1={y} x2={x+cellSize} y2={y+cellSize} stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" />);
    }
  });

  return (
    <>
      {rects}
      {boundaries}
    </>
  );
};

const DeductiveTotalsVisualizer = ({ data }) => {
  const { dynamicShapeA, dynamicShapeB, shapeA, shapeB } = data;
  
  return (
    <div className="flex flex-row justify-center items-center gap-6 p-6 w-full max-w-2xl mx-auto">
      <div className="flex flex-col items-center w-1/2">
        <svg viewBox="0 0 100 100" className="w-full h-auto max-w-[180px] drop-shadow-md bg-white rounded-lg border border-slate-200">
          {dynamicShapeA ? renderDynamicShape(dynamicShapeA) : <path d={getShapePath(shapeA)} fill="rgba(100,150,250,0.15)" stroke="#3b82f6" strokeWidth="2.5" />}
        </svg>
        <span className="mt-3 font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-sm shadow-sm border border-slate-200">Shape A</span>
      </div>
      <div className="flex flex-col items-center w-1/2">
        <svg viewBox="0 0 100 100" className="w-full h-auto max-w-[180px] drop-shadow-md bg-white rounded-lg border border-slate-200">
          {dynamicShapeB ? renderDynamicShape(dynamicShapeB) : <path d={getShapePath(shapeB)} fill="rgba(100,150,250,0.15)" stroke="#3b82f6" strokeWidth="2.5" />}
        </svg>
        <span className="mt-3 font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full text-sm shadow-sm border border-slate-200">Shape B</span>
      </div>
    </div>
  );
};

const FoldedCornerVisualizer = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <svg viewBox="0 0 200 150" className="w-64 h-auto drop-shadow-md">
        {/* Original uncut corner (dotted) */}
        <polygon points="10,10 50,10 10,50" fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 4" />
        
        {/* Main body of rectangle (solid) */}
        <polygon points="50,10 190,10 190,140 10,140 10,50" fill="rgba(100,150,250,0.15)" stroke="#3b82f6" strokeWidth="3" strokeLinejoin="round" />
        
        {/* Folded flap */}
        <polygon points="50,10 10,50 50,50" fill="rgba(100,150,250,0.3)" stroke="#2563eb" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Right angles at untouched corners */}
        <path d="M 170,10 L 170,30 L 190,30" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M 190,120 L 170,120 L 170,140" fill="none" stroke="#ef4444" strokeWidth="2" />
        <path d="M 30,140 L 30,120 L 10,120" fill="none" stroke="#ef4444" strokeWidth="2" />
      </svg>
    </div>
  );
};

export default AngleVisualizer;
