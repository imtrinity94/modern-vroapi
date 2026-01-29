
import fs from 'fs';
import path from 'path';

const PLUGINS_DIR = path.resolve(process.cwd(), 'src/data/plugins');
const INDEX_PATH = path.resolve(process.cwd(), 'src/data/index.json');

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

    for (const file of files) {
        const id = file.replace('.json', '');
        const content = fs.readFileSync(path.join(PLUGINS_DIR, file), 'utf8').replace(/^\uFEFF/, '');
        const pluginData = JSON.parse(content);
        const name = PLUGIN_NAMES[id] || id.replace('o11n-plugin-', '').replace(/-/g, ' ').toUpperCase();

        const pluginEntry = { id, name };
        plugins.push(pluginEntry);
        searchIndex.plugins.push(pluginEntry);

        // Add classes and methods to search index
        if (pluginData.classes) {
            pluginData.classes.forEach(cls => {
                searchIndex.classes.push({
                    n: cls.name,
                    p: id
                });

                if (cls.methods) {
                    cls.methods.forEach((m: any) => {
                        (searchIndex.methods as any[]).push({
                            n: m.name,
                            c: cls.name,
                            p: id
                        });
                    });
                }
            });
        }
    }

    plugins.sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync(INDEX_PATH, JSON.stringify(plugins, null, 2));
    fs.writeFileSync(path.resolve(process.cwd(), 'src/data/search-index.json'), JSON.stringify(searchIndex));

    console.log(`Successfully indexed ${plugins.length} plugins, ${searchIndex.classes.length} classes, and ${searchIndex.methods.length} methods.`);
}

reindex();
