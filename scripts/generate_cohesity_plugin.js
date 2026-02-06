const fs = require('fs');
const path = require('path');

const mdPath = path.resolve('Cohesity_Docs_Generated.md');
const pluginId = 'o11n-plugin-cohesity';
const pluginName = 'Cohesity';
const outputJsonPath = path.resolve(`vro-doc-site/src/data/plugins/${pluginId}.json`);
const indexJsonPath = path.resolve('vro-doc-site/src/data/index.json');
const searchIndexPath = path.resolve('vro-doc-site/src/data/search-index.json');

function cleanType(type) {
    if (!type) return "void";
    let cleaned = type.replace(/`/g, '').trim();
    // Fix Array/Prefix
    cleaned = cleaned.replace(/Array\/([a-zA-Z0-9_.:]+)(\[\])?/g, '$1[]');
    // Fix [Type
    cleaned = cleaned.replace(/\[([a-zA-Z][a-zA-Z0-9_]*)\b(?![\]])/g, '$1[]');
    return cleaned;
}

function parseMarkdown(mdContent) {
    const classes = []; // Array for final output

    // Split by Class Header "## "
    const classChunks = mdContent.split(/^## /m).slice(1); // Ignore preamble

    classChunks.forEach(chunk => {
        const lines = chunk.split('\n');
        const className = lines[0].trim();
        const classObj = {
            name: className,
            description: "",
            attributes: [],
            methods: []
        };

        // Extract Description
        const descMatch = chunk.match(/\*\*Description:\*\* (.*)/);
        if (descMatch) {
            classObj.description = descMatch[1].trim();
        }

        // Extract Attributes Table
        if (chunk.includes('### Attributes')) {
            const attrSection = chunk.split('### Attributes')[1].split('### Methods')[0].split(/^## /m)[0];
            const tableLines = attrSection.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---'));

            if (tableLines.length > 1) {
                // Header: | Name | Description | Type | Read-only |
                // Indices in split('|'): 0="", 1=Name, 2=Description, 3=Type, 4=Read-only, 5=""
                for (let i = 1; i < tableLines.length; i++) {
                    const cells = tableLines[i].split('|');
                    if (cells.length >= 5) {
                        const name = cells[1].trim().replace(/`/g, '');
                        const desc = cells[2].trim();
                        const rawType = cells[3].trim();
                        const readOnlyText = cells[4].trim();
                        const readOnly = readOnlyText.toLowerCase() === 'yes';

                        classObj.attributes.push({
                            name: name,
                            description: desc,
                            type: cleanType(rawType),
                            isReadonly: readOnly
                        });
                    }
                }
            }
        }

        // Extract Methods
        if (chunk.includes('### Methods')) {
            const methodSection = chunk.split('### Methods')[1];
            const methodChunks = methodSection.split(/^#### `/m).slice(1);

            methodChunks.forEach(mChunk => {
                const lines = mChunk.split('\n');
                const methodName = lines[0].split('`')[0];

                const methodObj = {
                    name: methodName,
                    description: "",
                    parameters: "",
                    returnType: "void"
                };

                // Description
                let descriptionLines = [];
                for (let i = 1; i < lines.length; i++) {
                    const line = lines[i].trim();
                    if (!line) continue;
                    if (line.startsWith('**Parameters:**') || line.startsWith('**Returns:**') || line.startsWith('---')) break;
                    descriptionLines.push(line);
                }
                methodObj.description = descriptionLines.join(' ');

                // Parameters
                if (mChunk.includes('**Parameters:**')) {
                    const paramSection = mChunk.split('**Parameters:**')[1].split('**Returns:**')[0];
                    const pLines = paramSection.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---'));
                    if (pLines.length > 1) {
                        // Header: | Name | Type | Description |
                        // Indices: 1=Name, 2=Type, 3=Description
                        const params = [];
                        for (let i = 1; i < pLines.length; i++) {
                            const cells = pLines[i].split('|');
                            if (cells.length >= 3) {
                                const pName = cells[1].trim().replace(/`/g, '');
                                const pType = cells[2].trim();
                                params.push(`${pName}: ${cleanType(pType)}`);
                            }
                        }
                        methodObj.parameters = params.join(', ');
                    }
                }

                // Returns
                const retMatch = mChunk.match(/\*\*Returns:\*\* `([^`]+)`/);
                if (retMatch) {
                    methodObj.returnType = cleanType(retMatch[1]);
                } else {
                    // Sometimes returns might be just **Returns:** void (no backticks?)
                    const retMatchText = mChunk.match(/\*\*Returns:\*\* (.*)/);
                    if (retMatchText) {
                        methodObj.returnType = cleanType(retMatchText[1]);
                    }
                }

                classObj.methods.push(methodObj);
            });
        }

        classes.push(classObj);
    });

    return classes;
}

if (!fs.existsSync(mdPath)) {
    console.error(`Markdown file not found: ${mdPath}`);
    process.exit(1);
}

console.log(`Parsing ${mdPath}...`);
const mdContent = fs.readFileSync(mdPath, 'utf8');
const parsedClasses = parseMarkdown(mdContent);
console.log(`Found ${parsedClasses.length} classes.`);

const pluginData = {
    name: pluginName,
    description: `API Reference for ${pluginName}`,
    classes: parsedClasses
};

// 1. Write Plugin JSON
fs.writeFileSync(outputJsonPath, JSON.stringify(pluginData, null, 2));
console.log(`Created plugin file: ${outputJsonPath}`);

// 2. Update index.json
const indexData = JSON.parse(fs.readFileSync(indexJsonPath, 'utf8'));
const exists = indexData.find(p => p.id === pluginId);
if (!exists) {
    indexData.push({ id: pluginId, name: pluginName });
    // Sort by ID or Name? Usually loosely sorted. I'll just push.
    // Sort properly to be nice
    indexData.sort((a, b) => a.id.localeCompare(b.id));

    fs.writeFileSync(indexJsonPath, JSON.stringify(indexData, null, 2));
    console.log(`Updated index.json with ${pluginName}`);
} else {
    console.log(`Index already contains ${pluginName}`);
}

// 3. Update search-index.json
// structure: { plugins: [{id, name}], classes: [{n, p}] }
const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

// Update plugins list in search index
const siPluginExists = searchIndex.plugins.find(p => p.id === pluginId);
if (!siPluginExists) {
    searchIndex.plugins.push({ id: pluginId, name: pluginName });
}

// Update classes
// We need to remove old classes for this plugin if they exist (re-indexing)
// Filtering out old entries for this plugin (p === pluginId)
// But searchIndex classes might not have p if it's optimized? No, they have p.
// Actually, let's just append new ones. Or filter out old ones first to avoid dupes if running twice.

const existingClasses = new Set(searchIndex.classes.filter(c => c.p === pluginId).map(c => c.n));
let addedCount = 0;

parsedClasses.forEach(c => {
    if (!existingClasses.has(c.name)) {
        searchIndex.classes.push({ n: c.name, p: pluginId });
        addedCount++;
    }
});

fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex)); // Minified write is fine
console.log(`Updated search-index.json with ${addedCount} new classes.`);

console.log('Done.');
