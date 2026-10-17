const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateRandomSubdivisions = () => {
  const rectLines = [[10,20, 90,20], [90,20, 90,80], [90,80, 10,80], [10,80, 10,20]];
  const allLines = [...rectLines];
  
  const getPerimeterPoint = () => {
    let d = Math.random() * 280;
    if (d < 80) return { x: 10 + d, y: 20 };
    if (d < 140) return { x: 90, y: 20 + (d - 80) };
    if (d < 220) return { x: 90 - (d - 140), y: 80 };
    return { x: 10, y: 80 - (d - 220) };
  };
  
  const N = getRandomInt(1, 3);
  const outLines = [...rectLines];
  
  for (let i = 0; i < N; i++) {
    let p1, p2;
    let attempts = 0;
    while(attempts < 100) {
      attempts++;
      p1 = getPerimeterPoint();
      p2 = getPerimeterPoint();
      if (Math.hypot(p1.x - p2.x, p1.y - p2.y) > 30) break;
    }
    allLines.push([p1.x, p1.y, p2.x, p2.y]);
    outLines.push([p1.x, p1.y, p2.x, p2.y]);
  }
  
  const getIntersection = (l1, l2) => {
    const x1 = l1[0], y1 = l1[1], x2 = l1[2], y2 = l1[3];
    const x3 = l2[0], y3 = l2[1], x4 = l2[2], y4 = l2[3];
    const denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (Math.abs(denom) < 0.001) return null;
    const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / denom;
    const u = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / denom;
    if (t >= -0.001 && t <= 1.001 && u >= -0.001 && u <= 1.001) {
      return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) };
    }
    return null;
  };
  
  let nodes = [];
  for (let i = 0; i < allLines.length; i++) {
    for (let j = i + 1; j < allLines.length; j++) {
      const pt = getIntersection(allLines[i], allLines[j]);
      if (pt) {
        let node = nodes.find(n => Math.hypot(n.x - pt.x, n.y - pt.y) < 0.1);
        if (!node) {
          node = { x: pt.x, y: pt.y, incidentLines: new Set() };
          nodes.push(node);
        }
        node.incidentLines.add(i);
        node.incidentLines.add(j);
      }
    }
  }
  
  let edges = [];
  for (let i = 0; i < allLines.length; i++) {
    const lineNodes = nodes.filter(n => n.incidentLines.has(i));
    lineNodes.sort((a, b) => Math.hypot(a.x - allLines[i][0], a.y - allLines[i][1]) - Math.hypot(b.x - allLines[i][0], b.y - allLines[i][1]));
    
    for (let k = 0; k < lineNodes.length - 1; k++) {
      edges.push({ n1: lineNodes[k], n2: lineNodes[k+1] });
    }
  }
  
  const right = [];
  const acute = [];
  const obtuse = [];
  
  for (let node of nodes) {
    let rays = [];
    for (let edge of edges) {
      if (edge.n1 === node) rays.push({ dx: edge.n2.x - node.x, dy: edge.n2.y - node.y });
      if (edge.n2 === node) rays.push({ dx: edge.n1.x - node.x, dy: edge.n1.y - node.y });
    }
    
    // Calculate angles in degrees
    rays = rays.map(r => {
      let a = Math.atan2(r.dy, r.dx) * 180 / Math.PI;
      if (a < 0) a += 360;
      return { ...r, angle: a };
    });
    rays.sort((a, b) => a.angle - b.angle);
    
    for (let i = 0; i < rays.length; i++) {
      let r1 = rays[i];
      let r2 = rays[(i + 1) % rays.length];
      
      let diff = r2.angle - r1.angle;
      if (diff < 0) diff += 360;
      
      if (diff < 1 || Math.abs(diff - 180) < 1) continue;
      
      let bisect = r1.angle + diff / 2;
      let bx = node.x + 0.5 * Math.cos(bisect * Math.PI / 180);
      let by = node.y + 0.5 * Math.sin(bisect * Math.PI / 180);
      
      let isInside = bx > 10.01 && bx < 89.99 && by > 20.01 && by < 79.99;
      
      if (isInside) {
        if (Math.abs(diff - 90) < 1) {
          let mag1 = Math.hypot(r1.dx, r1.dy);
          let mag2 = Math.hypot(r2.dx, r2.dy);
          right.push({ x: node.x, y: node.y, dx1: r1.dx/mag1, dy1: r1.dy/mag1, dx2: r2.dx/mag2, dy2: r2.dy/mag2 });
        } else if (diff < 90) {
          acute.push({ x: node.x, y: node.y, a1: r1.angle, a2: r2.angle > r1.angle ? r2.angle : r2.angle + 360 });
        } else if (diff > 90) {
          obtuse.push({ x: node.x, y: node.y, a1: r1.angle, a2: r2.angle > r1.angle ? r2.angle : r2.angle + 360 });
        }
      }
    }
  }
  
  return { lines: outLines, right, acute, obtuse };
};

for(let i=0; i<3; i++) {
  const result = generateRandomSubdivisions();
  console.log(`Run ${i+1}: right=${result.right.length}, acute=${result.acute.length}, obtuse=${result.obtuse.length}, lines=${result.lines.length}`);
}
