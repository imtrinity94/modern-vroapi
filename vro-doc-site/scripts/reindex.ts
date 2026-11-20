// Rebuilds every generated index from the plugin JSON files in src/data/plugins:
//
//   src/data/index.json          plugin id + display name (home page, page titles)
//   src/data/search-index.json   plugins, classes and methods (site search, type links)
//   src/data/stats.json          class and method counts per plugin
//   src/data/xref.json           "Reference" and "Returned By" links per class
//
// Run it after adding or changing anything in src/data/plugins:
//
//   npm run reindex
//
// Display names come from scripts/plugin-names.ts. A plugin without a name
// there gets an upper-cased fallback and a warning, so add the name first.
// Do not edit the four index files by hand: this script overwrites them.

import fs from 'fs';
import path from 'path';

import { PLUGIN_NAMES } from './plugin-names.js';

const DATA_DIR = path.resolve(process.cwd(), 'src/data');
const PLUGINS_DIR = path.join(DATA_DIR, 'plugins');
const INDEX_PATH = path.join(DATA_DIR, 'index.json');
const SEARCH_INDEX_PATH = path.join(DATA_DIR, 'search-index.json');
const STATS_PATH = path.join(DATA_DIR, 'stats.json');
const XREF_PATH = path.join(DATA_DIR, 'xref.json');

// Types that never get a cross-reference entry (compared in lower case).
const SKIPPED_TYPES = new Set([
    'void', 'string', 'number', 'boolean', 'any', 'object',
    'undefined', 'null', 'function', 'never', 'unknown'
]);

interface PluginMethod {
    name: string;
    returnType?: string;
    parameters?: string;
}

interface PluginClass {
    name: string;
    methods?: PluginMethod[];
}

interface PluginFile {
    classes?: PluginClass[];
}

interface PluginEntry {
    id: string;
    name: string;
}

type XrefKind = 'u' | 'r';

function fallbackName(id: string): string {
    return id.replace('o11n-plugin-', '').replace(/-/g, ' ').toUpperCase();
}

function readPlugin(file: string): PluginFile {
    const content = fs.readFileSync(path.join(PLUGINS_DIR, file), 'utf8').replace(/^\uFEFF/, '');
    try {
        return JSON.parse(content) as PluginFile;
    } catch (e) {
        throw new Error(`Cannot parse ${file}: ${(e as Error).message}`);
    }
}

function reindex(): void {
    console.log('--- Reindexing Plugins & Search Index ---');
    const files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.json')).sort();

    const plugins: PluginEntry[] = [];
    const searchClasses: { n: string; p: string }[] = [];
    const searchMethods: { n: string; c: string; p: string }[] = [];
    const stats: Record<string, { classes: number; methods: number }> = {};
    const unnamed: string[] = [];

    // Sets keep each list free of duplicates and preserve insertion order.
    const xref = new Map<string, { u: Set<string>; r: Set<string> }>();

    const addToXref = (targetClass: string, kind: XrefKind, source: string): void => {
        // Clean up array notation for indexing
        const cleanClass = targetClass.replace('[]', '').trim();
        if (SKIPPED_TYPES.has(cleanClass.toLowerCase())) return;

        let entry = xref.get(cleanClass);
        if (!entry) {
            entry = { u: new Set<string>(), r: new Set<string>() };
            xref.set(cleanClass, entry);
        }
        entry[kind].add(source);
    };

    for (const file of files) {
        const id = file.replace('.json', '');
        const pluginData = readPlugin(file);
        const classes = pluginData.classes || [];

        let name = PLUGIN_NAMES[id];
        if (!name) {
            name = fallbackName(id);
            unnamed.push(id);
        }
        plugins.push({ id, name });

        let methodCount = 0;

        for (const cls of classes) {
            searchClasses.push({ n: cls.name, p: id });

            for (const m of cls.methods || []) {
                methodCount++;
                const methodSignature = `${id}:${cls.name}:${m.name}`;
                searchMethods.push({ n: m.name, c: cls.name, p: id });

                // 1. Return type
                if (m.returnType) {
                    addToXref(m.returnType, 'r', methodSignature);
                }

                // 2. Parameters, e.g. "name: String, count: Number"
                if (m.parameters) {
                    for (const p of m.parameters.split(',')) {
                        const parts = p.trim().split(':');
                        if (parts.length === 2) {
                            addToXref(parts[1].trim(), 'u', methodSignature);
                        }
                    }
                }
            }
        }

        stats[id] = { classes: classes.length, methods: methodCount };
    }

    // The search index lists plugins in file order, index.json by display name.
    const searchIndex = {
        plugins: plugins.slice(),
        classes: searchClasses,
        methods: searchMethods
    };
    plugins.sort((a, b) => a.name.localeCompare(b.name));

    const xrefOut: Record<string, { u: string[]; r: string[] }> = {};
    for (const [cls, entry] of xref) {
        xrefOut[cls] = { u: Array.from(entry.u), r: Array.from(entry.r) };
    }

    fs.writeFileSync(INDEX_PATH, JSON.stringify(plugins, null, 2));
    fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchIndex));
    fs.writeFileSync(STATS_PATH, JSON.stringify(stats, null, 2));
    fs.writeFileSync(XREF_PATH, JSON.stringify(xrefOut));

    console.log(`Successfully indexed ${plugins.length} plugins, ${searchClasses.length} classes, and ${searchMethods.length} methods.`);
    console.log(`Generated Cross-Reference index with ${Object.keys(xrefOut).length} keys.`);
    console.log('Stats generated in src/data/stats.json');

    if (unnamed.length > 0) {
        console.warn('');
        console.warn(`WARNING: ${unnamed.length} plugin(s) have no display name in scripts/plugin-names.ts:`);
        for (const id of unnamed) {
            console.warn(`  ${id}  (shown on the site as "${fallbackName(id)}")`);
        }
        console.warn('Add the name there and run "npm run reindex" again before committing.');
    }
}

reindex();
