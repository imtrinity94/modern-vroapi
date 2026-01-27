
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileCode, X, Zap } from 'lucide-react';
import searchData from '../data/search-index.json';
import { getPluginMeta } from '../data/plugin-meta';

interface PluginEntry {
    id: string;
    name: string;
}

interface ClassEntry {
    n: string;
    p: string;
}

interface MethodEntry {
    n: string;
    c: string;
    p: string;
}

const GlobalSearch: React.FC = () => {
    const [query, setQuery] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || e.key === '/') {
                if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
                e.preventDefault();
                inputRef.current?.focus();
            }
        };
        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => document.removeEventListener('keydown', handleGlobalKeyDown);
    }, []);

    const results = useMemo(() => {
        if (!query.trim()) return { plugins: [], classes: [], methods: [], total: 0 };

        const q = query.toLowerCase();

        const filteredPlugins = (searchData.plugins as PluginEntry[])
            .filter(p => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
            .slice(0, 3);

        const filteredClasses = (searchData.classes as ClassEntry[])
            .filter(c => c.n.toLowerCase().includes(q))
            .slice(0, 5);

        const filteredMethods = (searchData.methods as MethodEntry[])
            .filter(m => m.n.toLowerCase().includes(q))
            .slice(0, 5);

        return {
            plugins: filteredPlugins,
            classes: filteredClasses,
            methods: filteredMethods,
            total: filteredPlugins.length + filteredClasses.length + filteredMethods.length
        };
    }, [query]);

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (results.total > 0 ? (prev + 1) % results.total : 0));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (results.total > 0 ? (prev - 1 + results.total) % results.total : 0));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results.total > 0) {
                if (selectedIndex < results.plugins.length) {
                    navigateToPlugin(results.plugins[selectedIndex].id);
                } else if (selectedIndex < results.plugins.length + results.classes.length) {
                    const classIdx = selectedIndex - results.plugins.length;
                    navigateToClass(results.classes[classIdx].p, results.classes[classIdx].n);
                } else {
                    const methodIdx = selectedIndex - results.plugins.length - results.classes.length;
                    navigateToMethod(results.methods[methodIdx].p, results.methods[methodIdx].c, results.methods[methodIdx].n);
                }
            }
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const navigateToPlugin = (id: string) => {
        navigate(`/plugin/${id}`);
        setIsOpen(false);
        setQuery('');
    };

    const navigateToClass = (pluginId: string, className: string) => {
        navigate(`/plugin/${pluginId}/class/${className}`);
        setIsOpen(false);
        setQuery('');
    };

    const navigateToMethod = (pluginId: string, className: string, methodName: string) => {
        // We use hash for methods if the page supports it
        navigate(`/plugin/${pluginId}/class/${className}#${methodName}`);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div className="relative group w-48 md:w-64" ref={containerRef}>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                <Search size={16} />
            </div>
            <input
                ref={inputRef}
                type="text"
                placeholder="Search APIs..."
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setIsOpen(true);
                }}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown}
                className="w-full bg-slate-800 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-white placeholder:text-slate-500"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                {query ? (
                    <button
                        onClick={(e) => { e.stopPropagation(); setQuery(''); }}
                        className="text-slate-500 hover:text-slate-200 pointer-events-auto"
                    >
                        <X size={14} />
                    </button>
                ) : (
                    <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border border-slate-700 bg-slate-800 px-1.5 font-mono text-[10px] font-medium text-slate-500">
                        <span className="text-xs">/</span>
                    </kbd>
                )}
            </div>

            {isOpen && query.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200 min-w-[320px] md:min-w-[400px]">
                    <div className="max-h-[450px] overflow-y-auto p-2">
                        {results.total === 0 ? (
                            <div className="p-4 text-center text-slate-500 dark:text-slate-400 text-sm">
                                No results found for "{query}"
                            </div>
                        ) : (
                            <>
                                {results.plugins.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Plugins
                                        </div>
                                        {results.plugins.map((plugin, i) => {
                                            const meta = getPluginMeta(plugin.id);
                                            const PluginIcon = meta.icon;
                                            const isSelected = i === selectedIndex;
                                            return (
                                                <button
                                                    key={plugin.id}
                                                    onClick={() => navigateToPlugin(plugin.id)}
                                                    onMouseEnter={() => setSelectedIndex(i)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${isSelected
                                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                        {meta.image ? (
                                                            <img src={meta.image} alt="" className="w-4 h-4 object-cover" />
                                                        ) : (
                                                            PluginIcon && <PluginIcon size={16} />
                                                        )}
                                                    </div>
                                                    <span className="text-sm font-medium truncate">{plugin.name}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {results.classes.length > 0 && (
                                    <div className="mb-2">
                                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Classes & Interfaces
                                        </div>
                                        {results.classes.map((cls, i) => {
                                            const idx = i + results.plugins.length;
                                            const isSelected = idx === selectedIndex;
                                            return (
                                                <button
                                                    key={`${cls.p}-${cls.n}`}
                                                    onClick={() => navigateToClass(cls.p, cls.n)}
                                                    onMouseEnter={() => setSelectedIndex(idx)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${isSelected
                                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 shadow-none'}`}>
                                                        <FileCode size={16} className="text-indigo-500" />
                                                    </div>
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-sm font-mono font-bold truncate">{cls.n}</span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate uppercase mt-0.5">
                                                            {cls.p.replace('o11n-plugin-', '').replace(/-/g, ' ')}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}

                                {results.methods.length > 0 && (
                                    <div>
                                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                            Methods
                                        </div>
                                        {results.methods.map((method, i) => {
                                            const idx = i + results.plugins.length + results.classes.length;
                                            const isSelected = idx === selectedIndex;
                                            return (
                                                <button
                                                    key={`${method.p}-${method.c}-${method.n}`}
                                                    onClick={() => navigateToMethod(method.p, method.c, method.n)}
                                                    onMouseEnter={() => setSelectedIndex(idx)}
                                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${isSelected
                                                        ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                        }`}
                                                >
                                                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white dark:bg-slate-900 shadow-sm' : 'bg-slate-100 dark:bg-slate-800 shadow-none'}`}>
                                                        <Zap size={16} className="text-amber-500" />
                                                    </div>
                                                    <div className="flex flex-col truncate">
                                                        <span className="text-sm font-mono font-bold truncate">{method.n}()</span>
                                                        <span className="text-[10px] text-slate-500 dark:text-slate-400 truncate uppercase mt-0.5">
                                                            {method.c} • {method.p.replace('o11n-plugin-', '').replace(/-/g, ' ')}
                                                        </span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;
