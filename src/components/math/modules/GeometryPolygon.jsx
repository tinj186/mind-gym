import React from 'react';

export default function GeometryPolygon({ data }) {
  if (!data) return null;
  const polygonsToRender = data.polygons || [data];
  
  if (polygonsToRender.length === 0) return null;
  
  const SCALE = 3;
  const allVertices = polygonsToRender.flatMap(p => p.vertices || []).map(v => ({ x: v.x * SCALE, y: v.y * SCALE }));
  
  if (allVertices.length === 0) return null;

  // Compute bounding box to set viewBox automatically
  const minX = Math.min(...allVertices.map(v => v.x));
  const maxX = Math.max(...allVertices.map(v => v.x));
  const minY = Math.min(...allVertices.map(v => v.y));
  const maxY = Math.max(...allVertices.map(v => v.y));

  const maxDim = Math.max(maxX - minX, maxY - minY);
  const fontSize = Math.max(16, maxDim * 0.06);
  // Increase padding multiplier so text labels (like '4 cm') don't get cut off when anchored start/end
  const padding = Math.max(60, fontSize * 4); 
  const offset = fontSize * 0.5;
  const strokeWidth = Math.max(3, maxDim * 0.01);

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px]">
        {polygonsToRender.map((poly, pIdx) => {
          const { vertices = [], edgeLabels = [], fillColor = "#bfdbfe", strokeColor = "#0f172a" } = poly;
          if (vertices.length < 3) return null;
          
          const scaledVertices = vertices.map(v => ({ x: v.x * SCALE, y: v.y * SCALE }));
          const points = scaledVertices.map(v => `${v.x - minX + padding},${v.y - minY + padding}`).join(' ');
          
          return (
            <g key={`poly-${pIdx}`}>
              <polygon points={points} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} strokeLinejoin="round" />
              
              {/* Render edge labels */}
              {edgeLabels.map((label, i) => {
                if (!label) return null;
                const v1 = scaledVertices[i];
                const v2 = scaledVertices[(i + 1) % scaledVertices.length];
                
                const x1 = v1.x - minX + padding;
                const y1 = v1.y - minY + padding;
                const x2 = v2.x - minX + padding;
                const y2 = v2.y - minY + padding;

                const midX = (x1 + x2) / 2;
                const midY = (y1 + y2) / 2;
                
                const dx = x2 - x1;
                const dy = y2 - y1;
                const len = Math.sqrt(dx * dx + dy * dy);
                
                // Since all our polygons are drawn in clockwise winding order,
                // the outward normal is always (dy, -dx).
                const nx = dy / len;
                const ny = -dx / len;
                
                const labelX = midX + nx * offset;
                const labelY = midY + ny * offset;

                let anchor = "middle";
                if (nx > 0.5) anchor = "start";       // Pointing right
                else if (nx < -0.5) anchor = "end";   // Pointing left

                let baseline = "middle";
                if (ny > 0.5) baseline = "hanging";   // Pointing down
                else if (ny < -0.5) baseline = "baseline"; // Pointing up

                return (
                  <text 
                    key={`label-${pIdx}-${i}`} 
                    x={labelX} 
                    y={labelY} 
                    fill="#0f172a" 
                    fontSize={fontSize} 
                    fontWeight="bold"
                    textAnchor={anchor}
                    alignmentBaseline={baseline}
                  >
                    {label}
                  </text>
                );
              })}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
