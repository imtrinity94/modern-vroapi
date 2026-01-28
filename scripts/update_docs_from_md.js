const fs = require('fs');
const path = require('path');

const mappings = [
    {
        md: "C:\\Users\\mayank\\Documents\\GitHub\\API Explorer to table\\AD_Docs_Generated.md",
        json: "c:\\Users\\mayank\\Documents\\GitHub\\modern-vroapi\\vro-doc-site\\src\\data\\plugins\\o11n-plugin-activedirectory.json"
    },
    {
        md: "C:\\Users\\mayank\\Documents\\GitHub\\API Explorer to table\\AMQP_Docs_Generated.md",
        json: "c:\\Users\\mayank\\Documents\\GitHub\\modern-vroapi\\vro-doc-site\\src\\data\\plugins\\o11n-plugin-amqp.json"
    },
    {
        md: "C:\\Users\\mayank\\Documents\\GitHub\\API Explorer to table\\XML_Docs_Generated.md",
        json: "c:\\Users\\mayank\\Documents\\GitHub\\modern-vroapi\\vro-doc-site\\src\\data\\plugins\\o11n-plugin-xml.json"
    }
];

function parseMarkdown(mdContent) {
    const classes = {};
    
    // Split by Class Header "## "
    const classChunks = mdContent.split(/^## /m).slice(1); // Ignore preamble

    classChunks.forEach(chunk => {
        const lines = chunk.split('\n');
        const className = lines[0].trim();
        const classObj = {
            name: className,
            description: "",
            methods: [],
            attributes: [],
            hasAttributesSection: false
        };

        // Extract Description
        const descMatch = chunk.match(/\*\*Description:\*\* (.*)/);
        if (descMatch) {
            classObj.description = descMatch[1].trim();
        }

        // Extract Attributes Table
        if (chunk.includes('### Attributes')) {
            classObj.hasAttributesSection = true;
            const attrSection = chunk.split('### Attributes')[1].split('### Methods')[0].split(/^## /m)[0]; // robust split
            // Find table rows
            const tableLines = attrSection.split('\n').filter(l => l.trim().startsWith('|') && !l.includes('---'));
            // format: | Name | Description | Type | Read-only |
            // skip header
            if (tableLines.length > 1) {
                // Determine column indices from header
                const header = tableLines[0].split('|').map(s => s.trim()).filter(s => s);
                // Standard order seems to be Name, Description, Type, Read-only
                
                for (let i = 1; i < tableLines.length; i++) {
                    const row = tableLines[i].split('|').map(s => s.trim()).filter(Boolean); // filter Boolean removes empty strings from leading/trailing |
                    // row[0] is name, row[1] description, row[2] type, row[3] readonly
                     if (row.length >= 3) {
                         // remove backticks from name and type
                         const name = row[0].replace(/`/g, '');
                         const desc = row[1] || "";
                         const type = row[2].replace(/`/g, '');
                         const readOnly = row[3] ? row[3].toLowerCase() === 'yes' : false;

                         classObj.attributes.push({
                             name: name,
                             description: desc,
                             type: type,
                             isReadonly: readOnly
                         });
                     }
                }
            }
        }

        // Extract Methods
        if (chunk.includes('### Methods')) {
            const methodSection = chunk.split('### Methods')[1];
            // Split methods by "#### `"
            const methodChunks = methodSection.split(/^#### `/m).slice(1);
            
            methodChunks.forEach(mChunk => {
                const lines = mChunk.split('\n');
                const methodName = lines[0].split('`')[0]; // since we split on #### `
                
                const methodObj = {
                    name: methodName,
                    description: "",
                    parameters: "", // "param: type, ..."
                    returnType: "void"
                };

                // Description: lines after name until **Parameters:** or **Returns:**
                // Actually usually line 2 or 3.
                let descriptionLines = [];
                for(let i=1; i<lines.length; i++) {
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
                    if (pLines.length > 1) { // Header exists
                         const params = [];
                         for(let i=1; i<pLines.length; i++) {
                             const row = pLines[i].split('|').map(s=>s.trim()).filter(Boolean);
                             if (row.length >= 2) {
                                 const pName = row[0].replace(/`/g, '');
                                 const pType = row[1].replace(/`/g, '');
                                 params.push(`${pName}: ${pType}`);
                             }
                        }
                        methodObj.parameters = params.join(', ');
                    }
                }

                // Returns
                const retMatch = mChunk.match(/\*\*Returns:\*\* `([^`]+)`/);
                if (retMatch) {
                    methodObj.returnType = retMatch[1];
                }

                classObj.methods.push(methodObj);
            });
        }

        classes[className] = classObj;
    });

    return classes;
}


mappings.forEach(entry => {
    if (!fs.existsSync(entry.md)) {
        console.error(`Markdown file not found: ${entry.md}`);
        return;
    }
    if (!fs.existsSync(entry.json)) {
        console.error(`JSON file not found: ${entry.json}`);
        return;
    }

    const mdContent = fs.readFileSync(entry.md, 'utf8');
    const jsonContent = fs.readFileSync(entry.json, 'utf8');
    const pluginData = JSON.parse(jsonContent);

    const parsedClasses = parseMarkdown(mdContent);

    // Update classes
    pluginData.classes.forEach(cls => {
        const parsed = parsedClasses[cls.name];
        if (parsed) {
            console.log(`Updating class: ${cls.name}`);
            
            // Update Description
            if (parsed.description) {
                cls.description = parsed.description;
            }

            // Update Methods
            if (parsed.methods.length > 0) {
                 cls.methods = parsed.methods;
            }

            // Update Attributes
            if (parsed.hasAttributesSection) {
                cls.attributes = parsed.attributes;
            } else {
                 console.log(`  Keeping existing attributes for ${cls.name} (No attributes in MD)`);
            }
        }
    });

    // Write back
    fs.writeFileSync(entry.json, JSON.stringify(pluginData, null, 2));
    console.log(`Updated ${path.basename(entry.json)}\n`);
});
