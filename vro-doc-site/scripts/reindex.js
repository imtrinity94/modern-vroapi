const fs = require('fs');
const path = require('path');

const PLUGINS_DIR = path.resolve(process.cwd(), 'src/data/plugins');
const INDEX_PATH = path.resolve(process.cwd(), 'src/data/index.json');
const SEARCH_INDEX_PATH = path.resolve(process.cwd(), 'src/data/search-index.json');

const PLUGIN_NAMES = {
    'o11n-core': 'Intrinsic / Core APIs',
    'o11n-plugin-activedirectory': 'Active Directory',
    'o11n-plugin-amqp': 'AMQP',
    'o11n-plugin-crypto': 'Crypto',
    'o11n-plugin-dynamictypes': 'Dynamic Types',
    'o11n-plugin-mail': 'Mail',
    'o11n-plugin-mqtt': 'MQTT',
    'o11n-plugin-net': 'Networking',
    'o11n-plugin-powershell': 'PowerShell',
    'o11n-plugin-rest': 'REST API',
    'o11n-plugin-snmp': 'SNMP',
    'o11n-plugin-soap': 'SOAP API',
    'o11n-plugin-sql': 'SQL Database',
    'o11n-plugin-ssh': 'SSH',
    'o11n-plugin-vapi': 'vAPI',
    'o11n-plugin-vc': 'vCenter',
    'o11n-plugin-vcloud': 'vCloud Director',
    'o11n-plugin-vco': 'Orchestrator Utils',
    'o11n-plugin-vum': 'vCenter Update Manager',
    'o11n-plugin-xml': 'XML',
    'o11n-plugin-aria': 'Aria Automation'
};

function reindex() {
    console.log('--- Reindexing Plugins & Search Index (JS Version) ---');
    const files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.json'));

    const plugins = [];
    const searchIndex = {
        plugins: [],
        classes: [],
        methods: []
    };

    for (const file of files) {
        const id = file.replace('.json', '');
        const pluginData = JSON.parse(fs.readFileSync(path.join(PLUGINS_DIR, file), 'utf8'));
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
                    cls.methods.forEach(m => {
                        searchIndex.methods.push({
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
    fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchIndex));

    console.log(`Successfully indexed ${plugins.length} plugins, ${searchIndex.classes.length} classes, and ${searchIndex.methods.length} methods.`);
}

reindex();
