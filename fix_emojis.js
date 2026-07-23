const fs = require('fs');
const path = require('path');

const svgBuilding = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zm-8 7v8l8 5 8-5V9l-8 5-8-5z"/></svg>`;
const svgFlag = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>`;
const svgStarFull = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
const svgPlay = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>`;

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    // Favicon replacements
    if (content.includes('🏛️') && filePath.endsWith('.html')) {
        content = content.replace(/<text[^>]*>🏛️<\/text>/g, `<path d="M3 21v-2h2V8H3V6h18v2h-2v11h2v2H3Zm4-2h2V8H7v11Zm6 0h2V8h-2v11ZM2 6V4l10-3 10 3v2H2Z" fill="%23D4A547"/>`);
        content = content.replace(/ viewBox='0 0 100 100'/g, ` viewBox='0 0 24 24'`);
        // Remove generic 🏛️
        content = content.replace(/🏛️/g, svgBuilding);
        changed = true;
    }

    if (content.includes('⚑')) {
        content = content.replace(/⚑/g, svgFlag);
        changed = true;
    }
    
    // Some ★ are in text content or rating bars
    if (content.includes('★')) {
        content = content.replace(/★/g, svgStarFull);
        changed = true;
    }
    
    if (content.includes('&#9654;')) {
        content = content.replace(/&#9654;/g, svgPlay);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log("Updated", filePath);
    }
}

const dirs = [
    path.join(__dirname, 'HTML'),
    path.join(__dirname, 'JS'),
    path.join(__dirname, 'JS', 'components'),
    path.join(__dirname, 'CSS')
];

dirs.forEach(dir => {
    if(fs.existsSync(dir)){
        fs.readdirSync(dir).forEach(file => {
            if (file.endsWith('.html') || file.endsWith('.js') || file.endsWith('.css')) {
                processFile(path.join(dir, file));
            }
        });
    }
});
