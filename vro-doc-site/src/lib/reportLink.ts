// "Report a problem" link on class pages: opens a GitHub issue with the fields laid out,
// in the same pattern the MCP tool report_inaccuracy and POST /api/report use.

const REPO = 'imtrinity94/modern-vroapi';

export function reportProblemUrl(pluginId: string, className: string, pageUrl: string): string {
    const body = [
        '| Field | Value |',
        '|---|---|',
        `| Plugin | \`${pluginId}\` |`,
        `| Class | \`${className}\` |`,
        '| Member | (method or attribute name, or "whole class") |',
        '| Orchestrator version | (for example 9.1.1.0) |',
        '| Orchestrator build | |',
        '| Plugin version | |',
        `| Reference page | ${pageUrl} |`,
        '',
        '### What the reference says',
        '',
        '### What the real Orchestrator did',
        '',
        '### Code',
        '```javascript',
        '',
        '```',
        '',
        '### Error log',
        '```text',
        '',
        '```',
        '',
        'Please leave out passwords, tokens, host names, IP addresses and customer names. This issue is public.'
    ].join('\n');
    const params = new URLSearchParams({ title: `[report] ${pluginId} / ${className}`, body });
    return `https://github.com/${REPO}/issues/new?${params.toString()}`;
}
