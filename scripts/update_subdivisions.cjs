const fs = require('fs');
const file = 'src/lib/syllabus/math/primary-3/geometry-angles/angle-comparison/foundation.js';
let text = fs.readFileSync(file, 'utf8');

const regex = /if \(activeVariant === 'foundation_rectangular_subdivisions'\) \{[\s\S]*?systemPrompt = \`You are generating a Primary 3 Math question\./;

const newBlock = `if (activeVariant === 'foundation_rectangular_subdivisions') {
    const rectLines = [[10,20, 90,20], [90,20, 90,80], [90,80, 10,80], [10,80, 10,20]];
    const configs = [
      {
        lines: [...rectLines, [10,20, 90,80]],
        right: [
          {x:90,y:20, dx1:0,dy1:1, dx2:-1,dy2:0},
          {x:10,y:80, dx1:1,dy1:0, dx2:0,dy2:-1}
        ],
        acute: [
          {x:10,y:20, a1:0, a2:36.87}, {x:10,y:20, a1:36.87, a2:90},
          {x:90,y:80, a1:216.87, a2:270}, {x:90,y:80, a1:180, a2:216.87}
        ],
        obtuse: []
      },
      {
        lines: [...rectLines, [10,20, 90,80], [90,20, 10,80]],
        right: [],
        acute: [
          {x:10,y:20, a1:0, a2:36.87}, {x:10,y:20, a1:36.87, a2:90},
          {x:90,y:20, a1:90, a2:143.13}, {x:90,y:20, a1:143.13, a2:180},
          {x:90,y:80, a1:180, a2:216.87}, {x:90,y:80, a1:216.87, a2:270},
          {x:10,y:80, a1:270, a2:323.13}, {x:10,y:80, a1:323.13, a2:360},
          {x:50,y:50, a1:143.13, a2:216.87}, {x:50,y:50, a1:323.13, a2:396.87}
        ],
        obtuse: [
          {x:50,y:50, a1:36.87, a2:143.13}, {x:50,y:50, a1:216.87, a2:323.13}
        ]
      },
      {
        lines: [...rectLines, [40,20, 40,80], [10,60, 90,60]],
        right: [
          {x:10,y:20, dx1:1,dy1:0, dx2:0,dy2:1}, {x:90,y:20, dx1:-1,dy1:0, dx2:0,dy2:1},
          {x:10,y:80, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:90,y:80, dx1:-1,dy1:0, dx2:0,dy2:-1},
          {x:40,y:20, dx1:1,dy1:0, dx2:0,dy2:1}, {x:40,y:20, dx1:-1,dy1:0, dx2:0,dy2:1},
          {x:40,y:80, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:40,y:80, dx1:-1,dy1:0, dx2:0,dy2:-1},
          {x:10,y:60, dx1:0,dy1:-1, dx2:1,dy2:0}, {x:10,y:60, dx1:0,dy1:1, dx2:1,dy2:0},
          {x:90,y:60, dx1:0,dy1:-1, dx2:-1,dy2:0}, {x:90,y:60, dx1:0,dy1:1, dx2:-1,dy2:0},
          {x:40,y:60, dx1:1,dy1:0, dx2:0,dy2:1}, {x:40,y:60, dx1:-1,dy1:0, dx2:0,dy2:1},
          {x:40,y:60, dx1:1,dy1:0, dx2:0,dy2:-1}, {x:40,y:60, dx1:-1,dy1:0, dx2:0,dy2:-1}
        ],
        acute: [], obtuse: []
      },
      {
        lines: [...rectLines, [10,20, 90,80], [10,50, 90,50]],
        right: [
          {x:90,y:20, dx1:-1,dy1:0, dx2:0,dy2:1}, {x:10,y:80, dx1:1,dy1:0, dx2:0,dy2:-1},
          {x:10,y:50, dx1:0,dy1:-1, dx2:1,dy2:0}, {x:10,y:50, dx1:0,dy1:1, dx2:1,dy2:0},
          {x:90,y:50, dx1:0,dy1:-1, dx2:-1,dy2:0}, {x:90,y:50, dx1:0,dy1:1, dx2:-1,dy2:0}
        ],
        acute: [
          {x:10,y:20, a1:0, a2:36.87}, {x:10,y:20, a1:36.87, a2:90},
          {x:90,y:80, a1:180, a2:216.87}, {x:90,y:80, a1:216.87, a2:270},
          {x:50,y:50, a1:0, a2:36.87}, {x:50,y:50, a1:180, a2:216.87}
        ],
        obtuse: [
          {x:50,y:50, a1:36.87, a2:180}, {x:50,y:50, a1:216.87, a2:360}
        ]
      },
      {
        lines: [...rectLines, [10,20, 90,80], [90,20, 10,80], [10,50, 90,50]],
        right: [
          {x:10,y:50, dx1:0,dy1:-1, dx2:1,dy2:0}, {x:10,y:50, dx1:0,dy1:1, dx2:1,dy2:0},
          {x:90,y:50, dx1:0,dy1:-1, dx2:-1,dy2:0}, {x:90,y:50, dx1:0,dy1:1, dx2:-1,dy2:0}
        ],
        acute: [
          {x:10,y:20, a1:0, a2:36.87}, {x:10,y:20, a1:36.87, a2:90},
          {x:90,y:20, a1:90, a2:143.13}, {x:90,y:20, a1:143.13, a2:180},
          {x:90,y:80, a1:180, a2:216.87}, {x:90,y:80, a1:216.87, a2:270},
          {x:10,y:80, a1:270, a2:323.13}, {x:10,y:80, a1:323.13, a2:360},
          {x:50,y:50, a1:0, a2:36.87}, {x:50,y:50, a1:143.13, a2:180},
          {x:50,y:50, a1:180, a2:216.87}, {x:50,y:50, a1:323.13, a2:360}
        ],
        obtuse: [
          {x:50,y:50, a1:36.87, a2:143.13}, {x:50,y:50, a1:216.87, a2:323.13}
        ]
      }
    ];
    
    let cfg = getRandomArrayElement(configs);
    let counts = { right: cfg.right.length, acute: cfg.acute.length, obtuse: cfg.obtuse.length };
    
    const targetType = getRandomArrayElement(["right", "acute", "obtuse"]);
    const targetLabel = targetType === "right" ? "right angles" : (targetType === "acute" ? "angles smaller than a right angle" : "angles greater than a right angle");
    const count = counts[targetType];
    
    let askText = \`STORY: A rectangle is drawn and subdivided by several straight lines cutting across it. Look at the marked angles. Calculate the total number of \${targetLabel} inside the shape.\`;
    let finalAns = \`\${count}\`;
    let hintStr = \`Carefully count every single \${targetLabel} marked in red.\`;
    let solutionStr = \`There are exactly \${count} \${targetLabel} formed by the intersecting lines.\`;
    let stepsArr = [];
    let optionsArr = [\`"\${count}"\`, \`"\${count + 1}"\`, \`"\${count + 2}"\`, \`"\${count - 1 < 0 ? count + 3 : count - 1}"\`];

    if (isStructure) {
      stepsArr = [
        { label: \`Total number of \${targetLabel}:\`, expectedAnswer: \`\${count}\`, acceptedAnswers: [] }
      ];
    }

    visualEngineStr = JSON.stringify({ componentToRender: "SUBDIVIDED_RECTANGLE", componentData: cfg });

    if (isStructure) {
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (!isMCQ) {
      inputRequirementStr = \`{"inputType": "STANDARD_TEXT"}\`;
    }

    systemPrompt = \`You are generating a Primary 3 Math question.\`;`;

text = text.replace(regex, newBlock);
fs.writeFileSync(file, text);
