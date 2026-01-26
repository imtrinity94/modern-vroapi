
# Contributing to Modern vRO API Reference

Thank you for your interest in improving the VMware vRealize Orchestrator (vRO) API documentation! This project is community-driven and depends on your contributions to stay accurate.

## 🚀 Quick Ways to Contribute

### 1. Suggest an Edit (Easiest)
If you find a typo or a missing method while browsing the site:
1. Click the **"Suggest Edit"** button on any Class page.
2. This will open the raw JSON data on GitHub.
3. If you have a GitHub account, you can click the ✏️ icon to edit the file directly in your browser and submit a Pull Request.

### 2. Add a New Plugin / Update Data
If you want to add a completely new plugin or do a bulk update:

#### Prerequisites
- Node.js installed
- Clone this repository

#### Step-by-Step
1. **Scrape New Data**: Run the scraper against the old vroapi.com (or any other source if the scraper is updated).
   ```bash
   npm run scrape -- https://www.vroapi.com/Plugin/vCenter/7.0.0
   ```
2. **Review JSON**: The file will be saved in `scraped_data/`. Clean it up or add descriptions if needed.
3. **Move to Project**: Copy the JSON to `src/data/plugins/`. Ensure the filename is logical (e.g., `o11n-plugin-vc.json`).
4. **Auto-Reindex**: Run our reindexing script to update the site's navigation automatically.
   ```bash
   npm run reindex
   ```
5. **Preview**: Run `npm run dev` to see your changes locally.
6. **Submit PR**: Push your changes to a fork and submit a Pull Request!

## 🛠 Project Structure
- `src/data/plugins/`: Contains the actual API metadata for each plugin.
- `scripts/`: Useful tools for scraping and indexing.
- `src/pages/`: UI components using React + Tailwind.

---
*Stay Awesome, Automator!*
