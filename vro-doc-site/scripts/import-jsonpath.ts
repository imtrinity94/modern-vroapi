
import * as fs from 'fs';
import * as path from 'path';

function simplifyType(type: string): string {
    if (!type) return 'any';
    let t = type.trim();

    // Common mappings
    const mappings: Record<string, string> = {
        'String': 'string',
        'Number': 'number',
        'boolean': 'boolean',
        'Boolean': 'boolean',
        'void': 'void',
        'Object': 'any',
        'Object[]': 'any[]',
        'String[]': 'string[]'
    };

    if (mappings[t]) return mappings[t];

    // Strip Java packages
    if (t.includes('.')) {
        t = t.split('.').pop() || t;
    }

    // Map remaining complex types
    if (t === 'Number') return 'number';
    if (t === 'String') return 'string';

    return t;
}

function simplifyParams(params: string): string {
    if (!params || params === '()') return '';
    let p = params.replace(/^\(|\)$/g, '');
    if (!p) return '';

    return p.split(',').map((part, index) => {
        let [name, type] = part.trim().split(/\s+/).reverse();
        if (!type) {
            type = name;
            name = `param${index}`;
        }
        return `${name}: ${simplifyType(type)}`;
    }).join(', ');
}

function importJsonPath() {
    const scrapedPath = 'scraped_data/1.0.2.json';
    const outputPath = 'src/data/plugins/o11n-plugin-jsonpath.json';

    if (!fs.existsSync(scrapedPath)) {
        console.error(`Scraped file not found: ${scrapedPath}`);
        return;
    }

    const scrapedData = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));

    const finalClasses = scrapedData.classes.map((sClass: any) => ({
        name: sClass.name,
        description: sClass.description || '',
        methods: sClass.methods.filter((m: any) => m.returnType !== 'constructor').map((m: any) => ({
            name: m.name,
            parameters: simplifyParams(m.parameters),
            returnType: simplifyType(m.returnType),
            description: m.description || ''
        })),
        attributes: sClass.attributes.map((a: any) => ({
            name: a.name,
            type: simplifyType(a.type),
            description: a.description || '',
            isReadonly: false // Scraper doesn't detect this yet
        }))
    }));

    const finalPlugin = {
        name: 'JsonPath',
        classes: finalClasses
    };

    fs.writeFileSync(outputPath, JSON.stringify(finalPlugin, null, 2));
    console.log(`Imported JsonPath plugin. Saved to ${outputPath}`);
}

importJsonPath();
