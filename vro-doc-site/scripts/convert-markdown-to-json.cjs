const fs = require('fs');
const path = require('path');

const INPUT_FILE = 'C:\\Users\\M.Goyal\\OneDrive - Midis services - FZ LLC\\Documents\\GitHub\\api-explorer-to-md\\Infoblox_Docs_Generated.md';
const OUTPUT_FILE = path.join(__dirname, '../src/data/plugins/o11n-plugin-infoblox.json');

const parseMarkdown = () => {
    if (!fs.existsSync(INPUT_FILE)) {
        console.error(`Input file not found: ${INPUT_FILE}`);
        process.exit(1);
    }

    const content = fs.readFileSync(INPUT_FILE, 'utf-8');
    const lines = content.split(/\r?\n/);

    const plugin = {
        name: "Infoblox",
        description: "Infoblox IPAM Reference",
        classes: []
    };

    let currentClass = null;
    let mode = 'NONE'; // NONE, ATTRIBUTES, METHODS_WAITING, METHOD_DETAILS

    const saveCurrentClass = () => {
        if (currentClass) {
            plugin.classes.push(currentClass);
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // New Class
        if (line.startsWith('## ')) {
            saveCurrentClass();
            const className = line.replace('## ', '').trim();
            currentClass = {
                name: className,
                description: '',
                attributes: [],
                methods: []
            };
            mode = 'NONE';
            continue;
        }

        if (!currentClass) continue;

        // Description
        if (line.startsWith('**Description:**')) {
            currentClass.description = line.replace('**Description:**', '').trim();
            continue;
        }

        // Link not found
        if (line.includes('*Link not found in tree*')) {
            currentClass.description = "Detailed documentation not available.";
            // We could mark it isStub if we wanted, but existing schema doesn't strictly require it
            continue;
        }

        // Section Headers
        if (line.startsWith('### Attributes')) {
            mode = 'ATTRIBUTES';
            continue;
        }
        if (line.startsWith('### Methods')) {
            mode = 'METHODS';
            continue;
        }

        // Attributes Table Parsing
        if (mode === 'ATTRIBUTES' && line.startsWith('|') && !line.includes('---')) {
            const cols = line.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
            // Expected: Name, Description, Type, Read-only
            // Markdown: | `name` | Desc | `Type` | Yes/No |
            if (cols.length >= 4 && cols[0] !== 'Name') {
                const name = cols[0].replace(/`/g, '');
                const desc = cols[1];
                const type = cols[2].replace(/`/g, '');
                const readOnly = cols[3].toLowerCase() === 'yes';

                currentClass.attributes.push({
                    name: name,
                    description: desc,
                    type: type,
                    isReadonly: readOnly
                });
            }
        }

        // Methods Parsing
        if (mode === 'METHODS') {
            // Method Header: #### `methodName`
            if (line.startsWith('#### ')) {
                const methodName = line.replace('#### ', '').replace(/`/g, '').trim();

                // Read next few lines for description
                let methodDesc = '';
                let j = i + 1;
                while (j < lines.length && !lines[j].startsWith('**Parameters:**') && !lines[j].startsWith('**Returns:**') && !lines[j].startsWith('---') && !lines[j].startsWith('#### ')) {
                    if (lines[j].trim()) methodDesc += lines[j].trim() + ' ';
                    j++;
                }
                i = j - 1; // Update main pointer

                currentClass.methods.push({
                    name: methodName,
                    description: methodDesc.trim(),
                    parameters: '', // Will fill if found
                    returnType: 'void' // Default
                });
                continue;
            }

            // Parameters
            if (line.startsWith('**Parameters:**')) {
                // Determine which method this belongs to (the last one added)
                const currentMethod = currentClass.methods[currentClass.methods.length - 1];
                if (currentMethod) {
                    // Read table until blank line
                    let params = [];
                    let j = i + 1;
                    while (j < lines.length && !lines[j].startsWith('**Returns:**') && !lines[j].startsWith('---')) {
                        const pLine = lines[j].trim();
                        if (pLine.startsWith('|') && !pLine.includes('---') && !pLine.includes('Name')) {
                            const pCols = pLine.split('|').map(c => c.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
                            // Name, Type, Description
                            if (pCols.length >= 2) {
                                const pName = pCols[0].replace(/`/g, '');
                                const pType = pCols[1].replace(/`/g, '');
                                params.push(`${pName}: ${pType}`);
                            }
                        }
                        j++;
                    }
                    currentMethod.parameters = params.join(', ');
                    i = j - 1;
                }
            }

            // Returns
            if (line.startsWith('**Returns:**')) {
                const currentMethod = currentClass.methods[currentClass.methods.length - 1];
                if (currentMethod) {
                    const retType = line.replace('**Returns:**', '').replace(/`/g, '').trim();
                    currentMethod.returnType = retType;
                }
            }
        }
    }

    saveCurrentClass(); // Save last one

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(plugin, null, 4));
    console.log(`Parsed ${plugin.classes.length} classes. Saved to ${OUTPUT_FILE}`);
};

parseMarkdown();
