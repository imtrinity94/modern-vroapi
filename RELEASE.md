# modernvroapi.in - Release Notes

## [v1.2.1] - 2026-11-15 - MCP page on the site

### ✨ New Features
- **MCP page** at `/#/mcp`: server URL with copy button, setup for Claude, ChatGPT, Claude Code, Cursor, VS Code and stdio clients, the four tools and a test prompt.
- **Discoverability**: "MCP for AI" link in the header (icon on smaller screens) and a one-line notice on the home page.

## [v1.2.0] - 2026-11-15 - MCP Server

### ✨ New Features
- **MCP server (1.0.0)**: `https://modernvroapi.in/api/mcp`, a remote, read-only Model Context Protocol endpoint (Streamable HTTP, stateless, no auth) with four tools: `search_api`, `get_class`, `list_plugins` and `get_method_signature`.
- **Search index**: `scripts/build-ai-api.mjs` now also writes `/api/v1/search-index.json`, a compact list of every class, method and attribute (used by the MCP search).
- **llms.txt** mentions the MCP endpoint.

### 🔧 Improvements
- The `/api/` CORS and cache headers in `vercel.json` now apply to `/api/v1/` only, so MCP responses are never cached.
- `npm run mcp:test` runs a local smoke test of every tool.

## [v1.1.0] - Azure Plugin Integration & Engine Update

### ✨ New Features
- **Azure Plugin Added**: Fully integrated the official `o11n-plugin-azure` to the modernvroapi.in documentation catalog.
- **Plugin Installation Reference**: Embedded the [official VCF Extensibility Installation Guide](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/configuration-of-vmware-cloud-foundation-operations-orchestrator/vcf-ochestrator-plugins-overview/manage-the-orchestrator-plug-ins/install-update-or-delete-a-plug-in.html) dynamically beside downloadable plugin components across the site.
- **Top Bar Version Marker**: Added dynamic `1.1.0` badge on the global site header navigation.

### 🐛 Bug Fixes
- **Markdown Extraction Resilience**: Fixed a critical extraction bug in `update_docs_from_md.js` where properties lacking descriptions caused tables to collapse and misalignment of `Type` and `Read-only` values. 

### 🔧 Improvements
- **Array Value Type Formatting**: Hardened the conversion scripts to automatically transform clunky `Array/TypeName` syntax into standard `TypeName[]` syntax recursively.
- **Cross-Reference Inheritance for Arrays**: Overhauled the indexing logic (`update-indices`) so methods returning Array structures dynamically anchor back to base classes in the Reference tracking panels. 
