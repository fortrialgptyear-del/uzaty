const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data.json');
let content = fs.readFileSync(filePath, 'utf8');

// Replace variations of the name
content = content.replace(/Мақпалдың/g, 'Ләзиманың');
content = content.replace(/Мақпал/g, 'Ләзима');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced Мақпал with Ләзима in data.json');
