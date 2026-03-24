const fs = require('fs');
const path = require('path');

const MD_PATH = String.raw`c:\Users\M.Goyal\OneDrive - Midis services - FZ LLC\Documents\GitHub\modern-vroapi\Azure_Docs_Generated.md`;
const ROOT_DIR = String.raw`c:\Users\M.Goyal\OneDrive - Midis services - FZ LLC\Documents\GitHub\modern-vroapi\vro-doc-site\src\data`;
const PLUGIN_ID = 'azure';
const PLUGIN_NAME = 'Azure';

// Read Markdown
const mdContent = fs.readFileSync(MD_PATH, 'utf-8');
const lines = mdContent.split('\n');

const plugin = {
  name: PLUGIN_NAME,
  description: `API Reference for ${PLUGIN_NAME}`,
  classes: []
};

let currentClass = null;
let currentMethod = null;
let parseMode = null; // 'attributes', 'methods', null

// parse markdown
for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('## ')) {
    const className = line.substring(3).trim();
    currentClass = {
      name: className,
      description: '',
      attributes: [],
      methods: []
    };
    plugin.classes.push(currentClass);
    currentMethod = null;
    parseMode = null;
  } else if (line.startsWith('### Attributes') && currentClass) {
    parseMode = 'attributes';
  } else if (line.startsWith('### Methods') && currentClass) {
    parseMode = 'methods';
  } else if (line.startsWith('#### `') && currentClass && parseMode === 'methods') {
    const methodName = line.match(/#### `([^`]+)`/)[1];
    currentMethod = {
      name: methodName,
      description: '',
      parameters: '',
      returnType: 'void'
    };
    currentClass.methods.push(currentMethod);
  } else if (line.startsWith('**Description:**') && currentClass && !parseMode) {
    currentClass.description = line.replace('**Description:**', '').trim();
  } else if (line.startsWith('**Returns:**') && currentMethod) {
    const retMatch = line.match(/\*\*Returns:\*\*\s*(?:`([^`]+)`|(.*))/);
    if (retMatch) {
      currentMethod.returnType = (retMatch[1] || retMatch[2]).trim();
    }
  } else if (parseMode === 'attributes' && line.startsWith('|') && !line.includes('---') && !line.includes('Name | Description')) {
    const parts = line.split('|').map(p => p.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    // Name, Description, Type, Read-only
    if (parts.length >= 4) {
      const isReadonly = parts[3] === 'Yes';
      const typeMatch = parts[2].match(/`([^`]+)`/);
      const typeStr = typeMatch ? typeMatch[1] : parts[2];
      const nameMatch = parts[0].match(/`([^`]+)`/);
      const nameStr = nameMatch ? nameMatch[1] : parts[0];
      if (nameStr && nameStr !== 'Name') {
        currentClass.attributes.push({
          name: nameStr,
          type: typeStr || 'any',
          description: parts[1],
          isReadonly
        });
      }
    }
  } else if (parseMode === 'methods' && currentMethod && line.startsWith('|') && !line.includes('---') && !line.includes('Name | Type')) {
    const parts = line.split('|').map(p => p.trim()).filter((_, idx, arr) => idx > 0 && idx < arr.length - 1);
    // Name, Type, Description
    if (parts.length >= 3) {
      const nameMatch = parts[0].match(/`([^`]+)`/);
      const nameStr = nameMatch ? nameMatch[1] : parts[0];
      const typeMatch = parts[1].match(/`([^`]+)`/);
      const typeStr = typeMatch ? typeMatch[1] : parts[1];
      if (nameStr && nameStr !== 'Name') {
        const paramStr = `${nameStr}: ${typeStr}`;
        if (currentMethod.parameters) {
          currentMethod.parameters += `, ${paramStr}`;
        } else {
          currentMethod.parameters = paramStr;
        }
      }
    }
  }
}

// STEP 1: Write JSON
const pluginJsonPath = path.join(ROOT_DIR, 'plugins', `${PLUGIN_ID}.json`);
fs.writeFileSync(pluginJsonPath, JSON.stringify(plugin, null, 2));

// STEP 3: index.json
const indexPath = path.join(ROOT_DIR, 'index.json');
const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
if (!indexData.find(i => i.id === PLUGIN_ID)) {
    indexData.push({ id: PLUGIN_ID, name: PLUGIN_NAME });
    indexData.sort((a, b) => a.name.localeCompare(b.name));
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2));
}

// STEP 4: search-index.json
const searchIndexPath = path.join(ROOT_DIR, 'search-index.json');
const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

searchIndex.classes = searchIndex.classes.filter(c => c.p !== PLUGIN_ID);
searchIndex.methods = searchIndex.methods.filter(m => m.p !== PLUGIN_ID);

plugin.classes.forEach(cls => {
  searchIndex.classes.push({ n: cls.name, p: PLUGIN_ID });
  cls.methods.forEach(m => {
    searchIndex.methods.push({ n: m.name, c: cls.name, p: PLUGIN_ID });
  });
});
fs.writeFileSync(searchIndexPath, JSON.stringify(searchIndex));

// STEP 5: stats.json
const statsPath = path.join(ROOT_DIR, 'stats.json');
const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));
const nCls = plugin.classes.length;
const nMet = plugin.classes.reduce((sum, cls) => sum + cls.methods.length, 0);
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

  cls.methods.forEach(m => {
    const signature = `${PLUGIN_ID}:${cls.name}:${m.name}`;
    
    const extractTypes = (typeStr) => {
        let clean = typeStr.replace(/Array\//g, '');
        return clean.split('/');
    };

    const retTypes = extractTypes(m.returnType);
    for(let rtype of retTypes) {
        if (!xref[rtype]) xref[rtype] = { u: [], r: [] };
        if (!xref[rtype].r.includes(signature)) {
          xref[rtype].r.push(signature);
        }
    }

    if (m.parameters) {
      const params = m.parameters.split(', ');
      params.forEach(p => {
        const parts = p.split(': ');
        if (parts.length === 2) {
          const typeStr = parts[1];
          const types = extractTypes(typeStr);
          for(let type of types) {
             if (!xref[type]) xref[type] = { u: [], r: [] };
             if (!xref[type].u.includes(signature)) {
               xref[type].u.push(signature);
             }
          }
        }
      });
    }
  });
});

fs.writeFileSync(xrefPath, JSON.stringify(xref));

console.log("Success");
