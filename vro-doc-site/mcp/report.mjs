// Problem reports for the modernvroapi.in reference.
//
// When the reference disagrees with what a real Orchestrator did, an AI agent (through the MCP
// tool report_inaccuracy) or any HTTP client (POST /api/report) can send a report in a fixed
// pattern. The report becomes a public GitHub issue labelled "agent-report", so it can be checked
// in a lab and the reference corrected.
//
// Rules this module enforces:
//   - the person the agent works for must have agreed (user_approved: true)
//   - the class must exist in the reference (checked by the caller before filing)
//   - every free-text field is length-capped and scrubbed of obvious secrets and hosts,
//     because the issue is public
//   - one open issue per plugin/class/member: a repeat adds a comment instead
//   - a per-caller hourly limit and a site-wide daily limit
//
// Without a GITHUB_REPORT_TOKEN nothing is filed: the caller gets a pre-filled "new issue" link
// to open in a browser instead.

export const REPORT_REPO = 'imtrinity94/modern-vroapi';
export const REPORT_LABEL = 'agent-report';

const SITE = 'https://modernvroapi.in';
const GITHUB_API = 'https://api.github.com';

const PER_CALLER_PER_HOUR = 5;
const SITE_WIDE_PER_DAY = 40;
const MAX_COMMENTS_PER_ISSUE = 10;
const MAX_PREFILLED_URL = 7000;

export const REPORT_KINDS = [
    'missing_member',      // a method or attribute exists on the server but not in the reference
    'does_not_exist',      // the reference lists something the server does not have
    'wrong_signature',     // parameters differ
    'wrong_type',          // attribute type or return type differs
    'wrong_description',   // the text is wrong or misleading
    'behaviour',           // documented correctly, but behaves in a way worth a note
    'other',
];

// Field name -> maximum length. Longer values are cut, not rejected.
const LIMITS = {
    reference_says: 1500,
    actual_behaviour: 2000,
    code: 4000,
    error_log: 4000,
    suggested_fix: 1500,
    orchestrator_version: 40,
    orchestrator_build: 40,
    plugin_version: 60,
    reporter: 80,
};

export class ReportError extends Error {}

// ---------------------------------------------------------------------------
// Cleaning
// ---------------------------------------------------------------------------

