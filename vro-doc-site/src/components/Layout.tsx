
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useUIState';
import { ThemeToggle } from './UIToggles';
import { Search, Slack, Star, Github, ExternalLink, BookOpen } from 'lucide-react';

const Layout: React.FC = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
            <header className="sticky top-0 z-50 w-full backdrop-blur-md border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95">
                <div className="container mx-auto px-4 md:px-6 h-16 md:h-24 flex items-center justify-between gap-4 md:gap-8">
                    <Link to="/" className="flex items-center gap-2 md:gap-4 shrink-0">
                        <div className="w-10 h-10 md:w-14 md:h-14 flex items-center justify-center shrink-0">
                            <img src="/logo.png" alt="VCF Orchestrator" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-white dark:to-slate-400 leading-tight">
                            <span className="hidden sm:inline">VCF Orchestrator JavaScript SDK APIs</span>
                            <span className="sm:hidden">VCF SDK APIs</span>
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <Link to="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Plugins</Link>
                        <a
                            href="https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/configuration-of-vmware-cloud-foundation-operations-orchestrator.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-indigo-600 dark:hover:text-white transition-colors flex items-center gap-1"
                        >
                            Official Docs <ExternalLink size={14} />
                        </a>
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

                        <div className="flex items-center gap-2">
                            <a
                                href="https://modernvroapi.slack.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-slate-500 hover:text-[#4A154B] dark:hover:text-[#ECB22E] hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                                title="Join our Slack"
                            >
                                <Slack size={20} />
                            </a>
                            <a
                                href="https://github.com/imtrinity94/modern-vroapi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all text-sm font-semibold shadow-sm"
                            >
                                <Star size={16} fill="currentColor" />
                                <span className="hidden sm:inline">Star</span>
                            </a>
                        </div>

                        <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />

                        <ThemeToggle theme={theme} toggle={toggleTheme} />
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Outlet />
            </main>

            <footer className="border-t border-slate-200 dark:border-slate-800 py-12 mt-12 bg-white dark:bg-slate-900/50">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                        Generated Documentation for VMware Cloud Foundation Orchestrator Plugins
                    </p>
                    <div className="flex justify-center items-center gap-6">
                        <a
                            href="https://modernvroapi.slack.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-500 hover:text-[#4A154B] dark:hover:text-[#ECB22E] transition-colors font-medium"
                        >
                            <Slack size={18} />
                            <span>Slack Community</span>
                        </a>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                        <a
                            href="https://github.com/imtrinity94/modern-vroapi"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
                        >
                            <Github size={18} />
                            <span>GitHub Repository</span>
                        </a>
                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800" />
                        <a
                            href="https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/configuration-of-vmware-cloud-foundation-operations-orchestrator.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
                        >
                            <BookOpen size={18} />
                            <span>Official Broadcom Docs</span>
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
