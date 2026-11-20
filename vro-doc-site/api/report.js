// Vercel serverless function: POST https://modernvroapi.in/api/report
//
// Plain HTTP way to send a problem report about the reference, for agents and scripts that do
// not use the MCP server. The body is the same JSON object the MCP tool report_inaccuracy takes
// (see ../mcp/report.mjs). GET returns a short description of the fields.

import { ToolError, reportInaccuracy } from '../mcp/server.mjs';
import { REPORT_KINDS } from '../mcp/report.mjs';
import { callerOf, dataBaseUrl } from './mcp.js';

const MAX_BODY_BYTES = 40 * 1024;

const CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept',
    'Access-Control-Max-Age': '86400',
};

const json = (body, status = 200) => new Response(JSON.stringify(body, null, 1), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
});

export async function POST(request) {
    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) return json({ status: 'rejected', message: 'Report too large. Keep code and logs to the lines that show the problem.' }, 413);
    let args;
    try {
        args = JSON.parse(raw);
    } catch {
        return json({ status: 'rejected', message: 'The body must be a JSON object.' }, 400);
    }
    if (!args || typeof args !== 'object' || Array.isArray(args)) {
        return json({ status: 'rejected', message: 'The body must be a JSON object.' }, 400);
    }
    try {
        const text = await reportInaccuracy(dataBaseUrl(request), args, { source: 'REST endpoint', caller: callerOf(request) });
        return json(JSON.parse(text));
    } catch (err) {
        if (err instanceof ToolError) return json({ status: 'rejected', message: err.message }, 400);
        return json({ status: 'error', message: 'The report could not be processed.' }, 500);
    }
}

export function GET() {
    return json({
        about: 'Report a problem in the modernvroapi.in Orchestrator API reference. POST a JSON object to this URL. The report becomes a public GitHub issue, so get the agreement of the person you work for first and leave out passwords, tokens, host names, IP addresses and customer names.',
        required: ['class', 'actual_behaviour', 'orchestrator_version', 'user_approved (must be true)'],
        optional: ['plugin', 'member', 'kind', 'reference_says', 'orchestrator_build', 'plugin_version', 'code', 'error_log', 'suggested_fix', 'reporter'],
        kinds: REPORT_KINDS,
        answer: { status: 'created | commented | duplicate | manual | rejected', message: 'what happened', url: 'the issue, or a pre-filled link to open when status is manual' },
        docs: 'https://modernvroapi.in/llms.txt',
    });
}

export function OPTIONS() {
    return new Response(null, { status: 204, headers: CORS });
}
