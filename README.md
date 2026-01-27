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

## 🚀 Overview

**modernvroapi.in** is a community-driven, modern replacement for legacy vRO documentation sites. Built with **React 19**, **Vite**, and **Tailwind CSS**, it provides a blazing-fast user experience with instant search, dark mode support, and deep-linking for every class and method.

### ✨ Key Features
- 🔍 **Universal Global Search**: Find any plugin, class, or method (over 14,000+ entries) instantly via `Ctrl+K` or `/`.
- ⚡ **High Performance**: Pre-indexed metadata ensures lightning-fast navigation with zero lag.
- 🌓 **Dark Mode**: Native support for dark and light themes with a premium glassmorphic UI.
- 📱 **Fully Responsive**: Optimized for everything from mobile phones up to 4K monitors.
- 🛠 **Community Registry**: Easy "Suggest Edit" buttons on every page to keep metadata accurate via GitHub.
- 🐇 **HD Branding**: Support for high-definition custom logos for specialized plugins.

---

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State/Routing**: [React Router 7](https://reactrouter.com/)

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
