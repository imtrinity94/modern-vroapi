
import fs from 'fs';
import path from 'path';

const PLUGINS_DIR = path.resolve(process.cwd(), 'src/data/plugins');
const INDEX_PATH = path.resolve(process.cwd(), 'src/data/index.json');
const XREF_PATH = path.resolve(process.cwd(), 'src/data/xref.json');

import { PLUGIN_NAMES } from './plugin-names.js';

function reindex() {
    console.log('--- Reindexing Plugins & Search Index ---');
    const files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.json'));

    const plugins = [];
    const searchIndex = {
        plugins: [],
        classes: [],
        methods: []
    };

    const stats: Record<string, { classes: number; methods: number }> = {};
    const xref: Record<string, { u: string[], r: string[] }> = {};

    const addToXref = (targetClass: string, type: 'u' | 'r', source: string) => {
        // Clean up array notation for indexing
        const cleanClass = targetClass.replace('[]', '').trim();
        // Skip primitives and void
        if (['void', 'string', 'number', 'boolean', 'any', 'object', 'undefined', 'null', 'function', 'never', 'unknown'].includes(cleanClass.toLowerCase())) return;

        if (!xref[cleanClass]) {
            xref[cleanClass] = { u: [], r: [] };
        }
        if (!xref[cleanClass][type].includes(source)) {
            xref[cleanClass][type].push(source);
        }
    };

    for (const file of files) {
        const id = file.replace('.json', '');
        const content = fs.readFileSync(path.join(PLUGINS_DIR, file), 'utf8').replace(/^\uFEFF/, '');
        const pluginData = JSON.parse(content);
        const name = PLUGIN_NAMES[id] || id.replace('o11n-plugin-', '').replace(/-/g, ' ').toUpperCase();

        const pluginEntry = { id, name };
        plugins.push(pluginEntry);
        searchIndex.plugins.push(pluginEntry);

        // Calculate counts
        const classCount = pluginData.classes ? pluginData.classes.length : 0;
        let methodCount = 0;
        if (pluginData.classes) {
            pluginData.classes.forEach((cls: any) => {
                if (cls.methods) {
                    methodCount += cls.methods.length;
                }
            });
        }

        // Collect stats
        stats[id] = { classes: classCount, methods: methodCount };

        // Add classes and methods to search index
        if (pluginData.classes) {
            pluginData.classes.forEach(cls => {
                searchIndex.classes.push({
                    n: cls.name,
                    p: id
                });

                if (cls.methods) {
                    cls.methods.forEach((m: any) => {
                        const methodSignature = `${id}:${cls.name}:${m.name}`;

                        (searchIndex.methods as any[]).push({
                            n: m.name,
                            c: cls.name,
                            p: id
                        });

                        // 1. Analyze Return Type
                        if (m.returnType) {
                            addToXref(m.returnType, 'r', methodSignature);
                        }

                        // 2. Analyze Parameters
                        if (m.parameters) {
                            // Split parameters string (e.g., "name: String, count: Number")
                            // Note: This matches the simple format. Complex nested types might need parsing updates.
                            const params = m.parameters.split(',');
                            params.forEach(p => {
                                const parts = p.trim().split(':');
                                if (parts.length === 2) {
                                    const type = parts[1].trim();
                                    addToXref(type, 'u', methodSignature);
                                }
                            });
                        }
                    });
                }
            });
        }
    }

    plugins.sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync(INDEX_PATH, JSON.stringify(plugins, null, 2));
    fs.writeFileSync(path.resolve(process.cwd(), 'src/data/search-index.json'), JSON.stringify(searchIndex));
    fs.writeFileSync(path.resolve(process.cwd(), 'src/data/stats.json'), JSON.stringify(stats, null, 2));
    fs.writeFileSync(XREF_PATH, JSON.stringify(xref));

    console.log(`Successfully indexed ${plugins.length} plugins, ${searchIndex.classes.length} classes, and ${searchIndex.methods.length} methods.`);
    console.log(`Generated Cross-Reference index with ${Object.keys(xref).length} keys.`);
    console.log('Stats generated in src/data/stats.json');
}

reindex();
