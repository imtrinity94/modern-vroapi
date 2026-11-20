// Vercel serverless function: the modernvroapi MCP endpoint at https://modernvroapi.in/api/mcp
//
// MCP Streamable HTTP transport, stateless: each POST carries a JSON-RPC request and gets a
// plain JSON response (no sessions, no SSE stream). The MCP logic itself is in ../mcp/server.mjs.

import { handleRpcBody, rpcError, SERVER_NAME, SERVER_VERSION } from '../mcp/server.mjs';

const PRODUCTION = 'https://modernvroapi.in';

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, Mcp-Session-Id, Mcp-Protocol-Version, Last-Event-ID',
    'Access-Control-Expose-Headers': 'Mcp-Session-Id, Mcp-Protocol-Version',
    'Access-Control-Max-Age': '86400',
};

const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

// Where to read /api/v1 data from. Production reads itself; anything else (preview deployments,
// which may sit behind Vercel deployment protection) reads production unless MCP_DATA_BASE_URL is set.
export function dataBaseUrl(request) {
    if (process.env.MCP_DATA_BASE_URL) return process.env.MCP_DATA_BASE_URL.replace(/\/+$/, '');
    const { origin, hostname } = new URL(request.url);
    return hostname === 'modernvroapi.in' || hostname.endsWith('.modernvroapi.in') ? origin : PRODUCTION;
}

// Used only to slow down one caller sending many problem reports.
export function callerOf(request) {
    return (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
}

export async function POST(request) {
    let body;
    try {
        body = await request.json();
    } catch {
        return json(rpcError(null, -32700, 'Parse error'), 400);
    }
    const result = await handleRpcBody(body, dataBaseUrl(request), { source: 'MCP tool', caller: callerOf(request) });
    if (result === null) return new Response(null, { status: 202, headers: CORS });
    return json(result);
}

// No server-initiated stream and no sessions: GET with an SSE Accept gets 405 as the spec allows.
// A plain browser GET gets a short description instead.
export function GET(request) {
    const accept = request.headers.get('accept') || '';
    if (accept.includes('text/event-stream')) {
        return new Response(null, { status: 405, headers: { ...CORS, Allow: 'POST, OPTIONS' } });
    }
    return json({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        transport: 'streamable-http (stateless, POST JSON-RPC to this URL)',
        tools: ['search_api', 'get_class', 'list_plugins', 'get_method_signature', 'report_inaccuracy'],
        docs: 'https://modernvroapi.in/llms.txt',
    });
}

export function DELETE() {
    return new Response(null, { status: 405, headers: { ...CORS, Allow: 'POST, OPTIONS' } });
}

export function OPTIONS() {
    return new Response(null, { status: 204, headers: CORS });
}
