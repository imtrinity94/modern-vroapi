
import { useState, useMemo } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { Link } from 'react-router-dom';
import pluginIndex from '../data/index.json';
import stats from '../data/stats.json';
import { useViewMode } from '../hooks/useUIState';
import { ViewToggle } from '../components/UIToggles';
import { getPluginMeta } from '../data/plugin-meta';
import { Package, Search, ArrowRight } from 'lucide-react';
import SEO from '../components/SEO';

const Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 300); // 300ms is enough for home page
    const isSearching = searchTerm !== debouncedSearchTerm;
    const { viewMode, toggleViewMode } = useViewMode();

    const filteredPlugins = useMemo(() => {
        const filtered = pluginIndex.filter(plugin =>
            plugin.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            plugin.id.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );

        // Sort: Put o11n-core at the very top
        return [...filtered].sort((a, b) => {
            if (a.id === 'o11n-core') return -1;
            if (b.id === 'o11n-core') return 1;
            return a.name.localeCompare(b.name);
        });
    }, [debouncedSearchTerm]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <SEO
                title="vRO API Documentation"
                description="Comprehensive generated documentation for vRealize Orchestrator (vRO) plugins, including classes, methods, and attributes."
                schema={JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "vRO API Documentation",
                    "url": "https://modernvroapi.in/",
                    "potentialAction": {
                        "@type": "SearchAction",
                        "target": "https://modernvroapi.in/#/?q={search_term_string}",
                        "query-input": "required name=search_term_string"
                    }
                })}
            />
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        VCF Orchestrator Plugin APIs
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        Explore JavaScript SDK documentation for {pluginIndex.length} Orchestrator (version 8 & above) plugins.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 lg:w-80">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} size={18} />
                        <input
                            type="text"
                            placeholder="Filter plugins..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                        />
                        {isSearching && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    <ViewToggle mode={viewMode} toggle={toggleViewMode} />
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlugins.map((plugin) => {
                        const pluginMeta = getPluginMeta(plugin.id);
                        const { icon: PluginIcon, color } = pluginMeta;
                        return (
                            <Link
                                to={`/plugin/${plugin.id}`}
                                key={plugin.id}
                                className={`group bg-${color}-50 dark:bg-slate-900 hover:bg-${color}-100 dark:hover:bg-slate-800/80 border border-${color}-100 dark:border-slate-800 hover:border-${color}-500/50 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-${color}-500/10 flex flex-col`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className={`p-3 rounded-2xl bg-white dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform border border-${color}-100 dark:border-${color}-500/20 w-20 h-20 flex items-center justify-center overflow-hidden shrink-0 shadow-sm`}>
                                        {pluginMeta.image ? (
                                            <img src={pluginMeta.image} alt={plugin.name} className="w-full h-full object-contain" />
                                        ) : (
                                            PluginIcon && <PluginIcon size={48} />
                                        )}
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        {pluginMeta.tags?.map(tag => {
                                            let tagColorClasses = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                                            if (tag === 'IN-BUILT') tagColorClasses = "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
                                            if (tag === 'OFFICIAL') tagColorClasses = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
                                            if (tag === '3RD PARTY') tagColorClasses = "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20";

                                            return (
                                                <span key={tag} className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded border ${tagColorClasses}`}>
                                                    {tag}
                                                </span>
                                            );
                                        })}
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider px-2 py-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                                {(stats as any)[plugin.id]?.classes || 0} Classes
                                            </span>
                                            <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 dark:text-slate-400 uppercase tracking-wider px-2 py-0.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                                {(stats as any)[plugin.id]?.methods || 0} Methods
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">
                                        {plugin.name}
                                    </h2>
                                    {pluginMeta.version && (
                                        <div className="font-mono text-xs text-slate-400 dark:text-slate-500 mt-1">
                                            v{pluginMeta.version}
                                        </div>
                                    )}
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed h-10 flex-grow">
                                        Complete API reference for {plugin.name}.
                                    </p>
                                    <div className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors shrink-0">
                                        <ArrowRight size={18} />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {filteredPlugins.map((plugin) => {
                            const pluginMeta = getPluginMeta(plugin.id);
                            const { icon: PluginIcon, color } = pluginMeta;
                            return (
                                <Link
                                    to={`/plugin/${plugin.id}`}
                                    key={plugin.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <div className={`p-2 rounded-lg bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 group-hover:scale-105 transition-transform w-10 h-10 flex items-center justify-center overflow-hidden shrink-0`}>
                                            {pluginMeta.image ? (
                                                <img src={pluginMeta.image} alt={plugin.name} className="w-full h-full object-contain" />
                                            ) : (
                                                PluginIcon && <PluginIcon size={22} />
                                            )}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <span className={`font-bold text-lg text-slate-900 dark:text-slate-200 group-hover:text-${color}-600 dark:group-hover:text-${color}-400 block truncate`}>
                                                {plugin.name}
                                            </span>
                                            {pluginMeta.version && (
                                                <span className="font-mono text-xs text-slate-400 dark:text-slate-500 block">
                                                    v{pluginMeta.version}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 ml-2 shrink-0">
                                            {pluginMeta.tags?.map(tag => {
                                                let tagColorClasses = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                                                if (tag === 'IN-BUILT') tagColorClasses = "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
                                                if (tag === 'OFFICIAL') tagColorClasses = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
                                                if (tag === '3RD PARTY') tagColorClasses = "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20";

                                                return (
                                                    <span key={tag} className={`hidden md:inline-flex text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded border ${tagColorClasses}`}>
                                                        {tag}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    <ArrowRight size={16} className="ml-4 text-slate-300 dark:text-slate-700 group-hover:text-indigo-500" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {!isSearching && filteredPlugins.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <Package className="mx-auto text-slate-300 dark:text-slate-700 mb-4" size={48} />
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No plugins found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your search term.</p>
                </div>
            )}
        </div>
    );
};

export default Home;
