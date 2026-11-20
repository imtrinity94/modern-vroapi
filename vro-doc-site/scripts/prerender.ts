// Runs after "vite build". Writes one real HTML page per plugin and per class into
// dist/, plus sitemap.xml and robots.txt, so search engines can read every page
// without running JavaScript:
//
//   dist/index.html                              home, with links to every plugin
//   dist/mcp/index.html                          MCP page (title and description)
//   dist/plugin/<id>/index.html                  plugin page with its class list
//   dist/plugin/<id>/class/<Class>/index.html    class page: attributes and methods
//   dist/sitemap.xml, dist/robots.txt
//   dist/app.html                                app shell for any other address
//
// Each page is the built index.html with its own <head> tags and a plain HTML
// copy of the content inside #root. The React app replaces that copy as soon as
// it starts, so visitors get the normal site.
//
// Titles and descriptions come from src/lib/seoText.ts, the same module the
// React pages use.

import fs from 'fs';
import path from 'path';

import { PLUGIN_NAMES } from './plugin-names.js';
import {
    HOME_DESCRIPTION,
    HOME_TITLE,
    MCP_DESCRIPTION,
    MCP_TITLE,
    SITE_NAME,
    SITE_URL,
    classDescription,
    classPath,
    classTitle,
    fullTitle,
    pluginDescription,
    pluginPath,
    pluginTitle
} from '../src/lib/seoText.js';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const PLUGINS_DIR = path.join(ROOT, 'src/data/plugins');
const TEMPLATE_PATH = path.join(DIST, 'index.html');

const SEO_BLOCK = /<!--seo:start-->[\s\S]*?<!--seo:end-->/;
const ROOT_SLOT = '<!--prerender-->';

interface Attribute {
    name: string;
    type?: string;
    description?: string;
    isReadonly?: boolean;
}

interface Method {
    name: string;
    parameters?: string;
    returnType?: string;
    description?: string;
}

interface ConstructorParam {
    name?: string;
    type?: string;
    description?: string;
}

interface Constructor {
    name?: string;
    description?: string;
    parameters?: ConstructorParam[] | string;
    example?: string;
}

interface ApiClass {
    name: string;
    description?: string;
    attributes?: Attribute[];
    methods?: Method[];
    constructors?: Constructor[];
}

interface Plugin {
    id: string;
    name: string;
    description?: string;
    classes: ApiClass[];
}

interface PageHead {
    title: string;
    description: string;
    path: string;
    jsonLd: object[];
}

function esc(value: unknown): string {
    return String(value === undefined || value === null ? '' : value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// JSON inside <script> must not be able to close the tag.
function jsonForScript(value: object): string {
    return JSON.stringify(value).replace(/</g, '\\u003c');
}

function headHtml(head: PageHead): string {
    const title = esc(fullTitle(head.title));
    const description = esc(head.description);
    const url = esc(`${SITE_URL}${head.path}`);
    const image = `${SITE_URL}/og-image.png`;
    const lines = [
        '<!--seo:start-->',
        `<title>${title}</title>`,
        `<meta name="description" data-rh="true" content="${description}" />`,
        `<link rel="canonical" data-rh="true" href="${url}" />`,
        '<meta property="og:type" data-rh="true" content="website" />',
        `<meta property="og:url" data-rh="true" content="${url}" />`,
        `<meta property="og:title" data-rh="true" content="${title}" />`,
        `<meta property="og:description" data-rh="true" content="${description}" />`,
        `<meta property="og:site_name" data-rh="true" content="${SITE_NAME}" />`,
        `<meta property="og:image" data-rh="true" content="${image}" />`,
        '<meta name="twitter:card" data-rh="true" content="summary_large_image" />',
        `<meta name="twitter:title" data-rh="true" content="${title}" />`,
        `<meta name="twitter:description" data-rh="true" content="${description}" />`,
        `<meta name="twitter:image" data-rh="true" content="${image}" />`
    ];
    for (const item of head.jsonLd) {
        lines.push(`<script type="application/ld+json" data-rh="true">${jsonForScript(item)}</script>`);
    }
    lines.push('<!--seo:end-->');
    return lines.join('\n  ');
}

// Same outer look as the app (dark header bar, page background) so the hand-over
// from this static copy to the React app is not jarring.
function shell(content: string): string {
    return [
        '<div class="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans">',
        '<header class="w-full border-b border-slate-800 bg-slate-950/95">',
        '<div class="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center">',
        `<a href="/" class="text-xl lg:text-2xl font-extrabold text-white leading-tight tracking-tight">${SITE_NAME}</a>`,
        '</div></header>',
        `<main class="container mx-auto px-4 py-8">${content}</main>`,
        '</div>'
    ].join('');
}

function breadcrumbLd(items: { name: string; path: string }[]): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: `${SITE_URL}${item.path}`
        }))
    };
}

