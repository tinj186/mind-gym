import { getRandomNames } from '../../../../../utils/variable-bank.js';

export const standardLogic = (variant, isMCQ, isShort, isStructure, getFormatInstructions) => {
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "{}";
  let systemPrompt = "";

  const name = getRandomNames(1)[0];

  if (variant === 'standard_deducing_quantities') {
    // Procedural generation for shape pool to guarantee variety in rotation/scale
    const generateShape = (targetPairs) => {
      let vertices = [];
      let name = "";
      const scaleX = 30 + Math.random() * 20;
      const scaleY = 30 + Math.random() * 20;

      if (targetPairs === 0) {
        name = "Triangle";
        vertices = [{x: 0, y: 0}, {x: scaleX, y: 0}, {x: scaleX/2 + (Math.random()-0.5)*10, y: scaleY}];
      } else if (targetPairs === 1) {
        if (Math.random() > 0.5) {
          name = "Trapezium";
          const offset = Math.random() * 15;
          vertices = [{x: 0, y: 0}, {x: scaleX + 10, y: 0}, {x: scaleX - offset, y: scaleY}, {x: offset, y: scaleY}];
        } else {
          name = "Pentagon";
          vertices = [{x: 0, y: 0}, {x: scaleX, y: 0}, {x: scaleX, y: scaleY*0.6}, {x: scaleX/2, y: scaleY}, {x: 0, y: scaleY*0.6}];
        }
      } else if (targetPairs === 2) {
        const type = Math.random();
        if (type > 0.6) {
          name = "Square";
          vertices = [{x: 0, y: 0}, {x: 40, y: 0}, {x: 40, y: 40}, {x: 0, y: 40}];
        } else if (type > 0.3) {
          name = "Rectangle";
          vertices = [{x: 0, y: 0}, {x: 50, y: 0}, {x: 50, y: 25}, {x: 0, y: 25}];
        } else {
          name = "Parallelogram";
          const skew = 10 + Math.random() * 10;
          vertices = [{x: skew, y: 0}, {x: scaleX + skew, y: 0}, {x: scaleX, y: scaleY}, {x: 0, y: scaleY}];
        }
      } else if (targetPairs === 3) {
        name = "Hexagon";
        vertices = [{x: 10, y: 0}, {x: 30, y: 0}, {x: 40, y: 20}, {x: 30, y: 40}, {x: 10, y: 40}, {x: 0, y: 20}];
      } else {
        name = "Octagon";
        vertices = [{x: 15, y: 0}, {x: 35, y: 0}, {x: 50, y: 15}, {x: 50, y: 35}, {x: 35, y: 50}, {x: 15, y: 50}, {x: 0, y: 35}, {x: 0, y: 15}];
      }

      // Arbitrary 2D rotation
      const angle = Math.random() * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      vertices = vertices.map(v => ({ x: v.x * cosA - v.y * sinA, y: v.x * sinA + v.y * cosA }));

      // Uniform normalization to ~55x55 size for better visual presence
      let minX = Math.min(...vertices.map(v => v.x));
      let minY = Math.min(...vertices.map(v => v.y));
      vertices = vertices.map(v => ({ x: v.x - minX, y: v.y - minY }));
      const maxDim = Math.max(...vertices.map(v => Math.max(v.x, v.y))) || 1;
      
      vertices = vertices.map(v => ({ 
        x: Math.round((v.x / maxDim) * 55), 
        y: Math.round((v.y / maxDim) * 55) 
      }));

      return { name, pairs: targetPairs, vertices };
    };

    // Pick 4 unique pair counts from 0, 1, 2, 3, 4
    const selectedPairs = [0, 1, 2, 3, 4].sort(() => 0.5 - Math.random()).slice(0, 4);
    const shapePool = selectedPairs.map(pairs => generateShape(pairs));
    
    const labels = ["A", "B", "C", "D"];
    const polygons = shapePool.map((shape, i) => {
      // Spread them across a 300px width canvas: 20, 95, 170, 245
      const startX = 20 + (i * 75); 
      // Vertically center them around y=40
      const startY = 40 - (Math.max(...shape.vertices.map(v => v.y)) / 2);
      
      return {
        label: labels[i],
        vertices: shape.vertices.map(v => ({ x: v.x + startX, y: v.y + startY })),
        strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)"
      };
    });

    // Pick 2 shapes as the answer
    const ansIndexes = [0, 1, 2, 3].sort(() => 0.5 - Math.random()).slice(0, 2);
    const shape1 = shapePool[ansIndexes[0]];
    const shape2 = shapePool[ansIndexes[1]];
    const label1 = labels[ansIndexes[0]];
    const label2 = labels[ansIndexes[1]];
    
    // Assign quantities
    const q1 = 2 + Math.floor(Math.random() * 4); // 2 to 5
    const q2 = 2 + Math.floor(Math.random() * 4); // 2 to 5
    const totalPairs = (q1 * shape1.pairs) + (q2 * shape2.pairs);
    
    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: polygons,
        showGrid: false
      }
    });

    let askText = "";
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"${name} chooses two different shapes from the options above. She draws exactly ${q1} of the first shape and ${q2} of the second shape. Altogether, these shapes have ${totalPairs} pairs of parallel lines. Which two shapes did she choose?"`;
      const stepsArr = [
        { label: `By looking at the visual, list the number of parallel pairs for Shape A, B, C, and D in order (e.g. 0, 1, 2, 3):`, expectedAnswer: `${shapePool[0].pairs}, ${shapePool[1].pairs}, ${shapePool[2].pairs}, ${shapePool[3].pairs}`, acceptedAnswers: [] },
        { label: `Use guess and check. If she chose Shape ${label1} and Shape ${label2}, write the equation to check if the total pairs equal ${totalPairs}:`, expectedAnswer: `${q1} x ${shape1.pairs} + ${q2} x ${shape2.pairs} = ${totalPairs}`, acceptedAnswers: [`${q1}*${shape1.pairs}+${q2}*${shape2.pairs}=${totalPairs}`] },
        { label: `What is the first shape she chose?`, expectedAnswer: `Shape ${label1}`, acceptedAnswers: [`${label1}`] },
        { label: `What is the second shape she chose?`, expectedAnswer: `Shape ${label2}`, acceptedAnswers: [`${label2}`] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"${name} draws ${q1} of one shape and ${q2} of another shape from the list. The total number of parallel lines is ${totalPairs} pairs. Which two shapes did she draw?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"${name} draws ${q1} of one shape and ${q2} of another shape from the list. The total number of parallel pairs is ${totalPairs}. Name the two shapes she drew (e.g., Shape A and Shape B)."`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }
    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: Shape ${label1} and Shape ${label2}
