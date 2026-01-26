
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import pluginIndex from '../data/index.json';
import { useViewMode } from '../hooks/useUIState';
import { ViewToggle } from '../components/UIToggles';
import {
    Search, Package, ArrowRight,
    Settings, Users, MessageSquare, Network, Cloud,
    Lock, Variable, Mail, Radio, Globe, Shield,
    Terminal, Database, Key, Zap, Monitor,
    Download, FileCode, Activity, type LucideIcon
} from 'lucide-react';

const PLUGIN_META: Record<string, { icon: LucideIcon; color: string }> = {
    'o11n-core': { icon: Settings, color: 'slate' },
    'o11n-plugin-activedirectory': { icon: Users, color: 'blue' },
    'o11n-plugin-amqp': { icon: MessageSquare, color: 'orange' },
    'o11n-plugin-apic': { icon: Network, color: 'cyan' },
    'o11n-plugin-aria': { icon: Cloud, color: 'indigo' },
    'o11n-plugin-azure': { icon: Cloud, color: 'sky' },
    'o11n-plugin-crypto': { icon: Lock, color: 'emerald' },
    'o11n-plugin-dynamictypes': { icon: Variable, color: 'purple' },
    'o11n-plugin-mail': { icon: Mail, color: 'amber' },
    'o11n-plugin-mqtt': { icon: Radio, color: 'rose' },
    'o11n-plugin-net': { icon: Globe, color: 'blue' },
    'o11n-plugin-nsx': { icon: Shield, color: 'emerald' },
    'o11n-plugin-powershell': { icon: Terminal, color: 'slate' },
    'o11n-plugin-rest': { icon: Globe, color: 'green' },
    'o11n-plugin-snmp': { icon: Activity, color: 'orange' },
    'o11n-plugin-soap': { icon: FileCode, color: 'indigo' },
    'o11n-plugin-sql': { icon: Database, color: 'blue' },
    'o11n-plugin-ssh': { icon: Key, color: 'slate' },
    'o11n-plugin-vapi': { icon: Zap, color: 'yellow' },
    'o11n-plugin-vc': { icon: Monitor, color: 'blue' },
    'o11n-plugin-vcloud': { icon: Cloud, color: 'sky' },
    'o11n-plugin-vco': { icon: Terminal, color: 'slate' },
    'o11n-plugin-vum': { icon: Download, color: 'green' },
    'o11n-plugin-xml': { icon: FileCode, color: 'orange' }
};

const getPluginMeta = (id: string) => PLUGIN_META[id] || { icon: Package, color: 'indigo' };

const Home: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const { viewMode, toggleViewMode } = useViewMode();

    const filteredPlugins = useMemo(() => {
        return pluginIndex.filter(plugin =>
            plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            plugin.id.toLowerCase().includes(searchTerm.toLowerCase())
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
                    {filteredPlugins.map((plugin) => {
                        const { icon: PluginIcon, color } = getPluginMeta(plugin.id);
                        return (
                            <Link
                                to={`/plugin/${plugin.id}`}
                                key={plugin.id}
                                className="group bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-2.5 rounded-xl bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 group-hover:scale-110 transition-transform border border-${color}-100 dark:border-${color}-500/20`}>
                                        <PluginIcon size={24} />
                                    </div>
                                    <div className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors">
                                        <ArrowRight size={20} />
                                    </div>
                                </div>

                                <h2 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {plugin.name}
                                </h2>
                                <p className="mt-2 text-slate-500 dark:text-slate-400 text-base line-clamp-2 leading-relaxed">
                                    Complete API reference for {plugin.name}.
                                </p>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {filteredPlugins.map((plugin) => {
                            const { icon: PluginIcon, color } = getPluginMeta(plugin.id);
                            return (
                                <Link
                                    to={`/plugin/${plugin.id}`}
                                    key={plugin.id}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={`p-1.5 rounded-lg bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 group-hover:scale-105 transition-transform`}>
                                            <PluginIcon size={18} />
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                            {plugin.name}
                                        </span>
                                    </div>
                                    <ArrowRight size={16} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500" />
                                </Link>
                            );
                        })}
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
