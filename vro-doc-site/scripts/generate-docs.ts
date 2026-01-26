
import * as fs from 'fs';
import * as path from 'path';
import * as ts from 'typescript';

const BTVA_DIR = path.resolve(process.cwd(), '../BTVA');

const PLUGIN_NAME_MAP: Record<string, string> = {
    'o11n-core': 'Core Standard',
    'o11n-plugin-activedirectory': 'Active Directory',
    'o11n-plugin-amqp': 'AMQP',
    'o11n-plugin-apic': 'Cisco APIC',
    'o11n-plugin-aria': 'Aria Automation',
    'o11n-plugin-azure': 'Azure',
    'o11n-plugin-crypto': 'Crypto',
    'o11n-plugin-dynamictypes': 'Dynamic Types',
    'o11n-plugin-mail': 'Mail',
    'o11n-plugin-mqtt': 'MQTT',
    'o11n-plugin-net': 'Net',
    'o11n-plugin-nsx': 'NSX-T',
    'o11n-plugin-powershell': 'PowerShell',
    'o11n-plugin-rest': 'HTTP-REST',
    'o11n-plugin-snmp': 'SNMP',
    'o11n-plugin-soap': 'SOAP',
    'o11n-plugin-sql': 'SQL',
    'o11n-plugin-ssh': 'SSH',
    'o11n-plugin-vapi': 'vAPI',
    'o11n-plugin-vc': 'vCenter',
    'o11n-plugin-vcloud': 'vCloud Director',
    'o11n-plugin-vco': 'Orchestrator Utils',
    'o11n-plugin-vum': 'vSphere Update Manager',
    'o11n-plugin-xml': 'XML'
};

function getFriendlyName(internalName: string): string {
    if (PLUGIN_NAME_MAP[internalName]) {
        return PLUGIN_NAME_MAP[internalName];
    }

    // Fallback: strip o11n-plugin- and o11n- and capitalize
    return internalName
        .replace(/^o11n-plugin-/, '')
        .replace(/^o11n-/, '')
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

interface ApiMethod {
    name: string;
    parameters: string;
    returnType: string;
    description: string;
}

interface ApiAttribute {
    name: string;
    type: string;
    description: string;
    isReadonly: boolean;
}

interface ApiClass {
    name: string;
    description: string;
    methods: ApiMethod[];
    attributes: ApiAttribute[];
}

interface ApiPlugin {
    name: string;
    classes: ApiClass[];
}

function extractDescription(node: ts.Node, sourceFile: ts.SourceFile): string {
    const jsDoc = (node as any).jsDoc as ts.JSDoc[];
    if (jsDoc && jsDoc.length > 0) {
        const comment = jsDoc[0].comment;
        if (typeof comment === 'string') {
            return comment;
        } else if (comment && Array.isArray(comment)) {
            // NodeArray<JSDocComment>
            return comment.map(c => c.text).join('');
        } else if (comment) {
            // Single JSDocComment node
            return (comment as any).text || '';
        }
    }
    return '';
}

function processFile(filePath: string, pluginName: string): ApiPlugin {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const sourceFile = ts.createSourceFile(
        filePath,
        fileContent,
        ts.ScriptTarget.Latest,
        true
    );

    const classes: ApiClass[] = [];

    ts.forEachChild(sourceFile, (node) => {
        if (ts.isClassDeclaration(node) || ts.isInterfaceDeclaration(node)) {
            const name = node.name?.getText(sourceFile) || 'Anonymous';
            const description = extractDescription(node, sourceFile);
            const methods: ApiMethod[] = [];
            const attributes: ApiAttribute[] = [];

            node.members.forEach((member) => {
                const memberName = member.name?.getText(sourceFile) || '';
                const memberDesc = extractDescription(member, sourceFile);

                if (ts.isMethodDeclaration(member) || ts.isMethodSignature(member)) {
                    const params = member.parameters
                        .map((p) => {
                            const pName = p.name.getText(sourceFile);
                            const pType = p.type?.getText(sourceFile) || 'any';
                            return `${pName}: ${pType}`;
                        })
                        .join(', ');
                    const returnType = member.type?.getText(sourceFile) || 'void';

                    methods.push({
                        name: memberName,
                        parameters: params,
                        returnType: returnType,
                        description: memberDesc,
                    });
                } else if (
                    ts.isPropertyDeclaration(member) ||
                    ts.isPropertySignature(member)
                ) {
                    const type = member.type?.getText(sourceFile) || 'any';
                    const isReadonly = member.modifiers?.some(
                        (m) => m.kind === ts.SyntaxKind.ReadonlyKeyword
                    ) || false;

                    attributes.push({
                        name: memberName,
                        type: type,
                        description: memberDesc,
                        isReadonly: isReadonly,
                    });
                }
            });

            classes.push({
                name,
                description,
                methods,
                attributes,
            });
        }
    });

    return {
        name: pluginName,
        classes,
    };
}

function main() {
    if (!fs.existsSync(BTVA_DIR)) {
        console.error(`Error: BTVA directory not found at ${BTVA_DIR}`);
        process.exit(1);
    }

    const DATA_DIR = path.resolve(process.cwd(), 'src/data');
    const PLUGINS_DIR = path.join(DATA_DIR, 'plugins');

    if (!fs.existsSync(PLUGINS_DIR)) {
        fs.mkdirSync(PLUGINS_DIR, { recursive: true });
    }

    const pluginIndex: { id: string; name: string; fileName: string }[] = [];
    const entries = fs.readdirSync(BTVA_DIR, { withFileTypes: true });

    for (const entry of entries) {
        if (entry.isDirectory() && (entry.name.startsWith('o11n-plugin-') || entry.name === 'o11n-core')) {
            const indexPath = path.join(BTVA_DIR, entry.name, 'index.d.ts');
            if (fs.existsSync(indexPath)) {
                console.log(`Processing ${entry.name}...`);
                try {
                    const friendlyName = getFriendlyName(entry.name);
                    const plugin = processFile(indexPath, friendlyName);
                    const fileName = `${entry.name}.json`;
                    fs.writeFileSync(
                        path.join(PLUGINS_DIR, fileName),
                        JSON.stringify(plugin, null, 2)
                    );
                    pluginIndex.push({ id: entry.name, name: friendlyName, fileName });
                } catch (e) {
                    console.error(`Failed to process ${entry.name}:`, e);
                }
            }
        }
    }

    fs.writeFileSync(
        path.join(DATA_DIR, 'index.json'),
        JSON.stringify(pluginIndex, null, 2)
    );
    console.log(`Successfully generated data for ${pluginIndex.length} plugins.`);
}

main();
