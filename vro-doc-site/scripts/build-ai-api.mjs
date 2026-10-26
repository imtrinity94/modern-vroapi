// Builds a machine-readable copy of the plugin docs for AI agents and other tools.
//
// Output (all static, generated at build time, not committed):
//   public/llms.txt                                how to use the API + plugin list
//   public/api/v1/plugins.json                     every plugin with class/method counts
//   public/api/v1/classes.json                     class name -> [{ plugin, url }], for lookup by name
//   public/api/v1/plugins/<pluginId>.json          one plugin: its classes with short descriptions
//   public/api/v1/plugins/<pluginId>/<Class>.json  one class: attributes, constructors, methods
//
// Run: node scripts/build-ai-api.mjs   (also runs automatically before `npm run build`)

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const PLUGINS_DIR = path.join(ROOT, 'src/data/plugins');
const INDEX_PATH = path.join(ROOT, 'src/data/index.json');
const PUBLIC_DIR = path.join(ROOT, 'public');
const API_DIR = path.join(PUBLIC_DIR, 'api', 'v1');
const SITE = 'https://modernvroapi.in';
const API_BASE = `${SITE}/api/v1`;
const PLACEHOLDER_DESC = /^detailed documentation not available\.?$/i;

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8').replace(/^﻿/, ''));
const writeJson = (file, data) => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(data));
};
const short = (text, max = 160) => {
    const t = (text || '').replace(/\s+/g, ' ').trim();
    return t.length > max ? `${t.slice(0, max - 1)}…` : t;
};

const paramText = (m) => (typeof m.parameters === 'string'
    ? m.parameters
    : Array.isArray(m.parameters)
        ? m.parameters.map((p) => (p.type ? `${p.name}: ${p.type}` : p.name)).join(', ')
        : '');

const signature = (cls, m) => `${cls}.${m.name}(${paramText(m)}): ${m.returnType || 'void'}`;

const betterDescription = (a, b) => {
    const score = (d) => (!d || PLACEHOLDER_DESC.test(d.trim()) ? 0 : d.length);
    return score(b) > score(a) ? b : a;
};

// Some source files list the same class more than once (often one empty stub plus the real one).
// Merge them so each class is published once with everything known about it.
function mergeDuplicates(classes) {
    const byName = new Map();
    for (const cls of classes) {
        const prev = byName.get(cls.name);
        if (!prev) {
            byName.set(cls.name, {
                ...cls,
                methods: [...(cls.methods || [])],
                attributes: [...(cls.attributes || [])],
                constructors: [...(cls.constructors || [])],
            });
            continue;
        }
        prev.description = betterDescription(prev.description, cls.description);
        const addUnique = (list, items, key) => {
            const seen = new Set(list.map(key));
            for (const item of items || []) {
                const k = key(item);
                if (!seen.has(k)) { seen.add(k); list.push(item); }
            }
        };
        addUnique(prev.methods, cls.methods, (m) => `${m.name}(${paramText(m)})`);
        addUnique(prev.attributes, cls.attributes, (a) => a.name);
        addUnique(prev.constructors, cls.constructors, (c) => JSON.stringify(c));
    }
    return [...byName.values()];
}

