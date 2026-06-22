const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'data.json');
let content = fs.readFileSync(filePath, 'utf8');

// Replace variations of the address
content = content.replace(/Мекен-жайы:/g, 'Мекен жайымыз:');
content = content.replace(/Алматы облысы, Кеген ауданы/g, 'Қарағанды обылысы, Нура ауданы');
content = content.replace(/Алматы облысы, Кеген\\nауданы/g, 'Қарағанды обылысы, Нура\\nауданы');
content = content.replace(/Алматы облысы, Кеген/g, 'Қарағанды обылысы, Нура');
content = content.replace(/“Ақниет”/g, "‘’Береке’’");
content = content.replace(/"Ақниет"/g, "‘’Береке’’");
content = content.replace(/«Ақниет»/g, "‘’Береке’’");
content = content.replace(/Ақниет/g, "Береке"); // fallback

fs.writeFileSync(filePath, content, 'utf8');
console.log('Replaced address in data.json');
