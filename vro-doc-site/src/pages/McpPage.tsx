import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bot, Copy, Check, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const MCP_URL = 'https://modernvroapi.in/api/mcp';

const CopyBlock: React.FC<{ code: string; label?: string }> = ({ code, label }) => {
    const [copied, setCopied] = useState(false);
    const copy = () => {
        navigator.clipboard.writeText(code).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }).catch(() => { /* clipboard not available */ });
    };
    return (
        <div className="relative group">
            {label && <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</div>}
            <pre className="bg-slate-900 text-slate-100 text-sm rounded-lg p-4 pr-12 overflow-x-auto border border-slate-800"><code>{code}</code></pre>
            <button
                onClick={copy}
                className="absolute right-2 bottom-2 p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                title="Copy"
                aria-label="Copy to clipboard"
            >
                {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
        </div>
    );
};

const TOOLS = [
    { name: 'search_api', text: 'Search classes, methods and attributes by words, a name or Class.method.' },
    { name: 'get_class', text: 'One class in full: attributes, constructors and every method with its signature.' },
    { name: 'list_plugins', text: 'All plugins with class and method counts, or the classes in one plugin.' },
    { name: 'get_method_signature', text: 'Exact parameters and return type of a method, with all overloads.' },
];

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="space-y-3">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h2>
        {children}
    </section>
);

const McpPage: React.FC = () => (
    <div className="max-w-3xl mx-auto space-y-10">
        <SEO
            title="MCP server for AI assistants"
            description="Connect Claude, ChatGPT, Cursor or VS Code to the modernvroapi.in MCP server so your AI assistant looks up real VCF Orchestrator API signatures."
            keywords={['MCP', 'Model Context Protocol', 'AI', 'Claude', 'Cursor', 'Copilot']}
        />

        <div>
            <Link to="/" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-4">
                <ArrowLeft size={14} /> All plugins
            </Link>
            <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
                <Bot size={34} className="text-indigo-500" /> MCP server for AI assistants
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-3 text-lg">
                Let your AI assistant look up real Orchestrator classes, methods and attributes from this site instead of guessing them.
                Free, read-only, no sign-in.
            </p>
        </div>

        <Section title="Server URL">
            <CopyBlock code={MCP_URL} />
            <p className="text-sm text-slate-500 dark:text-slate-400">
                Remote MCP server, Streamable HTTP transport. Works with any MCP client that can add a server by URL.
            </p>
        </Section>

        <Section title="Connect your client">
            <div className="space-y-5">
                <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Claude (web, desktop, mobile) and ChatGPT</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Add a custom connector and paste the server URL above. No authentication is needed.</p>
                </div>
                <CopyBlock label="Claude Code" code={`claude mcp add --transport http modernvroapi ${MCP_URL}`} />
                <CopyBlock label="Cursor (~/.cursor/mcp.json)" code={`{\n  "mcpServers": {\n    "modernvroapi": { "url": "${MCP_URL}" }\n  }\n}`} />
                <CopyBlock label="VS Code (.vscode/mcp.json)" code={`{\n  "servers": {\n    "modernvroapi": { "type": "http", "url": "${MCP_URL}" }\n  }\n}`} />
                <CopyBlock label="Clients that only run local (stdio) servers" code={`npx mcp-remote ${MCP_URL}`} />
            </div>
        </Section>

        <Section title="Tools">
            <ul className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900">
                {TOOLS.map((t) => (
                    <li key={t.name} className="p-4">
                        <code className="text-indigo-600 dark:text-indigo-400 font-semibold">{t.name}</code>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{t.text}</p>
                    </li>
                ))}
            </ul>
        </Section>

        <Section title="Try it">
            <p className="text-slate-600 dark:text-slate-400">Once connected, ask your assistant something like:</p>
            <CopyBlock code="Using modernvroapi, what is the exact signature of RESTHost.createRequest?" />
            <p className="text-sm text-slate-600 dark:text-slate-400">
                It should answer with <code className="text-slate-800 dark:text-slate-200">RESTHost.createRequest(method: String, url: String, content: Any): Request</code> from the REST plugin.
                Orchestrator scripts run on Rhino, so ask for plain ES5 code (no arrow functions, let/const or template literals).
            </p>
        </Section>

        <Section title="Prefer plain files?">
            <p className="text-slate-600 dark:text-slate-400">
                The same data is published as static JSON with no auth. Start with{' '}
                <a href="/llms.txt" className="text-indigo-600 dark:text-indigo-400 hover:underline">llms.txt</a>, which explains the endpoints.
                The server code is on{' '}
                <a href="https://github.com/imtrinity94/modern-vroapi" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">GitHub</a>.
            </p>
        </Section>
    </div>
);

export default McpPage;
