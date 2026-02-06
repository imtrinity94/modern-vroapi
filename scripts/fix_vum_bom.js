const fs = require('fs');
const path = require('path');

const filePath = path.resolve('vro-doc-site/src/data/plugins/o11n-plugin-vum.json');
let content = fs.readFileSync(filePath, 'utf8');

if (content.charCodeAt(0) === 0xFEFF) {
    console.log('Removing BOM...');
    content = content.slice(1);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Fixed.');
} else {
    console.log('No BOM found.');
}
