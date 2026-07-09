const fs = require('fs');
const path = require('path');

const dir = '/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus/math/primary-2/whole-numbers-numbers-up-to-1000';

function walk(currentDir) {
  const files = fs.readdirSync(currentDir);
  for (const file of files) {
    const fullPath = path.join(currentDir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.js')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      const searchStr = `  return {
    systemPrompt: "You are an expert Singapore MOE syllabus Math curriculum designer.",
    humanPrompt: aiPrompt
  };`;
  
      const replaceStr = `  return {
    aiPrompt: aiPrompt
  };`;
  
      if (content.includes(searchStr)) {
        let newContent = content.replace(searchStr, replaceStr);
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log('Fixed ' + fullPath);
      }
    }
  }
}

walk(dir);
