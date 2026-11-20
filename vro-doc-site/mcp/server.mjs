// modernvroapi MCP server core.
//
// A small, dependency-free MCP (Model Context Protocol) server over the static JSON API that
// scripts/build-ai-api.mjs publishes under /api/v1/. It is stateless: every JSON-RPC request is
// answered on its own, so it runs on any serverless host. The Vercel adapter is api/mcp.js.
//
// Tools: search_api, get_class, list_plugins, get_method_signature (read-only) and
// report_inaccuracy (files a public problem report, see report.mjs).

import { REPORT_KINDS, ReportError, fileReport, normaliseReport } from './report.mjs';

export const SERVER_NAME = 'modernvroapi';
export const SERVER_VERSION = '1.1.0';

const SUPPORTED_PROTOCOL_VERSIONS = ['2025-11-25', '2025-06-18', '2025-03-26', '2024-11-05'];
const DEFAULT_PROTOCOL_VERSION = '2025-06-18';
const DATA_TTL_MS = 60 * 60 * 1000; // re-fetch the JSON at most once an hour per warm instance

const INSTRUCTIONS = [
    'Scripting API reference for VMware/VCF Orchestrator (vRO 7.x, Aria Automation Orchestrator 8.x, VCF Operations Orchestrator 9.x), from modernvroapi.in.',
    'Use it to check that a class, method or attribute exists and how to call it before writing Orchestrator JavaScript.',
    'Typical flow: search_api to find names, then get_method_signature or get_class for exact details.',
    'Orchestrator scripts run on Rhino: write plain ES5 (var, function(){}); no arrow functions, let/const, template literals, classes or other ES6+ syntax.',
    'If a real Orchestrator contradicts this reference (a listed method is missing, a signature or type is wrong, an unlisted member exists), tell the person you are working for and offer to report it with report_inaccuracy. Only send a report after they agree; it becomes a public GitHub issue.',
].join(' ');

const READ_ONLY = { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false };

