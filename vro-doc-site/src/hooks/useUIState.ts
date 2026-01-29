
import { useEffect, useState } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) return savedTheme;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

    return { theme, toggleTheme };
};

export const useViewMode = () => {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>(
        (localStorage.getItem('viewMode') as 'grid' | 'list') || 'grid'
    );

    useEffect(() => {
        localStorage.setItem('viewMode', viewMode);
    }, [viewMode]);

    const toggleViewMode = () => setViewMode(viewMode === 'grid' ? 'list' : 'grid');

    return { viewMode, toggleViewMode };
};
