
import fs from 'fs';
import path from 'path';

const PLUGINS_DIR = path.resolve(process.cwd(), 'src/data/plugins');
const INDEX_PATH = path.resolve(process.cwd(), 'src/data/index.json');

import { PLUGIN_NAMES } from './plugin-names.js';

function reindex() {
    console.log('--- Reindexing Plugins ---');
    const files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.json'));

    const index = files.map(file => {
        const id = file.replace('.json', '');
        return {
            id: id,
            name: PLUGIN_NAMES[id] || id.replace('o11n-plugin-', '').replace(/-/g, ' ').toUpperCase()
        };
    }).sort((a, b) => a.name.localeCompare(b.name));

    fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 4));
    console.log(`Successfully indexed ${index.length} plugins.`);
}

reindex();
