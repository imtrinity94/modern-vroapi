# Contributing to Modern vRO API Documentation

First off, thanks for taking the time to contribute! 🎉

The goal of this project is to provide a modern, fast, and searchable interface for VMware Aria Automation Orchestrator (vRO) plugin API documentation.

## 🛠️ Project Structure

This repository contains the source code for the documentation website.

- **`vro-doc-site/`**: The main React application (Vite + TypeScript + Tailwind CSS).
- **`vro-doc-site/src/data/plugins/`**: Raw JSON files containing the API definitions for each plugin.
- **`vro-doc-site/src/data/index.json`**: The central registry of all available plugins.
- **`BTVA/`**: (Legacy/Source) Original TypeScript definition files used for parsing.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/imtrinity94/modern-vroapi.git
    cd modern-vroapi
    ```

2.  Navigate to the web application directory:
    ```bash
    cd vro-doc-site
    ```

3.  Install dependencies:
    ```bash
    npm install
    ```

4.  Start the development server:
    ```bash
    npm run dev
    ```
    The site will be available at `http://localhost:5173`.

## 📦 Adding or Updating Plugins

The documentation is driven by JSON data files. To add a new plugin or update an existing one:

1.  **Add the Data**: Place your plugin's JSON file in `vro-doc-site/src/data/plugins/`.
    *   Filename format: `o11n-plugin-<name>.json` (e.g., `o11n-plugin-aws.json`).
    *   Ensure the JSON structure matches the existing schema (contains `classes` array, etc.).

2.  **Re-index**: You **MUST** run the reindexing script to update the search index and plugin registry.
    ```bash
    npm run reindex
    ```
    *This script generates `src/data/index.json` and `src/data/search-index.json`. If you skip this, your new plugin will not appear.*

3.  **Verify**: Start the dev server and check that your plugin appears in the list and can be searched.

## 🎨 Code Style

- **Framework**: React (Functional Components with Hooks).
- **Styling**: Tailwind CSS. (Use adaptive classes like `bg-white dark:bg-slate-900` for dark mode support).
- **Language**: TypeScript. Please avoid `any` where possible.
- **Icons**: Lucide React.

## 🤝 Pull Request Process

1.  Fork the repository.
2.  Create a new branch for your feature (`git checkout -b feature/amazing-feature`).
3.  Commit your changes (`git commit -m 'Add some amazing feature'`).
4.  Push to the branch (`git push origin feature/amazing-feature`).
5.  Open a Pull Request.

## 🐛 Reporting Bugs

If you find a bug or have a suggestion, please open an issue on GitHub. Include details about the browser, device, and steps to reproduce the issue.

Thank you for contributing to the community!
