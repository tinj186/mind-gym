const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

// The array of configs is defined as `const configs = [ ... ];`
// We will replace `    ];` with our new configs + `    ];`

const newConfigs = `,
      {
        lines: [...rectLines, [30,20, 70,80]],
        right: [
          {x:10,y:20, dx1:1,dy1:0, dx2:0,dy2:1}, {x:90,y:20, dx1:-1,dy1:0, dx2:0,dy2:1},
          {x:10,y:80, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:90,y:80, dx1:-1,dy1:0, dx2:0,dy2:-1}
        ],
        acute: [
          {x:30,y:20, a1:0, a2:56.31},
          {x:70,y:80, a1:180, a2:236.31}
        ],
        obtuse: [
          {x:30,y:20, a1:56.31, a2:180},
          {x:70,y:80, a1:236.31, a2:360}
        ]
      },
      {
        lines: [...rectLines, [10,50, 60,80]],
        right: [
          {x:10,y:20, dx1:1,dy1:0, dx2:0,dy2:1}, {x:90,y:20, dx1:-1,dy1:0, dx2:0,dy2:1},
          {x:10,y:80, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:90,y:80, dx1:-1,dy1:0, dx2:0,dy2:-1}
        ],
        acute: [
          {x:10,y:50, a1:30.96, a2:90},
          {x:60,y:80, a1:180, a2:210.96}
        ],
        obtuse: [
          {x:10,y:50, a1:270, a2:390.96},
          {x:60,y:80, a1:210.96, a2:360}
        ]
      },
      {
        lines: [...rectLines, [20,20, 50,80], [80,20, 50,80]],
        right: [
          {x:10,y:20, dx1:1,dy1:0, dx2:0,dy2:1}, {x:90,y:20, dx1:-1,dy1:0, dx2:0,dy2:1},
          {x:10,y:80, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:90,y:80, dx1:-1,dy1:0, dx2:0,dy2:-1}
        ],
        acute: [
          {x:20,y:20, a1:0, a2:63.43}, {x:80,y:20, a1:116.57, a2:180},
          {x:50,y:80, a1:243.43, a2:296.57},
          {x:50,y:80, a1:180, a2:243.43}, {x:50,y:80, a1:296.57, a2:360}
        ],
        obtuse: [
          {x:20,y:20, a1:63.43, a2:180}, {x:80,y:20, a1:0, a2:116.57}
        ]
      }
    ];`;

text = text.replace(/    \];\n    \n    let cfg = getRandomArrayElement\(configs\);/, newConfigs + '\n    \n    let cfg = getRandomArrayElement(configs);');
fs.writeFileSync(file, text);
