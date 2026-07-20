import React from 'react';

/**
 * Helper to calculate polar to cartesian coordinates
 */
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

/**
 * FractionDisplay: Renders a shape partitioned into equal parts.
 *
 * @param {Object} data - The visual data payload
 *   - shape: 'circle', 'rectangle', 'hexagon'
 *   - totalParts: number (denominator)
 *   - shadedParts: number (numerator)
 *   - color: string (hex code for the shaded parts)
 */
export default function FractionDisplay({ data, hideCardStyles = false }) {
  if (!data) return null;

  const { shape = 'rectangle', totalParts = 4, shadedParts = 1, color = '#3b82f6', shadedSegments } = data;
  
  const baseSize = 200;
  const strokeColor = '#0f172a';
  const unshadedColor = '#ffffff';

  let colorArray = [];
  if (shadedSegments && Array.isArray(shadedSegments)) {
    shadedSegments.forEach(seg => {
      for(let j = 0; j < seg.parts; j++) {
         colorArray.push(seg.color);
      }
    });
  }

  const getFillColor = (i) => {
    if (colorArray.length > 0) {
      return i < colorArray.length ? colorArray[i] : unshadedColor;
    }
    return i < shadedParts ? color : unshadedColor;
  };

  const renderCircle = () => {
    if (totalParts <= 1) {
      return (
        <circle cx={100} cy={100} r={90} fill={getFillColor(0)} stroke={strokeColor} strokeWidth="4" />
      );
    }

    const slices = [];
    const anglePerPart = 360 / totalParts;

    for (let i = 0; i < totalParts; i++) {
      const startAngle = i * anglePerPart;
      const endAngle = (i + 1) * anglePerPart;
      
      const start = polarToCartesian(100, 100, 90, endAngle);
      const end = polarToCartesian(100, 100, 90, startAngle);
      
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      
      const d = [
        "M", 100, 100,
        "L", start.x, start.y,
        "A", 90, 90, 0, largeArcFlag, 0, end.x, end.y,
        "Z"
      ].join(" ");

      slices.push(
        <path 
          key={i} 
          d={d} 
          fill={getFillColor(i)} 
          stroke={strokeColor} 
          strokeWidth="3" 
          strokeLinejoin="round"
        />
      );
    }

    return <g>{slices}</g>;
  };

  const renderRectangle = (isRectObj) => {
    const rectWidth = 200;
    const rectHeight = 60;
    const yOffset = isRectObj ? 10 : 70;
    
    if (totalParts <= 1) {
      return (
        <rect x={0} y={yOffset} width={rectWidth} height={rectHeight} fill={getFillColor(0)} stroke={strokeColor} strokeWidth="4" />
      );
    }

    const partWidth = rectWidth / totalParts;
    const segments = [];

    for (let i = 0; i < totalParts; i++) {
      segments.push(
        <rect 
          key={i}
          x={i * partWidth}
          y={yOffset}
          width={partWidth}
          height={rectHeight}
          fill={getFillColor(i)}
          stroke={strokeColor}
          strokeWidth="3"
        />
      );
    }

    return <g>{segments}</g>;
  };

  const renderHexagon = () => {
    // Hexagon drawn explicitly for 6 parts (triangles from center)
    const cx = 100;
    const cy = 100;
    const r = 90;
    
    const partsToRender = totalParts === 6 ? 6 : Math.max(1, totalParts); // fallback
    const anglePerPart = 360 / partsToRender;
    const slices = [];

    for (let i = 0; i < partsToRender; i++) {
      const startAngle = i * anglePerPart + 30; // offset to point upwards
      const endAngle = (i + 1) * anglePerPart + 30;
      
      const start = polarToCartesian(cx, cy, r, endAngle);
      const end = polarToCartesian(cx, cy, r, startAngle);
      
      const d = [
        "M", cx, cy,
        "L", start.x, start.y,
        "L", end.x, end.y,
        "Z"
      ].join(" ");

      slices.push(
        <path 
          key={i} 
          d={d} 
          fill={getFillColor(i)} 
          stroke={strokeColor} 
          strokeWidth="3"
          strokeLinejoin="round"
        />
      );
    }
    return <g>{slices}</g>;
  };

  const isRect = !['circle', 'hexagon'].includes(shape.toLowerCase());

  const getShapeRenderer = () => {
    const s = shape.toLowerCase();
    if (s === 'hexagon') {
      if (totalParts === 6) return renderHexagon();
      return renderCircle(); // Fallback to circle if hexagon can't be divided evenly
    }
    if (s === 'circle') return renderCircle();
    return renderRectangle(true); // default
  };

  const shouldHideCardStyles = hideCardStyles || data.hideCardStyles;
  const containerStyle = shouldHideCardStyles
    ? "bg-transparent p-0 border-0 flex items-center justify-center w-full"
    : "w-full max-w-md mx-auto p-6 bg-white rounded-2xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex items-center justify-center";

  const viewBox = isRect ? `0 0 ${baseSize} 80` : `0 0 ${baseSize} ${baseSize}`;
  const svgClass = isRect ? "w-48 h-auto drop-shadow-sm overflow-visible" : "w-48 h-48 drop-shadow-sm overflow-visible";

  return (
    <div className={containerStyle}>
      <svg viewBox={viewBox} className={svgClass}>
        {getShapeRenderer()}
      </svg>
    </div>
  );
}
