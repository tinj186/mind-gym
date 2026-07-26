const fs = require('fs');

let content = fs.readFileSync('src/lib/syllabus/math/primary-2/measurement-time/measuring-time/advanced.js', 'utf8');

// Replace formatTime with formatTimeWithPeriod in the file where needed
// Actually, it's safer to just write the new content.
