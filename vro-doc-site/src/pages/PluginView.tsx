
import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import pluginIndex from '../data/index.json';
import { useViewMode } from '../hooks/useUIState';
import { ViewToggle } from '../components/UIToggles';
import { Search, ChevronRight, FileCode, ArrowRight, List as ListIcon, Edit3 } from 'lucide-react';

interface ApiPlugin {
    name: string;
    classes: any[];
}

import { getPluginMeta } from '../data/plugin-meta';

const PluginView: React.FC = () => {
    const { pluginName } = useParams<{ pluginName: string }>();
    const pluginMeta = useMemo(() => getPluginMeta(pluginName || ''), [pluginName]);
    const { icon: PluginIcon, color } = pluginMeta;
    const [data, setData] = useState<ApiPlugin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const { viewMode, toggleViewMode } = useViewMode();

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
                setError(err.message || 'Failed to load plugin data');
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [pluginName]);

    const filteredClasses = useMemo(() => {
        if (!data) return [];
        return data.classes.filter(c =>
            c.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    if (loading) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 font-medium">Loading SDK definitions...</p>
        </div>
    );

    if (error) return <div className="text-center py-20 text-red-500 font-medium">Error: {error}</div>;
    if (!data) return null;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                        Reference
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-900 dark:text-slate-200 font-medium">{data?.name || pluginName}</span>
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

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex items-start gap-5">
                    <div className={`${pluginMeta.image ? '' : 'p-4 rounded-2xl'} bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 border border-${color}-100 dark:border-${color}-500/20 shadow-sm w-20 h-20 flex items-center justify-center overflow-hidden`}>
                        {pluginMeta.image ? (
                            <img src={pluginMeta.image} alt={data.name} className="w-full h-full object-cover" />
                        ) : (
                            PluginIcon && <PluginIcon size={40} />
                        )}
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-all">
                            {data.name}
                        </h1>
                        <div className="mt-3 flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                {data.classes.length} Classes & Interfaces
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 lg:w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter classes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                    <ViewToggle mode={viewMode} toggle={toggleViewMode} />
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClasses.map((cls) => (
                        <Link
                            to={`/plugin/${pluginName}/class/${cls.name}`}
                            key={cls.name}
                            className="group block bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-2xl p-5 transition-all shadow-sm hover:shadow-lg"
                        >
                            <div className="flex items-start justify-between">
                                <FileCode className="text-indigo-500/50 group-hover:text-indigo-500 transition-colors" size={24} />
                                <div className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-400">
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                            <h3 className="mt-3 text-lg font-mono font-bold text-slate-900 dark:text-indigo-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-200 truncate transition-colors">
                                {cls.name}
                            </h3>
                            <p className="mt-2 text-base text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-12">
                                {cls.description || 'API component for plugin integration.'}
                            </p>
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex gap-4 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold font-mono">
                                <span>{cls.methods.length} Met</span>
                                <span>{cls.attributes.length} Attr</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50 font-mono text-base leading-none">
                        {filteredClasses.map((cls) => (
                            <Link
                                to={`/plugin/${pluginName}/class/${cls.name}`}
                                key={cls.name}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <ListIcon className="text-slate-300 dark:text-slate-700" size={20} />
                                    <span className="text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 font-bold text-lg truncate max-w-[200px] md:max-w-none">
                                        {cls.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="hidden md:flex gap-4 text-xs text-slate-400 uppercase font-black tracking-wider">
                                        <span>{cls.methods.length} Methods</span>
                                        <span>{cls.attributes.length} Attributes</span>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-200 dark:text-slate-800 group-hover:text-indigo-500" />
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {filteredClasses.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold dark:text-white">No classes found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your filter.</p>
                </div>
            )}
        </div>
    );
};

export default PluginView;
