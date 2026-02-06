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
    // Actually the previous issue showed "[VersionHistoryItem" which had no closing bracket.
    // Also "[string"
    // But invalid ones like "[string" (case sensitive?) often appear.

    // Regex: Matches a string containing "[" followed immediately by alphanumerics, 
    // but checks to ensure it's likely a malformed array type.
    // We want to catch "[String" or "[string" or "[Any" appearing at start or after a space/separator.
    // But we must be careful not to catch valid things if any (e.g. regex usage).

    // In the previous step we saw: "returnType": "[String"
    // "parameters": "Object object, [string tags"

    return /\[[a-zA-Z][a-zA-Z0-9_]*\b/.test(value) && !/\[[a-zA-Z][a-zA-Z0-9_]*\]/.test(value);
}

function fixString(value) {
    // Replace [Word with Word[]
    // Logic: Find occurrences of [Word where there isn't a closing ]

    // This regex looks for [Variable and replaces with Variable[]
    // It purposefully avoids matching things that already have brackets like [nums].
    // But wait, the issue is "[String" -> "String[]".

    // In parameters string: "Object object, [string tags" -> "Object object, string[] tags"

    return value.replace(/\[([a-zA-Z][a-zA-Z0-9_]*)\b(?![\]])/g, '$1[]');
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
