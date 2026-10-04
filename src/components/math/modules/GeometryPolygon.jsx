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
  const padding = Math.max(30, Math.min(60, fontSize * 2));
  const offset = fontSize * 0.5;
  const strokeWidth = Math.max(3, maxDim * 0.01);

  const width = maxX - minX + padding * 2;
  const height = maxY - minY + padding * 2;

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl flex flex-col items-center justify-center p-4 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto max-h-[300px]">
        <defs>
          {polygonsToRender.map((poly, pIdx) => {
            if (poly.hideInside) {
              return (
                <mask id={`mask_hide_${pIdx}`} key={`mask_${pIdx}`}>
                  <rect x="-1000" y="-1000" width="3000" height="3000" fill="white" />
                  {poly.hideInside.map(hideIdx => {
                    const hidePoly = polygonsToRender[hideIdx];
                    if (!hidePoly) return null;
                    const hidePoints = hidePoly.vertices.map(v => `${v.x * SCALE - minX + padding},${v.y * SCALE - minY + padding}`).join(' ');
                    return <polygon key={`mask_poly_${hideIdx}`} points={hidePoints} fill="black" />
                  })}
                </mask>
              );
            }
            return null;
          })}
        </defs>

        {polygonsToRender.map((poly, pIdx) => {
          const { vertices = [], edgeLabels = [], rightAngles = [], fillColor = "#bfdbfe", strokeColor = "#0f172a" } = poly;
          if (vertices.length < 3) return null;
          
          const scaledVertices = vertices.map(v => ({ x: v.x * SCALE, y: v.y * SCALE }));
          const points = scaledVertices.map(v => `${v.x - minX + padding},${v.y - minY + padding}`).join(' ');
          
          let polygonArea = 0;
          for (let i = 0; i < scaledVertices.length; i++) {
            const j = (i + 1) % scaledVertices.length;
            polygonArea += (scaledVertices[i].x * scaledVertices[j].y) - (scaledVertices[j].x * scaledVertices[i].y);
          }
          const isClockwise = polygonArea >= 0;
          const sweepFlag = isClockwise ? 0 : 1;
          const polyMinX = Math.min(...scaledVertices.map(v => v.x));
          const polyMaxX = Math.max(...scaledVertices.map(v => v.x));
          const polyMinY = Math.min(...scaledVertices.map(v => v.y));
          const polyMaxY = Math.max(...scaledVertices.map(v => v.y));
          const polyMaxDim = Math.max(polyMaxX - polyMinX, polyMaxY - polyMinY);
          
          return (
            <g key={`poly-${pIdx}`}>
              {/* Fill polygon without stroke */}
              <polygon points={points} fill={fillColor} stroke="none" />
              
              {/* Internal dashed stroke (drawn underneath) */}
              {poly.showInternalDashed && (
                <polygon points={points} fill="none" stroke={strokeColor} strokeWidth={strokeWidth} opacity="0.6" strokeLinejoin="round" strokeDasharray="4 4" />
              )}
              
              {/* Solid outer stroke (masked to hide internal lines) */}
              <polygon 
                points={points} 
                fill="none" 
                stroke={strokeColor} 
                strokeWidth={strokeWidth} 
                strokeLinejoin="round" 
                strokeDasharray={poly.isDashed ? "4 12" : "none"} 
                mask={poly.hideInside ? `url(#mask_hide_${pIdx})` : undefined} 
              />

              
              {/* Render right angle markers */}
              {rightAngles.map((vIdx) => {
                const vi = scaledVertices[vIdx];
                const prev = scaledVertices[(vIdx - 1 + scaledVertices.length) % scaledVertices.length];
                const next = scaledVertices[(vIdx + 1) % scaledVertices.length];
                
                const vx = vi.x - minX + padding;
                const vy = vi.y - minY + padding;
                const px = prev.x - minX + padding;
                const py = prev.y - minY + padding;
                const nx = next.x - minX + padding;
                const ny = next.y - minY + padding;

                let dx1 = px - vx; let dy1 = py - vy;
                let len1 = Math.hypot(dx1, dy1);
                dx1 /= len1; dy1 /= len1;

                let dx2 = nx - vx; let dy2 = ny - vy;
                let len2 = Math.hypot(dx2, dy2);
                dx2 /= len2; dy2 /= len2;

                const baseSize = Math.max(8, polyMaxDim * 0.035);
                const size = baseSize * 0.75; // Shrink right angle marker to balance visual area with arcs
                const pt1x = vx + dx1 * size;
                const pt1y = vy + dy1 * size;
                const pt2x = vx + dx2 * size;
                const pt2y = vy + dy2 * size;
                const pt3x = pt1x + dx2 * size;
                const pt3y = pt1y + dy2 * size;

                return (
                  <path 
                    key={`right-${pIdx}-${vIdx}`}
                    d={`M ${pt1x},${pt1y} L ${pt3x},${pt3y} L ${pt2x},${pt2y}`}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeLinejoin="miter"
                  />
                );
              })}

              {/* Render acute angle markers (red arcs) */}
              {(poly.acuteAngles || []).map((vIdx) => {
                const vi = scaledVertices[vIdx];
                const prev = scaledVertices[(vIdx - 1 + scaledVertices.length) % scaledVertices.length];
                const next = scaledVertices[(vIdx + 1) % scaledVertices.length];
                
                const vx = vi.x - minX + padding;
                const vy = vi.y - minY + padding;
                
                let dx1 = prev.x - minX + padding - vx; let dy1 = prev.y - minY + padding - vy;
                let len1 = Math.hypot(dx1, dy1);
                dx1 /= len1; dy1 /= len1;

                let dx2 = next.x - minX + padding - vx; let dy2 = next.y - minY + padding - vy;
                let len2 = Math.hypot(dx2, dy2);
                dx2 /= len2; dy2 /= len2;

                const size = Math.max(8, polyMaxDim * 0.035);
                const pt1x = vx + dx1 * size;
                const pt1y = vy + dy1 * size;
                const pt2x = vx + dx2 * size;
                const pt2y = vy + dy2 * size;

                const cross = dx1 * dy2 - dy1 * dx2;
                const largeArcFlag = (isClockwise ? cross > 0 : cross < 0) ? 1 : 0;

                // Determine sweep flag. Assuming clockwise vertices and interior angle < 180, sweep is always 1 for interior.
                return (
                  <path 
                    key={`acute-${pIdx}-${vIdx}`}
                    d={`M ${pt1x},${pt1y} A ${size} ${size} 0 ${largeArcFlag} ${sweepFlag} ${pt2x},${pt2y}`}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                  />
                );
              })}

              {/* Render obtuse angle markers (blue arcs) */}
              {(poly.obtuseAngles || []).map((vIdx) => {
                const vi = scaledVertices[vIdx];
                const prev = scaledVertices[(vIdx - 1 + scaledVertices.length) % scaledVertices.length];
                const next = scaledVertices[(vIdx + 1) % scaledVertices.length];
                
                const vx = vi.x - minX + padding;
                const vy = vi.y - minY + padding;
                
                let dx1 = prev.x - minX + padding - vx; let dy1 = prev.y - minY + padding - vy;
                let len1 = Math.hypot(dx1, dy1);
                dx1 /= len1; dy1 /= len1;

                let dx2 = next.x - minX + padding - vx; let dy2 = next.y - minY + padding - vy;
                let len2 = Math.hypot(dx2, dy2);
                dx2 /= len2; dy2 /= len2;

                const size = Math.max(8, polyMaxDim * 0.035);
                const pt1x = vx + dx1 * size;
                const pt1y = vy + dy1 * size;
                const pt2x = vx + dx2 * size;
                const pt2y = vy + dy2 * size;

                const cross = dx1 * dy2 - dy1 * dx2;
                const largeArcFlag = (isClockwise ? cross > 0 : cross < 0) ? 1 : 0;

                return (
                  <path 
                    key={`obtuse-${pIdx}-${vIdx}`}
                    d={`M ${pt1x},${pt1y} A ${size} ${size} 0 ${largeArcFlag} ${sweepFlag} ${pt2x},${pt2y}`}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                  />
                );
              })}
              
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
