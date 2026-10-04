const fs = require('fs');
const file = 'src/components/math/modules/AngleVisualizer.jsx';
let text = fs.readFileSync(file, 'utf8');

const regex = /const WordVisualizer = \(\{ data \}\) => \{[\s\S]*?\}\);\n\};/;

const newBlock = `const WordVisualizer = ({ data }) => {
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
      acute: [{x:50,y:10, a1:69.4, a2:110.5}, {x:35,y:50, a1:290.5, a2:360}, {x:65,y:50, a1:180, a2:249.4}],
      obtuse: [{x:35,y:50, a1:0, a2:110.5}, {x:65,y:50, a1:69.4, a2:180}]
    },
    X: {
      lines: [[20,10, 80,90], [80,10, 20,90]],
      right: [],
      acute: [{x:50,y:50, a1:233.1, a2:306.9}, {x:50,y:50, a1:53.1, a2:126.9}],
      obtuse: [{x:50,y:50, a1:126.9, a2:233.1}, {x:50,y:50, a1:306.9, a2:413.1}]
    },
    Y: {
      lines: [[20,10, 50,50], [80,10, 50,50], [50,50, 50,90]],
      right: [],
      acute: [{x:50,y:50, a1:233.1, a2:306.9}],
      obtuse: [{x:50,y:50, a1:90, a2:233.1}, {x:50,y:50, a1:306.9, a2:450}]
    }
  };

  const drawRight = (p, i) => {
    const size = 10;
    const p1x = p.x + p.dx1 * size;
    const p1y = p.y + p.dy1 * size;
    const p2x = p.x + p.dx2 * size;
    const p2y = p.y + p.dy2 * size;
    const px = p.x + p.dx1 * size + p.dx2 * size;
    const py = p.y + p.dy1 * size + p.dy2 * size;
    return <polyline key={\`r-\${i}\`} points={\`\${p1x},\${p1y} \${px},\${py} \${p2x},\${p2y}\`} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
  };

  const drawArc = (p, i) => {
    const size = 12;
    const rad1 = p.a1 * Math.PI / 180;
    const rad2 = p.a2 * Math.PI / 180;
    const pt1x = p.x + size * Math.cos(rad1);
    const pt1y = p.y + size * Math.sin(rad1);
    const pt2x = p.x + size * Math.cos(rad2);
    const pt2y = p.y + size * Math.sin(rad2);
    return <path key={\`a-\${i}\`} d={\`M \${pt1x},\${pt1y} A \${size} \${size} 0 0 1 \${pt2x},\${pt2y}\`} fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
  };

  return (
    <div className="flex justify-center items-center p-8 space-x-6 flex-wrap">
      {data.word.split('').map((char, index) => {
        const d = letterData[char];
        if (!d) return <span key={index} className="text-7xl font-mono font-bold text-slate-700">{char}</span>;
        
        return (
          <svg key={index} viewBox="0 0 100 100" className="w-24 h-24 drop-shadow-md">
            {d.lines.map((l, i) => (
              <line key={\`l-\${i}\`} x1={l[0]} y1={l[1]} x2={l[2]} y2={l[3]} stroke="#334155" strokeWidth="6" strokeLinecap="round" />
            ))}
            {d.right.map((p, i) => drawRight(p, i))}
            {d.acute.map((p, i) => drawArc(p, i))}
            {d.obtuse.map((p, i) => drawArc(p, i))}
          </svg>
        );
      })}
    </div>
  );
};`;

text = text.replace(regex, newBlock);
fs.writeFileSync(file, text);
