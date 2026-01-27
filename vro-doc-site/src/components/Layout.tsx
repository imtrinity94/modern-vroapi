
import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../hooks/useUIState';
import { ThemeToggle } from './UIToggles';
import { Slack, Star, Github, ExternalLink, BookOpen } from 'lucide-react';
import GlobalSearch from './GlobalSearch';

const Layout: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // Show header if scrolling up or at the very top
            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            }
            // Hide header if scrolling down and not at the top
            else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-indigo-500 selection:text-white transition-colors duration-300">
            <header className={`sticky top-0 z-50 w-full backdrop-blur-md border-b border-slate-800 bg-slate-950/95 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="container mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4 md:gap-8">
                    <Link to="/" className="flex items-center gap-2 md:gap-3 shrink-0">
                        <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center shrink-0">
                            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="VCF Orchestrator" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl md:text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 leading-tight transition-opacity hover:opacity-90">
                            modernvroapi.in
                        </span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                        <Link to="/" className="hover:text-white transition-colors">Plugins</Link>
                        <a
                            href="https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/configuration-of-vmware-cloud-foundation-operations-orchestrator.html"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-white transition-colors flex items-center gap-1"
                        >
                            Official Docs <ExternalLink size={14} />
                        </a>
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block">
                            <GlobalSearch />
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href="https://modernvroapi.slack.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg text-slate-400 hover:text-[#ECB22E] hover:bg-slate-800 transition-all"
                                title="Join our Slack"
                            >
                                <Slack size={20} />
                            </a>
                            <a
                                href="https://github.com/imtrinity94/modern-vroapi"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-lg bg-white text-slate-900 hover:bg-slate-100 transition-all text-sm font-semibold shadow-sm"
                            >
                                <Star size={16} fill="currentColor" />
                                <span className="hidden sm:inline">Star</span>
                            </a>
                        </div>

                        <div className="w-px h-6 bg-slate-800 mx-1" />

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
