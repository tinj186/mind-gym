const fs = require('fs');
const path = require('path');

const originalFile = fs.readFileSync('src/lib/utils/variable-bank.js', 'utf8');
const lines = originalFile.split('\n');

// Target directory
const dir = 'src/lib/utils/variable-bank';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// 1. Names and contexts: lines 1 to 206
const namesAndContexts = lines.slice(0, 206).join('\n');
fs.writeFileSync(path.join(dir, 'names-and-contexts.js'), namesAndContexts);

// 2. Graph themes: lines 207 to 1762
const graphThemes = lines.slice(206, 1762).join('\n');
fs.writeFileSync(path.join(dir, 'graph-themes.js'), graphThemes);

// 3. Length items: 1763 to 1804
const lengthLines = lines.slice(1762, 1804).join('\n');

// 4. Divisible foods & objects: 1805 to 1938
const divisibleLines = lines.slice(1804, 1938).join('\n');
fs.writeFileSync(path.join(dir, 'divisible-items.js'), divisibleLines);

// 5. Geometry base: 1939 to 1965
const geometryBase = lines.slice(1938, 1965).join('\n');

// 6. Mass & measurement items: 1966 to 2141
const massLines = lines.slice(1965, 2141).join('\n');

// 7. Words and emojis: 2142 to 2193
const wordsAndEmojis = lines.slice(2141, 2193).join('\n');
fs.writeFileSync(path.join(dir, 'words-and-emojis.js'), wordsAndEmojis);

// 8. Time activities: 2194 to 2368
const timeLines = lines.slice(2193, 2368).join('\n');

// 9. 3D objects: 2369 to 2484
const geometry3D = lines.slice(2368, 2484).join('\n');

// 10. Liquids & units: 2485 to end
const liquidsLines = lines.slice(2484).join('\n');

// Combine Geometry: geometryBase + geometry3D
const geometryContent = `${geometryBase}\n\n${geometry3D}\n`;
fs.writeFileSync(path.join(dir, 'geometry.js'), geometryContent);

// Combine Measurements: lengthLines + massLines + timeLines + liquidsLines
const measurementsContent = `${lengthLines}\n\n${massLines}\n\n${timeLines}\n\n${liquidsLines}\n`;
fs.writeFileSync(path.join(dir, 'measurements.js'), measurementsContent);

// Build barrel file: src/lib/utils/variable-bank.js
const barrelContent = `/**
 * VARIABLE BANK - Centralized Thematic Repository
 * Re-exports all domain-specific variable banks for seamless backwards compatibility.
 */

export * from './variable-bank/names-and-contexts.js';
export * from './variable-bank/graph-themes.js';
export * from './variable-bank/divisible-items.js';
export * from './variable-bank/geometry.js';
export * from './variable-bank/measurements.js';
export * from './variable-bank/words-and-emojis.js';
`;

fs.writeFileSync('src/lib/utils/variable-bank.js', barrelContent);

console.log('✅ variable-bank.js modularization complete!');
