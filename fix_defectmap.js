const fs = require('fs');
const glob = require('glob'); // use standard fs traversing

function traverse(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        let fullPath = dir + '/' + file;
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath, callback);
        } else if (fullPath.endsWith('.js')) {
            callback(fullPath);
        }
    });
}

traverse('src/lib/syllabus/math/primary-1/whole-numbers', (file) => {
    let code = fs.readFileSync(file, 'utf8');
    
    // We want to move defectMap initialization outside the if (isMCQ) block.
    // Instead of doing complex parsing, let's just make defectMap default to an empty object,
    // and extract the defectMap specific assignments if they exist.
    // Actually, it's safer to just dynamically inject a fallback in the JSON TEMPLATE!
    
    // Wait, in JSON TEMPLATE we have:
    // "defectMap": ${defectMap ? JSON.stringify(defectMap) : 'null'}
    // Let's replace it with:
    // "defectMap": ${defectMap ? JSON.stringify(defectMap) : (typeof isMCQ !== 'undefined' && !isMCQ && typeof answer === 'string' && !isNaN(parseInt(answer)) ? JSON.stringify({ [String(parseInt(answer) + 1)]: "CARELESS_CALCULATION", [String(parseInt(answer) - 1)]: "CARELESS_CALCULATION", [String(parseInt(answer) + 10)]: "CARELESS_CALCULATION", [String(parseInt(answer) - 10)]: "CARELESS_CALCULATION" }) : 'null')}
    
    // BUT we have specific wrongOpAnswers! It is better to just manually change addition-subtraction since the user is looking at that right now.
});