const TOOLS = [
    {
        name: 'search_api',
        title: 'Search the Orchestrator API',
        description: 'Search all Orchestrator plugin classes, methods and attributes by name (and class descriptions). '
            + 'Accepts plain words ("folder vm"), a member name ("getAllVirtualMachines") or Class.member ("System.getModule"). '
            + 'Returns matches with plugin id and signature or type.',
        inputSchema: {
            type: 'object',
            properties: {
                query: { type: 'string', description: 'Words, a name, or Class.member to look for.' },
                kind: { type: 'string', enum: ['any', 'class', 'method', 'attribute'], description: 'Limit results to one kind. Default any.' },
                plugin: { type: 'string', description: 'Optional plugin id to search in, e.g. o11n-core or o11n-plugin-vsphere (see list_plugins).' },
                limit: { type: 'integer', minimum: 1, maximum: 100, description: 'Maximum results. Default 25.' },
            },
            required: ['query'],
            additionalProperties: false,
        },
        annotations: { title: 'Search the Orchestrator API', ...READ_ONLY },
    },
    {
        name: 'get_class',
        title: 'Get class details',
        description: 'Full reference for one class: description, attributes (type, read-only), constructors and every method with its signature, return type and description.',
        inputSchema: {
            type: 'object',
            properties: {
                name: { type: 'string', description: 'Class name, e.g. VcVirtualMachine, RESTHost, System. Case-insensitive.' },
                plugin: { type: 'string', description: 'Optional plugin id when the class exists in more than one plugin.' },
            },
            required: ['name'],
            additionalProperties: false,
        },
        annotations: { title: 'Get class details', ...READ_ONLY },
    },
    {
        name: 'list_plugins',
        title: 'List plugins and their classes',
        description: 'Without plugin: every documented Orchestrator plugin with its id and class/method counts. '
            + 'With plugin: the classes in that plugin with one-line descriptions (filter and paging available).',
        inputSchema: {
            type: 'object',
            properties: {
                plugin: { type: 'string', description: 'Plugin id (or part of its name) to list classes for.' },
                filter: { type: 'string', description: 'Only classes whose name contains this text.' },
                offset: { type: 'integer', minimum: 0, description: 'Skip this many classes. Default 0.' },
                limit: { type: 'integer', minimum: 1, maximum: 500, description: 'Maximum classes to return. Default 100.' },
            },
            additionalProperties: false,
        },
        annotations: { title: 'List plugins and their classes', ...READ_ONLY },
    },
    {
        name: 'get_method_signature',
        title: 'Get a method signature',
        description: 'Exact signature, parameters, return type and description of a method on a class, including all overloads. '
            + 'Suggests close names when the method does not exist.',
        inputSchema: {
            type: 'object',
            properties: {
                class: { type: 'string', description: 'Class name, e.g. System. Case-insensitive.' },
                method: { type: 'string', description: 'Method name, e.g. getModule. Case-insensitive.' },
                plugin: { type: 'string', description: 'Optional plugin id when the class exists in more than one plugin.' },
            },
            required: ['class', 'method'],
            additionalProperties: false,
        },
        annotations: { title: 'Get a method signature', ...READ_ONLY },
    },
    {
        name: 'report_inaccuracy',
        title: 'Report a problem in the reference',
        description: 'Report that this reference is wrong or incomplete for a class, method or attribute, after a real Orchestrator behaved differently. '
            + 'The report becomes a PUBLIC GitHub issue for the maintainer to verify. Before calling: show the person you are working for what you will send and get their agreement, then set user_approved to true. '
            + 'Never include passwords, tokens, host names, IP addresses, user names or customer names; keep code and logs to the few lines that show the problem. '
            + 'Do not use it for general questions, for problems in your own script, or when you have not run the code on a real Orchestrator.',
        inputSchema: {
            type: 'object',
            properties: {
                class: { type: 'string', description: 'Class the problem is in, e.g. WorkflowSwitchItem. Must exist in this reference.' },
                plugin: { type: 'string', description: 'Plugin id when the class exists in more than one plugin.' },
                member: { type: 'string', description: 'Method or attribute name. Leave out when the report is about the whole class.' },
                kind: { type: 'string', enum: REPORT_KINDS, description: 'missing_member: exists on the server, not in the reference. does_not_exist: listed here, not on the server. wrong_signature, wrong_type, wrong_description: the entry is incorrect. behaviour: correct but behaves in a way worth a note.' },
                reference_says: { type: 'string', description: 'What this reference states (the signature, type or sentence in question).' },
                actual_behaviour: { type: 'string', description: 'What the real Orchestrator did instead. Required.' },
                orchestrator_version: { type: 'string', description: 'Orchestrator version the code ran on, e.g. 9.1.1.0 or 8.18.1. Required.' },
                orchestrator_build: { type: 'string', description: 'Build number, if known.' },
                plugin_version: { type: 'string', description: 'Version of the plugin, if known.' },
                code: { type: 'string', description: 'Shortest script that shows the problem (plain ES5).' },
                error_log: { type: 'string', description: 'The error message or the few relevant log lines.' },
                suggested_fix: { type: 'string', description: 'What the reference entry should say instead, if you know.' },
                reporter: { type: 'string', description: 'Name of the agent or client sending the report, e.g. "Claude Code".' },
                user_approved: { type: 'boolean', description: 'true only when the person you are working for has seen the report and agreed to send it.' },
            },
            required: ['class', 'actual_behaviour', 'orchestrator_version', 'user_approved'],
            additionalProperties: false,
        },
        annotations: { title: 'Report a problem in the reference', readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: true },
    },
];

// ---------------------------------------------------------------------------
// Data access (fetched from the site's own /api/v1 and cached per warm instance)
// ---------------------------------------------------------------------------

const cache = new Map(); // url -> { at, promise }

function fetchJson(url) {
    const hit = cache.get(url);
    if (hit && Date.now() - hit.at < DATA_TTL_MS) return hit.promise;
    const promise = fetch(url, { headers: { accept: 'application/json' } }).then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
        return res.json();
    });
    promise.catch(() => cache.delete(url));
    cache.set(url, { at: Date.now(), promise });
    return promise;
}

const indexCache = new Map(); // baseUrl -> { at, promise }

function loadSearchIndex(baseUrl) {
    const hit = indexCache.get(baseUrl);
    if (hit && Date.now() - hit.at < DATA_TTL_MS) return hit.promise;
    const promise = fetchJson(`${baseUrl}/api/v1/search-index.json`).then((data) => {
        const rows = data.rows.map((r) => ({
            kind: r[0],
            plugin: data.plugins[r[1]],
            cls: r[2],
            member: r[3],
            detail: r[4],
            clsLower: r[2].toLowerCase(),
            memberLower: r[3].toLowerCase(),
            detailLower: r[0] === 'c' ? r[4].toLowerCase() : '',
        }));
        return { rows, plugins: data.plugins };
    });
    promise.catch(() => indexCache.delete(baseUrl));
    indexCache.set(baseUrl, { at: Date.now(), promise });
    return promise;
}

