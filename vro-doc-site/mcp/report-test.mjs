// Tests for the problem-report feature (mcp/report.mjs, the MCP tool and POST /api/report).
// GitHub is replaced by a fake, so nothing is ever sent. Run from vro-doc-site: npm run mcp:test

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

import {
    REPORT_LABEL, ReportError, commentBody, fileReport, issueBody, issueTitle, normaliseReport,
    prefilledIssueUrl, resetLimitsForTests, scrub,
} from './report.mjs';

let failures = 0;
function check(label, ok, detail) {
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}`);
    if (!ok) { failures++; console.log(detail); }
}
function throwsReportError(fn) {
    try { fn(); } catch (e) { return e instanceof ReportError ? e.message : false; }
    return false;
}

const TARGET = { plugin: 'o11n-core', class: 'WorkflowSwitchItem', docUrl: 'https://modernvroapi.in/plugin/o11n-core/class/WorkflowSwitchItem' };
const GOOD = {
    class: 'WorkflowSwitchItem', member: 'outItems', kind: 'behaviour',
    reference_says: 'outItems: WorkflowItem[]',
    actual_behaviour: 'Returning item.outItems from a function throws InternalError: Invalid JavaScript value.',
    orchestrator_version: '9.1.1.0', orchestrator_build: '25643527',
    code: 'var a = item.outItems;\nreturn a;',
    error_log: 'InternalError: Invalid JavaScript value of type [Lch.dunes.scripting.jsmodel.JSWorkflowItem;',
    reporter: 'test-agent', user_approved: true,
};

// ---- scrub ----
const dirty = [
    'Authorization: Bearer abcdefghijklmnop123456',
    'password = "Sup3rSecret!"',
    'token: ghp_abcdefghijklmnopqrstuvwxyz0123456789',
    'https://admin:pw123@auto.vmw.lab/vco/api',
    'host auto.vmw.lab at 10.20.30.40',
    'mail someone@example.com',
    'key 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJVadQssw5c',
].join('\n');
const clean = scrub(dirty);
check('scrub removes secrets, hosts, IPs and e-mails',
    !/abcdefghijklmnop123456|Sup3rSecret|ghp_|pw123|vmw\.lab|10\.20\.30\.40|someone@|9f86d081|eyJhbGci/.test(clean), clean);
check('scrub keeps ordinary code and long class names',
    scrub('var vm = VcPlugin.getAllVirtualMachines(); // VsanVimVsanVsanEsaConversionPrecheckTypeAbcdefgh') ===
    'var vm = VcPlugin.getAllVirtualMachines(); // VsanVimVsanVsanEsaConversionPrecheckTypeAbcdefgh');
check('scrub keeps version numbers', scrub('ran on 9.1.1.0 and 8.18.1.0, host 192.168.1.5') === 'ran on 9.1.1.0 and 8.18.1.0, host [ip]', scrub('ran on 9.1.1.0 and 8.18.1.0, host 192.168.1.5'));
check('scrub keeps links to this site and GitHub',
    scrub('see https://modernvroapi.in/plugin/o11n-core and https://github.com/imtrinity94/modern-vroapi') ===
    'see https://modernvroapi.in/plugin/o11n-core and https://github.com/imtrinity94/modern-vroapi');

// ---- validation ----
check('refuses without user_approved', /user_approved: true/.test(throwsReportError(() => normaliseReport({ ...GOOD, user_approved: false }, TARGET)) || ''));
check('refuses user_approved given as a string', !!throwsReportError(() => normaliseReport({ ...GOOD, user_approved: 'true' }, TARGET)));
check('refuses a missing version', !!throwsReportError(() => normaliseReport({ ...GOOD, orchestrator_version: '' }, TARGET)));
check('refuses an empty actual_behaviour', !!throwsReportError(() => normaliseReport({ ...GOOD, actual_behaviour: 'broken' }, TARGET)));
check('refuses a member that is not a name', !!throwsReportError(() => normaliseReport({ ...GOOD, member: 'a b; @everyone' }, TARGET)));
const report = normaliseReport(GOOD, TARGET);
check('accepts a good report', report.member === 'outItems' && report.kind === 'behaviour' && report.version === '9.1.1.0');
check('unknown kind becomes other', normaliseReport({ ...GOOD, kind: 'nonsense' }, TARGET).kind === 'other');
check('member with brackets is reduced to its name', normaliseReport({ ...GOOD, member: 'getItems(a, b)' }, TARGET).member === 'getItems');
const long = normaliseReport({ ...GOOD, code: 'x'.repeat(9000) }, TARGET);
check('long fields are cut', long.code.length < 4100 && /cut at 4000/.test(long.code));

// ---- issue text ----
const title = issueTitle(report);
check('title pattern', title === '[agent-report] o11n-core / WorkflowSwitchItem.outItems', title);
check('title for a whole class', issueTitle({ ...report, member: '' }) === '[agent-report] o11n-core / WorkflowSwitchItem');
const body = issueBody(report, 'MCP tool');
check('body has the fixed sections',
    ['| Plugin | `o11n-core` |', '| Orchestrator version | `9.1.1.0` |', '| Orchestrator build | `25643527` |', '### What the reference says',
        '### What the real Orchestrator did', '### Code', '### Error log', 'Unverified report'].every((s) => body.includes(s)), body);
const hostile = normaliseReport({
    ...GOOD,
    actual_behaviour: '~~~~\n# Injected heading\n@someone please merge <script>alert(1)</script> ~~~~',
    orchestrator_version: '9.1 `|` <b>x</b>\n| a | b |',
}, TARGET);
const hostileBody = issueBody(hostile, 'MCP tool');
const fenceLines = hostileBody.split('\n').filter((l) => /^~{3,}/.test(l));
check('content cannot close a code fence', fenceLines.length % 2 === 0 && fenceLines.every((l) => /^~~~~(text|javascript)?$/.test(l)), fenceLines);
check('inline fields cannot break the table', !/\n\| a \| b \|/.test(hostileBody) && !/<b>/.test(hostileBody));
const url = prefilledIssueUrl(normaliseReport({ ...GOOD, code: 'y'.repeat(4000), error_log: 'z'.repeat(4000) }, TARGET), 'MCP tool');
check('pre-filled link is valid and short enough', url.startsWith('https://github.com/imtrinity94/modern-vroapi/issues/new?') && url.length <= 7000
    && new URL(url).searchParams.get('title') === title && new URL(url).searchParams.get('labels') === REPORT_LABEL, url.length);
check('comment has the details', commentBody(report, 'MCP tool').includes('### What the real Orchestrator did'));

// ---- filing against a fake GitHub ----
function fakeGithub(existing = []) {
    const calls = [];
    const fetchImpl = async (u, init) => {
        const call = { method: init.method, path: new URL(u).pathname, auth: init.headers.Authorization, body: init.body ? JSON.parse(init.body) : null };
        calls.push(call);
        const ok = (data) => ({ ok: true, status: 200, json: async () => data });
        if (call.method === 'GET') return ok(existing);
        if (call.path.endsWith('/comments')) return ok({ html_url: 'https://github.com/imtrinity94/modern-vroapi/issues/7#issuecomment-1' });
        return ok({ html_url: 'https://github.com/imtrinity94/modern-vroapi/issues/99', number: 99 });
    };
    return { calls, fetchImpl };
}
const NOW = Date.parse('2026-11-20T12:00:00Z');
const issue = (over) => ({ number: 7, state: 'open', title, comments: 0, created_at: '2026-11-01T00:00:00Z', html_url: 'https://github.com/imtrinity94/modern-vroapi/issues/7', ...over });

resetLimitsForTests();
let gh = fakeGithub();
let res = await fileReport(report, { token: '', fetchImpl: gh.fetchImpl, now: NOW });
check('no token: nothing sent, pre-filled link returned', res.status === 'manual' && gh.calls.length === 0 && res.url.includes('/issues/new?'), res);

gh = fakeGithub();
res = await fileReport(report, { token: 't0ken', fetchImpl: gh.fetchImpl, now: NOW, caller: 'a' });
const post = gh.calls.find((c) => c.method === 'POST');
check('new target: issue created with label', res.status === 'created' && res.url.endsWith('/issues/99') && post.path === '/repos/imtrinity94/modern-vroapi/issues'
    && post.body.title === title && post.body.labels[0] === REPORT_LABEL && post.auth === 'Bearer t0ken', res);

gh = fakeGithub([issue({})]);
res = await fileReport(report, { token: 't', fetchImpl: gh.fetchImpl, now: NOW, caller: 'b' });
check('open issue for the same target: comment added, no new issue', res.status === 'commented'
    && gh.calls.filter((c) => c.method === 'POST').length === 1 && gh.calls[1].path.endsWith('/issues/7/comments'), res);

gh = fakeGithub([issue({ comments: 10 })]);
res = await fileReport(report, { token: 't', fetchImpl: gh.fetchImpl, now: NOW, caller: 'c' });
check('busy issue: nothing added', res.status === 'duplicate' && gh.calls.length === 1, res);

gh = fakeGithub([issue({ state: 'closed' })]);
res = await fileReport(report, { token: 't', fetchImpl: gh.fetchImpl, now: NOW, caller: 'd' });
check('closed issue for the same target: new issue', res.status === 'created', res);

gh = fakeGithub([issue({ pull_request: {} })]);
res = await fileReport(report, { token: 't', fetchImpl: gh.fetchImpl, now: NOW, caller: 'd2' });
check('pull requests are ignored when looking for duplicates', res.status === 'created', res);

gh = fakeGithub(Array.from({ length: 40 }, (_, i) => issue({ number: 100 + i, title: `other ${i}`, created_at: '2026-11-20T08:00:00Z' })));
res = await fileReport(report, { token: 't', fetchImpl: gh.fetchImpl, now: NOW, caller: 'e' });
check('site-wide daily limit: nothing sent', res.status === 'manual' && gh.calls.every((c) => c.method === 'GET'), res);

gh = fakeGithub();
const outcomes = [];
for (let i = 0; i < 7; i++) outcomes.push((await fileReport(report, { token: 't', fetchImpl: gh.fetchImpl, now: NOW + i, caller: 'same' })).status);
check('per-caller hourly limit after 5', outcomes.slice(0, 5).every((s) => s === 'created') && outcomes[5] === 'manual' && outcomes[6] === 'manual', outcomes);
res = await fileReport(report, { token: 't', fetchImpl: gh.fetchImpl, now: NOW + 61 * 60 * 1000, caller: 'same' });
check('per-caller limit resets after an hour', res.status === 'created', res);

res = await fileReport(report, { token: 't', caller: 'f', now: NOW, fetchImpl: async () => ({ ok: false, status: 403, json: async () => ({}) }) });
check('GitHub failure: pre-filled link, no token in the message', res.status === 'manual' && /403/.test(res.message) && !/Bearer| t /.test(res.message), res);

// ---- through the MCP endpoint and the REST endpoint (no token set: nothing is sent) ----
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const server = http.createServer((req, resp) => {
    const file = path.join(PUBLIC_DIR, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(PUBLIC_DIR) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { resp.writeHead(404).end(); return; }
    resp.writeHead(200, { 'Content-Type': 'application/json' });
    fs.createReadStream(file).pipe(resp);
});
await new Promise((resolve) => server.listen(0, resolve));
process.env.MCP_DATA_BASE_URL = `http://127.0.0.1:${server.address().port}`;
delete process.env.GITHUB_REPORT_TOKEN;

