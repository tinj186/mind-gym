const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getFiles(fullPath));
    } else {
      results.push({ path: fullPath, size: stat.size });
    }
  }
  return results;
}

const files = getFiles('./src')
  .filter(f => /\.(jsx?|tsx?|css|json)$/.test(f.path))
  .map(f => {
    const content = fs.readFileSync(f.path, 'utf8');
    const lines = content.split('\n').length;
    return { path: f.path, size: f.size, lines };
  });

files.sort((a, b) => b.lines - a.lines);

console.log('=== TOP 50 LARGEST FILES BY LINE COUNT IN SRC ===');
files.slice(0, 50).forEach((f, idx) => {
  const relPath = f.path.replace(/^\.\//, '');
  const kb = (f.size / 1024).toFixed(1);
  const num = String(idx + 1).padStart(2);
  const lines = String(f.lines).padStart(5);
  const size = String(kb).padStart(6);
  console.log(`${num}. ${relPath.padEnd(85)} | ${lines} lines | ${size} KB`);
});

// Summary by directory
const dirMap = {};
files.forEach(f => {
  const parts = f.path.split(path.sep);
  // e.g. src/lib/syllabus, src/components/math, etc.
  const topDir = parts.slice(0, 3).join('/');
  if (!dirMap[topDir]) dirMap[topDir] = { lines: 0, count: 0, size: 0 };
  dirMap[topDir].lines += f.lines;
  dirMap[topDir].size += f.size;
  dirMap[topDir].count += 1;
});

console.log('\n=== DIRECTORY BREAKDOWN (LINES & FILE COUNT) ===');
Object.entries(dirMap)
  .sort((a, b) => b[1].lines - a[1].lines)
  .forEach(([dir, stats]) => {
    const kb = (stats.size / 1024).toFixed(1);
    console.log(`${dir.padEnd(35)} | ${String(stats.count).padStart(3)} files | ${String(stats.lines).padStart(7)} lines | ${String(kb).padStart(8)} KB`);
  });