async function loadClassMap(baseUrl) {
    const map = await fetchJson(`${baseUrl}/api/v1/classes.json`);
    if (!map.__lower) {
        const lower = {};
        for (const name of Object.keys(map)) (lower[name.toLowerCase()] ||= []).push(name);
        Object.defineProperty(map, '__lower', { value: lower, enumerable: false });
    }
    return map;
}

async function loadPlugins(baseUrl) {
    return (await fetchJson(`${baseUrl}/api/v1/plugins.json`)).plugins;
}

// Class URLs in classes.json point at modernvroapi.in; keep the path, use our own base
// so preview deployments read their own data.
const localUrl = (baseUrl, url) => `${baseUrl}${new URL(url).pathname}`;

async function resolvePluginId(baseUrl, plugin) {
    if (!plugin) return undefined;
    const want = plugin.trim().toLowerCase();
    const plugins = await loadPlugins(baseUrl);
    const exact = plugins.find((p) => p.id.toLowerCase() === want || p.name.toLowerCase() === want);
    if (exact) return exact.id;
    const partial = plugins.filter((p) => p.id.toLowerCase().includes(want) || p.name.toLowerCase().includes(want));
    if (partial.length === 1) return partial[0].id;
    throw new ToolError(partial.length
        ? `Plugin "${plugin}" is ambiguous: ${partial.map((p) => p.id).join(', ')}.`
        : `Unknown plugin "${plugin}". Call list_plugins for the ids.`);
}

// Returns the class JSON, or throws a ToolError listing candidates / suggestions.
async function loadClass(baseUrl, name, plugin) {
    const map = await loadClassMap(baseUrl);
    const exactNames = map[name] ? [name] : (map.__lower[name.toLowerCase()] || []);
    let entries = exactNames.flatMap((n) => map[n].map((e) => ({ ...e, name: n })));
    if (!entries.length) {
        const { rows } = await loadSearchIndex(baseUrl);
        const q = name.toLowerCase();
        const similar = rows.filter((r) => r.kind === 'c' && r.clsLower.includes(q)).slice(0, 15).map((r) => `${r.cls} (${r.plugin})`);
        throw new ToolError(`No class named "${name}".${similar.length ? ` Similar: ${similar.join(', ')}.` : ' Try search_api.'}`);
    }
    const pluginId = await resolvePluginId(baseUrl, plugin);
    if (pluginId) {
        const inPlugin = entries.filter((e) => e.plugin === pluginId);
        if (!inPlugin.length) throw new ToolError(`Class "${name}" is not in ${pluginId}; it is in ${entries.map((e) => e.plugin).join(', ')}.`);
        entries = inPlugin;
    }
    if (entries.length > 1) {
        throw new ToolError(`"${name}" exists in several plugins: ${entries.map((e) => e.plugin).join(', ')}. Pass plugin to choose one.`);
    }
    return fetchJson(localUrl(baseUrl, entries[0].url));
}

// ---------------------------------------------------------------------------
// Tools
// ---------------------------------------------------------------------------

class ToolError extends Error {}

const clampInt = (v, def, min, max) => {
    const n = Number.isInteger(v) ? v : def;
    return Math.min(max, Math.max(min, n));
};

function scoreRow(r, terms, dotted) {
    let score = 0;
    if (dotted) {
        if (r.kind === 'c') return 0;
        const [c, m] = dotted;
        if (!r.clsLower.includes(c) || !r.memberLower.includes(m)) return 0;
        score += r.clsLower === c ? 50 : 20;
        score += r.memberLower === m ? 50 : r.memberLower.startsWith(m) ? 30 : 10;
        return score;
    }
    for (const t of terms) {
        let s = 0;
        const name = r.kind === 'c' ? r.clsLower : r.memberLower;
        if (name === t) s = 100;
        else if (name.startsWith(t)) s = 60;
        else if (name.includes(t)) s = 40;
        else if (r.kind !== 'c' && r.clsLower === t) s = 30;
        else if (r.kind !== 'c' && r.clsLower.includes(t)) s = 15;
        else if (r.detailLower.includes(t)) s = 8;
        if (!s) return 0; // every term must match somewhere
        score += s;
    }
    if (r.kind === 'c') score += 5; // classes first on ties
    return score;
}

