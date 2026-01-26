
import fs from 'fs';
import path from 'path';

const jsonPath = 'c:/Users/M.Goyal/OneDrive - Midis services - FZ LLC/Documents/GitHub/modern-vroapi/vro-doc-site/scraped_data/1.0.0.json';
const assetPath = 'c:/Users/M.Goyal/OneDrive - Midis services - FZ LLC/Documents/GitHub/modern-vroapi/vro-doc-site/dist/assets/o11n-core-rLXfgAi0.js';

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const classesStr = JSON.stringify(data.classes);

// Escape backticks if any (unlikely in this data but good practice)
const escapedClasses = classesStr.replace(/`/g, '\\`').replace(/\$/g, '\\$');

let assetContent = fs.readFileSync(assetPath, 'utf8');

// Use regex to find the JSON.parse(...) part
// The original looks like t=JSON.parse(`[...]`)
const regex = /(t=JSON\.parse\(`)(.*?)(\`\))/;
const newAssetContent = assetContent.replace(regex, `$1${escapedClasses}$3`);

fs.writeFileSync(assetPath, newAssetContent);
console.log('Successfully updated dist asset with new classes.');
