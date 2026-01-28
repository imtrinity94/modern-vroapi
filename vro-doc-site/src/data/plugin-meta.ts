
import {
    Users, Cloud,
    Lock, Variable, Mail, Radio, Globe,
    Terminal, Database, Key, Zap, Monitor,
    Download, FileCode, Activity, Package, Cpu, type LucideIcon
} from 'lucide-react';

export interface PluginMetadata {
    icon?: LucideIcon;
    image?: string;
    color: string;
    tags?: string[];
    downloadUrl?: string;
}

export const PLUGIN_META: Record<string, PluginMetadata> = {
    'o11n-core': { icon: Cpu, color: 'indigo', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-activedirectory': { icon: Users, color: 'blue', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-amqp': { image: `${import.meta.env.BASE_URL}icons/amqp.png`, color: 'orange', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-aria': { icon: Cloud, color: 'indigo', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-crypto': { icon: Lock, color: 'emerald', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-dynamictypes': { icon: Variable, color: 'purple', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-jsonpath': { icon: FileCode, color: 'blue', tags: ['3RD PARTY'], downloadUrl: `${import.meta.env.BASE_URL}plugins/o11nplugin-jsonpath-1.0.2.zip` },
    'o11n-plugin-mail': { icon: Mail, color: 'amber', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-mqtt': { icon: Radio, color: 'rose', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-net': { icon: Globe, color: 'blue', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-powershell': { icon: Terminal, color: 'slate', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-rest': { icon: Globe, color: 'green', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-snmp': { icon: Activity, color: 'orange', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-soap': { icon: FileCode, color: 'indigo', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-sql': { icon: Database, color: 'blue', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-ssh': { icon: Key, color: 'slate', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-vapi': { icon: Zap, color: 'yellow', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-vc': { icon: Monitor, color: 'blue', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-vcloud': { icon: Cloud, color: 'sky', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-vco': { icon: Terminal, color: 'slate', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-vum': { icon: Download, color: 'green', tags: ['IN-BUILT', 'CERTIFIED'] },
    'o11n-plugin-xml': { icon: FileCode, color: 'orange', tags: ['IN-BUILT', 'CERTIFIED'] }
};

export const getPluginMeta = (id: string): PluginMetadata => {
    const meta = PLUGIN_META[id] || { icon: Package, color: 'indigo' };
    if (!meta.tags) {
        meta.tags = ['IN-BUILT', 'CERTIFIED'];
    }
    return meta;
};
