const generateTotallyRandomPolygon = () => {
    let pts = [
    {x: 20, y: 20}, {x: 80, y: 20}, {x: 80, y: 80}, {x: 20, y: 80}
    ];
    const numTransforms = 5;
    for (let i = 0; i < numTransforms; i++) {
        const tType = Math.floor(Math.random() * 3);
        const edgeIdx = Math.floor(Math.random() * pts.length);
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
            const dir = p1.x > 50 ? 15 : -15;
            const yDir = Math.sign(p2.y - p1.y);
            const y1 = p1.y + yDir * 15;
            const y2 = p2.y - yDir * 15;
            pts.splice(edgeIdx + 1, 0, {x: p1.x, y: y1}, {x: p1.x + dir, y: y1}, {x: p1.x + dir, y: y2}, {x: p1.x, y: y2});
            } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const dir = p1.y > 50 ? 15 : -15;
            const xDir = Math.sign(p2.x - p1.x);
            const x1 = p1.x + xDir * 15;
            const x2 = p2.x - xDir * 15;
            pts.splice(edgeIdx + 1, 0, {x: x1, y: p1.y}, {x: x1, y: p1.y + dir}, {x: x2, y: p1.y + dir}, {x: x2, y: p1.y});
            }
        } else if (tType === 2) {
            if (p1.x === p2.x && Math.abs(p1.y - p2.y) >= 40) {
            const midY = (p1.y + p2.y) / 2;
            const dir = p1.x > 50 ? 15 : -15; 
            pts.splice(edgeIdx + 1, 0, {x: p1.x + dir, y: midY});
            } else if (p1.y === p2.y && Math.abs(p1.x - p2.x) >= 40) {
            const midX = (p1.x + p2.x) / 2;
            const dir = p1.y > 50 ? 15 : -15;
            pts.splice(edgeIdx + 1, 0, {x: midX, y: p1.y + dir});
            }
        }
    }
    
    let filtered = [];
    for (let p of pts) {
    if (filtered.length === 0) filtered.push(p);
    else {
        let last = filtered[filtered.length - 1];
        if (last.x !== p.x || last.y !== p.y) filtered.push(p);
    }
    }
    if (filtered.length > 1) {
    let last = filtered[filtered.length - 1];
    let first = filtered[0];
    if (last.x === first.x && last.y === first.y) filtered.pop();
    }
    return filtered;
};

const getAngles = (shapeVertices) => {
    let rightAngles = [];
    let acuteAngles = [];
    let obtuseAngles = [];
    let area = 0;
    for (let i = 0; i < shapeVertices.length; i++) {
      let j = (i + 1) % shapeVertices.length;
      area += shapeVertices[i].x * shapeVertices[j].y - shapeVertices[j].x * shapeVertices[i].y;
    }
    let isClockwise = area >= 0;
    for (let i = 0; i < shapeVertices.length; i++) {
      let prev = shapeVertices[(i - 1 + shapeVertices.length) % shapeVertices.length];
      let curr = shapeVertices[i];
      let next = shapeVertices[(i + 1) % shapeVertices.length];
      let v1 = { x: prev.x - curr.x, y: prev.y - curr.y };
      let v2 = { x: next.x - curr.x, y: next.y - curr.y };
      let cross = v1.x * v2.y - v1.y * v2.x;
      let dot = v1.x * v2.x + v1.y * v2.y;
      let isReflex = isClockwise ? (cross > 0) : (cross < 0);
      if (isReflex) {
        obtuseAngles.push(i);
      } else {
        let mag1 = Math.hypot(v1.x, v1.y);
        let mag2 = Math.hypot(v2.x, v2.y);
        let cosTheta = dot / (mag1 * mag2);
        if (Math.abs(cosTheta) < 0.05) {
          rightAngles.push(i);
        } else if (cosTheta > 0) {
          acuteAngles.push(i);
        } else {
          obtuseAngles.push(i);
        }
      }
    }
    return { r: rightAngles, a: acuteAngles, o: obtuseAngles };
  };

const cleanCollinear = (pts) => {
    let clean = [];
    for (let i = 0; i < pts.length; i++) {
        let prev = pts[(i - 1 + pts.length) % pts.length];
        let curr = pts[i];
        let next = pts[(i + 1) % pts.length];
        let v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
        let v2 = { x: next.x - curr.x, y: next.y - curr.y };
        let cross = v1.x * v2.y - v1.y * v2.x;
        let dot = v1.x * v2.x + v1.y * v2.y;
        
        let mag1 = Math.hypot(v1.x, v1.y);
        let mag2 = Math.hypot(v2.x, v2.y);
        let cosTheta = dot / (mag1 * mag2);
        
        // Remove if collinear (angle is 180 degrees, cross is 0 and dot is positive)
        // Wait, if points are in order, v1 is IN, v2 is OUT.
        // If angle is 180, they are in the SAME direction!
        // So cosTheta should be 1 (dot > 0).
        if (Math.abs(cross) > 0.05 || cosTheta < 0.95) {
            clean.push(curr);
        }
    }
    return clean;
};

const run = () => {
    let baseVertices = generateTotallyRandomPolygon();
    
    // Calculate center
    let cx = 0, cy = 0;
    for(let v of baseVertices) { cx += v.x; cy += v.y; }
    cx /= baseVertices.length;
    cy /= baseVertices.length;

    // Pick a random mirror angle
    const mirrorAngles = [0, 45, 90, 135];
    const mAngle = mirrorAngles[Math.floor(Math.random() * mirrorAngles.length)];
    const mRad = mAngle * Math.PI / 180;
    const mNormal = { x: Math.cos(mRad), y: Math.sin(mRad) };
    const maxProj = cx * mNormal.x + cy * mNormal.y; // line passes through center

    const inside = (p) => (p.x * mNormal.x + p.y * mNormal.y) >= maxProj - 0.0001;
    const intersect = (p1, p2) => {
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        let t = (maxProj - (p1.x * mNormal.x + p1.y * mNormal.y)) / (dx * mNormal.x + dy * mNormal.y);
        return { x: p1.x + t * dx, y: p1.y + t * dy };
    };

    let clipped = [];
    let cp1 = baseVertices[baseVertices.length - 1];
    for (let cp2 of baseVertices) {
        if (inside(cp2)) {
            if (!inside(cp1)) clipped.push(intersect(cp1, cp2));
            clipped.push(cp2);
        } else if (inside(cp1)) {
            clipped.push(intersect(cp1, cp2));
        }
        cp1 = cp2;
    }

    clipped = cleanCollinear(clipped);

    const reflectPoint = (p) => {
        const dist = (p.x * mNormal.x + p.y * mNormal.y) - maxProj;
        return {
            x: p.x - 2 * dist * mNormal.x,
            y: p.y - 2 * dist * mNormal.y
        };
    };

    let reflectedVertices = clipped.map(reflectPoint);

    // Form whole shape perimeter
    // Since clipping keeps order, we can just append reflected in reverse
    let whole = [...clipped];
    for(let i = clipped.length - 1; i >= 0; i--) {
        whole.push(reflectedVertices[i]);
    }
    
    whole = cleanCollinear(whole);

    console.log("mAngle", mAngle);
    console.log("base", baseVertices.length);
    console.log("clipped", clipped.length);
    console.log("whole", whole.length);
    const hAngles = getAngles(clipped);
    const wAngles = getAngles(whole);
    console.log("hAngles", hAngles);
    console.log("wAngles", wAngles);
};
run();