function formatRow(r) {
    if (r.kind === 'c') return `class ${r.cls} [${r.plugin}]${r.detail ? ` - ${r.detail}` : ''}`;
    if (r.kind === 'm') return `method ${r.cls}.${r.member}${r.detail} [${r.plugin}]`;
    return `attribute ${r.cls}.${r.member}: ${r.detail || 'Any'} [${r.plugin}]`;
}

async function searchApi(baseUrl, args) {
    const query = String(args.query || '').trim();
    if (!query) throw new ToolError('query is required.');
    const limit = clampInt(args.limit, 25, 1, 100);
    const kindMap = { class: 'c', method: 'm', attribute: 'a' };
    const kind = kindMap[args.kind] || null;
    const pluginId = await resolvePluginId(baseUrl, args.plugin);

    const q = query.toLowerCase();
    const dot = q.match(/^([\w$]+)\.([\w$]+)\(?\)?$/);
    const dotted = dot ? [dot[1], dot[2]] : null;
    const terms = q.split(/[\s,]+/).filter(Boolean);

    const { rows } = await loadSearchIndex(baseUrl);
    const hits = [];
    for (const r of rows) {
        if (kind && r.kind !== kind) continue;
        if (pluginId && r.plugin !== pluginId) continue;
        const s = scoreRow(r, terms, dotted);
        if (s) hits.push([s, r]);
    }
    hits.sort((a, b) => b[0] - a[0] || a[1].cls.length - b[1].cls.length || a[1].cls.localeCompare(b[1].cls));

    if (!hits.length) return `No matches for "${query}"${pluginId ? ` in ${pluginId}` : ''}. Try fewer or shorter words.`;
    const shown = hits.slice(0, limit).map(([, r]) => formatRow(r));
    const more = hits.length > limit ? `\n(${hits.length - limit} more; narrow the query, set kind or plugin, or raise limit)` : '';
    return `${hits.length} match(es) for "${query}":\n${shown.join('\n')}${more}`;
}

async function getClass(baseUrl, args) {
    if (!args.name) throw new ToolError('name is required.');
    const cls = await loadClass(baseUrl, String(args.name).trim(), args.plugin);
    return JSON.stringify(cls, null, 1);
}

async function listPlugins(baseUrl, args) {
    if (!args.plugin) {
        const plugins = await loadPlugins(baseUrl);
        return [
            `${plugins.length} plugins (id: name, classes, methods):`,
            ...plugins.map((p) => `${p.id}: ${p.name}, ${p.classes} classes, ${p.methods} methods`),
        ].join('\n');
    }
    const pluginId = await resolvePluginId(baseUrl, args.plugin);
    const data = await fetchJson(`${baseUrl}/api/v1/plugins/${encodeURIComponent(pluginId)}.json`);
    const filter = String(args.filter || '').toLowerCase();
    const classes = filter ? data.classes.filter((c) => c.name.toLowerCase().includes(filter)) : data.classes;
    const offset = clampInt(args.offset, 0, 0, Number.MAX_SAFE_INTEGER);
    const limit = clampInt(args.limit, 100, 1, 500);
    const page = classes.slice(offset, offset + limit);
    const lines = [
        `${data.name} (${data.id}): ${classes.length} class(es)${filter ? ` matching "${args.filter}"` : ''}, showing ${page.length ? `${offset + 1}-${offset + page.length}` : 'none'}.`,
        ...page.map((c) => `${c.name} (${c.methods} methods, ${c.attributes} attributes)${c.description ? ` - ${c.description}` : ''}`),
    ];
    if (offset + limit < classes.length) lines.push(`(more: call again with offset ${offset + limit})`);
    return lines.join('\n');
}

