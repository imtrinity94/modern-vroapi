
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import pluginIndex from '../data/index.json';
import { getPluginMeta } from '../data/plugin-meta';
import { ChevronRight, Box, FunctionSquare, Info, ShieldAlert, Edit3, List, LayoutGrid } from 'lucide-react';

interface ApiClass {
    name: string;
    description: string;
    methods: any[];
    attributes: any[];
}

const ClassView: React.FC = () => {
    const { pluginName, className } = useParams<{ pluginName: string; className: string }>();
    const pluginMeta = useMemo(() => getPluginMeta(pluginName || ''), [pluginName]);
    const { icon: PluginIcon, color } = pluginMeta;
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'detailed' | 'compact'>('compact');

    useEffect(() => {
        const loadData = async () => {
            if (!pluginName) return;
            setLoading(true);
            try {
                const entry = pluginIndex.find(p => p.id === pluginName);
                if (!entry) throw new Error(`Plugin ${pluginName} not found`);

                const modules = import.meta.glob('../data/plugins/*.json');
                const path = `../data/plugins/${pluginName}.json`;
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
    }, [pluginName]);

    if (loading) return <div className="text-center py-20 text-slate-400 lg:text-lg animate-pulse">Analyzing class definition...</div>;
    if (error) return <div className="text-center py-20 text-red-500 font-bold">{error}</div>;

    const classData = data?.classes.find((c: any) => c.name === className) as ApiClass;
    if (!classData) return <div className="text-center py-20 text-slate-500">Class {className} not found.</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/" className="hover:text-indigo-500 dark:hover:text-indigo-400">Reference</Link>
                    <ChevronRight size={14} />
                    <Link to={`/plugin/${pluginName}`} className="hover:text-indigo-500 dark:hover:text-indigo-400">
                        {pluginIndex.find(p => p.id === pluginName)?.name || pluginName}
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-900 dark:text-white font-mono font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">{className}</span>
                </nav>

                <a
                    href={`https://github.com/imtrinity94/modern-vroapi/blob/main/vro-doc-site/src/data/plugins/${pluginName}.json`}
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
                        <div className={`${pluginMeta.image ? 'p-0' : 'p-4'} rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 border border-${color}-100 dark:border-${color}-500/20 shadow-sm transition-transform hover:scale-105 w-16 h-16 flex items-center justify-center overflow-hidden`}>
                            {pluginMeta.image ? (
                                <img src={pluginMeta.image} alt={pluginName} className="w-full h-full object-cover" />
                            ) : (
                                PluginIcon && <PluginIcon size={36} />
                            )}
                        </div>
                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
                                <Box size={14} /> Class Definition
                            </div>
                            <h1 className="text-4xl md:text-5xl font-mono font-extrabold text-slate-900 dark:text-white leading-tight">
                                {classData.name}
                            </h1>
                        </div>
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border-l-4 border-indigo-500 shadow-sm border border-slate-200 dark:border-slate-800">
                    <p className="text-slate-700 dark:text-slate-300 text-xl leading-relaxed">
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
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-widest font-black">
                                    <th className="p-4 border-b border-slate-200 dark:border-slate-800">Identifier</th>
                                    <th className="p-4 border-b border-slate-200 dark:border-slate-800">Type Interface</th>
                                    <th className="p-4 border-b border-slate-200 dark:border-slate-800">Description</th>
                                    <th className="p-4 border-b border-slate-200 dark:border-slate-800 w-32 text-center">Flags</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {classData.attributes.map((attr) => (
                                    <tr key={attr.name} className="hover:bg-slate-50 dark:hover:bg-indigo-500/[0.02] transition-colors group">
                                        <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-300 text-lg">{attr.name}</td>
                                        <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 text-lg whitespace-nowrap">{attr.type}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed">{attr.description}</td>
                                        <td className="p-4 text-center">
                                            {attr.isReadonly && (
                                                <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-500 border border-slate-200 dark:border-slate-700">
                                                    <ShieldAlert size={10} /> RO
                                                </span>
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
                                    <div className="md:w-1/3 p-5 bg-slate-50 dark:bg-slate-800/30 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                                        <h4 className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-xl break-all group-hover:text-indigo-500">{method.name}</h4>
                                        <div className="mt-3 text-sm font-black uppercase tracking-wider text-slate-400 dark:text-slate-600">Return Type</div>
                                        <div className="font-mono text-base text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-3 py-1 rounded inline-block mt-2 truncate">{method.returnType}</div>
                                    </div>
                                    <div className="flex-1 p-5 space-y-3">
                                        <div className="flex gap-2">
                                            <div className="min-w-[14px] pt-1 text-slate-300 dark:text-slate-600"><ChevronRight size={14} /></div>
                                            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                                                {method.description || 'No method documentation.'}
                                            </p>
                                        </div>
                                        {method.parameters && (
                                            <div className="ml-6 p-5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800">
                                                <div className="text-sm font-black tracking-widest text-slate-400 dark:text-slate-600 uppercase mb-3">Parameters</div>
                                                <div className="font-mono text-base text-emerald-600 dark:text-emerald-500 leading-normal">{method.parameters}</div>
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
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-800 min-w-[200px]">Parameters</th>
                                        <th className="p-4 border-b border-slate-200 dark:border-slate-800 w-full">Description</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {classData.methods.map((method) => (
                                        <tr key={method.name} className="hover:bg-slate-50 dark:hover:bg-indigo-500/[0.02] transition-colors group">
                                            <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-400 text-lg align-top whitespace-nowrap">{method.name}</td>
                                            <td className="p-4 align-top whitespace-nowrap">
                                                <span className="font-mono text-base text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 px-2 py-0.5 rounded inline-block">{method.returnType}</span>
                                            </td>
                                            <td className="p-4 align-top max-w-sm">
                                                <div className="font-mono text-base text-emerald-600 dark:text-emerald-500 leading-normal break-words">
                                                    {method.parameters || '-'}
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-600 dark:text-slate-400 text-base leading-relaxed align-top min-w-[300px]">
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