// Removes things that should not end up in a public issue. It is a safety net, not a guarantee:
// the tool description also tells callers to leave such details out.
export function scrub(text) {
    return String(text)
        // Authorization headers and bearer tokens
        .replace(/\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi, '$1 [removed]')
        // GitHub tokens and JSON web tokens
        .replace(/\b(gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,})\b/g, '[removed]')
        .replace(/\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g, '[removed]')
        // key = value for secret-looking keys
        .replace(/\b(pass(?:word|wd)?|pwd|secret|token|api[_-]?key|authorization|cookie|session[_-]?id)(["']?\s*[:=]\s*)("[^"\n]*"|'[^'\n]*'|[^\s,;&]+)/gi, '$1$2[removed]')
        // user:password@ inside URLs
        .replace(/\/\/[^/\s:@]+:[^/\s@]+@/g, '//[removed]@')
        // host part of URLs, except this site and GitHub
        .replace(/\b(https?:\/\/)([^/\s:?#"'<>]+)/gi, (all, scheme, host) =>
            /(^|\.)(modernvroapi\.in|github\.com)$/i.test(host) ? all : `${scheme}[host]`)
        // e-mail addresses
        .replace(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g, '[email]')
        // IPv4 addresses. Four-part numbers starting with a single digit are left alone:
        // they are almost always versions (9.1.1.0, 8.18.1.0), and private ranges start at 10.
        .replace(/\b(\d{1,3})(?:\.\d{1,3}){3}\b/g, (m, first) => (first.length === 1 ? m : '[ip]'))
        // internal-looking host names
        .replace(/\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:lab|local|internal|corp|lan|intra|home|localdomain)\b/gi, '[host]')
        // long opaque strings with digits (keys, hashes, encoded blobs); long class names stay
        .replace(/\b[A-Za-z0-9+/_-]{40,}={0,2}/g, (m) => (/\d/.test(m) ? '[removed]' : m));
}

function cleanBlock(value, max) {
    if (value === undefined || value === null) return '';
    let text = scrub(String(value).replace(/\r\n?/g, '\n').replace(/\u0000/g, '')).trim();
    if (text.length > max) text = `${text.slice(0, max)}\n[cut at ${max} characters]`;
    // Blocks are shown inside ~~~~ fences; make sure the content cannot close one.
    return text.replace(/~{3,}/g, (m) => m.split('').join(' '));
}

function cleanInline(value, max) {
    if (value === undefined || value === null) return '';
    return scrub(String(value)).replace(/[\r\n`|<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

// Version and build numbers: digits, letters, dots, dashes, spaces and brackets only.
function cleanVersion(value, max) {
    if (value === undefined || value === null) return '';
    return String(value).replace(/[^\w.\- ()]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

// Checks and cleans the raw arguments. target = { plugin, class, docUrl } comes from the
// reference itself (the caller looked the class up), so those names are trusted.
export function normaliseReport(args, target) {
    if (!args || typeof args !== 'object') throw new ReportError('A report object is required.');
    if (args.user_approved !== true) {
        throw new ReportError('Not sent. Reports are public GitHub issues: show the person you are working for what will be sent, and call again with user_approved: true once they agree.');
    }
    const kind = REPORT_KINDS.includes(args.kind) ? args.kind : 'other';

    let member = '';
    if (args.member !== undefined && args.member !== null && String(args.member).trim()) {
        member = String(args.member).trim().replace(/\(.*$/, '');
        if (!/^[A-Za-z_$][\w$]{0,99}$/.test(member)) {
            throw new ReportError('member must be a single method or attribute name, for example "createSnapshot_Task".');
        }
    }

    const actual = cleanBlock(args.actual_behaviour, LIMITS.actual_behaviour);
    if (actual.length < 15) throw new ReportError('actual_behaviour is required: say what the real Orchestrator did (at least a sentence).');

    const version = cleanVersion(args.orchestrator_version, LIMITS.orchestrator_version);
    if (!/\d/.test(version)) throw new ReportError('orchestrator_version is required, for example "9.1.1.0" or "8.18.1".');

    return {
        plugin: target.plugin,
        class: target.class,
        docUrl: target.docUrl,
        member,
        kind,
        referenceSays: cleanBlock(args.reference_says, LIMITS.reference_says),
        actual,
        version,
        build: cleanVersion(args.orchestrator_build, LIMITS.orchestrator_build),
        pluginVersion: cleanVersion(args.plugin_version, LIMITS.plugin_version),
        code: cleanBlock(args.code, LIMITS.code),
        errorLog: cleanBlock(args.error_log, LIMITS.error_log),
        suggestedFix: cleanBlock(args.suggested_fix, LIMITS.suggested_fix),
        reporter: cleanInline(args.reporter, LIMITS.reporter),
    };
}

// ---------------------------------------------------------------------------
// Issue text
// ---------------------------------------------------------------------------

export function issueTitle(report) {
    return `[${REPORT_LABEL}] ${report.plugin} / ${report.class}${report.member ? `.${report.member}` : ''}`;
}

const fence = (lang, text) => `~~~~${lang}\n${text}\n~~~~`;

function detailSections(report) {
    const out = [];
    if (report.referenceSays) out.push('### What the reference says', fence('text', report.referenceSays), '');
    out.push('### What the real Orchestrator did', fence('text', report.actual), '');
    if (report.code) out.push('### Code', fence('javascript', report.code), '');
    if (report.errorLog) out.push('### Error log', fence('text', report.errorLog), '');
    if (report.suggestedFix) out.push('### Suggested fix', fence('text', report.suggestedFix), '');
    return out;
}

function environmentRows(report, source) {
    const rows = [
        `| Orchestrator version | \`${report.version}\` |`,
        `| Orchestrator build | ${report.build ? `\`${report.build}\`` : 'not given'} |`,
        `| Plugin version | ${report.pluginVersion ? `\`${report.pluginVersion}\`` : 'not given'} |`,
        `| Sent through | ${source}${report.reporter ? ` (\`${report.reporter}\`)` : ''} |`,
    ];
    return rows;
}

export function issueBody(report, source) {
    return [
        '| Field | Value |',
        '|---|---|',
        `| Plugin | \`${report.plugin}\` |`,
        `| Class | \`${report.class}\` |`,
        `| Member | ${report.member ? `\`${report.member}\`` : 'whole class'} |`,
        `| Kind | \`${report.kind}\` |`,
        ...environmentRows(report, source),
        `| Reference page | ${report.docUrl} |`,
        '',
        ...detailSections(report),
        '---',
        'Unverified report sent through modernvroapi.in. Check it on a real Orchestrator before changing the reference.',
    ].join('\n');
}

export function commentBody(report, source) {
    return [
        `Another report for the same class or member (kind \`${report.kind}\`).`,
        '',
        '| Field | Value |',
        '|---|---|',
        ...environmentRows(report, source),
        '',
        ...detailSections(report),
    ].join('\n').trimEnd();
}

// A link that opens GitHub's "new issue" form with the report filled in. Used when the server
// cannot file the issue itself; the long sections are shortened so the URL stays usable.
export function prefilledIssueUrl(report, source) {
    const build = (r) => `https://github.com/${REPORT_REPO}/issues/new?${new URLSearchParams({
        title: issueTitle(r),
        labels: REPORT_LABEL,
        body: issueBody(r, source),
    })}`;
    let url = build(report);
    for (const max of [1500, 600, 200]) {
        if (url.length <= MAX_PREFILLED_URL) break;
        const cut = (t) => (t.length > max ? `${t.slice(0, max)}\n[shortened]` : t);
        url = build({
            ...report,
            referenceSays: cut(report.referenceSays),
            actual: cut(report.actual),
            code: cut(report.code),
            errorLog: cut(report.errorLog),
            suggestedFix: cut(report.suggestedFix),
        });
    }
    return url;
}

// ---------------------------------------------------------------------------
// Limits
// ---------------------------------------------------------------------------

const callerHits = new Map(); // caller -> timestamps (per warm instance; a brake, not a wall)

export function allowCaller(caller, now = Date.now()) {
    const key = caller || 'unknown';
    const recent = (callerHits.get(key) || []).filter((t) => now - t < 60 * 60 * 1000);
    if (recent.length >= PER_CALLER_PER_HOUR) {
        callerHits.set(key, recent);
        return false;
    }
    recent.push(now);
    callerHits.set(key, recent);
    if (callerHits.size > 5000) callerHits.clear();
    return true;
}

export function resetLimitsForTests() {
    callerHits.clear();
}

// ---------------------------------------------------------------------------
// Filing
// ---------------------------------------------------------------------------

async function github(fetchImpl, token, method, path, body) {
    const res = await fetchImpl(`${GITHUB_API}${path}`, {
        method,
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${token}`,
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'modernvroapi-report',
            ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) throw new Error(`GitHub answered ${res.status} for ${method} ${path.split('?')[0]}`);
    return res.json();
}

// Files the report. Returns { status, message, url }:
//   created      a new issue was opened
//   commented    an open issue for the same target got a comment
//   duplicate    an open issue exists and already has many comments; nothing added
//   manual       not filed (no token, limit reached or GitHub failed); url is a pre-filled link
export async function fileReport(report, options = {}) {
    const {
        source = 'MCP tool',
        caller = 'unknown',
        token = process.env.GITHUB_REPORT_TOKEN,
        fetchImpl = fetch,
        now = Date.now(),
    } = options;

    const manual = (why) => ({
        status: 'manual',
        url: prefilledIssueUrl(report, source),
        message: `${why} Nothing was sent. Give the person this link: it opens a GitHub issue with the report filled in, for them to review and submit.`,
    });

    if (!token) return manual('This server cannot file reports itself right now.');
    if (!allowCaller(caller, now)) return manual(`The limit of ${PER_CALLER_PER_HOUR} reports an hour was reached.`);

    const title = issueTitle(report);
    try {
        const recent = await github(fetchImpl, token, 'GET',
            `/repos/${REPORT_REPO}/issues?labels=${REPORT_LABEL}&state=all&sort=created&direction=desc&per_page=100`);
        const issues = recent.filter((i) => !i.pull_request);

        const open = issues.find((i) => i.state === 'open' && i.title === title);
        if (open) {
            if (open.comments >= MAX_COMMENTS_PER_ISSUE) {
                return { status: 'duplicate', url: open.html_url, message: 'This was already reported and has enough detail. Nothing was added.' };
            }
            const comment = await github(fetchImpl, token, 'POST',
                `/repos/${REPORT_REPO}/issues/${open.number}/comments`, { body: commentBody(report, source) });
            return { status: 'commented', url: comment.html_url || open.html_url, message: 'This was already reported; your details were added as a comment.' };
        }

        const lastDay = issues.filter((i) => now - Date.parse(i.created_at) < 24 * 60 * 60 * 1000).length;
        if (lastDay >= SITE_WIDE_PER_DAY) return manual('The site-wide limit for automatic reports today was reached.');

        const created = await github(fetchImpl, token, 'POST', `/repos/${REPORT_REPO}/issues`, {
            title,
            body: issueBody(report, source),
            labels: [REPORT_LABEL],
        });
        return { status: 'created', url: created.html_url, message: 'Report filed as a public GitHub issue. A maintainer will check it on a real Orchestrator.' };
    } catch (err) {
        return manual(`Filing failed (${err.message}).`);
    }
}
