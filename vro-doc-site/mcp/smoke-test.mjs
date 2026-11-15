// Local smoke test for the MCP endpoint, no Vercel needed.
// Serves public/ on a local port, points the MCP function at it and runs every tool.
//
// Run from vro-doc-site:  npm run mcp:test   (builds public/api/v1 first)

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const PUBLIC_DIR = path.join(process.cwd(), 'public');

const server = http.createServer((req, res) => {
    const file = path.join(PUBLIC_DIR, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
        res.writeHead(404).end();
        return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    fs.createReadStream(file).pipe(res);
});
await new Promise((resolve) => server.listen(0, resolve));
process.env.MCP_DATA_BASE_URL = `http://127.0.0.1:${server.address().port}`;

const { POST, GET } = await import('../api/mcp.js');

let id = 0;
let failures = 0;
async function rpc(method, params) {
    const res = await POST(new Request('https://modernvroapi.in/api/mcp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json, text/event-stream' },
        body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }),
    }));
    return res.json();
}
function check(label, ok, detail) {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
    if (!ok) { failures++; console.log(detail); }
}
const text = (r) => (r.result && r.result.content ? r.result.content[0].text : JSON.stringify(r));

const init = await rpc('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'smoke', version: '0' } });
check('initialize', init.result && init.result.serverInfo.name === 'modernvroapi', init);

const list = await rpc('tools/list', {});
check('tools/list has 4 tools', list.result && list.result.tools.length === 4, list);

const t0 = Date.now();
const search = await rpc('tools/call', { name: 'search_api', arguments: { query: 'System.getModule' } });
check(`search_api System.getModule (${Date.now() - t0} ms, cold)`, /System\.getModule/.test(text(search)), text(search));

const t1 = Date.now();
const search2 = await rpc('tools/call', { name: 'search_api', arguments: { query: 'virtual machine', kind: 'class', limit: 5 } });
check(`search_api words + kind (${Date.now() - t1} ms, warm)`, !search2.result.isError, text(search2));

const cls = await rpc('tools/call', { name: 'get_class', arguments: { name: 'resthost' } });
check('get_class resthost (case-insensitive)', /"name": "RESTHost"/.test(text(cls)), text(cls).slice(0, 300));

const plugins = await rpc('tools/call', { name: 'list_plugins', arguments: {} });
check('list_plugins', /o11n-core/.test(text(plugins)), text(plugins));

const core = await rpc('tools/call', { name: 'list_plugins', arguments: { plugin: 'o11n-core', filter: 'Rest', limit: 5 } });
check('list_plugins o11n-core filter', !core.result.isError, text(core));

const sig = await rpc('tools/call', { name: 'get_method_signature', arguments: { class: 'System', method: 'getModule' } });
check('get_method_signature System.getModule', /System\.getModule\(/.test(text(sig)), text(sig));

const miss = await rpc('tools/call', { name: 'get_method_signature', arguments: { class: 'System', method: 'getModul' } });
check('get_method_signature suggests close names', miss.result.isError && /getModule/.test(text(miss)), text(miss));

const unknown = await rpc('nope', {});
check('unknown method -> -32601', unknown.error && unknown.error.code === -32601, unknown);

const note = await POST(new Request('https://modernvroapi.in/api/mcp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized' }),
}));
check('notification -> 202', note.status === 202, note.status);

const sse = GET(new Request('https://modernvroapi.in/api/mcp', { headers: { Accept: 'text/event-stream' } }));
check('GET SSE -> 405', sse.status === 405, sse.status);

console.log('\nSample output:\n' + text(search2) + '\n\n' + text(sig));
server.close();
process.exit(failures ? 1 : 0);
