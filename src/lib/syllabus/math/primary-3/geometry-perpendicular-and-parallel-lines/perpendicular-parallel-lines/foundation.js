import { getRandomNames } from '../../../../../utils/variable-bank.js';

export const foundationLogic = (variant, isMCQ, isShort, isStructure, getFormatInstructions) => {
  let visualEngineStr = JSON.stringify({ componentToRender: "NONE", componentData: {} });
  let inputRequirementStr = "{}";
  let systemPrompt = "";

  const name = getRandomNames(1)[0];

  if (variant === 'foundation_grouping_parallel') {
    // Procedural mathematical polygon generator
    const generatePolygon = () => {
      const type = Math.floor(Math.random() * 4);
      let vertices = [];
      let parallelPairs = [];
      let name = "";
      let pairs = 0;
      
      const scaleX = 40 + Math.random() * 40; // 40 to 80
      const scaleY = 40 + Math.random() * 40;
      const skew = (Math.random() - 0.5) * 40; 
      
      if (type === 0) {
        // Trapezium (1 pair of parallel lines, top and bottom)
        name = "trapeziums";
        pairs = 1;
        const topWidth = 20 + Math.random() * 30;
        const bottomWidth = topWidth + 20 + Math.random() * 30;
        const offset = Math.random() * 40;
        vertices = [
          { x: 0, y: 0 },
          { x: bottomWidth, y: 0 },
          { x: offset + topWidth, y: scaleY },
          { x: offset, y: scaleY }
        ];
        parallelPairs = [[0, 1], [2, 1]]; // Edge 0 (bottom) and Edge 2 (top)
      } else if (type === 1) {
        // Parallelogram / Rhombus / Rectangle (2 pairs)
        name = "parallelograms";
        pairs = 2;
        vertices = [
          { x: 0, y: 0 },
          { x: scaleX, y: 0 },
          { x: scaleX + skew, y: scaleY },
          { x: skew, y: scaleY }
        ];
        parallelPairs = [[0, 1], [2, 1], [1, 2], [3, 2]]; // Edges 0,2 and Edges 1,3
      } else if (type === 2) {
        // Hexagon (3 pairs)
        name = "hexagons";
        pairs = 3;
        const hSkew = (Math.random() - 0.5) * 20;
        vertices = [
          { x: 20 - hSkew, y: 0 },
          { x: 60 + hSkew, y: 0 },
          { x: 80 + scaleX, y: 50 },
          { x: 60 + hSkew, y: 100 },
          { x: 20 - hSkew, y: 100 },
          { x: 0 - scaleX, y: 50 }
        ];
        parallelPairs = [[0, 1], [3, 1], [1, 2], [4, 2], [2, 3], [5, 3]]; // 0,3 | 1,4 | 2,5
      } else {
        // Pentagon (1 pair of parallel lines: left and right walls)
        name = "pentagons";
        pairs = 1;
        const width = 40 + Math.random() * 40;
        const wallHeight = 40 + Math.random() * 20;
        const roofHeight = wallHeight + 20 + Math.random() * 20;
        const peakOffset = width / 2 + (Math.random() - 0.5) * 20;
        vertices = [
          { x: 0, y: 0 },
          { x: width, y: 0 },
          { x: width, y: wallHeight },
          { x: peakOffset, y: roofHeight },
          { x: 0, y: wallHeight }
        ];
        // Edges: 0(bottom), 1(right), 2(roof right), 3(roof left), 4(left)
        // Parallel pairs: 1 and 4
        parallelPairs = [[1, 1], [4, 1]];
      }

      // Randomly apply an arbitrary 2D rotation so the shape never repeats its exact orientation
      const angle = Math.random() * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      vertices = vertices.map(v => ({
        x: v.x * cosA - v.y * sinA,
        y: v.x * sinA + v.y * cosA
      }));

      // Normalize uniformly to prevent shearing/stretching which destroys angles and parallel properties
      let minX = Math.min(...vertices.map(v => v.x));
      let minY = Math.min(...vertices.map(v => v.y));
      vertices = vertices.map(v => ({ x: v.x - minX, y: v.y - minY }));
      
      const maxX = Math.max(...vertices.map(v => v.x));
      const maxY = Math.max(...vertices.map(v => v.y));
      const maxDim = Math.max(maxX, maxY) || 1;
      
      vertices = vertices.map(v => ({ 
        x: Math.round((v.x / maxDim) * 100), 
        y: Math.round((v.y / maxDim) * 100) 
      }));

      return { name, pairs, vertices, parallelPairs };
    };

    const shape = generatePolygon();
    const qCount = 4 + Math.floor(Math.random() * 5); // 4 to 8
    const total = qCount * shape.pairs; 
    
    let askText = "";
    let stepsArr = [];
    
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"${name} draws exactly ${qCount} ${shape.name} on a poster. Calculate the total number of pairs of parallel lines on the poster."`;
      stepsArr = [
        { label: `Number of pairs of parallel lines in 1 ${shape.name.slice(0, -1)}:`, expectedAnswer: `${shape.pairs}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the total pairs of parallel lines for ${qCount} ${shape.name}:`, expectedAnswer: `${qCount} x ${shape.pairs} = ${total}`, acceptedAnswers: [`${qCount}*${shape.pairs}=${total}`, `${shape.pairs}*${qCount}=${total}`] },
        { label: "Total pairs of parallel lines:", expectedAnswer: `${total}`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"A group of identical ${shape.name} has exactly ${total} pairs of parallel lines in total. How many ${shape.name} are there in the group?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"How many pairs of parallel lines are there in ${qCount} ${shape.name}?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: [
          {
            vertices: shape.vertices,
            parallelPairs: shape.parallelPairs 
          }
        ],
        showGrid: false
      }
    });

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: Geometry
Type: ${isMCQ ? 'MCQ' : isStructure ? 'Structured' : 'Short Answer'}
Difficulty: Foundation

${getFormatInstructions(visualEngineStr, inputRequirementStr)}

Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${isMCQ ? qCount : total}
`;
  } else if (variant === 'foundation_grouping_perpendicular') {
    const generatePerpendicularPolygon = () => {
      const type = Math.floor(Math.random() * 4);
      let vertices = [];
      let perpendicularPairs = [];
      let name = "";
      let shortName = "";
      let pairs = 0;
      
      const scaleX = 40 + Math.random() * 40;
      const scaleY = 40 + Math.random() * 40;
      
      if (type === 0) {
        // Rectangle
        name = "rectangular notebooks";
        shortName = "rectangle";
        pairs = 4;
        vertices = [
          { x: 0, y: 0 }, { x: scaleX, y: 0 }, { x: scaleX, y: scaleY }, { x: 0, y: scaleY }
        ];
        perpendicularPairs = [0, 1, 2, 3];
      } else if (type === 1) {
        // Right-angled triangle
        name = "right-angled triangle signboards";
        shortName = "right-angled triangle";
        pairs = 1;
        vertices = [
          { x: 0, y: 0 }, { x: scaleX, y: 0 }, { x: 0, y: scaleY }
        ];
        perpendicularPairs = [0];
      } else if (type === 2) {
        // Right-angled trapezoid
        name = "right-angled trapezoid blocks";
        shortName = "right-angled trapezoid";
        pairs = 2;
        const topWidth = scaleX * (0.3 + Math.random() * 0.4);
        vertices = [
          { x: 0, y: 0 }, { x: scaleX, y: 0 }, { x: topWidth, y: scaleY }, { x: 0, y: scaleY }
        ];
        perpendicularPairs = [0, 3];
      } else {
        // House pentagon
        name = "pentagon shaped tiles";
        shortName = "pentagon";
        pairs = 2; 
        const width = scaleX;
        const wallHeight = scaleY * 0.6;
        const peakHeight = scaleY;
        vertices = [
          { x: 0, y: 0 }, { x: width, y: 0 }, { x: width, y: wallHeight }, 
          { x: width / 2, y: peakHeight }, { x: 0, y: wallHeight }
        ];
        perpendicularPairs = [0, 1];
      }
      
      // Randomly apply an arbitrary 2D rotation so the shape never repeats its exact orientation
      const angle = Math.random() * Math.PI * 2;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);
      vertices = vertices.map(v => ({
        x: v.x * cosA - v.y * sinA,
        y: v.x * sinA + v.y * cosA
      }));

      // Normalize uniformly to prevent shearing/stretching which destroys right angles
      let minX = Math.min(...vertices.map(v => v.x));
      let minY = Math.min(...vertices.map(v => v.y));
      vertices = vertices.map(v => ({ x: v.x - minX, y: v.y - minY }));
      
      const maxX = Math.max(...vertices.map(v => v.x));
      const maxY = Math.max(...vertices.map(v => v.y));
      const maxDim = Math.max(maxX, maxY) || 1;
      
      vertices = vertices.map(v => ({ 
        x: Math.round((v.x / maxDim) * 100), 
        y: Math.round((v.y / maxDim) * 100) 
      }));
      
      return { name, shortName, pairs, vertices, perpendicularPairs };
    };

    const shape = generatePerpendicularPolygon();
    const qCount = 3 + Math.floor(Math.random() * 5); // 3 to 7
    const total = qCount * shape.pairs; 
    
    let askText = "";
    let stepsArr = [];
    if (isStructure) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"${name} counts the pairs of perpendicular lines on ${qCount} ${shape.name}. Calculate the total number of pairs of perpendicular lines."`;
      stepsArr = [
        { label: `Number of pairs of perpendicular lines on 1 ${shape.shortName}:`, expectedAnswer: `${shape.pairs}`, acceptedAnswers: [] },
        { label: `Write the working equation to find the total pairs of perpendicular lines for ${qCount} ${shape.shortName}:`, expectedAnswer: `${qCount} x ${shape.pairs} = ${total}`, acceptedAnswers: [`${qCount}*${shape.pairs}=${total}`, `${shape.pairs}*${qCount}=${total}`] },
        { label: "Total pairs of perpendicular lines:", expectedAnswer: `${total}`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"A stack of identical ${shape.name} has a total of ${total} pairs of perpendicular lines. How many ${shape.shortName}s are in the stack?"`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `CRITICAL INSTRUCTION: Your "questionText" MUST BE EXACTLY the following string. DO NOT ADD OR CHANGE A SINGLE WORD:
"There are ${qCount} ${shape.name} in a classroom. How many pairs of perpendicular lines do they have in total?"`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: [
          {
            vertices: shape.vertices,
            perpendicularPairs: shape.perpendicularPairs 
          }
        ],
        showGrid: false
      }
    });

    systemPrompt = `You are generating a Primary 3 Math question.
Topic: Geometry
Type: ${isMCQ ? 'MCQ' : isStructure ? 'Structured' : 'Short Answer'}
Difficulty: Foundation

${getFormatInstructions(visualEngineStr, inputRequirementStr)}

Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${isMCQ ? qCount : total}
`;
  } else if (variant === 'foundation_letters_perpendicular') {
    const generateProceduralSticks = () => {
      // Helper to check if two line segments intersect
      const intersects = (p1, p2, p3, p4) => {
        const ccw = (A, B, C) => (C.y - A.y) * (B.x - A.x) > (B.y - A.y) * (C.x - A.x);
        return ccw(p1, p3, p4) !== ccw(p2, p3, p4) && ccw(p1, p2, p3) !== ccw(p1, p2, p4);
      };

      const generatePath = () => {
        const numTurns = 1 + Math.floor(Math.random() * 5); // 1 to 5 turns (pairs)
        
        let path, isValid = false;
        let attempts = 0;
        
        while (!isValid && attempts < 100) {
          attempts++;
          path = [{ x: 50, y: 50 }];
          let currentDir = Math.floor(Math.random() * 4); // 0: Up, 1: Right, 2: Down, 3: Left
          isValid = true;
          
          for (let i = 0; i <= numTurns; i++) {
            const length = 20 + Math.random() * 40;
            const lastPt = path[path.length - 1];
            const nextPt = { x: lastPt.x, y: lastPt.y };
            
            if (currentDir === 0) nextPt.y -= length;
            else if (currentDir === 1) nextPt.x += length;
            else if (currentDir === 2) nextPt.y += length;
            else if (currentDir === 3) nextPt.x -= length;
            
            // Check self-intersection with all previous segments except the immediately preceding one
            if (path.length > 2) {
              for (let j = 0; j < path.length - 2; j++) {
                if (intersects(path[j], path[j+1], lastPt, nextPt)) {
                  isValid = false;
                  break;
                }
              }
            }
            
            if (!isValid) break;
            
            path.push(nextPt);
            
            // Turn left or right for next segment
            const turn = Math.random() > 0.5 ? 1 : -1;
            currentDir = (currentDir + turn + 4) % 4;
          }
        }
        
        return { vertices: path, c: numTurns };
      };

      const chosen = [generatePath(), generatePath(), generatePath()];
      
      return chosen.map((shape, idx) => {
        let newVerts = shape.vertices;
        
        // Normalize coordinates to a standard bounding box
        let minX = Math.min(...newVerts.map(v => v.x));
        let minY = Math.min(...newVerts.map(v => v.y));
        newVerts = newVerts.map(v => ({ x: Math.round(v.x - minX), y: Math.round(v.y - minY) }));
        
        const maxX = Math.max(...newVerts.map(v => v.x));
        const maxY = Math.max(...newVerts.map(v => v.y));
        
        // Maximize height and width to make marking as easy as possible
        const targetWidth = 80;
        const targetHeight = 120;
        
        newVerts = newVerts.map(v => ({ 
          x: Math.round((v.x / (maxX || 1)) * targetWidth),
          y: Math.round((v.y / (maxY || 1)) * targetHeight)
        }));

        return { 
          short: `Wire ${String.fromCharCode(65 + idx)}`, // Wire A, Wire B, Wire C
          c: shape.c,
          vertices: newVerts, 
          perpendicularPairs: Array.from({length: shape.c}, (_, i) => i + 1) 
        };
      });
    };

    const chosen = generateProceduralSticks();
    const sum = chosen.reduce((acc, curr) => acc + curr.c, 0);
    const word = chosen.map(s => s.short).join(", ");
    
    let askText = "";
    if (isStructure) {
      askText = `STORY: ${name} bends wires to form three shapes: ${word}. Observe the visual to calculate the total number of pairs of perpendicular lines in these wire shapes.
      CRITICAL INSTRUCTION: DO NOT state how many pairs of perpendicular lines each shape has in the question text. The student must find that out themselves using the interactive visual.`;
      const stepsArr = [
        { label: `Number of pairs of perpendicular lines in the ${chosen[0].short}:`, expectedAnswer: `${chosen[0].c}`, acceptedAnswers: [] },
        { label: `Number of pairs of perpendicular lines in the ${chosen[1].short}:`, expectedAnswer: `${chosen[1].c}`, acceptedAnswers: [] },
        { label: `Number of pairs of perpendicular lines in the ${chosen[2].short}:`, expectedAnswer: `${chosen[2].c}`, acceptedAnswers: [] },
        { label: "Write the working equation to add the pairs from all three shapes together:", expectedAnswer: `${chosen[0].c} + ${chosen[1].c} + ${chosen[2].c} = ${sum}`, acceptedAnswers: [`${chosen[0].c}+${chosen[1].c}+${chosen[2].c}=${sum}`] },
        { label: "Total pairs of perpendicular lines:", expectedAnswer: `${sum}`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `STORY: What is the total number of pairs of perpendicular lines in these three wire shapes: ${word}?
      CRITICAL INSTRUCTION: DO NOT state how many pairs of perpendicular lines each shape has.`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `STORY: What is the total number of pairs of perpendicular lines in these three wire shapes: ${word}?
      CRITICAL INSTRUCTION: You are STRICTLY FORBIDDEN from mentioning or revealing how many pairs of perpendicular lines any single shape has.`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }

    const polygons = [];
    chosen.forEach((shape, index) => {
      // Space them out side-by-side
      const startX = 20 + (110 * index);
      const shiftedVertices = shape.vertices.map(v => ({ x: v.x + startX, y: v.y + 20 }));
      
      polygons.push({
        vertices: shiftedVertices,
        perpendicularPairs: shape.perpendicularPairs,
        strokeColor: "#3b82f6",
        fillColor: "transparent",
        isOpen: true // Renders as 1D stick without closing edge
      });
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "LINE_AND_POLYGON",
      componentData: {
        polygons: polygons,
        showGrid: false
      }
    });
    
    systemPrompt = `You are generating a Primary 3 Math question.
Topic: Geometry
Type: ${isMCQ ? 'MCQ' : isStructure ? 'Structured' : 'Short Answer'}
Difficulty: Foundation

${getFormatInstructions(visualEngineStr, inputRequirementStr)}

Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${sum}
`;
  } else if (variant === 'foundation_grid_relationships') {
    const isMasterDiagonal = Math.random() > 0.6;
    const masterAngle = isMasterDiagonal ? (Math.random() > 0.5 ? 45 : 135) : (Math.random() > 0.5 ? 0 : 90);
    
    // Generate 5 to 7 random lines
    const numLines = 5 + Math.floor(Math.random() * 3);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    
    let parallelCount = 0;
    let perpendicularCount = 0;
    
    const lines = [];
    
    // Helper to create a line given an angle (0, 45, 90, 135)
    const createLine = (angle, label, isMaster = false) => {
      const length = 60 + Math.random() * 80;
      const rad = (angle * Math.PI) / 180;
      
      // Keep lines within 0-300 bounding box roughly
      const startX = 50 + Math.random() * 200;
      const startY = 50 + Math.random() * 200;
      
      const endX = startX + Math.cos(rad) * length;
      const endY = startY - Math.sin(rad) * length; // -sin because Y goes down
      
      return {
        label,
        vertices: [{x: startX, y: startY}, {x: endX, y: endY}],
        isOpen: true,
        strokeColor: isMaster ? "#ef4444" : "#3b82f6", // Red for master, Blue for others
        isMaster,
        angle
      };
    };

    // Create Master Line
    const masterLine = createLine(masterAngle, "", true);
    lines.push(masterLine);
    
    // Create other lines
    for (let i = 0; i < numLines; i++) {
      // 0, 45, 90, 135, or even slightly off angles like 30, 60 for distractors
      const possibleAngles = [0, 90, 45, 135, 30, 60];
      const angle = possibleAngles[Math.floor(Math.random() * possibleAngles.length)];
      
      const line = createLine(angle, ""); // Removed label from distractor lines
      
      // Determine relationship
      const angleDiff = Math.abs(masterAngle - angle) % 180;
      if (angleDiff === 0) parallelCount++;
      else if (angleDiff === 90) perpendicularCount++;
      
      lines.push(line);
    }
    
    // Ensure we don't have overlapping line hitboxes by scattering them better if needed (omitted for brevity, randomized starts usually suffice)
    const totalRelated = parallelCount + perpendicularCount;
    
    const shortAskParallel = Math.random() > 0.5;
    
    let askText = "";
    if (isStructure) {
      askText = `STORY: A city planner draws a map of streets on a square grid. "Line X" (the red line) is Main Street. There are ${numLines} other streets scattered around the map. By looking closely at the grid, count how many streets are strictly parallel to Main Street, and how many are strictly perpendicular to it. Calculate the total number of streets that share one of these relationships with Main Street.`;
      const stepsArr = [
        { label: "Visually check the grid. How many lines are parallel to Line X?", expectedAnswer: `${parallelCount}`, acceptedAnswers: [] },
        { label: "Visually check the grid. How many lines are perpendicular to Line X?", expectedAnswer: `${perpendicularCount}`, acceptedAnswers: [] },
        { label: "Write the working equation to find the total number of these related lines:", expectedAnswer: `${parallelCount} + ${perpendicularCount} = ${totalRelated}`, acceptedAnswers: [`${parallelCount}+${perpendicularCount}=${totalRelated}`] },
        { label: "Total related lines:", expectedAnswer: `${totalRelated}`, acceptedAnswers: [] }
      ];
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `STORY: Look at the grid. Line X (the red line) is the reference line. How many other lines are either parallel OR perpendicular to Line X?`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `STORY: Look at the grid. Line X (the red line) is the reference line. How many other lines on the grid are ${shortAskParallel ? 'parallel' : 'perpendicular'} to Line X?`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }
    
    visualEngineStr = JSON.stringify({ 
      componentToRender: "LINE_AND_POLYGON", 
      componentData: {
        polygons: lines,
        showGrid: true
      } 
    });
    
    systemPrompt = `You are generating a Primary 3 Math question.
Topic: Geometry
Type: ${isMCQ ? 'MCQ' : isStructure ? 'Structured' : 'Short Answer'}
Difficulty: Foundation

${getFormatInstructions(visualEngineStr, inputRequirementStr)}

Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${isMCQ || isStructure ? totalRelated : (shortAskParallel ? parallelCount : perpendicularCount)}
`;
  } else {
    // foundation_labeled_polygon_edges
    // Generate an irregular rectilinear polygon (L-shape, T-shape, C-shape, Staircase)
    const templates = [
      { name: "L-shape", vertices: [{x:0,y:0}, {x:0,y:100}, {x:60,y:100}, {x:60,y:80}, {x:20,y:80}, {x:20,y:0}] },
      { name: "T-shape", vertices: [{x:0,y:0}, {x:80,y:0}, {x:80,y:20}, {x:50,y:20}, {x:50,y:100}, {x:30,y:100}, {x:30,y:20}, {x:0,y:20}] },
      { name: "C-shape", vertices: [{x:0,y:0}, {x:60,y:0}, {x:60,y:20}, {x:20,y:20}, {x:20,y:80}, {x:60,y:80}, {x:60,y:100}, {x:0,y:100}] },
      { name: "Staircase", vertices: [{x:0,y:0}, {x:0,y:60}, {x:40,y:60}, {x:40,y:100}, {x:100,y:100}, {x:100,y:40}, {x:60,y:40}, {x:60,y:0}] }
    ];
    
    let shape = templates[Math.floor(Math.random() * templates.length)];
    let newVerts = shape.vertices;
    
    // Random Scale
    const scaleX = 0.5 + Math.random() * 1.5;
    const scaleY = 0.5 + Math.random() * 1.5;
    newVerts = newVerts.map(v => ({ x: v.x * scaleX, y: v.y * scaleY }));
    
    // Random Flips
    if (Math.random() > 0.5) {
      const maxXX = Math.max(...newVerts.map(v => v.x));
      newVerts = newVerts.map(v => ({ x: maxXX - v.x, y: v.y }));
    }
    if (Math.random() > 0.5) {
      const maxYY = Math.max(...newVerts.map(v => v.y));
      newVerts = newVerts.map(v => ({ x: v.x, y: maxYY - v.y }));
    }
    
    // Normalize to bounding box
    let minX = Math.min(...newVerts.map(v => v.x));
    let minY = Math.min(...newVerts.map(v => v.y));
    newVerts = newVerts.map(v => ({ x: Math.round(v.x - minX), y: Math.round(v.y - minY) }));
    
    const maxX = Math.max(...newVerts.map(v => v.x));
    const maxY = Math.max(...newVerts.map(v => v.y));
    const targetWidth = 140 + Math.random() * 60;
    const targetHeight = 140 + Math.random() * 60;
    
    newVerts = newVerts.map(v => ({ 
      x: 100 + Math.round((v.x / (maxX || 1)) * targetWidth), // Offset to center in canvas roughly
      y: 50 + Math.round((v.y / (maxY || 1)) * targetHeight)
    }));

    const numSides = newVerts.length;
    
    // Determine edge orientations (Horizontal vs Vertical)
    const isEdgeHoriz = (p1, p2) => Math.abs(p1.y - p2.y) < 1; // Tolerance for floating point
    
    const edges = [];
    for (let i = 0; i < numSides; i++) {
      const p1 = newVerts[i];
      const p2 = newVerts[(i + 1) % numSides];
      edges.push({ isHoriz: isEdgeHoriz(p1, p2), idx: i });
    }
    
    // Generate Labels A, B, C...
    const labels = Array.from({length: numSides}, (_, i) => String.fromCharCode(65 + i));
    
    // Pick a random target edge
    const targetEdgeIdx = Math.floor(Math.random() * numSides);
    const targetIsHoriz = edges[targetEdgeIdx].isHoriz;
    
    const v1 = labels[targetEdgeIdx];
    const v2 = labels[(targetEdgeIdx + 1) % numSides];
    const targetLineName = `Line ${v1}${v2}`;
    
    // Collect parallel and perpendicular lines
    let parallelLines = [];
    let perpLines = [];
    
    for (let i = 0; i < numSides; i++) {
      if (i === targetEdgeIdx) continue;
      // Always store as alphabetically sorted pair (e.g. "AB" not "BA")
      const l1 = labels[i];
      const l2 = labels[(i + 1) % numSides];
      const lineStr = [l1, l2].sort().join('');
      
      if (edges[i].isHoriz === targetIsHoriz) {
        parallelLines.push(lineStr);
      } else {
        perpLines.push(lineStr);
      }
    }
    
    // Sort the collected arrays alphabetically
    parallelLines.sort();
    perpLines.sort();
    
    // Generate just a few acceptable spacing variants (no permutations needed because of alphabetical rule!)
    const generateFormats = (linesArr) => {
      if (linesArr.length === 0) return ["None", "none", "NO", "No"];
      const commaNoSpace = linesArr.join(",");
      const commaSpace = linesArr.join(", ");
      const linesSpace = linesArr.map(l => `Line ${l}`).join(", ");
      const andSpace = linesArr.join(" and ");
      return [commaSpace, commaNoSpace, linesSpace, andSpace];
    };
    
    const parallelAccepted = generateFormats(parallelLines);
    const perpAccepted = generateFormats(perpLines);
    
    let askText = "";
    if (isStructure) {
      askText = `STORY: A large garden is shaped like the irregular rectilinear polygon shown on your screen, with its corners labeled from A to ${labels[numSides-1]}. The gardener is looking at the fence named ${targetLineName}. By visually tracing the boundary of the garden, identify all OTHER fences (sides) that are perfectly parallel or perpendicular to ${targetLineName}.`;
      
      const stepsArr = [];
      
      stepsArr.push({ 
        label: `List all OTHER sides parallel to ${targetLineName} in alphabetical order (e.g. AB, CD):`, 
        expectedAnswer: parallelAccepted[0], 
        acceptedAnswers: parallelAccepted 
      });
      
      stepsArr.push({ 
        label: `List all OTHER sides perpendicular to ${targetLineName} in alphabetical order (e.g. AB, CD):`, 
        expectedAnswer: perpAccepted[0], 
        acceptedAnswers: perpAccepted 
      });
      
      stepsArr.push({ 
        label: "Now, count the TOTAL number of parallel sides listed above:", 
        expectedAnswer: `${parallelLines.length}`, 
        acceptedAnswers: [] 
      });
      
      stepsArr.push({ 
        label: "Count the TOTAL number of perpendicular sides listed above:", 
        expectedAnswer: `${perpLines.length}`, 
        acceptedAnswers: [] 
      });
      
      stepsArr.push({ 
        label: "Write the working equation to find the total number of these related sides combined:", 
        expectedAnswer: `${parallelLines.length} + ${perpLines.length} = ${parallelLines.length + perpLines.length}`, 
        acceptedAnswers: [`${parallelLines.length}+${perpLines.length}=${parallelLines.length + perpLines.length}`] 
      });
      
      inputRequirementStr = JSON.stringify({ inputType: "MULTI_STEP_INPUT", steps: stepsArr });
    } else if (isMCQ) {
      askText = `STORY: Look at the irregular shape drawn on the grid. Which of the following sides is parallel to ${targetLineName}?`;
      inputRequirementStr = JSON.stringify({ inputType: "MCQ_BUTTONS" });
    } else {
      askText = `STORY: Look at the labeled polygon. List all OTHER sides on this shape that are perpendicular to ${targetLineName} in alphabetical order (e.g. AB, CD):`;
      inputRequirementStr = `{"inputType": "STANDARD_TEXT"}`;
    }
    
    visualEngineStr = JSON.stringify({ 
      componentToRender: "LINE_AND_POLYGON", 
      componentData: {
        polygons: [{
          vertices: newVerts,
          vertexLabels: labels,
          strokeColor: "#3b82f6",
          fillColor: "rgba(59, 130, 246, 0.1)"
        }],
        showGrid: true
      } 
    });
    
    systemPrompt = `You are generating a Primary 3 Math question.
Topic: Geometry
Type: ${isMCQ ? 'MCQ' : isStructure ? 'Structured' : 'Short Answer'}
Difficulty: Foundation

${getFormatInstructions(visualEngineStr, inputRequirementStr)}

Generate the "content" JSON based on this logic:
${askText}
Final Answer: ${isMCQ ? parallelLines[0] || "None" : isStructure ? parallelLines.length + perpLines.length : perpAccepted[0]}
`;
  }

  return { aiPrompt: systemPrompt };
};
