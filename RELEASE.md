# modernvroapi.in - Release Notes

## [v1.1.0] - Azure Plugin Integration & Engine Update

### ✨ New Features
- **Azure Plugin Added**: Fully integrated the official `o11n-plugin-azure` to the modernvroapi.in documentation catalog.
- **Top Bar Version Marker**: Added dynamic `1.1.0` badge on the global site header navigation.

### 🐛 Bug Fixes
- **Markdown Extraction Resilience**: Fixed a critical extraction bug in `update_docs_from_md.js` where properties lacking descriptions caused tables to collapse and misalignment of `Type` and `Read-only` values. 

### 🔧 Improvements
- **Array Value Type Formatting**: Hardened the conversion scripts to automatically transform clunky `Array/TypeName` syntax into standard `TypeName[]` syntax recursively.
- **Cross-Reference Inheritance for Arrays**: Overhauled the indexing logic (`update-indices`) so methods returning Array structures dynamically anchor back to base classes in the Reference tracking panels. 
