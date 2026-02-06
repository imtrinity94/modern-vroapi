const fs = require('fs');
const path = require('path');

const pluginsDir = path.resolve('vro-doc-site/src/data/plugins');
const statsPath = path.resolve('vro-doc-site/src/data/stats.json');

const stats = {};

if (fs.existsSync(pluginsDir)) {
    const files = fs.readdirSync(pluginsDir).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        const filePath = path.join(pluginsDir, file);
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            const pluginId = path.basename(file, '.json');

            let classCount = 0;
            let methodCount = 0;

            if (data.classes && Array.isArray(data.classes)) {
                classCount = data.classes.length;
                data.classes.forEach(cls => {
                    if (cls.methods && Array.isArray(cls.methods)) {
                        methodCount += cls.methods.length;
                    }
                });
            }

            stats[pluginId] = {
                classes: classCount,
                methods: methodCount
            };
            console.log(`Processed ${pluginId}: ${classCount} classes, ${methodCount} methods`);

        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    });

    // Merge with existing stats only if needed, or just overwrite?
    // User wants "update", implying overwrite is fine for accuracy.
    // However, index.json might have plugins not in the folder? (e.g. vCloud?)
    // Checking previous stats.json, vcloud is there but file list will confirm.

    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    console.log(`Updated stats.json with ${Object.keys(stats).length} plugins.`);
} else {
    console.error(`Plugins directory not found: ${pluginsDir}`);
}
