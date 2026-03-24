const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const PLUGIN_ID = 'azure';

// Read the generated JSON
const pluginPath = path.join(ROOT_DIR, 'plugins', `${PLUGIN_ID}.json`);
if (!fs.existsSync(pluginPath)) {
    console.error(`Plugin JSON not found: ${pluginPath}`);
    process.exit(1);
}
const plugin = JSON.parse(fs.readFileSync(pluginPath, 'utf8'));

// STEP 4: search-index.json
const searchIndexPath = path.join(ROOT_DIR, 'search-index.json');
const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

searchIndex.classes = searchIndex.classes.filter(c => c.p !== PLUGIN_ID);
searchIndex.methods = searchIndex.methods.filter(m => m.p !== PLUGIN_ID);

plugin.classes.forEach(cls => {
  searchIndex.classes.push({ n: cls.name, p: PLUGIN_ID });
  if (cls.methods) {
      cls.methods.forEach(m => {
        searchIndex.methods.push({ n: m.name, c: cls.name, p: PLUGIN_ID });
      });
  }
});
fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex));

// STEP 5: stats.json
const statsPath = path.join(ROOT_DIR, 'stats.json');
let statsData = {};
if (fs.existsSync(statsPath)) {
    statsData = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
}
const nCls = plugin.classes.length;
const nMet = plugin.classes.reduce((sum, cls) => sum + (cls.methods ? cls.methods.length : 0), 0);
statsData[PLUGIN_ID] = { classes: nCls, methods: nMet };
fs.writeFileSync(statsPath, JSON.stringify(statsData, null, 2));

// STEP 6: xref.json
const xrefPath = path.join(ROOT_DIR, 'xref.json');
const xref = JSON.parse(fs.readFileSync(xrefPath, 'utf8'));

for (const clsName in xref) {
  xref[clsName].u = xref[clsName].u.filter(sig => !sig.startsWith(PLUGIN_ID + ':'));
  xref[clsName].r = xref[clsName].r.filter(sig => !sig.startsWith(PLUGIN_ID + ':'));
}

plugin.classes.forEach(cls => {
  if (!xref[cls.name]) xref[cls.name] = { u: [], r: [] };

  if (cls.methods) {
      cls.methods.forEach(m => {
        const signature = `${PLUGIN_ID}:${cls.name}:${m.name}`;
        
        const extractTypes = (typeStr) => {
            if (!typeStr) return [];
            let clean = typeStr.replace(/Array\//g, '');
            return clean.split('/');
        };

        const retTypes = extractTypes(m.returnType);
        for(let rtype of retTypes) {
            if (rtype && rtype !== 'void') {
                if (!xref[rtype]) xref[rtype] = { u: [], r: [] };
                if (!xref[rtype].r.includes(signature)) {
                  xref[rtype].r.push(signature);
                }
            }
        }

        if (m.parameters) {
          const params = m.parameters.split(', ');
          params.forEach(p => {
            const parts = p.split(': ');
            if (parts.length === 2) {
              const typeStr = parts[1].trim();
              const types = extractTypes(typeStr);
              for(let type of types) {
                 if (type) {
                     if (!xref[type]) xref[type] = { u: [], r: [] };
                     if (!xref[type].u.includes(signature)) {
                       xref[type].u.push(signature);
                     }
                 }
              }
            }
          });
        }
      });
  }
});

fs.writeFileSync(xrefPath, JSON.stringify(xref));

console.log(`Successfully updated search-index.json, stats.json, and xref.json for ${PLUGIN_ID}.`);
