const fs = require('fs');
const path = require('path');

const filePath = path.resolve('vro-doc-site/src/data/plugins/o11n-plugin-vum.json');
try {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`Read ${content.length} characters.`);
    JSON.parse(content);
    console.log('JSON parse successful');
} catch (e) {
    console.error('JSON parse failed:', e.message);
}
