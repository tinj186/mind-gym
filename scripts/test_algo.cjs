const allLines = [
  [10,20, 90,20],
  [90,20, 90,80],
  [90,80, 10,80],
  [10,80, 10,20],
  [10,80, 70,20]
];
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
for (let node of nodes) {
  if (Math.abs(node.y - 20) < 0.1 && Math.abs(node.x - 70) < 0.1) {
    console.log("Found top node at", node.x, node.y);
    let rays = [];
    for (let edge of edges) {
      if (edge.n1 === node) rays.push({ dx: edge.n2.x - node.x, dy: edge.n2.y - node.y });
      if (edge.n2 === node) rays.push({ dx: edge.n1.x - node.x, dy: edge.n1.y - node.y });
    }
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
      console.log(`Angles: ${r1.angle.toFixed(1)} to ${r2.angle.toFixed(1)}, diff: ${diff.toFixed(1)}, bisect: ${bisect.toFixed(1)}, by: ${by.toFixed(4)}, isInside: ${isInside}`);
    }
  }
}
