const fs = require('fs');
const path = require('path');

const dir = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2';

function walk(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Fix backslash escapes
      let newContent = content.replace(/\\\`/g, '\`').replace(/\\\$/g, '$');
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Fixed ' + fullPath);
      }
    }
  }
}

walk(dir);
