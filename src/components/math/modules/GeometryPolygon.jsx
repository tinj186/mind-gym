import React from 'react';

export default function GeometryPolygon({ data }) {
  if (!data) return null;
  const { vertices = [], edgeLabels = [], fillColor = "#bfdbfe", strokeColor = "#0f172a" } = data;
  
  if (vertices.length < 3) return null;

  // Compute bounding box to set viewBox automatically
  const minX = Math.min(...vertices.map(v => v.x));
  const maxX = Math.max(...vertices.map(v => v.x));
  const minY = Math.min(...vertices.map(v => v.y));
  const maxY = Math.max(...vertices.map(v => v.y));

  const padding = 30; // padding for labels
  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  const points = vertices.map(v => `${v.x - minX + padding},${v.y - minY + padding}`).join(' ');

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px]">
        <polygon points={points} fill={fillColor} stroke={strokeColor} strokeWidth="3" strokeLinejoin="round" />
        
        {/* Render edge labels */}
        {edgeLabels.map((label, i) => {
          if (!label) return null;
          const v1 = vertices[i];
          const v2 = vertices[(i + 1) % vertices.length];
          
          const x1 = v1.x - minX + padding;
          const y1 = v1.y - minY + padding;
          const x2 = v2.x - minX + padding;
          const y2 = v2.y - minY + padding;

          const midX = (x1 + x2) / 2;
          const midY = (y1 + y2) / 2;
          
          const dx = x2 - x1;
          const dy = y2 - y1;
          const len = Math.sqrt(dx * dx + dy * dy);
          
          let nx = -dy / len;
          let ny = dx / len;
          
          // Calculate centroid to ensure normal points outward
          const centroidX = vertices.reduce((sum, v) => sum + v.x - minX + padding, 0) / vertices.length;
          const centroidY = vertices.reduce((sum, v) => sum + v.y - minY + padding, 0) / vertices.length;
          
          const dotProduct = (midX - centroidX) * nx + (midY - centroidY) * ny;
          if (dotProduct < 0) {
            nx = -nx;
            ny = -ny;
          }
          
          const offset = 22; // slightly more padding for labels
          const labelX = midX + nx * offset;
          const labelY = midY + ny * offset;

          return (
            <text 
              key={i} 
              x={labelX} 
              y={labelY} 
              fill="#0f172a" 
              fontSize="16" 
              fontWeight="bold"
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
