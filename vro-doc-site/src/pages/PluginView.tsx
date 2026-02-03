
import { useEffect, useState, useMemo, useRef, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Layers } from 'lucide-react';
import pluginIndex from '../data/index.json';
import searchData from '../data/search-index.json';
import { useViewMode } from '../hooks/useUIState';
import { ViewToggle } from '../components/UIToggles';
import { Search, ChevronRight, FileCode, ArrowRight, List as ListIcon, Edit3, Download } from 'lucide-react';
import SEO from '../components/SEO';

interface Version {
    id: string;
    version: string;
}

interface ApiPlugin {
    name: string;
    classes: any[];
}

interface ApiPluginIndexEntry {
    id: string;
    name: string;
    versions?: Version[];
}

import { getPluginMeta } from '../data/plugin-meta';

import { generateDts } from '../utils/dtsGenerator';

const ITEMS_PER_PAGE = 500;

const PluginView: React.FC = () => {
    const { pluginName, versionId } = useParams<{ pluginName: string; versionId?: string }>();
    const navigate = useNavigate();

    // Find plugin entry in index to check for versions
    const pluginEntry = useMemo(() =>
        (pluginIndex as ApiPluginIndexEntry[]).find(p => p.id === pluginName),
        [pluginName]);

    // Use versionId from URL, or fallback to the latest version's ID from the index
    const activeVersionId = versionId || (pluginEntry?.versions ? pluginEntry.versions[0].id : pluginName);

    const pluginMeta = useMemo(() => getPluginMeta(pluginName || ''), [pluginName]);
    const { icon: PluginIcon, color } = pluginMeta;
    const [data, setData] = useState<ApiPlugin | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearchTerm = useDebounce(searchTerm, 500); // 500ms debounce
    const isSearching = searchTerm !== debouncedSearchTerm;
    const { viewMode, toggleViewMode } = useViewMode();
    const [displayLimit, setDisplayLimit] = useState(ITEMS_PER_PAGE);
    const observerTarget = useRef<HTMLDivElement>(null);

    // Reset display limit when search term or plugin changes
    useEffect(() => {
        setDisplayLimit(ITEMS_PER_PAGE);
    }, [debouncedSearchTerm, activeVersionId]);

    const loadMore = useCallback((entries: IntersectionObserverEntry[]) => {
        const target = entries[0];
        if (target.isIntersecting) {
            setDisplayLimit(prev => prev + ITEMS_PER_PAGE);
        }
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(loadMore, {
            rootMargin: '800px', // Pre-load much earlier
            threshold: 0
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [loadMore]);

    useEffect(() => {
        const loadData = async () => {
            if (!activeVersionId) return;
            // Don't set loading=true if we already have initial stub data
            // Just set a background loading state if needed
            try {
                const modules = import.meta.glob('../data/plugins/*.json');
                const path = `../data/plugins/${activeVersionId}.json`;
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
    }, [activeVersionId]);

    const initialClassesFromIndex = useMemo(() => {
        return ((searchData as any).classes as any[])
            .filter(c => c.p === pluginName)
            .map(c => ({
                name: c.n,
                description: '',
                methods: [],
                attributes: [],
                isStub: true
            }));
    }, [pluginName]);

    const classes = useMemo(() => {
        if (!data) return initialClassesFromIndex;
        return data.classes;
    }, [data, initialClassesFromIndex]);

    const filteredClasses = useMemo(() => {
        return classes.filter((c: any) =>
            c.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [classes, debouncedSearchTerm]);

    const displayedClasses = useMemo(() => {
        // Use a higher limit for search to give more results immediately, 
        // but not so many that it kills performance.
        const limit = searchTerm ? 1000 : displayLimit;
        return filteredClasses.slice(0, limit);
    }, [filteredClasses, displayLimit, searchTerm]);

    const handleDownloadDts = () => {
        if (!data) return;
        const dtsContent = generateDts(data as any);
        const blob = new Blob([dtsContent], { type: 'application/typescript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${pluginName}.d.ts`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading && !initialClassesFromIndex.length) return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-slate-400 font-medium">Loading SDK definitions...</p>
        </div>
    );

    if (error) return <div className="text-center py-20 text-red-500 font-medium">Error: {error}</div>;
    // Don't return null if we have initial classes to show
    if (!data && !initialClassesFromIndex.length) return null;

    const pluginTitle = pluginEntry?.name || data?.name || pluginName;
    const pluginDescription = `API documentation for ${pluginTitle} plugin. Includes ${classes.length} classes and interfaces such as ${classes.slice(0, 3).map((c: any) => c.name).join(', ')}...`;

    // Structured Data (JSON-LD)
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": pluginTitle,
        "operatingSystem": "vRealize Orchestrator",
        "applicationCategory": "DeveloperApplication",
        "description": pluginDescription,
        "softwareVersion": pluginMeta.version || activeVersionId,
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "hasPart": classes.slice(0, 20).map((c: any) => ({
            "@type": "SoftwareSourceCode",
            "name": c.name,
            "programmingLanguage": "JavaScript"
        }))
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SEO
                title={`${pluginTitle} - API Documentation`}
                description={pluginDescription}
                keywords={[pluginName || '', pluginEntry?.name || '', 'vRO Plugin', 'API Reference', ...classes.slice(0, 10).map((c: any) => c.name)]}
                schema={JSON.stringify(structuredData)}
            />
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                <nav className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Link to="/" className="hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                        Reference
                    </Link>
                    <ChevronRight size={14} />
                    <span className="text-slate-900 dark:text-slate-200 font-medium">{pluginEntry?.name || data?.name || pluginName}</span>
                </nav>

                <div className="flex items-center gap-3">
                    {/* Show Download Button if NOT In-Built */}
                    {pluginMeta.tags && !pluginMeta.tags.includes('IN-BUILT') && (
                        <a
                            href={pluginMeta.downloadUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-colors border shadow-sm ${pluginMeta.tags.includes('3RD PARTY')
                                ? 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-500/20 hover:bg-orange-100 dark:hover:bg-orange-500/20'
                                : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20'
                                }`}
                        >
                            <Download size={14} />
                            <span>Download Plugin</span>
                        </a>
                    )}

                    {data && (
                        <button
                            onClick={handleDownloadDts}
                            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg transition-colors border border-slate-200 dark:border-slate-700 w-fit"
                            title="Download TypeScript definitions"
                        >
                            <FileCode size={14} />
                            <span>Download .d.ts</span>
                        </button>
                    )}

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
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="flex flex-col gap-6">
                    <div className="flex items-start gap-3 md:gap-5">
                        <div className={`p-3 md:p-4 rounded-2xl bg-${color}-50 dark:bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 border border-${color}-100 dark:border-${color}-500/20 shadow-sm w-16 h-16 md:w-24 md:h-24 flex items-center justify-center overflow-hidden shrink-0`}>
                            {pluginMeta.image ? (
                                <img src={pluginMeta.image} alt={pluginEntry?.name || data?.name || pluginName} className="w-full h-full object-contain" />
                            ) : (
                                PluginIcon && <div className="scale-75 md:scale-110"><PluginIcon size={48} /></div>
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight break-all">
                                    {pluginEntry?.name || data?.name || pluginName}
                                </h1>
                                {pluginMeta.tags?.map(tag => {
                                    let tagColorClasses = "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400";
                                    if (tag === 'IN-BUILT') tagColorClasses = "bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20";
                                    if (tag === 'OFFICIAL') tagColorClasses = "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
                                    if (tag === '3RD PARTY') tagColorClasses = "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border-orange-200 dark:border-orange-500/20";

                                    return (
                                        <span key={tag} className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md border ${tagColorClasses}`}>
                                            {tag}
                                        </span>
                                    );
                                })}
                            </div>
                            <div className="mt-3 flex items-center gap-4 text-slate-500 dark:text-slate-400 text-sm">
                                <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                    {classes.length} Classes & Interfaces
                                    {loading && <div className="ml-2 w-3 h-3 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" title="Loading full metadata..." />}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Version Selector Tabs */}
                    {pluginEntry?.versions && pluginEntry.versions.length > 1 && (
                        <div className="flex flex-wrap items-center gap-2 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700/50 w-fit">
                            <div className="px-3 py-1 text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 border-r border-slate-200 dark:border-slate-700 mr-1">
                                <Layers size={14} /> Versions
                            </div>
                            {pluginEntry.versions.map((v, idx) => (
                                <button
                                    key={v.id}
                                    onClick={() => navigate(idx === 0 ? `/plugin/${pluginName}` : `/plugin/${pluginName}/v/${v.id}`)}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${activeVersionId === v.id
                                        ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-600'
                                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    {v.version} {idx === 0 && <span className="ml-1 text-[10px] opacity-60">(LATEST)</span>}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative flex-1 lg:w-72">
                        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 transition-colors ${isSearching ? 'text-indigo-500 animate-pulse' : 'text-slate-400'}`} size={18} />
                        <input
                            type="text"
                            placeholder="Filter classes..."
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isSearching ? (
                        <div className="col-span-full py-12 flex flex-col items-center justify-center gap-3">
                            <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-slate-400 font-medium animate-pulse">Filtering classes...</p>
                        </div>
                    ) : displayedClasses.map((cls: any) => (
                        <Link
                            to={`/plugin/${pluginName}/class/${cls.name}${versionId ? `/v/${versionId}` : ''}`}
                            key={cls.name}
                            className={`group block bg-${color}-50/50 dark:bg-slate-900 border border-${color}-100 dark:border-slate-800 hover:border-${color}-500/50 hover:bg-${color}-50 dark:hover:bg-slate-800/80 rounded-2xl p-5 transition-all shadow-sm hover:shadow-lg`}
                        >
                            <div className="flex items-start justify-between">
                                <FileCode className={`text-${color}-500/50 group-hover:text-${color}-500 transition-colors`} size={24} />
                                <div className={`text-slate-300 dark:text-slate-700 group-hover:text-${color}-400`}>
                                    <ArrowRight size={16} />
                                </div>
                            </div>
                            <h3 className={`mt-3 text-lg font-mono font-bold text-slate-900 dark:text-slate-200 group-hover:text-${color}-600 dark:group-hover:text-${color}-300 truncate transition-colors`}>
                                {cls.name}
                            </h3>
                            {classes.length <= 500 && (
                                <p className="mt-2 text-base text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed h-12">
                                    {!cls.isStub && (cls.description || 'API component for plugin integration.')}
                                </p>
                            )}
                            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/50 flex gap-4 text-[11px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold font-mono">
                                <span>{cls.methods.length} Methods</span>
                                <span>{cls.attributes.length} Attributes</span>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                    {isSearching ? (
                        <div className="py-12 flex flex-col items-center justify-center gap-3 border-b border-slate-100 dark:border-slate-800/50">
                            <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                            <p className="text-slate-400 font-medium animate-pulse">Filtering classes...</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/50 font-mono text-base leading-none">
                            {displayedClasses.map((cls: any) => (
                                <Link
                                    to={`/plugin/${pluginName}/class/${cls.name}${versionId ? `/v/${versionId}` : ''}`}
                                    key={cls.name}
                                    className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                                >
                                    <div className="flex items-center gap-4 min-w-0 flex-1">
                                        <ListIcon className="text-slate-300 dark:text-slate-700 shrink-0" size={20} />
                                        <span className={`text-slate-900 dark:text-slate-200 group-hover:text-${color}-600 dark:group-hover:text-${color}-400 font-bold text-lg truncate`}>
                                            {cls.name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0 ml-4">
                                        <div className="hidden md:flex gap-4 text-xs text-slate-400 uppercase font-black tracking-wider">
                                            <span>{cls.methods.length} Methods</span>
                                            <span>{cls.attributes.length} Attributes</span>
                                        </div>
                                        <ArrowRight size={16} className="text-slate-200 dark:text-slate-800 group-hover:text-indigo-500" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Intersection observer target for loading more items */}
            {displayLimit < filteredClasses.length && !searchTerm && (
                <div ref={observerTarget} className="py-12 flex flex-col items-center justify-center gap-4 border-t border-slate-100 dark:border-slate-800/50">
                    <div className="flex flex-col items-center gap-2">
                        <div className="w-8 h-8 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                            Showing {displayLimit} of {filteredClasses.length} classes
                        </p>
                    </div>
                    <button
                        onClick={() => setDisplayLimit(prev => prev + ITEMS_PER_PAGE)}
                        className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/20 transition-all transform hover:scale-105 active:scale-95"
                    >
                        Load More Classes
                    </button>
                </div>
            )}

            {!isSearching && filteredClasses.length === 0 && (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/20 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                    <h3 className="text-xl font-bold dark:text-white">No classes found</h3>
                    <p className="text-slate-500 dark:text-slate-400">Try adjusting your filter.</p>
                </div>
            )}
        </div>
    );
};

export default PluginView;
