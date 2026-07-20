const fs = require('fs');
const path = require('path');
const dir = 'c:/Users/user/Desktop/HERITAGE APP/HTML';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace ../HTML/something.html with something.html
  content = content.replace(/href=\"\.\.\/HTML\/([^\"]+)\"/g, 'href=\"$1\"');
  
  // Remove onclick=\"navigate('...')\" from links that already have an href
  content = content.replace(/onclick=\"navigate\([^\)]+\)\"/g, '');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Fixed ' + file);
});