async function getMethodSignature(baseUrl, args) {
    if (!args.class || !args.method) throw new ToolError('class and method are required.');
    const cls = await loadClass(baseUrl, String(args.class).trim(), args.plugin);
    const want = String(args.method).trim().replace(/\(.*$/, '').toLowerCase();
    const matches = (cls.methods || []).filter((m) => m.name.toLowerCase() === want);
    if (!matches.length) {
        const names = [...new Set((cls.methods || []).map((m) => m.name))];
        const close = names.filter((n) => n.toLowerCase().includes(want) || want.includes(n.toLowerCase())).slice(0, 15);
        const attr = (cls.attributes || []).find((a) => a.name.toLowerCase() === want);
        throw new ToolError(`${cls.name} has no method "${args.method}".`
            + (attr ? ` It has an attribute ${attr.name}: ${attr.type || 'Any'}${attr.isReadonly ? ' (read-only)' : ''}.` : '')
            + (close.length ? ` Close matches: ${close.join(', ')}.` : ` It has ${names.length} methods; call get_class to see them.`));
    }
    return JSON.stringify({
        plugin: cls.plugin,
        class: cls.name,
        overloads: matches.map((m) => ({
            signature: m.signature,
            parameters: m.parameters,
            returnType: m.returnType,
            description: m.description,
        })),
        docUrl: cls.docUrl,
    }, null, 1);
}

// Shared by the MCP tool and POST /api/report. ctx = { source, caller }.
export async function reportInaccuracy(baseUrl, args, ctx = {}) {
    if (!args || !args.class) throw new ToolError('class is required.');
    let report;
    try {
        if (args.user_approved !== true) normaliseReport(args, {}); // refuse before any lookup
        const cls = await loadClass(baseUrl, String(args.class).trim(), args.plugin);
        report = normaliseReport(args, { plugin: cls.plugin, class: cls.name, docUrl: cls.docUrl });
    } catch (err) {
        if (err instanceof ReportError) throw new ToolError(err.message);
        throw err;
    }
    const result = await fileReport(report, { source: ctx.source || 'MCP tool', caller: ctx.caller });
    return JSON.stringify({ status: result.status, message: result.message, url: result.url }, null, 1);
}

const HANDLERS = {
    search_api: searchApi,
    get_class: getClass,
    list_plugins: listPlugins,
    get_method_signature: getMethodSignature,
    report_inaccuracy: reportInaccuracy,
};

// ---------------------------------------------------------------------------
// JSON-RPC / MCP
// ---------------------------------------------------------------------------

const rpcError = (id, code, message) => ({ jsonrpc: '2.0', id: id ?? null, error: { code, message } });
const rpcResult = (id, result) => ({ jsonrpc: '2.0', id, result });

async function handleMessage(msg, baseUrl, ctx) {
    if (!msg || msg.jsonrpc !== '2.0' || typeof msg.method !== 'string') {
        return rpcError(msg && msg.id, -32600, 'Invalid Request');
    }
    const isNotification = msg.id === undefined;
    if (isNotification) return null; // notifications/initialized, notifications/cancelled, ...

    const { id, method, params = {} } = msg;
    switch (method) {
        case 'initialize': {
            const requested = params.protocolVersion;
            return rpcResult(id, {
                protocolVersion: SUPPORTED_PROTOCOL_VERSIONS.includes(requested) ? requested : DEFAULT_PROTOCOL_VERSION,
                capabilities: { tools: { listChanged: false } },
                serverInfo: { name: SERVER_NAME, title: 'modernvroapi.in - Orchestrator API reference', version: SERVER_VERSION, websiteUrl: 'https://modernvroapi.in' },
                instructions: INSTRUCTIONS,
            });
        }
        case 'ping':
            return rpcResult(id, {});
        case 'tools/list':
            return rpcResult(id, { tools: TOOLS });
        case 'tools/call': {
            const handler = HANDLERS[params.name];
            if (!handler) return rpcError(id, -32602, `Unknown tool: ${params.name}`);
            try {
                const text = await handler(baseUrl, params.arguments || {}, ctx);
                return rpcResult(id, { content: [{ type: 'text', text }] });
            } catch (err) {
                const text = err instanceof ToolError ? err.message : `Request failed: ${err.message}`;
                return rpcResult(id, { content: [{ type: 'text', text }], isError: true });
            }
        }
        case 'resources/list':
            return rpcResult(id, { resources: [] });
        case 'prompts/list':
            return rpcResult(id, { prompts: [] });
        default:
            return rpcError(id, -32601, `Method not found: ${method}`);
    }
}

// Handles one POST body (a JSON-RPC message or a batch). Returns the response body, or null
// when everything was a notification (the HTTP layer then answers 202 with no body).
export async function handleRpcBody(body, baseUrl, ctx = {}) {
    if (Array.isArray(body)) {
        if (!body.length) return rpcError(null, -32600, 'Invalid Request');
        const out = (await Promise.all(body.map((m) => handleMessage(m, baseUrl, ctx)))).filter(Boolean);
        return out.length ? out : null;
    }
    return handleMessage(body, baseUrl, ctx);
}

export { rpcError, ToolError };
