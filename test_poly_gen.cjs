const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateTotallyRandomPolygon = () => {
  let pts = [
    {x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}, {x: 20, y: 80}
  ];
  const numTransforms = getRandomInt(3, 8);
  for (let i = 0; i < numTransforms; i++) {
    const tType = getRandomInt(0, 2);
    const edgeIdx = getRandomInt(0, pts.length - 1);
    const p1 = pts[edgeIdx];
    const p2 = pts[(edgeIdx + 1) % pts.length];
    
    if (tType === 0) {
      const p3 = pts[(edgeIdx + 2) % pts.length];
      if ((p1.x === p2.x && p2.y === p3.y) || (p1.y === p2.y && p2.x === p3.x)) {
        const mid1 = { x: (p1.x + p2.x)/2, y: (p1.y + p2.y)/2 };
        const mid2 = { x: (p2.x + p3.x)/2, y: (p2.y + p3.y)/2 };
        if (edgeIdx + 1 === pts.length) {
            pts.splice(0, 1, mid1, mid2);
        } else {
            pts.splice(edgeIdx + 1, 1, mid1, mid2);
        }
      }
    } else if (tType === 1) {
      if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
        const dir = p1.x > 50 ? -20 : 20;
        const midY = (p1.y + p2.y) / 2;
        pts.splice(edgeIdx + 1, 0, {x: p1.x + dir, y: p1.y}, {x: p1.x + dir, y: midY}, {x: p1.x, y: midY});
      } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
        const dir = p1.y > 50 ? -20 : 20;
        const midX = (p1.x + p2.x) / 2;
        pts.splice(edgeIdx + 1, 0, {x: p1.x, y: p1.y + dir}, {x: midX, y: p1.y + dir}, {x: midX, y: p1.y});
      }
    } else if (tType === 2) {
      if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 20) {
        const midY = (p1.y + p2.y) / 2;
        const dir = p1.x > 50 ? 20 : -20; 
        pts.splice(edgeIdx + 1, 0, {x: p1.x + dir, y: midY});
      } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 20) {
        const midX = (p1.x + p2.x) / 2;
        const dir = p1.y > 50 ? 20 : -20;
        pts.splice(edgeIdx + 1, 0, {x: midX, y: p1.y + dir});
      }
    }
  }
  
  pts = pts.filter((p, i, arr) => {
    const next = arr[(i + 1) % arr.length];
    return p.x !== next.x || p.y !== next.y;
  });
  
  return pts;
};

for (let i=0; i<3; i++) {
  console.log("Shape", i+1, ":", generateTotallyRandomPolygon());
}