`;
  } else if (variant === 'standard_shapes_inside_shapes') {
    // Generate outer and inner shapes that have NO internal parallel lines,
    // but share exact edges with each other. We use an Affine Transformation
    // to guarantee infinite variety (skew, rotation, scale) while mathematically
    // preserving parallelism across shapes!
    
    let baseOuter, baseInner, outerName, innerName, totalCrossPairs;
    let outerParallelPairs = [];
    let innerParallelPairs = [];

    const combo = Math.floor(Math.random() * 6);
    if (combo === 0) {
      outerName = "Triangle"; innerName = "smaller Triangle";
      baseOuter = [{x: 0, y: 100}, {x: 100, y: 100}, {x: 50, y: 0}];
      baseInner = [{x: 25, y: 75}, {x: 75, y: 75}, {x: 50, y: 25}];
      totalCrossPairs = 3;
      outerParallelPairs = [[0, 1], [1, 2], [2, 3]];
      innerParallelPairs = [[0, 1], [1, 2], [2, 3]];
    } else if (combo === 1) {
      outerName = "Irregular Quadrilateral"; innerName = "Triangle";
      baseOuter = [{x: 0, y: 100}, {x: 100, y: 100}, {x: 150, y: 0}, {x: 20, y: 30}];
      baseInner = [{x: 30, y: 80}, {x: 80, y: 80}, {x: 105, y: 30}];
      totalCrossPairs = 2;
      outerParallelPairs = [[0, 1], [1, 2]];
      innerParallelPairs = [[0, 1], [1, 2]];
    } else if (combo === 2) {
      outerName = "Irregular Quadrilateral"; innerName = "smaller Quadrilateral";
      baseOuter = [{x: 0, y: 100}, {x: 100, y: 100}, {x: 150, y: 0}, {x: 20, y: 30}];
      baseInner = [{x: 30, y: 80}, {x: 80, y: 80}, {x: 105, y: 30}, {x: 50, y: 50}];
      totalCrossPairs = 2;
      outerParallelPairs = [[0, 1], [1, 2]];
      innerParallelPairs = [[0, 1], [1, 2]];
    } else if (combo === 3) {
      outerName = "Irregular Pentagon"; innerName = "Triangle";
      baseOuter = [{x: 0, y: 100}, {x: 100, y: 100}, {x: 120, y: 50}, {x: 60, y: 0}, {x: 10, y: 40}];
      baseInner = [{x: 20, y: 80}, {x: 80, y: 80}, {x: 92, y: 50}];
      totalCrossPairs = 2;
      outerParallelPairs = [[0, 1], [1, 2]];
      innerParallelPairs = [[0, 1], [1, 2]];
    } else if (combo === 4) {
      outerName = "Irregular Pentagon"; innerName = "smaller Pentagon";
      baseOuter = [{x: 0, y: 100}, {x: 100, y: 100}, {x: 120, y: 50}, {x: 60, y: 0}, {x: 10, y: 40}];
      baseInner = [{x: 20, y: 80}, {x: 80, y: 80}, {x: 92, y: 50}, {x: 62, y: 25}, {x: 30, y: 45}];
      totalCrossPairs = 3;
      outerParallelPairs = [[0, 1], [1, 2], [2, 3]];
      innerParallelPairs = [[0, 1], [1, 2], [2, 3]];
    } else {
      outerName = "Irregular Hexagon"; innerName = "Quadrilateral";
      baseOuter = [{x: 0, y: 100}, {x: 80, y: 110}, {x: 120, y: 50}, {x: 90, y: -10}, {x: 20, y: -20}, {x: -10, y: 40}];
      baseInner = [{x: 20, y: 80}, {x: 60, y: 85}, {x: 80, y: 55}, {x: 65, y: 25}];
      totalCrossPairs = 3;
      outerParallelPairs = [[0, 1], [1, 2], [2, 3]];
      innerParallelPairs = [[0, 1], [1, 2], [2, 3]];
    }

    // Apply Random Affine Transformation
    const angle = Math.random() * Math.PI * 2;
    const cosA = Math.cos(angle), sinA = Math.sin(angle);
    const sx = 0.6 + Math.random() * 0.8;
    const sy = 0.6 + Math.random() * 0.8;
    const kx = (Math.random() - 0.5) * 1.5;
    const ky = (Math.random() - 0.5) * 1.5;

    const applyTransform = (v) => {
      let nx = v.x * sx + v.y * kx;
      let ny = v.x * ky + v.y * sy;
      return { x: nx * cosA - ny * sinA, y: nx * sinA + ny * cosA };
    };

    let outerTransformed = baseOuter.map(applyTransform);
    let innerTransformed = baseInner.map(applyTransform);

    // Normalize visually
    let minX = Math.min(...outerTransformed.map(v => v.x));
    let minY = Math.min(...outerTransformed.map(v => v.y));
    outerTransformed = outerTransformed.map(v => ({x: v.x - minX, y: v.y - minY}));
    innerTransformed = innerTransformed.map(v => ({x: v.x - minX, y: v.y - minY}));

    let maxDim = Math.max(...outerTransformed.map(v => Math.max(v.x, v.y))) || 1;
    let scale = 180 / maxDim;

    const outerVerts = outerTransformed.map(v => ({x: Math.round(v.x * scale + 10), y: Math.round(v.y * scale + 10)}));
    const innerVerts = innerTransformed.map(v => ({x: Math.round(v.x * scale + 10), y: Math.round(v.y * scale + 10)}));

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: [
          {
            vertices: outerVerts,
            strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)",
            parallelPairs: outerParallelPairs
          },
          {
            vertices: innerVerts,
            strokeColor: "#ef4444", fillColor: "rgba(239, 68, 68, 0.1)",
            parallelPairs: innerParallelPairs
          }
        ],
        showGrid: false
      }
    });
    
    let askText = "";

    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"${name} draws a ${innerName} inside an ${outerName}. Neither shape has any parallel lines of its own. However, some lines on the outside shape are parallel to lines on the inside shape! Mark each matching pair using the arrow tools. How many cross-shape parallel pairs can you find?"`;
      
      const stepsArr = [];
      stepsArr.push({ label: `Use the arrow tools on the interactive canvas to mark each matching pair you find. How many pairs did you mark in total?`, expectedAnswer: `${totalCrossPairs}`, acceptedAnswers: [] });
      stepsArr.push({ label: `Total cross-shape parallel pairs:`, expectedAnswer: `${totalCrossPairs}`, acceptedAnswers: [] });

      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"${name} draws a ${innerName} inside an ${outerName}. Neither shape has any parallel lines of its own. However, some lines on the outside shape are parallel to lines on the inside shape! How many cross-shape pairs can you find?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"${name} draws a ${innerName} inside an ${outerName}. Neither shape has any parallel lines of its own. However, some lines on the outside shape are parallel to lines on the inside shape! How many cross-shape pairs can you find?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${totalCrossPairs}

