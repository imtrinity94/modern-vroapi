
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import pluginIndex from '../data/index.json';
import { ChevronRight, Box, FunctionSquare, Info, ShieldAlert } from 'lucide-react';

interface ApiClass {
    name: string;
    description: string;
    methods: any[];
    attributes: any[];
}

const ClassView: React.FC = () => {
    const { pluginName, className } = useParams<{ pluginName: string; className: string }>();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async () => {
            if (!pluginName) return;
            setLoading(true);
            try {
                const entry = pluginIndex.find(p => p.id === pluginName);
                if (!entry) throw new Error(`Plugin ${pluginName} not found`);

                const modules = import.meta.glob('../data/plugins/*.json');
                const path = `../data/plugins/${entry.fileName}`;
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
            <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                <Link to="/" className="hover:text-indigo-500 dark:hover:text-indigo-400">Reference</Link>
                <ChevronRight size={14} />
                <Link to={`/plugin/${pluginName}`} className="hover:text-indigo-500 dark:hover:text-indigo-400">
                    {pluginIndex.find(p => p.id === pluginName)?.name || pluginName}
                </Link>
                <ChevronRight size={14} />
                <span className="text-slate-900 dark:text-white font-mono font-bold bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">{className}</span>
            </nav>

            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 text-xs font-bold uppercase tracking-wider border border-indigo-100 dark:border-indigo-500/20">
                    <Box size={14} /> Class Definition
                </div>
                <h1 className="text-4xl md:text-5xl font-mono font-extrabold text-slate-900 dark:text-white flex flex-wrap items-baseline gap-4">
                    {classData.name}
                </h1>
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
                                        <td className="p-4 font-mono font-bold text-indigo-600 dark:text-indigo-300">{attr.name}</td>
                                        <td className="p-4 font-mono text-emerald-600 dark:text-emerald-400 text-base whitespace-nowrap">{attr.type}</td>
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
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <FunctionSquare className="text-indigo-500" /> Member Methods
                </h2>
                {classData.methods.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {classData.methods.map((method) => (
                            <div key={method.name} className="group flex flex-col md:flex-row bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-indigo-500/50 transition-all shadow-sm overflow-hidden">
                                <div className="md:w-1/3 p-5 bg-slate-50 dark:bg-slate-800/30 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800">
                                    <h4 className="font-mono font-bold text-indigo-600 dark:text-indigo-400 break-all group-hover:text-indigo-500">{method.name}</h4>
                                    <div className="mt-2 text-[10px] font-black uppercase tracking-tighter text-slate-400 dark:text-slate-600">Return Type</div>
                                    <div className="font-mono text-xs text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded inline-block mt-1 truncate">{method.returnType}</div>
                                </div>
                                <div className="flex-1 p-5 space-y-3">
                                    <div className="flex gap-2">
                                        <div className="min-w-[14px] pt-1 text-slate-300 dark:text-slate-600"><ChevronRight size={14} /></div>
                                        <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed">
                                            {method.description || 'No method documentation.'}
                                        </p>
                                    </div>
                                    {method.parameters && (
                                        <div className="ml-6 p-4 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800">
                                            <div className="text-[10px] font-black tracking-widest text-slate-400 dark:text-slate-600 uppercase mb-2">Parameters</div>
                                            <div className="font-mono text-sm text-emerald-600 dark:text-emerald-500 leading-normal">{method.parameters}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-8 text-center text-slate-400 dark:text-slate-600 italic border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">Invokable methods are not available for this component.</div>
                )}
            </section>
        </div>
    );
};

export default ClassView;
