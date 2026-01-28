
import * as fs from 'fs';
import * as path from 'path';

// Configuration
const MD_SOURCE_DIR = 'C:/Users/M.Goyal/OneDrive - Midis services - FZ LLC/Documents/GitHub/api-explorer-to-md';
const OUTPUT_DIR = path.resolve(process.cwd(), 'src/data/plugins');

// Mapping from MD prefix to Plugin ID
const PLUGIN_MAP: Record<string, string> = {
    'AD': 'o11n-plugin-activedirectory',
    'AMQP': 'o11n-plugin-amqp',
    'AWS_EC2': 'o11n-plugin-aws',
    'AutoDeploy': 'o11n-plugin-autodeploy',
    'Avi': 'o11n-plugin-avi',
    'Configurator': 'o11n-plugin-configurator',
    'Crypto': 'o11n-plugin-crypto',
    'DynamicTypes': 'o11n-plugin-dynamictypes',
    'F5': 'o11n-plugin-f5',
    'Lenovo': 'o11n-plugin-lenovo',
    'Mail': 'o11n-plugin-mail',
    'Net': 'o11n-plugin-net',
    'PowerShell': 'o11n-plugin-powershell',
    'Redis': 'o11n-plugin-redis',
    'REST': 'o11n-plugin-rest',
    'SNMP': 'o11n-plugin-snmp',
    'SOAP': 'o11n-plugin-soap',
    'SQL': 'o11n-plugin-sql',
    'SSH': 'o11n-plugin-ssh',
    'Support': 'o11n-plugin-support',
    'VAPI': 'o11n-plugin-vapi',
    'VC': 'o11n-plugin-vc',
    'VCO': 'o11n-plugin-vco',
    'VRA': 'o11n-plugin-vra',
    'VR': 'o11n-plugin-vr',
    'VSAN': 'o11n-plugin-vsan',
    'XML': 'o11n-plugin-xml'
};

interface Attribute {
    name: string;
    type: string;
    description: string;
    isReadonly?: boolean;
}

interface Method {
    name: string;
    description: string;
    parameters: string;
    returnType: string;
}

interface ClassDef {
    name: string;
    description: string;
    attributes: Attribute[];
    methods: Method[];
}

interface PluginDef {
    name: string;
    classes: ClassDef[];
}

