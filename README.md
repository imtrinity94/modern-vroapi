<div align="center">
  <img src="vro-doc-site/public/logo.png" width="120" height="120" alt="VCF Orchestrator Logo">
  <h1>modernvroapi.in</h1>
  <p><strong>API Documentation for VCF Operations Orchestrator™ Plugins</strong></p>
  <p>A modern, high-performance community reference for VMware Cloud Foundation Orchestrator (vRO) Plugins.</p>
  
  <p>
    <a href="https://modernvroapi.in"><strong>🌐 Live Preview: modernvroapi.in</strong></a>
  </p>

  <p>
    <a href="https://github.com/imtrinity94/modern-vroapi/stargazers"><img src="https://img.shields.io/github/stars/imtrinity94/modern-vroapi?style=for-the-badge&color=indigo" alt="Stars"></a>
    <a href="https://modernvroapi.slack.com/"><img src="https://img.shields.io/badge/Slack-Join%20Us-purple?style=for-the-badge&logo=slack" alt="Slack"></a>
    <a href="https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/configuration-of-vmware-cloud-foundation-operations-orchestrator.html"><img src="https://img.shields.io/badge/Broadcom-Official%20Docs-blue?style=for-the-badge" alt="Broadcom Docs"></a>
  </p>
</div>

---

## 🚀 What is modernvroapi.in?

**modernvroapi.in** is a community-driven API reference hub for **VMware Cloud Foundation Operations Orchestrator (vRO)** plugins. It serves as a modern, high-performance replacement for legacy documentation site (vroapi.com), designed specifically for automation engineers and developers working with the vRO JavaScript SDK.

Its primary goal is to provide **instant access** to the complete API surface of dozens of plugins, including in-built VCF components, certified integrations, and widely used 3rd-party community plugins.

### 🎯 Key Capabilities
- 🔍 **Universal Search**: Instantly find any plugin, class, method, or attribute (over 14,000+ entries) with sub-second latency.
- 📚 **Comprehensive Coverage**: Aggregates documentation for standard plugins (vCenter, AD, SQL) and specialized integrations (F5, SRM, vSAN, Avi).
- 🔗 **Deep Linking**: Every class and method has its own unique URL, making it easy to share specific API references in code comments or Slack.
- ⬇️ **Download Hub**: Quick access to plugin binaries and official documentation links directly from each API page.
- 🌓 **Developer-First UI**: Features like **Dark Mode**, **one-click method signature copying**, and a mobile-responsive layout designed for multi-tasking.
- 🛠 **Open Contribution**: Built on an open JSON data structure, allowing the community to suggest fixes and add new plugins via GitHub.

---

## 🔍 Global Intelligent Search

The cornerstone of the `modernvroapi.in` experience is its **unified search engine**, specifically engineered for speed and breadth:

- **Unified Registry**: Simultaneously searches across **Plugins**, **Classes/Interfaces**, and **Member Methods/Attributes**.
- **Blazing Performance**: All search operations happen client-side using a optimized `search-index.json`, providing results in milliseconds without any server-side roundtrips.
- **Productivity Shortcuts**:
  - `Ctrl + K` or `/`: Instantly focuses the global search bar from anywhere on the site.
  - `Arrow Keys + Enter`: Rapidly navigate results without touching the mouse.
- **Smart Filtering**: Results are categorized by type, allowing you to quickly jump directly to a method implementation even if you only remember part of its name.
- **Deep Index**: Over **14,000 components** are currently indexed and searchable in real-time.

---

## 🏗 Project Structure

- **vro-doc-site**: The main documentation web application.
- **scripts**: Automation tools for scraping legacy data and re-indexing the API catalog.
- **BTVA**: Source TypeScript definition files and extracted metadata for vRO plugins.
- **Third-party Plugins**: A collection of community-contributed vRO plugin binaries and sources.

---

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Project tested with Node 18+)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/imtrinity94/modern-vroapi.git
   ```
2. Navigate to the webapp directory:
   ```bash
   cd vro-doc-site
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

---

## 🤝 Contributing

This project relies on the community to keep API data up-to-date. There are three ways to help:

### 1. Quick Metadata Edits
Every class page has a **"Suggest Edit"** button. Clicking it takes you directly to the JSON source file on GitHub where you can submit a PR with corrected descriptions or method signatures.

### 2. Auto-Reindexing
If you add a new plugin JSON file to `src/data/plugins/`, simply run:
```bash
npm run reindex
```
This script automatically scans your files and updates the global navigation registry.

### 3. Scraping New Data
We have built-in tools to pull data from legacy formats:
```bash
npm run scrape -- https://www.vroapi.com/Plugin/vCenter/7.0.0
```

For more detailed instructions, see [CONTRIBUTING.md](./CONTRIBUTING.md).

---

## 💬 Community

- **Slack**: [Join our workspace](https://modernvroapi.slack.com/) to discuss automation, SDK updates, and feature requests.
- **Broadcom**: For product configuration, refer to the [Official VCF Documentation](https://techdocs.broadcom.com/us/en/vmware-cis/vcf/vcf-9-0-and-later/9-0/configuration-of-vmware-cloud-foundation-operations-orchestrator.html).

---

<p align="center">
  Built with ❤️ by the Automation Community.
</p>
