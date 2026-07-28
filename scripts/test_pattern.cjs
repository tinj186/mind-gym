const { identifying3DShapesBlueprint } = require('./src/lib/syllabus/math/primary-2/geometry-3d-shapes/identifying-3d-shapes.js');

try {
  for(let i=0; i<100; i++) {
    identifying3DShapesBlueprint.generate('standard', 'standard_dual_attribute_pattern', 'Short Question');
  }
  console.log("standard_dual_attribute_pattern NO CRASH");
} catch(e) {
  console.error("CRASH", e);
}
