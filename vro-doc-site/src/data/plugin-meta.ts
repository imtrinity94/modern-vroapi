
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
}

export const PLUGIN_META: Record<string, PluginMetadata> = {
    'o11n-core': { icon: Cpu, color: 'indigo' },
    'o11n-plugin-activedirectory': { icon: Users, color: 'blue' },
    'o11n-plugin-amqp': { image: `${import.meta.env.BASE_URL}icons/amqp.png`, color: 'orange' },
    'o11n-plugin-aria': { icon: Cloud, color: 'indigo' },
    'o11n-plugin-crypto': { icon: Lock, color: 'emerald' },
    'o11n-plugin-dynamictypes': { icon: Variable, color: 'purple' },
    'o11n-plugin-mail': { icon: Mail, color: 'amber' },
    'o11n-plugin-mqtt': { icon: Radio, color: 'rose' },
    'o11n-plugin-net': { icon: Globe, color: 'blue' },
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

export const getPluginMeta = (id: string): PluginMetadata => PLUGIN_META[id] || { icon: Package, color: 'indigo' };
