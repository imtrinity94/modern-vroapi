---
description: how to add a new vRO plugin to the modern-vroapi documentation site
---

# Add a New Plugin to modern-vroapi

Follow these steps in order whenever a new vRO plugin needs to be added to the documentation site.

---

## Required Inputs (ask the user if not provided)

| Input | Description | Example |
|---|---|---|
| `PLUGIN_ID` | Unique kebab-case ID matching the vRO plugin convention | `o11n-plugin-vcfautomation` |
| `PLUGIN_NAME` | Human-friendly display name shown on the site | `VCF Automation for All Apps` |
| `DOCS_MD_FILE` | Absolute path to the `*_Docs_Generated.md` markdown file containing class/method data | `C:\...\VCF_Automation_Docs_Generated.md` |
| `ICON_FILE` | Filename of the icon already placed in `vro-doc-site/public/icons/` | `vcfa-all-apps.png` |
| `COLOR` | Tailwind color name for the plugin tint | `blue` |
| `TAGS` | Array of tag strings | `['IN-BUILT', '9.x ONLY']` |
| `VERSION` | Plugin version string (optional) | `9.0.0` |
| `DOWNLOAD_URL` | Download URL (optional, for 3rd-party/official plugins) | — |

---

## Step 1 — Parse the markdown and create the plugin JSON

Read the `DOCS_MD_FILE` markdown. The format is:

```
## ClassName
**Description:** ...
### Attributes
| Name | Description | Type | Read-only |
### Methods
#### `methodName`
**Parameters:** | Name | Type | Description |
**Returns:** `ReturnType`
```

Create `vro-doc-site/src/data/plugins/<PLUGIN_ID>.json` with this structure:

```json
{
  "name": "<PLUGIN_NAME>",
  "description": "API Reference for <PLUGIN_NAME>",
  "classes": [
    {
      "name": "ClassName",
      "description": "...",
      "attributes": [
        { "name": "attrName", "type": "TypeName", "description": "...", "isReadonly": true }
      ],
      "methods": [
        { "name": "methodName", "description": "...", "parameters": "param: Type, param2: Type2", "returnType": "ReturnType" }
      ]
    }
  ]
}
```

- `parameters` is a comma-separated string: `"param: Type, param2: Type2"` (empty string `""` if none)
- `isReadonly` is `true`/`false` based on the "Read-only" column (`Yes` → `true`)
- Count total classes and methods for Step 5

---

## Step 2 — Register the plugin in `plugin-meta.ts`

File: `vro-doc-site/src/data/plugin-meta.ts`

Add an entry to the `PLUGIN_META` object (keep alphabetical order by plugin ID):

```typescript
'<PLUGIN_ID>': {
  image: `${import.meta.env.BASE_URL}icons/<ICON_FILE>`,
  color: '<COLOR>',
  tags: <TAGS>,
  version: '<VERSION>'          // omit if unknown
  downloadUrl: '<DOWNLOAD_URL>' // omit if not applicable
},
```

---

## Step 3 — Add to `index.json`

File: `vro-doc-site/src/data/index.json`

Insert a new entry in alphabetical order by `name`:

```json
{
  "id": "<PLUGIN_ID>",
  "name": "<PLUGIN_NAME>"
}
```

---

## Step 4 — Add to `search-index.json` (enables clickable type links)

File: `vro-doc-site/src/data/search-index.json`

Run the following Node.js snippet (or replicate the logic manually):

```js
const fs = require('fs');
const P = '<PLUGIN_ID>';
const plugin = JSON.parse(fs.readFileSync('vro-doc-site/src/data/plugins/<PLUGIN_ID>.json', 'utf8'));
const idx = JSON.parse(fs.readFileSync('vro-doc-site/src/data/search-index.json', 'utf8'));

plugin.classes.forEach(cls => {
  idx.classes.push({ n: cls.name, p: P });
  cls.methods.forEach(m => {
    idx.methods.push({ n: m.name, c: cls.name, p: P });
  });
});

fs.writeFileSync('vro-doc-site/src/data/search-index.json', JSON.stringify(idx));
```

This makes every class name a clickable hyperlink wherever it appears as a type (return type, attribute type, parameter type) across the entire site.

---

## Step 5 — Add to `stats.json`

File: `vro-doc-site/src/data/stats.json`

Add an entry (count classes and methods from the plugin JSON):

```json
"<PLUGIN_ID>": {
  "classes": <N_CLASSES>,
  "methods": <N_METHODS>
}
```

---

## Step 6 — Update `xref.json` (Reference / Returned By cross-links)

File: `vro-doc-site/src/data/xref.json`

For each plugin-specific class that is **used as a parameter** or **returned** by methods in the same plugin, add entries using this Node.js snippet:

```js
const fs = require('fs');
const xref = JSON.parse(fs.readFileSync('vro-doc-site/src/data/xref.json', 'utf8'));
const P = '<PLUGIN_ID>';

// For each class that appears as a type in parameters or return values:
xref['ClassName'] = {
  u: [   // "used by" — signatures of methods that accept this class as a PARAMETER
    `${P}:CallerClass:methodName`,
  ],
  r: [   // "returned by" — signatures of methods that RETURN this class
    `${P}:CallerClass:methodName`,
  ]
};

// Classes with no cross-references still need an empty entry:
xref['StandaloneClass'] = { u: [], r: [] };

fs.writeFileSync('vro-doc-site/src/data/xref.json', JSON.stringify(xref));
```

**How to identify relationships from the plugin JSON:**
- A class appears in `u[]` (used by) when it appears as a **parameter type** in a method of another class
- A class appears in `r[]` (returned by) when it appears as a **return type** of a method in another class
- Signature format: `pluginId:ClassName:methodName` (no spaces)

---

## Step 7 — Verify

1. Check the dev server (if running: `npm run dev` inside `vro-doc-site/`) reflects:
   - Plugin tile appears on home page with correct icon, color, and tags
   - Class list loads for the plugin
   - Type names in attributes/methods/returns are clickable links
   - **Reference** and **Returned By** sections appear on class pages where applicable

---

## File Summary

| File | What changes |
|---|---|
| `vro-doc-site/src/data/plugins/<PLUGIN_ID>.json` | **NEW** — full class/method data |
| `vro-doc-site/src/data/plugin-meta.ts` | Add icon, color, tags, version entry |
| `vro-doc-site/src/data/index.json` | Add display name entry |
| `vro-doc-site/src/data/search-index.json` | Add all classes + methods for type linking |
| `vro-doc-site/src/data/stats.json` | Add class/method counts |
| `vro-doc-site/src/data/xref.json` | Add Reference / Returned By cross-links |
| `vro-doc-site/public/icons/<ICON_FILE>` | Place icon here **before** running (not created by this workflow) |
