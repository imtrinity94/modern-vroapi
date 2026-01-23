
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localPath = path.resolve(__dirname, '../src/data/plugins/o11n-core.json');
const localData = JSON.parse(fs.readFileSync(localPath, 'utf8'));
const localNames = new Set(localData.classes.map(c => c.name));

const remoteNames = [
    "Action", "ActionResult", "Array", "Attribute", "AuthorizationElement",
    "AuthorizationReference", "boolean", "Boolean", "char", "Command",
    "ConfigurationElement", "ConfigurationElementCategory", "Credential",
    "Date", "Debug", "EncryptedString", "Enumeration", "Event",
    "EventGauge", "EventSchedule", "EventTrigger", "ExecutionContext",
    "File", "FileHelper", "FileReader", "FileWriter", "Function",
    "LdapGroup", "LdapUser", "LockingSystem", "LogEvent", "LogFileWriter",
    "LogQuery", "MimeAttachment", "Module", "NotFound", "Number",
    "Object", "Package", "Parameter", "Path", "PluginModuleDescription",
    "PluginTypeDescription", "Policy", "PolicyTemplate", "PolicyTemplateCategory",
    "Properties", "QueryResult", "Regexp", "ResourceElement",
    "ResourceElementCategory", "SDKObject", "SecureString", "Server",
    "String", "StringRepresentation", "System", "TagQuery", "Task",
    "Trigger", "URL", "VersionHistoryItem", "Workflow", "WorkflowCategory",
    "WorkflowCustomConditionItem", "WorkflowGenericConditionItem",
    "WorkflowInput", "WorkflowInputItem", "WorkflowItem", "WorkflowItemEnd",
    "WorkflowItemWaitingEvent", "WorkflowItemWaitingTimer", "WorkflowLinkItem",
    "WorkflowMultipleCallItem", "WorkflowTaskItem", "WorkflowToken", "ZipWriter"
];

const missing = remoteNames.filter(name => !localNames.has(name));
const extra = [...localNames].filter(name => !remoteNames.includes(name));

console.log('--- ANALYSIS ---');
console.log(`Remote: ${remoteNames.length} classes`);
console.log(`Local:  ${localNames.size} classes`);
console.log('\n--- MISSING LOCALLY ---');
console.log(JSON.stringify(missing, null, 2));
console.log('\n--- EXTRA LOCALLY (NOT IN REMOTE) ---');
console.log(JSON.stringify(extra, null, 2));