function build() {
    const started = Date.now();
    fs.rmSync(API_DIR, { recursive: true, force: true });

    const displayNames = {};
    for (const entry of readJson(INDEX_PATH)) displayNames[entry.id] = entry.name;

    const files = fs.readdirSync(PLUGINS_DIR).filter((f) => f.endsWith('.json')).sort();
    const plugins = [];
    const classIndex = {};
    let classTotal = 0;
    let methodTotal = 0;

    for (const file of files) {
        const id = file.replace(/\.json$/, '');
        const data = readJson(path.join(PLUGINS_DIR, file));
        const name = displayNames[id] || data.name || id;
        const classes = mergeDuplicates(data.classes || []);
        const usedFileNames = new Set(); // lower-cased, so Mac/Windows file systems don't overwrite
        let methodCount = 0;
        const classSummaries = [];

        for (const cls of classes) {
            let fileName = `${encodeURIComponent(cls.name)}.json`;
            for (let n = 2; usedFileNames.has(fileName.toLowerCase()); n++) {
                fileName = `${encodeURIComponent(cls.name)}~${n}.json`;
            }
            usedFileNames.add(fileName.toLowerCase());
            const url = `${API_BASE}/plugins/${id}/${fileName}`;

            const methods = (cls.methods || []).map((m) => ({
                name: m.name,
                signature: signature(cls.name, m),
                parameters: paramText(m),
                returnType: m.returnType || 'void',
                description: m.description || '',
            }));
            methodCount += methods.length;

            writeJson(path.join(API_DIR, 'plugins', id, fileName), {
                plugin: id,
                pluginName: name,
                name: cls.name,
                description: cls.description || '',
                attributes: cls.attributes || [],
                constructors: cls.constructors || [],
                methods,
                docUrl: `${SITE}/#/plugin/${id}/class/${encodeURIComponent(cls.name)}`,
            });

            classSummaries.push({
                name: cls.name,
                description: short(cls.description),
                methods: methods.length,
                attributes: (cls.attributes || []).length,
                url,
            });
            (classIndex[cls.name] ||= []).push({ plugin: id, url });
        }

        writeJson(path.join(API_DIR, 'plugins', `${id}.json`), {
            id,
            name,
            description: data.description || '',
            classes: classSummaries,
        });

        plugins.push({
            id,
            name,
            classes: classes.length,
            methods: methodCount,
            url: `${API_BASE}/plugins/${id}.json`,
        });
        classTotal += classes.length;
        methodTotal += methodCount;
    }

    plugins.sort((a, b) => a.name.localeCompare(b.name));
    writeJson(path.join(API_DIR, 'plugins.json'), {
        generated: new Date().toISOString(),
        classUrlPattern: `${API_BASE}/plugins/{pluginId}/{ClassName}.json`,
        plugins,
    });
    writeJson(path.join(API_DIR, 'classes.json'), classIndex);

    fs.writeFileSync(path.join(PUBLIC_DIR, 'llms.txt'), llmsTxt(plugins, classTotal, methodTotal));

    console.log(
        `AI API: ${plugins.length} plugins, ${classTotal} classes, ${methodTotal} methods ` +
        `-> public/api/v1 + public/llms.txt (${((Date.now() - started) / 1000).toFixed(1)}s)`,
    );
}

function llmsTxt(plugins, classTotal, methodTotal) {
    const lines = [
        '# modern-vroapi',
        '',
        '> Scripting API reference for VMware/VCF Orchestrator (vRealize Orchestrator 7.x, Aria Automation Orchestrator 8.x, VCF Operations Orchestrator 9.x): every plugin class with its methods, parameters, return types and attributes. Use it to check a method exists and how to call it before writing Orchestrator JavaScript.',
        '',
        `${plugins.length} plugins, ${classTotal} classes, ${methodTotal} methods. All endpoints are static JSON, no auth.`,
        '',
        'Orchestrator scripts run on Rhino: write plain ES5 (var, function(){}); no arrow functions, let/const, template literals, classes or other ES6+ syntax.',
        '',
        '## How to look something up',
        '',
        `1. Know the class name (e.g. VcPlugin, RESTHost, System)? Fetch ${API_BASE}/classes.json; each class name maps to a list of { plugin, url }. Fetch the url.`,
        `2. A class file has the attributes, constructors and methods, each method with a ready "signature" string. Pattern: ${API_BASE}/plugins/{pluginId}/{ClassName}.json`,
        `3. Browsing a plugin? Fetch ${API_BASE}/plugins/{pluginId}.json for all its classes with one-line descriptions and urls.`,
        `4. Full plugin list with counts: ${API_BASE}/plugins.json`,
        '',
        `Example: ${API_BASE}/plugins/o11n-core/System.json`,
        '',
        'Some class names exist in more than one plugin; classes.json then lists each one. Pick the plugin that matches what the script is working with.',
        '',
        '## Plugins',
        '',
        ...plugins.map((p) => `- [${p.name}](${p.url}): \`${p.id}\`, ${p.classes} classes, ${p.methods} methods`),
        '',
    ];
    return lines.join('\n');
}

build();
