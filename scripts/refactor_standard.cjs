const fs = require('fs');
const file = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/geometry-3d-shapes/identifying-3d-shapes/standard.js';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');

const newLogic = `  if (activeVariant === 'standard_dual_attribute_pattern') {
    const patternLength = getRandomInt(7, 10);
    const templates = [
      [0, 1, 2], [0, 0, 1], [0, 1, 1], 
      [0, 1, 2, 3], [0, 0, 1, 1], [0, 1, 1, 2], [0, 1, 2, 2], 
      [0, 1, 2, 3, 4], [0, 0, 1, 1, 2], [0, 1, 1, 2, 2], [0, 1, 2, 2, 3] 
    ];
    const template = getRandomElement(templates);
    const coreSize = template.length;
    
    // Pick 2 attributes to change
    const attributes = ['shape', 'color', 'size', 'orientation'];
    const changingAttrs = attributes.sort(() => 0.5 - Math.random()).slice(0, 2);
    
    const isShapeChanging = changingAttrs.includes('shape');
    const isColorChanging = changingAttrs.includes('color');
    const isSizeChanging = changingAttrs.includes('size');
    const isOrientationChanging = changingAttrs.includes('orientation');
    
    // Determine static properties if they don't change
    let staticShape = 'cube';
    if (!isShapeChanging) {
      staticShape = getRandomElement(isOrientationChanging ? ['cuboid', 'cone', 'cylinder'] : SHAPES_3D);
    }
    const staticColor = isColorChanging ? null : getRandomElement(COLORS);
    const staticSizeIdx = isSizeChanging ? null : getRandomInt(0, 1); // 0=Big, 1=Small
    const staticOIdx = isOrientationChanging ? null : 0; // Default rot [0,0,0]
    
    // Pools for changing attributes
    const shapesPool = isOrientationChanging 
      ? ['cuboid', 'cone', 'cylinder'].sort(() => 0.5 - Math.random()) 
      : [...SHAPES_3D].sort(() => 0.5 - Math.random());
      
    const colorsPool = [...COLORS].sort(() => 0.5 - Math.random());
    const sizesPool = [0, 1].sort(() => 0.5 - Math.random());
    const commonAxes = ['Y', 'X', 'Z'].sort(() => 0.5 - Math.random());
    
    const uniqueIds = [...new Set(template)];
    const comboMap = {};
    
    uniqueIds.forEach((id, idx) => {
      comboMap[id] = {
        shape: isShapeChanging ? shapesPool[idx % shapesPool.length] : staticShape,
        color: isColorChanging ? colorsPool[idx % colorsPool.length] : staticColor,
        sizeIdx: isSizeChanging ? sizesPool[idx % sizesPool.length] : staticSizeIdx,
        axis: isOrientationChanging ? commonAxes[idx % commonAxes.length] : null
      };
    });
    
    const coreUnit = template.map(id => comboMap[id]);
    
    const pattern = [];
    for (let i = 0; i < patternLength; i++) {
      pattern.push(coreUnit[i % coreSize]);
    }
    
    const validMissingIndices = [];
    for (let i = 0; i < patternLength; i++) {
      const coreIdx = i % coreSize;
      let count = 0;
      for (let j = 0; j < patternLength; j++) {
        if (j % coreSize === coreIdx) count++;
      }
      if (count > 1) validMissingIndices.push(i);
    }
    const missingIdx = getRandomElement(validMissingIndices);
    const missingItem = pattern[missingIdx];
    
    // Determine compass if orientation is changing
    let compassShape = null;
    let getOrientationName = (item) => '';
    if (isOrientationChanging) {
      // Find the first visible shape to be the compass shape
      compassShape = pattern.find((_, idx) => idx !== missingIdx).shape;
      getOrientationName = (item) => ORIENTATION_MAP[compassShape].find(o => o.axis === item.axis).name;
    }
    
    const sizes = [160, 55];
    const sizeNames = ['Big', 'Small'];
    
    const formatItemName = (item) => {
      let parts = [];
      if (isSizeChanging) parts.push(sizeNames[item.sizeIdx]);
      if (isColorChanging) parts.push(getColorName(item.color));
      // Noun is always included
      parts.push(formatShapeName(item.shape));
      if (isOrientationChanging) parts.push(getOrientationName(item));
      return parts.join(' ');
    };
    
    actualAnswer = formatItemName(missingItem);
    
    const attrNames = changingAttrs.map(a => a.charAt(0).toUpperCase() + a.slice(1).replace('Color', 'Colour')).join(' and ');

    shortText = "Look at the pattern. What is the missing shape?";
    structureText = "Identify the missing shape in the pattern.";
    
    hintStr = \`Look at the \${attrNames} of the shapes. Find the repeating block of \${coreSize} shapes.\`;
    
    const step1 = \`Observe the pattern to find the repeating block.\`;
    const step2 = \`The core repeating sequence is made of \${coreSize} shapes:\`;
    const step3 = coreUnit.map((item, idx) => \`\${idx + 1}. \${formatItemName(item)}\`).join(', ');
    const step4 = \`The missing shape is at position \${missingIdx + 1} in the sequence.\`;
    const step5 = \`Following the repeating rule, the missing shape must be a \${actualAnswer}.\`;
    
    stepsStr = JSON.stringify([step1, step2, step3, step4, step5]);

    structureSteps = [
      { label: "Changing attributes", expectedAnswer: attrNames },
      { label: "Core pattern length", expectedAnswer: String(coreSize) },
      { label: "Missing shape", expectedAnswer: actualAnswer }
    ];

    const components = pattern.map((item, idx) => {
      if (idx === missingIdx) {
        return {
          componentToRender: "HTML_CONTENT",
          componentData: { html: "<div class='text-6xl font-black text-slate-300 px-4'>?</div>" }
        };
      }
      
      let rotation = [0, 0, 0];
      if (isOrientationChanging) {
        rotation = ORIENTATION_MAP[item.shape].find(o => o.axis === item.axis).rot;
      } else if (item.shape === 'cube') {
         rotation = ORIENTATION_MAP['cube'][0].rot;
      } else {
         rotation = ORIENTATION_MAP[item.shape][0].rot;
      }
      
      return {
        componentToRender: "SHAPE_3D",
        componentData: { 
          shape: item.shape, 
          color: item.color, 
          size: isSizeChanging ? sizes[item.sizeIdx] : 100, 
          rotation: rotation 
        }
      };
    });

    visualEngineStr = JSON.stringify({
      componentToRender: "SHAPE_3D_PATTERN",
      componentData: { sequence: components, showCompass: isOrientationChanging }
    });

    if (isMCQ) {
      mcqOptions = [actualAnswer];
      const distractors = new Set();
      while (distractors.size < 3) {
        let distItem = { ...missingItem };
        if (isShapeChanging) distItem.shape = getRandomElement(shapesPool);
        if (isColorChanging) distItem.color = getRandomElement(colorsPool);
        if (isSizeChanging) distItem.sizeIdx = getRandomElement(sizesPool);
        if (isOrientationChanging) distItem.axis = getRandomElement(commonAxes);
        
        const dist = formatItemName(distItem);
        if (dist !== actualAnswer) distractors.add(dist);
      }
      mcqOptions.push(...Array.from(distractors));
    }`;

const before = lines.slice(0, 48).join('\n');
const after = lines.slice(637).join('\n');

fs.writeFileSync(file, before + '\n' + newLogic + '\n' + after);
console.log('Success');
