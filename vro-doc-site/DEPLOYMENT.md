# Testing & Deployment Instructions

### 1. Local Testing
To run the documentation site on your machine:
1.  **Open Terminal** in the `vro-doc-site` folder.
2.  **Install dependencies** (if not done): `npm install`.
3.  **Start Dev Server**: `npm run dev`.
4.  **View Site**: Open [http://localhost:5173/](http://localhost:5173/) in your browser.

> [!TIP]
> If you add new plugins to the `BTVA` folder, update the documentation data by running:
> `npx tsx scripts/generate-docs.ts`

---

### 2. GitHub Testing & Deployment
The site is configured to deploy automatically via GitHub Actions.

1.  **Commit and Push**:
    ```bash
    git add .
    git commit -m "Update UI and fix theme"
    git push origin main
    ```
2.  **Monitor Actions**: Go to the **Actions** tab in your GitHub repository. You should see a workflow named "Deploy vRO Docs" running.
3.  **Enable Pages**: 
    - Once the Action finishes, go to **Settings > Pages**.
    - Under **Build and deployment > Source**, ensure it says "Deploy from a branch".
    - Select the `gh-pages` branch (it should appear after the first run).
4.  **Visit URL**: The URL will be listed at the top of the Pages settings (e.g., `https://imtrinity94.github.io/modern-vroapi/`).

---

### 3. Verification Checklist
- [ ] **Home Page**: Search for "vCenter" or "VC" to see the plugin list filter.
- [ ] **Theme**: Click the Sun/Moon icon. The background should switch between pure white and deep blue/black.
- [ ] **View Toggle**: Switch between "Grid" (cards) and "List" (compact rows).
- [ ] **Drill-down**: Navigate to a class and verify that the "Methods" and "Attributes" tables are readable.
