const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if (file.endsWith('.js')) results.push(file);
        }
    });
    return results;
}

const files = walk('/Users/jwoshiteng/Downloads/mind-gym/src/lib/syllabus');
let count = 0;
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    if (content.includes('const zodType = type;')) {
        content = content.replace(/const zodType = type;/g, "const zodType = type === 'Short Question' ? 'SHORT_QUESTION' : type.toUpperCase();");
        fs.writeFileSync(file, content);
        count++;
    }
});
console.log('Replaced in ' + count + ' files.');