function parseMarkdown(content: string, pluginName: string): PluginDef {
    const lines = content.split(/\r?\n/);
    const classes: ClassDef[] = [];
    let currentClass: ClassDef | null = null;
    let currentMethod: Method | null = null;
    let state: 'NONE' | 'CLASS_DESC' | 'ATTRIBUTES' | 'METHODS' | 'METHOD_DESC' | 'PARAMS' | 'RETURNS' = 'NONE';

    // Helper to sanitize markdown table cells
    const cleanCell = (s: string) => s.trim();

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // 1. Detect Class Header: ## ClassName
        if (line.startsWith('## ') && !line.startsWith('###')) {
            const className = line.replace('## ', '').trim();
            currentClass = {
                name: className,
                description: '',
                attributes: [],
                methods: []
            };
            classes.push(currentClass);
            state = 'CLASS_DESC';
            continue;
        }

        if (!currentClass) continue;

        // 2. Class Description
        if (state === 'CLASS_DESC' || state === 'NONE') {
            if (line.startsWith('**Description:**')) {
                currentClass.description = line.replace('**Description:**', '').trim();
            } else if (line.startsWith('### Attributes')) {
                state = 'ATTRIBUTES';
            } else if (line.startsWith('### Methods')) {
                state = 'METHODS';
            }
            continue;
        }

        // 3. Attributes Table
        if (state === 'ATTRIBUTES') {
            if (line.startsWith('### Methods')) {
                state = 'METHODS';
                continue;
            }
            if (line.startsWith('## ')) {
                // Next class started unexpectedly
                i--;
                state = 'NONE';
                continue;
            }
            // Parse Table Row: | Name | Description | Type | Read-only |
            if (line.startsWith('|') && !line.includes('---')) {
                // Do NOT filter out empty strings, as we need them to maintain column positions
                const parts = line.split('|').map(s => s.trim());

                // parts[0] is empty (before first |)
                // parts[1] is Name
                // parts[2] is Description (might be empty)
                // parts[3] is Type
                // parts[4] is Read-only (optional)

                if (parts.length < 2) continue; // Not a valid row

                // Check if it's the header row
                if (parts[1] === 'Name' || parts[1] === ':---') continue;

                // Expected format: | Name | Description | Type | Read-only |
                // This results in ["", "Name", "Description", "Type", "Read-only", ""]

                if (parts.length >= 4) {
                    const name = parts[1].replace(/`/g, '');
                    let description = parts[2];
                    let type = parts[3].replace(/`/g, '');
                    let isReadonly = false;

                    if (parts.length > 4 && parts[4]) {
                        isReadonly = parts[4].toLowerCase() === 'yes';
                    }

                    currentClass.attributes.push({ name, type, description, isReadonly });
                }
            }
            continue;
        }

        // 4. Methods
        if (state === 'METHODS' || state === 'METHOD_DESC' || state === 'PARAMS') {
            if (line.startsWith('## ')) {
                i--;
                state = 'NONE';
                continue;
            }

            // Method Header: #### `methodName`
            if (line.startsWith('#### ')) {
                const methodName = line.replace('#### ', '').replace(/`/g, '').trim();
                currentMethod = {
                    name: methodName,
                    description: '',
                    parameters: '',
                    returnType: 'void'
                };
                currentClass.methods.push(currentMethod);
                state = 'METHOD_DESC';
                continue;
            }

            if (!currentMethod) continue;

            // Method Description (text immediately after header)
            if (state === 'METHOD_DESC') {
                if (line.startsWith('**Parameters:**')) {
                    state = 'PARAMS';
                } else if (line.startsWith('**Returns:**')) {
                    const ret = line.replace('**Returns:**', '').replace(/`/g, '').trim();
                    currentMethod.returnType = ret;
                } else if (line.length > 0 && !line.startsWith('---') && !line.startsWith('|')) {
                    currentMethod.description += (currentMethod.description ? ' ' : '') + line;
                }
                continue;
            }

            // Parameters Table
            if (state === 'PARAMS') {
                if (line.startsWith('**Returns:**')) {
                    const ret = line.replace('**Returns:**', '').replace(/`/g, '').trim();
                    currentMethod.returnType = ret;
                    state = 'METHODS'; // Done with this method mostly
                    continue;
                }

                // Table: | Name | Type | Description |
                if (line.startsWith('|') && !line.includes('---')) {
                    const parts = line.split('|').map(s => s.trim()).filter(s => s !== '');
                    if (parts[0] === 'Name' || parts[0] === ':---') continue;

                    if (parts.length >= 2) {
                        const pName = parts[0].replace(/`/g, '');
                        const pType = parts[1].replace(/`/g, '');
                        // Check if description exists
                        // const pDesc = parts[2] || ''; 

                        const pStr = `${pName}: ${pType}`;
                        currentMethod.parameters += (currentMethod.parameters ? ', ' : '') + pStr;
                    }
                }
            }
        }
    }

    return {
        name: pluginName,
        classes: classes
    };
}

function proc() {
    console.log('Starting Import from MD...');
    if (!fs.existsSync(MD_SOURCE_DIR)) {
        console.error('Source directory not found!');
        return;
    }

    const files = fs.readdirSync(MD_SOURCE_DIR).filter(f => f.endsWith('_Docs_Generated.md'));

    for (const file of files) {
        const prefix = file.replace('_Docs_Generated.md', '');
        const pluginId = PLUGIN_MAP[prefix];

        if (!pluginId) {
            console.warn(`Skipping ${file}: No Plugin ID map found for prefix ${prefix}`);
            continue;
        }

        console.log(`Processing ${file} -> ${pluginId}`);
        const content = fs.readFileSync(path.join(MD_SOURCE_DIR, file), 'utf-8');

        // Use the mapped plugin ID as the 'name' (or derived display name)
        // Actually the 'name' in JSON is usually the Display Name, e.g. "ActiveDirectory"
        const pluginDef = parseMarkdown(content, prefix);

        const outputJSON = {
            name: prefix, // Or map to a nicer name if needed
            description: `API Reference for ${prefix}`,
            classes: pluginDef.classes
        };

        const outPath = path.join(OUTPUT_DIR, `${pluginId}.json`);
        fs.writeFileSync(outPath, JSON.stringify(outputJSON, null, 2));
    }
    console.log('Import complete.');
}

proc();
