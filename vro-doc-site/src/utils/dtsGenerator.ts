
interface Attribute {
    name: string;
    type: string;
    description?: string;
    isReadonly?: boolean;
}

interface Method {
    name: string;
    description?: string;
    parameters: string;
    returnType: string;
}

interface ClassEntry {
    name: string;
    description?: string;
    attributes: Attribute[];
    methods: Method[];
}

interface PluginData {
    name: string;
    description?: string;
    classes: ClassEntry[];
}

const mapType = (type: string): string => {
    if (!type) return 'any';

    const trimmedType = type.trim();

    // Handle Array types (e.g., Array/string, Array/AD_User)
    if (trimmedType.startsWith('Array/')) {
        const innerType = trimmedType.replace('Array/', '').trim();
        return `Array/${mapType(innerType)}`;
    }

    // Basic mappings
    switch (trimmedType.toLowerCase()) {
        case 'string':
        case 'securestring':
            return 'string';
        case 'number':
        case 'long':
        case 'double':
        case 'integer':
        case 'int':
            return 'number';
        case 'boolean': return 'boolean';
        case 'void': return 'void';
        case 'any': return 'any';
        case 'object': return 'any';
        case 'date': return 'Date';
        case 'properties': return 'any';
        default: return trimmedType;
    }
};

const parseParameters = (paramStr: string): string => {
    if (!paramStr) return '';

    // Split by comma, but be careful of generics? vRO params usually simple.
    // Format: "name: type, name2: type2"
    return paramStr.split(',').map(p => {
        const parts = p.split(':');
        if (parts.length === 2) {
            const name = parts[0].trim();
            const type = mapType(parts[1].trim());

            // Handle optional params? vRO definitions don't clearly mark them usually.
            // But we can check if name has ? suffix if data supported it (unlikely).
            return `${name}: ${type}`;
        } else if (parts.length === 1 && parts[0].trim()) {
            // Fallback for missing type
            return `${parts[0].trim()}: any`;
        }
        return '';
    }).filter(Boolean).join(', ');
};

export const generateDts = (plugin: PluginData): string => {
    const lines: string[] = [];

    lines.push(`/**`);
    lines.push(` * TypeScript definitions for ${plugin.name}`);
    lines.push(` * ${plugin.description || ''}`);
    lines.push(` */`);
    lines.push(``);

    plugin.classes.forEach(cls => {
        lines.push(`/**`);
        lines.push(` * ${cls.description || cls.name}`);
        lines.push(` */`);
        lines.push(`export declare class ${cls.name} {`);

        // Attributes
        if (cls.attributes && cls.attributes.length > 0) {
            cls.attributes.forEach(attr => {
                if (attr.description) {
                    lines.push(`    /** ${attr.description} */`);
                }
                const readonlyMod = attr.isReadonly ? 'readonly ' : '';
                lines.push(`    ${readonlyMod}${attr.name}: ${mapType(attr.type)};`);
            });
        }

        if (cls.methods && cls.methods.length > 0) {
            // Add spacing between attributes and methods
            if (cls.attributes && cls.attributes.length > 0) lines.push('');

            cls.methods.forEach(method => {
                if (method.description) {
                    lines.push(`    /** ${method.description} */`);
                }
                const params = parseParameters(method.parameters);
                const retType = mapType(method.returnType);
                lines.push(`    ${method.name}(${params}): ${retType};`);
            });
        }

        lines.push(`}`);
        lines.push(``);
    });

    return lines.join('\n');
};