function breadcrumbHtml(items: { name: string; path?: string }[]): string {
    const parts = items.map(item =>
        item.path
            ? `<a href="${esc(item.path)}" class="hover:text-indigo-500">${esc(item.name)}</a>`
            : `<span class="text-slate-900 dark:text-white font-mono font-bold">${esc(item.name)}</span>`
    );
    return `<nav class="flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">${parts.join('<span>&rsaquo;</span>')}</nav>`;
}

function loadPlugins(): Plugin[] {
    const files = fs.readdirSync(PLUGINS_DIR).filter(f => f.endsWith('.json')).sort();
    return files.map(file => {
        const id = file.replace('.json', '');
        const raw = fs.readFileSync(path.join(PLUGINS_DIR, file), 'utf8').replace(/^\uFEFF/, '');
        const data = JSON.parse(raw) as { description?: string; classes?: ApiClass[] };

        // A few plugins list the same class twice; keep the first.
        const seen = new Set<string>();
        const classes = (data.classes || []).filter(cls => {
            if (seen.has(cls.name)) return false;
            seen.add(cls.name);
            return true;
        });

        return {
            id,
            name: PLUGIN_NAMES[id] || id.replace('o11n-plugin-', '').replace(/-/g, ' ').toUpperCase(),
            description: data.description,
            classes
        };
    });
}

