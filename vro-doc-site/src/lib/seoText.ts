// Titles, descriptions and URLs for search engines.
// Used by the React pages and by scripts/prerender.ts, so the HTML built
// ahead of time and the page rendered in the browser always say the same thing.

export const SITE_URL = 'https://modernvroapi.in';
export const SITE_NAME = 'modernvroapi.in';

export const HOME_TITLE = 'vRO API Documentation';
export const HOME_DESCRIPTION =
    'Searchable JavaScript API reference for VCF Operations Orchestrator (vRO) plugins: classes, methods and attributes for vCenter, NSX, REST, Aria Automation and more.';

export const MCP_TITLE = 'MCP server for AI assistants';
export const MCP_DESCRIPTION =
    'Connect Claude, ChatGPT, Cursor or VS Code to the modernvroapi.in MCP server so your AI assistant looks up real VCF Orchestrator API signatures.';

export function fullTitle(title: string): string {
    return `${title} | ${SITE_NAME}`;
}

export function pluginPath(pluginId: string): string {
    return `/plugin/${pluginId}`;
}

export function classPath(pluginId: string, className: string): string {
    return `/plugin/${pluginId}/class/${encodeURIComponent(className)}`;
}

function clip(text: string, max: number): string {
    const clean = text.replace(/\s+/g, ' ').trim();
    if (clean.length <= max) return clean;
    return clean.slice(0, max - 1).trimEnd() + '…';
}

export function pluginTitle(pluginName: string): string {
    return `${pluginName} plugin - vRO API reference`;
}

export function pluginDescription(pluginName: string, classNames: string[]): string {
    const sample = classNames.slice(0, 3).join(', ');
    return `vRO (VCF Operations Orchestrator) JavaScript API reference for the ${pluginName} plugin: ${classNames.length} classes${sample ? ` such as ${sample}` : ''}.`;
}

export function classTitle(className: string, pluginName: string): string {
    return `${className} - ${pluginName} plugin - vRO API`;
}

export function classDescription(
    className: string,
    pluginName: string,
    description: string | undefined,
    methodNames: string[],
    attributeNames: string[]
): string {
    const parts = [`${className} class in the ${pluginName} plugin for vRO (VCF Operations Orchestrator).`];
    if (description) parts.push(clip(description, 120));
    const members = methodNames.length > 0 ? methodNames : attributeNames;
    if (members.length > 0) {
        const label = methodNames.length > 0 ? 'Methods' : 'Attributes';
        parts.push(`${label}: ${members.slice(0, 4).join(', ')}${members.length > 4 ? ' and more' : ''}.`);
    }
    return parts.join(' ');
}
