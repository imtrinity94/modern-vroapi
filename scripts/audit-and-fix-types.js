const fs = require('fs');
const path = require('path');

const pluginsDir = path.resolve('vro-doc-site/src/data/plugins');

if (!fs.existsSync(pluginsDir)) {
    console.error(`Directory not found: ${pluginsDir}`);
    process.exit(1);
}

let issuesFound = 0;
let filesModified = 0;

function isSuspicious(value) {
    if (typeof value !== 'string') return false;
    // Look for [Word (starts with [ followed by word char, and NOT followed by ])
    // OR Array/Prefix
    if (/\[([a-zA-Z][a-zA-Z0-9_]*)\b(?![\]])/.test(value)) return true;
    if (/Array\/([a-zA-Z0-9_.:]+)(\[\])?/.test(value)) return true;
    return false;
}

function fixString(value) {
    let newValue = value;
    // Replace [Word with Word[]
    newValue = newValue.replace(/\[([a-zA-Z][a-zA-Z0-9_]*)\b(?![\]])/g, '$1[]');

    // Replace Array/Word or Array/Word[] with Word[]
    // If it was Array/Word[], $2 catches [], we ignore it and append [] to $1
    // If it was Array/Word, $2 is undefined, we append [] to $1
    newValue = newValue.replace(/Array\/([a-zA-Z0-9_.:]+)(\[\])?/g, '$1[]');

    return newValue;
}

function scanAndFix(obj, filePath, fix = false) {
    let modified = false;

    if (Array.isArray(obj)) {
        for (const item of obj) {
            if (scanAndFix(item, filePath, fix)) modified = true;
        }
    } else if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
            const value = obj[key];
            if (typeof value === 'object') {
                if (scanAndFix(value, filePath, fix)) modified = true;
            } else if (typeof value === 'string') {
                // Check relevant fields or just all strings?
                // keys: type, returnType, parameters mainly.
                if (['type', 'returnType', 'parameters'].includes(key)) {
                    if (isSuspicious(value)) {
                        console.log(`[${path.basename(filePath)}] Found issue in '${key}': "${value}"`);
                        issuesFound++;

                        if (fix) {
                            const newValue = fixString(value);
                            console.log(`   -> Fixed: "${newValue}"`);
                            obj[key] = newValue;
                            modified = true;
                        }
                    }
                }
            }
        }
    }
    return modified;
}

const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');

console.log(`Scanning plugins directory... (Fix mode: ${shouldFix})`);

fs.readdirSync(pluginsDir).forEach(file => {
    if (file.endsWith('.json')) {
        const filePath = path.join(pluginsDir, file);
        try {
            let fileContent = fs.readFileSync(filePath, 'utf8');
            // Strip BOM if present
            if (fileContent.charCodeAt(0) === 0xFEFF) {
                fileContent = fileContent.slice(1);
            }

            const content = JSON.parse(fileContent);
            if (scanAndFix(content, filePath, shouldFix)) {
                if (shouldFix) {
                    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
                    filesModified++;
                }
            }
        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    }
});

console.log('--------------------------------------------------');
console.log(`Scan complete.`);
console.log(`Total issues found: ${issuesFound}`);
if (shouldFix) {
    console.log(`Files modified: ${filesModified}`);
} else {
    console.log(`Run with --fix to apply changes.`);
}