function main(): void {
    const started = Date.now();
    if (!fs.existsSync(TEMPLATE_PATH)) {
        throw new Error('dist/index.html not found. Run "vite build" first.');
    }
    const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');
    if (!SEO_BLOCK.test(template) || !template.includes(ROOT_SLOT)) {
        throw new Error('index.html is missing the <!--seo:start--> / <!--seo:end--> block or the <!--prerender--> slot.');
    }

    // Plain copy of the app shell for addresses that have no page of their own
    // (unknown paths, versioned routes). vercel.json sends those here.
    fs.writeFileSync(path.join(DIST, 'app.html'), template.replace(ROOT_SLOT, ''));

    const plugins = loadPlugins();

    // Class name -> plugin id, for linking types. The last plugin wins, as in the app.
    const classMap = new Map<string, string>();
    for (const plugin of plugins) {
        for (const cls of plugin.classes) classMap.set(cls.name, plugin.id);
    }

    const typeHtml = (type: string | undefined, currentPluginId: string): string => {
        if (!type) return '';
        const isArray = type.endsWith('[]');
        const baseType = isArray ? type.slice(0, -2) : type;
        let target = baseType;
        let pluginId = classMap.get(baseType);
        if (!pluginId && currentPluginId === 'o11n-plugin-f5') {
            const candidate = `F5Networks${baseType}`;
            const candidatePlugin = classMap.get(candidate);
            if (candidatePlugin) {
                target = candidate;
                pluginId = candidatePlugin;
            }
        }
        if (!pluginId) return `<code>${esc(type)}</code>`;
        return `<a href="${esc(classPath(pluginId, target))}" class="font-mono text-orange-600 dark:text-orange-400"><code>${esc(type)}</code></a>`;
    };

    const urls: string[] = [];

    const writePage = (pagePath: string, head: PageHead, content: string): void => {
        const html = template
            .replace(SEO_BLOCK, () => headHtml(head))
            .replace(ROOT_SLOT, () => shell(content));
        const dir = pagePath === '/' ? DIST : path.join(DIST, ...pagePath.split('/').filter(Boolean).map(decodeURIComponent));
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
        urls.push(`${SITE_URL}${pagePath}`);
    };

    // ---- Home ----
    const homePlugins = plugins.slice().sort((a, b) => {
        if (a.id === 'o11n-core') return -1;
        if (b.id === 'o11n-core') return 1;
        return a.name.localeCompare(b.name);
    });
    const classTotal = plugins.reduce((sum, p) => sum + p.classes.length, 0);
    writePage(
        '/',
        {
            title: HOME_TITLE,
            description: HOME_DESCRIPTION,
            path: '/',
            jsonLd: [{
                '@context': 'https://schema.org',
                '@type': 'WebSite',
                name: HOME_TITLE,
                url: `${SITE_URL}/`,
                potentialAction: {
                    '@type': 'SearchAction',
                    target: `${SITE_URL}/?q={search_term_string}`,
                    'query-input': 'required name=search_term_string'
                }
            }]
        },
        [
            '<h1 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">VCF Orchestrator Plugin APIs</h1>',
            `<p class="text-slate-500 dark:text-slate-400 text-lg mt-2">Explore JavaScript SDK documentation for ${plugins.length} Orchestrator (version 8 &amp; above) plugins and ${classTotal} classes.</p>`,
            '<ul class="mt-8 space-y-2">',
            ...homePlugins.map(p =>
                `<li><a href="${esc(pluginPath(p.id))}" class="font-bold text-indigo-600 dark:text-indigo-300">${esc(p.name)}</a> <span class="text-slate-500 dark:text-slate-400 text-sm">${p.classes.length} classes</span></li>`
            ),
            '</ul>',
            '<p class="mt-8"><a href="/mcp" class="text-indigo-600 dark:text-indigo-300">MCP server for AI assistants</a></p>'
        ].join('')
    );

    // ---- MCP page ----
    writePage(
        '/mcp',
        { title: MCP_TITLE, description: MCP_DESCRIPTION, path: '/mcp', jsonLd: [] },
        [
            `<h1 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">${esc(MCP_TITLE)}</h1>`,
            `<p class="text-slate-500 dark:text-slate-400 text-lg mt-2">${esc(MCP_DESCRIPTION)}</p>`,
            `<p class="mt-4 font-mono">${SITE_URL}/api/mcp</p>`
        ].join('')
    );

    // ---- Plugins and classes ----
    let classPages = 0;
    for (const plugin of plugins) {
        const pPath = pluginPath(plugin.id);
        const classNames = plugin.classes.map(c => c.name);

        writePage(
            pPath,
            {
                title: pluginTitle(plugin.name),
                description: pluginDescription(plugin.name, classNames),
                path: pPath,
                jsonLd: [breadcrumbLd([{ name: 'Reference', path: '/' }, { name: plugin.name, path: pPath }])]
            },
            [
                breadcrumbHtml([{ name: 'Reference', path: '/' }, { name: plugin.name }]),
                `<h1 class="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-4">${esc(plugin.name)} plugin</h1>`,
                `<p class="text-slate-500 dark:text-slate-400 text-lg mt-2">${esc(pluginDescription(plugin.name, classNames))}</p>`,
                '<ul class="mt-8 space-y-2">',
                ...plugin.classes.map(cls =>
                    `<li><a href="${esc(classPath(plugin.id, cls.name))}" class="font-mono font-bold text-indigo-600 dark:text-indigo-300">${esc(cls.name)}</a>${cls.description ? ` <span class="text-slate-600 dark:text-slate-400 text-sm">${esc(cls.description)}</span>` : ''}</li>`
                ),
                '</ul>'
            ].join('')
        );

        for (const cls of plugin.classes) {
            const attributes = cls.attributes || [];
            const methods = cls.methods || [];
            const constructors = cls.constructors || [];
            const cPath = classPath(plugin.id, cls.name);
            const description = classDescription(
                cls.name,
                plugin.name,
                cls.description,
                methods.map(m => m.name),
                attributes.map(a => a.name)
            );

            const parts: string[] = [
                breadcrumbHtml([{ name: 'Reference', path: '/' }, { name: plugin.name, path: pPath }, { name: cls.name }]),
                `<h1 class="text-2xl md:text-3xl font-mono font-extrabold text-slate-900 dark:text-white leading-tight mt-4">${esc(cls.name)}</h1>`,
                `<p class="text-slate-700 dark:text-slate-300 text-base leading-relaxed mt-4">${esc(cls.description || `${cls.name} class in the ${plugin.name} plugin.`)}</p>`
            ];

            if (constructors.length > 0) {
                parts.push('<h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-10">Constructors</h2><ul class="mt-4 space-y-4">');
                for (const ctor of constructors) {
                    const params = Array.isArray(ctor.parameters)
                        ? ctor.parameters.map(p => `${p.name || ''}${p.type ? `: ${p.type}` : ''}`).join(', ')
                        : (ctor.parameters || '');
                    parts.push(
                        `<li><code class="font-mono font-bold">new ${esc(ctor.name || cls.name)}(${esc(params)})</code>` +
                        (ctor.description ? `<p class="text-slate-600 dark:text-slate-400 text-sm">${esc(ctor.description)}</p>` : '') +
                        (ctor.example ? `<pre class="font-mono text-sm">${esc(ctor.example)}</pre>` : '') +
                        '</li>'
                    );
                }
                parts.push('</ul>');
            }

            parts.push('<h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-10">Attributes</h2>');
            if (attributes.length > 0) {
                parts.push('<table class="w-full text-left border-collapse mt-4"><thead><tr class="text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-black"><th class="p-4">Identifier</th><th class="p-4">Type Interface</th><th class="p-4">Description</th><th class="p-4">Read Only</th></tr></thead><tbody>');
                for (const attr of attributes) {
                    parts.push(
                        `<tr><td class="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-300">${esc(attr.name)}</td>` +
                        `<td class="p-4 font-mono">${typeHtml(attr.type, plugin.id)}</td>` +
                        `<td class="p-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">${esc(attr.description)}</td>` +
                        `<td class="p-4">${attr.isReadonly ? 'Yes' : 'No'}</td></tr>`
                    );
                }
                parts.push('</tbody></table>');
            } else {
                parts.push('<p class="text-slate-400 italic mt-4">No attributes defined for this class.</p>');
            }

            parts.push('<h2 class="text-2xl font-bold text-slate-900 dark:text-white mt-10">Member Methods</h2>');
            if (methods.length > 0) {
                parts.push('<ul class="mt-4 space-y-4">');
                for (const method of methods) {
                    const params = !method.parameters || method.parameters === '-' ? '' : method.parameters;
                    parts.push(
                        `<li><h3 class="font-mono font-bold text-indigo-600 dark:text-indigo-300">${esc(method.name)}(${esc(params)})</h3>` +
                        (method.returnType ? `<p class="text-sm">Returns: ${typeHtml(method.returnType, plugin.id)}</p>` : '') +
                        (method.description ? `<p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">${esc(method.description)}</p>` : '') +
                        '</li>'
                    );
                }
                parts.push('</ul>');
            } else {
                parts.push('<p class="text-slate-400 italic mt-4">No methods defined for this class.</p>');
            }

            writePage(
                cPath,
                {
                    title: classTitle(cls.name, plugin.name),
                    description,
                    path: cPath,
                    jsonLd: [
                        {
                            '@context': 'https://schema.org',
                            '@type': 'APIReference',
                            name: cls.name,
                            url: `${SITE_URL}${cPath}`,
                            description: cls.description,
                            programmingLanguage: 'JavaScript',
                            targetPlatform: 'VCF Operations Orchestrator (vRealize Orchestrator)',
                            articleSection: 'Classes'
                        },
                        breadcrumbLd([
                            { name: 'Reference', path: '/' },
                            { name: plugin.name, path: pPath },
                            { name: cls.name, path: cPath }
                        ])
                    ]
                },
                parts.join('')
            );
            classPages++;
        }
    }

    // ---- sitemap.xml and robots.txt ----
    const sitemap = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map(url => `  <url><loc>${esc(url)}</loc></url>`),
        '</urlset>',
        ''
    ].join('\n');
    fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
    fs.writeFileSync(
        path.join(DIST, 'robots.txt'),
        ['User-agent: *', 'Allow: /', '', `Sitemap: ${SITE_URL}/sitemap.xml`, ''].join('\n')
    );

    console.log(
        `[prerender] ${plugins.length} plugin pages, ${classPages} class pages, sitemap.xml with ${urls.length} URLs, robots.txt ` +
        `(${((Date.now() - started) / 1000).toFixed(1)}s)`
    );
}

main();
