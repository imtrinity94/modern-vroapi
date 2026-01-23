
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useUIState';
import { ThemeToggle } from './UIToggles';
import { Search } from 'lucide-react';

const Layout: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                            V
                        </div>
                        <span className="text-xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-slate-400">
                            vRO API Docs
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Plugins</Link>
                        <a href="#" className="hover:text-indigo-600 dark:hover:text-white transition-colors">About</a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="relative group hidden sm:block">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-48 md:w-64 transition-all"
                            />
                        </div>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

                        <ThemeToggle theme={theme} toggle={toggleTheme} />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 dark:border-slate-800 py-12 mt-12 bg-slate-100 dark:bg-black/20">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        Generated Documentation for vRealize Orchestrator Plugins
                    </p>
                    <div className="flex justify-center gap-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all">
                        {/* Minimal logos or textual links can go here */}
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
