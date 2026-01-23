
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import pluginIndex from '../data/index.json';
import { useViewMode } from '../hooks/useUIState';
import { ViewToggle } from '../components/UIToggles';
import { Search, Package, ArrowRight, List as ListIcon } from 'lucide-react';

const Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { viewMode, toggleViewMode } = useViewMode();

    const filteredPlugins = useMemo(() => {
        return pluginIndex.filter(plugin =>
            plugin.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                        API Reference
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">
                        Explore documentation for {pluginIndex.length} vRO plugins.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 lg:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Filter plugins..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 shadow-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all dark:text-white"
                        />
                    </div>
                    <ViewToggle mode={viewMode} toggle={toggleViewMode} />
                </div>
            </div>

            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlugins.map((plugin) => (
                        <Link
                            to={`/plugin/${plugin.name}`}
                            key={plugin.name}
                            className="group bg-white dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                    <Package size={24} />
                                </div>
                                <div className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 transition-colors">
                                    <ArrowRight size={20} />
                                </div>
                            </div>

                            <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {plugin.name}
                            </h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed">
                                Complete API reference for {plugin.name}.
                            </p>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                        {filteredPlugins.map((plugin) => (
                            <Link
                                to={`/plugin/${plugin.name}`}
                                key={plugin.name}
                                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                            >
                                <div className="flex items-center gap-4">
                                    <ListIcon className="text-slate-400 dark:text-slate-600" size={18} />
                                    <span className="font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                        {plugin.name}
                                    </span>
                                </div>
                                <ArrowRight size={16} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500" />
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {filteredPlugins.length === 0 && (
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
