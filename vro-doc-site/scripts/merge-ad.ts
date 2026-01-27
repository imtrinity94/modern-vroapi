
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
        let [type, name] = part.trim().split(/\s+/).reverse();
        if (!name) name = `param${index}`;
        return `${name}: ${simplifyType(type)}`;
    }).join(', ');
}

function processAd() {
    const localDir = 'src/data/plugins';
    const localPath = path.join(localDir, 'o11n-plugin-activedirectory.json');
    const scrapedPath = 'scraped_data/3.0.9.json';

    const localData = JSON.parse(fs.readFileSync(localPath, 'utf-8'));
    const scrapedData = JSON.parse(fs.readFileSync(scrapedPath, 'utf-8'));

    const classMap = new Map();
    localData.classes.forEach((c: any) => classMap.set(c.name, c));

    const finalClasses = [];

    for (const sClass of scrapedData.classes) {
        const localClass = classMap.get(sClass.name);

        const mergedClass = {
            name: sClass.name,
            description: localClass?.description || sClass.description || '',
            methods: sClass.methods.filter((m: any) => m.returnType !== 'constructor').map((m: any) => {
                const localMethod = localClass?.methods.find((lm: any) => lm.name === m.name);
                return {
                    name: m.name,
                    parameters: simplifyParams(m.parameters),
                    returnType: simplifyType(m.returnType),
                    description: localMethod?.description || m.description || ''
                };
            }),
            attributes: sClass.attributes.map((a: any) => {
                const localAttr = localClass?.attributes.find((la: any) => la.name === a.name);
                return {
                    name: a.name,
                    type: simplifyType(a.type),
                    description: localAttr?.description || a.description || '',
                    isReadonly: localAttr?.isReadonly ?? false
                };
            })
        };

        // Add existing methods that might not be in the scrape (just in case)
        if (localClass) {
            localClass.methods.forEach((lm: any) => {
                if (!mergedClass.methods.find((m: any) => m.name === lm.name)) {
                    mergedClass.methods.push(lm);
                }
            });
            localClass.attributes.forEach((la: any) => {
                if (!mergedClass.attributes.find((a: any) => a.name === la.name)) {
                    mergedClass.attributes.push(la);
                }
            });
        }

        finalClasses.push(mergedClass);
    }

    // Add classes that were ONLY in local
    localData.classes.forEach((lc: any) => {
        if (!finalClasses.find(fc => fc.name === lc.name)) {
            finalClasses.push(lc);
        }
    });

    localData.classes = finalClasses;
    fs.writeFileSync(localPath, JSON.stringify(localData, null, 2));
    console.log(`Merged AD plugin. Now has ${finalClasses.length} classes.`);
}

processAd();
