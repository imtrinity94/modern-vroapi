
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import pluginIndex from '../data/index.json';
import { getPluginMeta } from '../data/plugin-meta';
import { ChevronRight, Box, FunctionSquare, Info, Edit3, List, LayoutGrid, Copy, Check } from 'lucide-react';
import SEO from '../components/SEO';

interface ApiClass {
    name: string;
    description: string;
    methods: any[];
    attributes: any[];
}

const ClassView: React.FC = () => {
    const { pluginName, className, versionId } = useParams<{ pluginName: string; className: string; versionId?: string }>();
    const pluginEntry = useMemo(() =>
        (pluginIndex as any[]).find(p => p.id === pluginName),
        [pluginName]);

    // Use versionId from URL, or fallback to the latest version's ID
    const activeVersionId = versionId || (pluginEntry?.versions ? pluginEntry.versions[0].id : pluginName);
    const pluginMeta = useMemo(() => getPluginMeta(pluginName || ''), [pluginName]);
    const { icon: PluginIcon, color } = pluginMeta;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('compact');
    const [copiedMethod, setCopiedMethod] = useState<string | null>(null);
    const [copiedAttribute, setCopiedAttribute] = useState<string | null>(null);

    const formatMethodSnippet = (name: string, params: string) => {
        if (!params || params === '-' || params === '()') return `${name}()`;

        const formattedParams = params.split(',').map(p => {
            const part = p.trim();
            if (part.includes(':')) {
                const [pName, pType] = part.split(':').map(s => s.trim());
                return `${pType} ${pName}`;
            }
            return part;
        }).join(', ');

        return `${name}(${formattedParams})`;
    };

    const handleCopy = (method: any) => {
        const snippet = formatMethodSnippet(method.name, method.parameters);
        navigator.clipboard.writeText(snippet);
        setCopiedMethod(method.name);
        setTimeout(() => setCopiedMethod(null), 2000);
    };

    const handleCopyAttribute = (attrName: string) => {
        navigator.clipboard.writeText(attrName);
        setCopiedAttribute(attrName);
        setTimeout(() => setCopiedAttribute(null), 2000);
    };

    useEffect(() => {
        const loadData = async () => {
            if (!pluginName) return;
            setLoading(true);
            try {
                const modules = import.meta.glob('../data/plugins/*.json');
                const path = `../data/plugins/${activeVersionId}.json`;
                if (!modules[path]) throw new Error(`Data file ${path} not found`);

                const module = await modules[path]();
                setData((module as any).default || module);
            } catch (err: any) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [activeVersionId]);

    if (loading) return <div className="text-center py-20 text-slate-400 lg:text-lg animate-pulse">Analyzing class definition...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    const classData = data?.classes.find((c: any) => c.name === className) as ApiClass;
    if (!classData) return <div className="text-center py-20 text-slate-500">Class {className} not found.</div>;

    const seoTitle = `${classData.name} - ${pluginEntry?.name || pluginName} - Modern vRO API`;
    const seoDesc = classData.description || `API documentation for class ${classData.name} in ${pluginEntry?.name || pluginName} plugin.`;

    return (
        <div className="w-[95%] max-w-[1920px] mx-auto space-y-10 animate-in fade-in duration-500">
            <SEO
                title={seoTitle}
                description={seoDesc}
                image={pluginMeta.image}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/" className="hover:text-indigo-500 dark:hover:text-indigo-400">Reference</Link>
                    <ChevronRight size={14} />
                    <Link to={`/plugin/${pluginName}${versionId ? `/v/${versionId}` : ''}`} className="hover:text-indigo-500 dark:hover:text-indigo-400">
                        {pluginEntry?.name || pluginName}
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-900 dark:text-white font-mono font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">{className}</span>
                </nav>

                <a
                    href={`https://github.com/imtrinity94/modern-vroapi/blob/main/vro-doc-site/src/data/plugins/${activeVersionId}.json`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 w-fit"
                >
                    <Edit3 size={14} />
                    <span>Suggest Edit</span>
                </a>
            </div>

            <header className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="flex items-start gap-5">
                        <div className={`p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 border border-${color}-100 dark:border-${color}-500/20 shadow-sm transition-transform hover:scale-105 w-20 h-20 flex items-center justify-center overflow-hidden`}>
                            {pluginMeta.image ? (
                                <img src={pluginMeta.image} alt={pluginName} className="w-full h-full object-contain" />
                            ) : (
                                PluginIcon && <PluginIcon size={48} />
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${color}-50 dark:bg-${color}-500/10 text-${color}-700 dark:text-${color}-400 text-xs font-bold uppercase tracking-wider border border-${color}-100 dark:border-${color}-500/20`}>
                                    <Box size={14} /> Class Definition
                                </div>
                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-${color}-50 dark:bg-${color}-500/10 text-${color}-700 dark:text-${color}-400 text-xs font-bold uppercase tracking-wider border border-${color}-100 dark:border-${color}-500/20`}>
                                    {pluginEntry?.name || pluginName}
                                </div>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-mono font-extrabold text-slate-900 dark:text-white leading-tight">
                                {classData.name}
                            </h1>
                        </div>
                    </div>
                </div>
                <div className={`bg-${color}-50/30 dark:bg-slate-900 rounded-2xl p-6 border-l-4 border-${color}-500 shadow-sm border border-${color}-100 dark:border-slate-800`}>
                    <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                        {classData.description || 'No detailed documentation available for this class.'}
                    </p>
                </div>
            </header>

            {/* Attributes Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Info className="text-purple-500" /> Attributes
                </h2>
                {classData.attributes.length > 0 ? (
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-black">
                                    <th className="p-4 border-b border-slate-200 dark:border-slate-800">Identifier</th>
                                    <th className="p-4 border-b border-slate-200 dark:border-slate-800">Type Interface</th>
                                    <th className="p-4 border-b border-slate-200 dark:border-slate-800">Description</th>
                                    <th className="p-4 border-b border-slate-200 dark:border-slate-800 w-32 text-center">Read Only</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {classData.attributes.map((attr) => (
                                    <tr key={attr.name} className="hover:bg-slate-50 dark:hover:bg-indigo-500/[0.02] transition-colors group">
                                        <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-300 text-base">
                                            <div className="flex items-center gap-2">
                                                {attr.name}
                                                <button
                                                    onClick={() => handleCopyAttribute(attr.name)}
                                                    className={`p-1 rounded-md transition-all ${copiedAttribute === attr.name
                                                        ? 'bg-emerald-500 text-white'
                                                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100'
                                                        }`}
                                                    title="Copy Attribute Name"
                                                >
                                                    {copiedAttribute === attr.name ? <Check size={12} /> : <Copy size={12} />}
                                                </button>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 text-base whitespace-nowrap">{attr.type}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{attr.description}</td>
                                        <td className="p-4 text-center align-middle">
                                            {attr.isReadonly ? (
                                                <span className="text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded">Yes</span>
                                            ) : (
                                                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded">No</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-600 italic border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">No attributes defined for this class.</div>
                )}
            </section>

            {/* Methods Section */}
            <section className="space-y-6">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <FunctionSquare className="text-indigo-500" /> Member Methods
                    </h2>
                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                        <button
                            onClick={() => setViewMode('detailed')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'detailed'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <LayoutGrid size={14} /> Detailed
                        </button>
                        <button
                            onClick={() => setViewMode('compact')}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${viewMode === 'compact'
                                ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                }`}
                        >
                            <List size={14} /> Compact
                        </button>
                    </div>
                </div>

                {classData.methods.length > 0 ? (
                    viewMode === 'detailed' ? (
                        <div className="grid grid-cols-1 gap-4">
                            {classData.methods.map((method) => (
                                <div key={method.name} className="group flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all shadow-sm overflow-hidden">
                                    <div className="md:w-80 lg:w-96 shrink-0 p-5 bg-slate-50 dark:bg-slate-800/30 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 relative group">
                                        <div className="flex items-start justify-between gap-2">
                                            <h4 className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg break-all group-hover:text-indigo-500">{method.name}</h4>
                                            <button
                                                onClick={() => handleCopy(method)}
                                                className={`p-1.5 rounded-md transition-all ${copiedMethod === method.name
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-white dark:bg-slate-700 text-slate-400 hover:text-indigo-500 border border-slate-200 dark:border-slate-600 shadow-sm opacity-0 group-hover:opacity-100'
                                                    }`}
                                                title="Copy JS Signature"
                                            >
                                                {copiedMethod === method.name ? <Check size={14} /> : <Copy size={14} />}
                                            </button>
                                        </div>
                                        <div className="mt-3 text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-600">Return Type</div>
                                        <div className="font-mono text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-3 py-1 rounded inline-block mt-2 truncate">{method.returnType}</div>
                                    </div>
                                    <div className="flex-1 p-5 space-y-3">
                                        <div className="flex gap-2">
                                            <div className="min-w-[14px] pt-1 text-slate-300 dark:text-slate-600"><ChevronRight size={14} /></div>
                                            <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                                                {method.description || 'No method documentation.'}
                                            </p>
                                        </div>
                                        {method.parameters && (
                                            <div className="ml-6 p-5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800">
                                                <div className="text-xs font-black tracking-widest text-slate-400 dark:text-slate-600 uppercase mb-3">Parameters</div>
                                                <div className="font-mono text-sm text-emerald-600 dark:text-emerald-500 leading-normal">{method.parameters}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[800px]">
                                <thead>
                                    <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-black">
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">Method Name</th>
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-800 whitespace-nowrap">Return Type</th>
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-800">Parameters</th>
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-800">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {classData.methods.map((method) => (
                                        <tr key={method.name} className="hover:bg-slate-50 dark:hover:bg-indigo-500/[0.02] transition-colors group">
                                            <td className="p-4 align-top whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-base">{method.name}</span>
                                                    <button
                                                        onClick={() => handleCopy(method)}
                                                        className={`p-1 rounded-md transition-all ${copiedMethod === method.name
                                                            ? 'bg-emerald-500 text-white'
                                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-indigo-500 border border-slate-200 dark:border-slate-700 opacity-0 group-hover:opacity-100'
                                                            }`}
                                                        title="Copy JS Signature"
                                                    >
                                                        {copiedMethod === method.name ? <Check size={12} /> : <Copy size={12} />}
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-4 align-top whitespace-nowrap">
                                                <span className="font-mono text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-2 py-0.5 rounded inline-block">{method.returnType}</span>
                                            </td>
                                            <td className="p-4 align-top max-w-2xl">
                                                <div className="font-mono text-sm text-emerald-600 dark:text-emerald-500 leading-normal break-words">
                                                    {method.parameters || '-'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400 text-sm leading-relaxed align-top">
                                                {method.description || 'No documentation.'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                ) : (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-600 italic border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">Invokable methods are not available for this component.</div>
                )}
            </section>
        </div>
    );
};

export default ClassView;