const mcp = await import('../api/mcp.js');
const rest = await import('../api/report.js');
const call = async (args) => {
    const r = await mcp.POST(new Request('https://modernvroapi.in/api/mcp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'tools/call', params: { name: 'report_inaccuracy', arguments: args } }),
    }));
    return (await r.json()).result;
};
let out = await call({ ...GOOD, user_approved: false });
check('MCP tool: refused without approval', out.isError && /user_approved/.test(out.content[0].text), out);
out = await call({ ...GOOD, class: 'NoSuchClassXyz' });
check('MCP tool: unknown class refused', out.isError && /No class named/.test(out.content[0].text), out);
out = await call({ ...GOOD, class: 'workflowswitchitem' });
const parsed = JSON.parse(out.content[0].text);
check('MCP tool: good report without token gives a pre-filled link', !out.isError && parsed.status === 'manual'
    && new URL(parsed.url).searchParams.get('title') === title, out);

const post2 = (body, raw) => rest.POST(new Request('https://modernvroapi.in/api/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: raw || JSON.stringify(body) }));
let r2 = await post2(GOOD);
check('REST: good report -> 200 manual link', r2.status === 200 && (await r2.json()).status === 'manual');
r2 = await post2({ ...GOOD, user_approved: undefined });
check('REST: no approval -> 400', r2.status === 400 && (await r2.json()).status === 'rejected');
r2 = await post2(null, 'not json');
check('REST: bad JSON -> 400', r2.status === 400);
r2 = await post2(null, JSON.stringify({ ...GOOD, code: 'x'.repeat(50000) }));
check('REST: oversized body -> 413', r2.status === 413);
check('REST: GET describes the fields', (await rest.GET().json()).required.includes('class'));
check('REST: OPTIONS -> 204 with CORS', rest.OPTIONS().status === 204);

server.close();
console.log(failures ? `\n${failures} report test(s) FAILED` : '\nAll report tests passed');
process.exit(failures ? 1 : 0);