CRITICAL: Because the student has an interactive visual of the shapes, you MUST NOT state the answer in the question text. DO NOT STATE IT.
`;
  } else if (variant === 'standard_intersecting_networks') {
    const vStreets = 2 + Math.floor(Math.random() * 4); // 2 to 5
    const hStreets = 3 + Math.floor(Math.random() * 4); // 3 to 6
    const sStreets = 1 + Math.floor(Math.random() * 3); // 1 to 3 slanted avenues
    const modifier = 1 + Math.floor(Math.random() * 3); // 1 to 3
    const isAdding = Math.random() > 0.3; // Favor adding
    const actualModifier = isAdding ? modifier : Math.min(modifier, vStreets - 1);
    const newVStreets = isAdding ? vStreets + actualModifier : vStreets - actualModifier;
    
    const hasSlantedPerp = Math.random() > 0.5;
    let extraPerp = hasSlantedPerp ? 1 : 0;
    let origIntersections = (vStreets * hStreets) + extraPerp;
    let newIntersections = (newVStreets * hStreets) + extraPerp;

    // Generate visual engine lines (roads)
    const polygons = [];
    
    // Fit within a nice square bounding box, e.g. 0 to 220
    const vSpacing = 180 / (vStreets + 1);
    for (let i = 1; i <= vStreets; i++) {
      const x = 20 + i * vSpacing;
      polygons.push({
        vertices: [{x: x, y: 10}, {x: x, y: 210}],
        isOpen: true,
        strokeColor: "#475569" // Match the orthogonal road color (solid)
      });
    }
    
    const hSpacing = 180 / (hStreets + 1);
    for (let i = 1; i <= hStreets; i++) {
      const y = 20 + i * hSpacing;
      polygons.push({
        vertices: [{x: 10, y: y}, {x: 210, y: y}],
        isOpen: true,
        strokeColor: "#475569"
      });
    }

    if (hasSlantedPerp) {
      // Draw N lines of slope 1 and M lines of slope -1
      const nSlanted = 1 + Math.floor(Math.random() * 2); // 1 to 2
      const mSlanted = 1 + Math.floor(Math.random() * 2); // 1 to 2
      extraPerp = nSlanted * mSlanted; // Update extraPerp dynamically
      origIntersections = (vStreets * hStreets) + extraPerp;
      newIntersections = (newVStreets * hStreets) + extraPerp;
      for (let i = 0; i < nSlanted; i++) {
        const jitterX = 10 + (i * 40) + Math.random() * 10;
        polygons.push({
          vertices: [{x: jitterX, y: 10}, {x: jitterX + 200, y: 210}],
          isOpen: true,
          strokeColor: "#475569"
        });
      }
      
      for (let i = 0; i < mSlanted; i++) {
        const jitterX = 160 - (i * 40) + Math.random() * 10;
        polygons.push({
          vertices: [{x: jitterX, y: 10}, {x: jitterX - 200, y: 210}],
          isOpen: true,
          strokeColor: "#475569"
        });
      }
    } else {
      // Draw 1 to 2 random non-perpendicular slanted lines (mix of top-down and side-to-side)
      const numDistractors = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < numDistractors; i++) {
        const isSideToSide = Math.random() > 0.5;
        if (isSideToSide) {
          // Mostly horizontal, e.g. dy = 50, dx = 200
          const startY = 20 + Math.random() * 100;
          polygons.push({
            vertices: [{x: 10, y: startY}, {x: 210, y: startY + 50 + Math.random() * 50}],
            isOpen: true,
            strokeColor: "#475569"
          });
        } else {
          // Mostly vertical, e.g. dx = 50, dy = 200
          const startX = 20 + Math.random() * 100;
          polygons.push({
            vertices: [{x: startX, y: 10}, {x: startX + 50 + Math.random() * 50, y: 210}],
            isOpen: true,
            strokeColor: "#475569"
          });
        }
      }
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: polygons,
        showGrid: false
      }
    });

    let askText = "";
    
    if (isStructure) {
      const changeWord = isAdding ? "builds exactly" : "removes exactly";
      const extraWord = isAdding ? "more " : "";
      askText = "CRITICAL INSTRUCTION: Your \"questionText\" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n\"A city planner draws a town map. Calculate the original total number of perpendicular (right-angled) intersections on the map. Then, figure out the new total if the planner " + changeWord + " " + actualModifier + " " + extraWord + "vertical streets.\"";
      
      const stepsArr = [
        { label: "What is the original total number of perpendicular intersections on the map?", expectedAnswer: String(origIntersections), acceptedAnswers: [] },
        { label: "How many vertical streets will there be after the planner's change?", expectedAnswer: String(newVStreets), acceptedAnswers: [] },
        { label: "Calculate the new total number of perpendicular intersections after the planner's change:", expectedAnswer: String(newIntersections), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = "CRITICAL INSTRUCTION: Your \"questionText\" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n\"A city planner draws a grid of streets. Taking into account ALL streets (vertical, horizontal, and slanted), how many perpendicular (right-angled) intersections are there?\"";
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = "CRITICAL INSTRUCTION: Your \"questionText\" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n\"A map has several vertical streets, horizontal streets, and slanted avenues. How many perpendicular intersections are there in total?\"";
      inputRequirementStr = "{\"inputType\": \"STANDARD_TEXT\"}";
    }

    systemPrompt = "You are generating a Primary 3 Math question.\n" +
      getFormatInstructions(visualEngineStr, inputRequirementStr) + "\n" +
      "Generate the \"content\" JSON based on this logic:\n" +
      askText + "\n" +
      "Final Answer: " + (isMCQ ? origIntersections : isStructure ? newIntersections : origIntersections) + "\n\n" +
      "CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.\n";
  } else if (variant === 'standard_shape_group_filtering') {
    const shapesDef = [
      { name: "Square", parallel: 2, perp: 4, getVertices: (dx) => [{x: 10+dx, y: 10}, {x: 60+dx, y: 10}, {x: 60+dx, y: 60}, {x: 10+dx, y: 60}] },
      { name: "Right-Angled Triangle", parallel: 0, perp: 1, getVertices: (dx) => [{x: 10+dx, y: 60}, {x: 60+dx, y: 60}, {x: 10+dx, y: 10}] },
      { name: "Regular Pentagon", parallel: 0, perp: 0, getVertices: (dx) => { const v = []; for(let i=0; i<5; i++) { const ang = -Math.PI/2 + (i * 2 * Math.PI / 5); v.push({ x: 35+dx + 25*Math.cos(ang), y: 35 + 25*Math.sin(ang) }); } return v; } },
      { name: "Trapezium", parallel: 1, perp: 0, getVertices: (dx) => [{x: 20+dx, y: 15}, {x: 50+dx, y: 15}, {x: 65+dx, y: 55}, {x: 5+dx, y: 55}] },
      { name: "Rectangle", parallel: 2, perp: 4, getVertices: (dx) => [{x: 10+dx, y: 20}, {x: 60+dx, y: 20}, {x: 60+dx, y: 50}, {x: 10+dx, y: 50}] },
      { name: "Parallelogram", parallel: 2, perp: 0, getVertices: (dx) => [{x: 20+dx, y: 20}, {x: 60+dx, y: 20}, {x: 50+dx, y: 50}, {x: 10+dx, y: 50}] },
      { name: "Regular Hexagon", parallel: 3, perp: 0, getVertices: (dx) => { const v = []; for(let i=0; i<6; i++) { const ang = -Math.PI/2 + (i * 2 * Math.PI / 6); v.push({ x: 35+dx + 25*Math.cos(ang), y: 35 + 25*Math.sin(ang) }); } return v; } },
      { name: "Irregular Pentagon", parallel: 1, perp: 0, getVertices: (dx) => [{x: 20+dx, y: 10}, {x: 50+dx, y: 10}, {x: 60+dx, y: 30}, {x: 40+dx, y: 50}, {x: 10+dx, y: 50}] },
      { name: "Irregular Quadrilateral", parallel: 0, perp: 0, getVertices: (dx) => [{x: 10+dx, y: 30}, {x: 30+dx, y: 10}, {x: 60+dx, y: 20}, {x: 40+dx, y: 50}] },
      { name: "Irregular Hexagon", parallel: 2, perp: 2, getVertices: (dx) => [{x: 10+dx, y: 10}, {x: 60+dx, y: 10}, {x: 60+dx, y: 40}, {x: 40+dx, y: 60}, {x: 20+dx, y: 60}, {x: 10+dx, y: 40}] }
    ];

    const shuffledShapes = shapesDef.sort(() => 0.5 - Math.random()).slice(0, 4);
    const shapeNames = shuffledShapes.map(s => s.name).join(", ");
    const polygons = shuffledShapes.map((s, i) => ({
      vertices: s.getVertices(i * 75), // spacing of 75px
      fillColor: "rgba(59, 130, 246, 0.1)",
      strokeColor: "#3b82f6"
    }));

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: polygons,
        showGrid: false
      }
    });

    const parallelRules = [
      { text: "at least 1 pair of parallel lines", check: (s) => s.parallel >= 1 },
      { text: "exactly 0 pairs of parallel lines", check: (s) => s.parallel === 0 }
    ];
    const perpRules = [
      { text: "at least 1 pair of perpendicular lines", check: (s) => s.perp >= 1 },
      { text: "exactly 0 pairs of perpendicular lines", check: (s) => s.perp === 0 }
    ];
    const rule1 = parallelRules[Math.floor(Math.random() * parallelRules.length)];
    const rule2 = perpRules[Math.floor(Math.random() * perpRules.length)];
    
    // Randomize order
    const rules = Math.random() > 0.5 ? [rule1, rule2] : [rule2, rule1];
    const finalRule1 = rules[0];
    const finalRule2 = rules[1];

    const count1 = shuffledShapes.filter(finalRule1.check).length;
    const count2 = shuffledShapes.filter(finalRule2.check).length;
    const total = count1 + count2;

    let askText = "";
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A teacher places 4 shape cards on the board: ${shapeNames}. First, find the number of shapes that contain ${finalRule1.text}. Then, find the number of shapes that contain ${finalRule2.text}."`;
      const stepsArr = [
        { label: `Visually check the 4 shapes. How many shapes have ${finalRule1.text}?`, expectedAnswer: String(count1), acceptedAnswers: [] },
        { label: `Visually check the shapes again. How many shapes have ${finalRule2.text}?`, expectedAnswer: String(count2), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A group contains 4 shapes: ${shapeNames}. How many shapes in this group have ${finalRule1.text}?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"Look at these 4 shapes: ${shapeNames}. How many of these shapes have ${finalRule2.text}?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${isMCQ ? count1 : count2}

CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.
`;
  } else {
    // standard_shape_splitting
    const splits = [
      {
        name: "square_diag_perp",
        origShape: "square",
        focusProp: "perpendicular lines",
        piecesName: "triangular pieces",
        origPairs: 4,
        newPairs: 2,
        lost: 2,
        getVisual: () => {
          const s = 40 + Math.random() * 40;
          const x0 = 10 + Math.random() * 20;
          const y0 = 10 + Math.random() * 20;
          const isLeftToRight = Math.random() > 0.5;
          const pts = [{x: x0, y: y0}, {x: x0+s, y: y0}, {x: x0+s, y: y0+s}, {x: x0, y: y0+s}];
          return {
            polygons: [
              { vertices: pts, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
              { vertices: isLeftToRight ? [pts[0], pts[2]] : [pts[1], pts[3]], isDashed: true, isOpen: true, strokeColor: "#475569" }
            ]
          };
        }
      },
      {
        name: "square_offcenter_perp",
        origShape: "square",
        focusProp: "perpendicular lines",
        piecesName: "unequal pieces (a triangle and a trapezium)",
        origPairs: 4,
        newPairs: 3,
        lost: 1,
        getVisual: () => {
          const s = 40 + Math.random() * 40;
          const x0 = 10 + Math.random() * 20;
          const y0 = 10 + Math.random() * 20;
          const pts = [{x: x0, y: y0}, {x: x0+s, y: y0}, {x: x0+s, y: y0+s}, {x: x0, y: y0+s}];
          const edgeOffset = s * (0.3 + Math.random() * 0.4);
          const isLeft = Math.random() > 0.5;
          const cutEnd = isLeft ? {x: x0 + edgeOffset, y: y0+s} : {x: x0+s - edgeOffset, y: y0+s};
          const cutStart = isLeft ? pts[0] : pts[1];
          return {
            polygons: [
              { vertices: pts, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
              { vertices: [cutStart, cutEnd], isDashed: true, isOpen: true, strokeColor: "#475569" }
            ]
          };
        }
      },
      {
        name: "rect_diag_parallel",
        origShape: "rectangle",
        focusProp: "parallel lines",
        piecesName: "triangular pieces",
        origPairs: 2,
        newPairs: 0,
        lost: 2,
        getVisual: () => {
          const w = 60 + Math.random() * 40;
          const h = 30 + Math.random() * 20;
          const x0 = 10 + Math.random() * 20;
          const y0 = 10 + Math.random() * 20;
          const isLeftToRight = Math.random() > 0.5;
          const pts = [{x: x0, y: y0}, {x: x0+w, y: y0}, {x: x0+w, y: y0+h}, {x: x0, y: y0+h}];
          return {
            polygons: [
              { vertices: pts, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
              { vertices: isLeftToRight ? [pts[0], pts[2]] : [pts[1], pts[3]], isDashed: true, isOpen: true, strokeColor: "#475569" }
            ]
          };
        }
      },
      {
        name: "rect_corner_parallel",
        origShape: "rectangle",
        focusProp: "parallel lines",
        piecesName: "pieces (a triangle and a trapezium)",
        origPairs: 2,
        newPairs: 1,
        lost: 1,
        getVisual: () => {
          const w = 60 + Math.random() * 40;
          const h = 30 + Math.random() * 20;
          const x0 = 10 + Math.random() * 20;
          const y0 = 10 + Math.random() * 20;
          const pts = [{x: x0, y: y0}, {x: x0+w, y: y0}, {x: x0+w, y: y0+h}, {x: x0, y: y0+h}];
          const edgeOffset = w * (0.3 + Math.random() * 0.4);
          const isLeft = Math.random() > 0.5;
          const cutEnd = isLeft ? {x: x0 + edgeOffset, y: y0+h} : {x: x0+w - edgeOffset, y: y0+h};
          const cutStart = isLeft ? pts[0] : pts[1];
          return {
            polygons: [
              { vertices: pts, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
              { vertices: [cutStart, cutEnd], isDashed: true, isOpen: true, strokeColor: "#475569" }
            ]
          };
        }
      },
      {
        name: "hexagon_half_parallel",
        origShape: "regular hexagon",
        focusProp: "parallel lines",
        piecesName: "trapezium pieces",
        origPairs: 3,
        newPairs: 2,
        lost: 1,
        getVisual: () => {
          const v = [];
          const cx = 50 + Math.random() * 40;
          const cy = 50 + Math.random() * 40;
          const r = 30 + Math.random() * 15;
          const rot = Math.random() * (Math.PI / 3);
          for(let i=0; i<6; i++) {
            const ang = rot + (i * 2 * Math.PI / 6);
            v.push({ x: cx + r*Math.cos(ang), y: cy + r*Math.sin(ang) });
          }
          const cutIdx = Math.floor(Math.random() * 3);
          return {
            polygons: [
              { vertices: v, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
              { vertices: [v[cutIdx], v[cutIdx+3]], isDashed: true, isOpen: true, strokeColor: "#475569" }
            ]
          };
        }
      },
      {
        name: "hexagon_offcenter_parallel",
        origShape: "regular hexagon",
        focusProp: "parallel lines",
        piecesName: "pieces (a triangle and a pentagon)",
        origPairs: 3,
        newPairs: 1,
        lost: 2,
        getVisual: () => {
          const v = [];
          const cx = 50 + Math.random() * 40;
          const cy = 50 + Math.random() * 40;
          const r = 30 + Math.random() * 15;
          const rot = Math.random() * (Math.PI / 3);
          for(let i=0; i<6; i++) {
            const ang = rot + (i * 2 * Math.PI / 6);
            v.push({ x: cx + r*Math.cos(ang), y: cy + r*Math.sin(ang) });
          }
          const startIdx = Math.floor(Math.random() * 6);
          const endIdx = (startIdx + 2) % 6; // Skips 1 vertex to form a triangle
          return {
            polygons: [
              { vertices: v, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
              { vertices: [v[startIdx], v[endIdx]], isDashed: true, isOpen: true, strokeColor: "#475569" }
            ]
          };
        }
      },
      {
        name: "octagon_offcenter_parallel",
        origShape: "regular octagon",
        focusProp: "parallel lines",
        piecesName: "pieces (a triangle and a heptagon)",
        origPairs: 4,
        newPairs: 2,
        lost: 2,
        getVisual: () => {
          const v = [];
          const cx = 50 + Math.random() * 40;
          const cy = 50 + Math.random() * 40;
          const r = 30 + Math.random() * 15;
          const rot = Math.random() * (Math.PI / 4);
          for(let i=0; i<8; i++) {
            const ang = rot + (i * 2 * Math.PI / 8);
            v.push({ x: cx + r*Math.cos(ang), y: cy + r*Math.sin(ang) });
          }
          const startIdx = Math.floor(Math.random() * 8);
          const endIdx = (startIdx + 2) % 8; // Skips 1 vertex to form a triangle
          return {
            polygons: [
              { vertices: v, strokeColor: "#3b82f6", fillColor: "rgba(59, 130, 246, 0.1)" },
              { vertices: [v[startIdx], v[endIdx]], isDashed: true, isOpen: true, strokeColor: "#475569" }
            ]
          };
        }
      }
    ];

    const split = splits[Math.floor(Math.random() * splits.length)];
    
    let askText = "";
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A baker has a ${split.origShape} cake with ${split.origPairs} pairs of ${split.focusProp}. He cuts the cake straight across, forming exactly 2 ${split.piecesName}. Calculate the total number of pairs of ${split.focusProp} the 2 pieces have, and find how many pairs were lost compared to the uncut cake."`;
      const stepsArr = [
        { label: `Visually check the 2 pieces. How many pairs of ${split.focusProp} do they have in TOTAL?`, expectedAnswer: String(split.newPairs), acceptedAnswers: [] },
        { label: "How many pairs were lost compared to the uncut cake?", expectedAnswer: String(split.lost), acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A ${split.origShape} (${split.origPairs} pairs of ${split.focusProp}) is cut into 2 ${split.piecesName}. How many FEWER pairs of ${split.focusProp} are there now compared to the original shape?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:\n"A ${split.origShape} is cut into 2 ${split.piecesName}. How many pairs of ${split.focusProp} do the 2 pieces have in total?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: split.getVisual().polygons,
        showGrid: false
      }
    });

    systemPrompt = `You are generating a Primary 3 Math question.
${getFormatInstructions(visualEngineStr, inputRequirementStr)}
Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${isMCQ ? split.lost : isStructure ? split.lost : split.newPairs}

CRITICAL: Do not explain the math inside the questionText. Leave it as a puzzle for the student.
`;
  }

  return { aiPrompt: systemPrompt };
};
