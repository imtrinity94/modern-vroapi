
import { Sun, Moon, LayoutGrid, List } from 'lucide-react';

interface ToggleProps {
    active: boolean;
    onToggle: () => void;
    iconOn: React.ReactNode;
    iconOff: React.ReactNode;
    label: string;
}

const IconButton = ({ active, onToggle, iconOn, iconOff, label }: ToggleProps) => (
    <button
        onClick={onToggle}
        title={label}
        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all shadow-sm"
    >
        {active ? iconOn : iconOff}
    </button>
);

export const ThemeToggle = ({ theme, toggle }: { theme: string; toggle: () => void }) => (
    <IconButton
        active={theme === 'dark'}
        onToggle={toggle}
        iconOn={<Sun size={18} />}
        iconOff={<Moon size={18} />}
        label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    />
);

export const ViewToggle = ({ mode, toggle }: { mode: 'grid' | 'list'; toggle: () => void }) => (
    <IconButton
        active={mode === 'grid'}
        onToggle={toggle}
        iconOn={<List size={18} />}
        iconOff={<LayoutGrid size={18} />}
        label={`Switch to ${mode === 'grid' ? 'list' : 'grid'} view`}
    />
);
