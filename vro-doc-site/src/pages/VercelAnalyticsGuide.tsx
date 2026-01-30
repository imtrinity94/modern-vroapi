import { BookOpen } from 'lucide-react';

const VercelAnalyticsGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="text-indigo-600 dark:text-indigo-400" size={32} />
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Getting started with Vercel Web Analytics
          </h1>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          This guide will help you get started with using Vercel Web Analytics on your project, showing you how to enable it, add the package to your project, deploy your app to Vercel, and view your data in the dashboard.
        </p>
        <div className="mt-4 p-4 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 rounded-lg">
          <p className="text-sm text-indigo-900 dark:text-indigo-300 font-medium">
            Select your framework to view instructions on using the Vercel Web Analytics in your project.
          </p>
        </div>
      </div>

      {/* Prerequisites */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Prerequisites</h2>
        <ul className="space-y-3 list-none">
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <span className="text-slate-700 dark:text-slate-300">
              A Vercel account. If you don't have one, you can{' '}
              <a href="https://vercel.com/signup" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                sign up for free
              </a>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <span className="text-slate-700 dark:text-slate-300">
              A Vercel project. If you don't have one, you can{' '}
              <a href="https://vercel.com/new" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                create a new project
              </a>.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <div className="flex-1">
              <span className="text-slate-700 dark:text-slate-300">
                The Vercel CLI installed. If you don't have it, you can install it using the following command:
              </span>
              <div className="mt-3 space-y-2">
                <CodeBlock lang="bash" label="pnpm">pnpm i vercel</CodeBlock>
                <CodeBlock lang="bash" label="yarn">yarn i vercel</CodeBlock>
                <CodeBlock lang="bash" label="npm">npm i vercel</CodeBlock>
                <CodeBlock lang="bash" label="bun">bun i vercel</CodeBlock>
              </div>
            </div>
          </li>
        </ul>
      </section>

      {/* Enable Web Analytics */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Enable Web Analytics in Vercel</h3>
        <p className="text-slate-700 dark:text-slate-300">
          On the Vercel dashboard, select your Project and then click the <strong>Analytics</strong> tab and click <strong>Enable</strong> from the dialog.
        </p>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>💡 Note:</strong> Enabling Web Analytics will add new routes (scoped at <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded">/_vercel/insights/*</code>) after your next deployment.
          </p>
        </div>
      </section>

      {/* Add Package */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add @vercel/analytics to your project</h3>
        <p className="text-slate-700 dark:text-slate-300">
          Using the package manager of your choice, add the <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">@vercel/analytics</code> package to your project:
        </p>
        <div className="space-y-2">
          <CodeBlock lang="bash" label="pnpm">pnpm i @vercel/analytics</CodeBlock>
          <CodeBlock lang="bash" label="yarn">yarn i @vercel/analytics</CodeBlock>
          <CodeBlock lang="bash" label="npm">npm i @vercel/analytics</CodeBlock>
          <CodeBlock lang="bash" label="bun">bun i @vercel/analytics</CodeBlock>
        </div>
      </section>

      {/* Framework-specific Implementation */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Add the Analytics component to your app</h3>

        {/* Next.js Pages Directory */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Next.js (Pages Directory)</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            The Analytics component is a wrapper around the tracking script, offering more seamless integration with Next.js, including route support.
            If you are using the <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">pages</code> directory, add the following code to your main app file:
          </p>
          <CodeBlock lang="tsx" label="pages/_app.tsx" highlight={[2, 8]}>
{`import type { AppProps } from "next/app";
import { Analytics } from "@vercel/analytics/next";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}

export default MyApp;`}
          </CodeBlock>
        </div>

        {/* Next.js App Directory */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Next.js (App Directory)</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            Add the following code to the root layout:
          </p>
          <CodeBlock lang="tsx" label="app/layout.tsx" highlight={[1, 15]}>
{`import { Analytics } from "@vercel/analytics/next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Next.js</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}`}
          </CodeBlock>
        </div>

        {/* Remix */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Remix</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            The Analytics component is a wrapper around the tracking script, offering a seamless integration with Remix, including route detection.
            Add the following code to your root file:
          </p>
          <CodeBlock lang="tsx" label="app/root.tsx" highlight={[9, 21]}>
{`import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { Analytics } from "@vercel/analytics/remix";

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Analytics />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}`}
          </CodeBlock>
        </div>

        {/* Nuxt */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Nuxt</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            The Analytics component is a wrapper around the tracking script, offering more seamless integration with Nuxt, including route support.
            Add the following code to your main component:
          </p>
          <CodeBlock lang="tsx" label="app.vue" highlight={[2, 6]}>
{`<script setup lang="ts">
import { Analytics } from '@vercel/analytics/nuxt';
</script>

<template>
  <Analytics />
  <NuxtPage />
</template>`}
          </CodeBlock>
        </div>

        {/* SvelteKit */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">SvelteKit</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            The <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">injectAnalytics</code> function is a wrapper around the tracking script, offering more seamless integration with SvelteKit, including route support.
            Add the following code to the main layout:
          </p>
          <CodeBlock lang="ts" label="src/routes/+layout.ts">
{`import { dev } from "$app/environment";
import { injectAnalytics } from "@vercel/analytics/sveltekit";

injectAnalytics({ mode: dev ? "development" : "production" });`}
          </CodeBlock>
        </div>

        {/* Astro */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Astro</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            The Analytics component is a wrapper around the tracking script, offering more seamless integration with Astro, including route support.
            Add the following code to your base layout:
          </p>
          <CodeBlock lang="tsx" label="src/layouts/Base.astro" highlight={[2, 10]}>
{`---
import Analytics from '@vercel/analytics/astro';
{/* ... */}
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <!-- ... -->
    <Analytics />
  </head>
  <body>
    <slot />
  </body>
</html>`}
          </CodeBlock>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-300 mb-2">
              <strong>💡 Note:</strong> The Analytics component is available in version @vercel/analytics@1.4.0 and later.
            </p>
            <p className="text-sm text-blue-900 dark:text-blue-300">
              If you are using an earlier version, you must configure the webAnalytics property of the Vercel adapter in your astro.config.mjs file. 
              For further information, see the{' '}
              <a href="https://docs.astro.build/en/guides/integrations-guide/vercel/#webanalytics" target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-700 dark:hover:text-blue-400">
                Astro adapter documentation
              </a>.
            </p>
          </div>
        </div>

        {/* React (Create React App) */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">React (Create React App)</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            The Analytics component is a wrapper around the tracking script, offering more seamless integration with React.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg mb-3">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>💡 Note:</strong> When using the plain React implementation, there is no route support.
            </p>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            Add the following code to the main app file:
          </p>
          <CodeBlock lang="tsx" label="App.tsx" highlight={[1, 7]}>
{`import { Analytics } from "@vercel/analytics/react";

export default function App() {
  return (
    <div>
      {/* ... */}
      <Analytics />
    </div>
  );
}`}
          </CodeBlock>
        </div>

        {/* Vue */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Vue</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            The Analytics component is a wrapper around the tracking script, offering more seamless integration with Vue.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg mb-3">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>💡 Note:</strong> Route support is automatically enabled if you're using vue-router.
            </p>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            Add the following code to your main component:
          </p>
          <CodeBlock lang="tsx" label="src/App.vue" highlight={[2, 6]}>
{`<script setup lang="ts">
import { Analytics } from '@vercel/analytics/vue';
</script>

<template>
  <Analytics />
  <!-- your content -->
</template>`}
          </CodeBlock>
        </div>

        {/* Plain HTML */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">HTML (Plain HTML Sites)</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            For plain HTML sites, you can add the following script to your .html files:
          </p>
          <CodeBlock lang="html" label="index.html">
{`<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>`}
          </CodeBlock>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>💡 Note:</strong> When using the HTML implementation, there is no need to install the @vercel/analytics package. However, there is no route support.
            </p>
          </div>
        </div>

        {/* Other frameworks */}
        <div className="space-y-3">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Other Frameworks</h4>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            Import the <code className="px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded">inject</code> function from the package, which will add the tracking script to your app. This should only be called once in your app, and must run in the client.
          </p>
          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg mb-3">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>💡 Note:</strong> There is no route support with the inject function.
            </p>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm">
            Add the following code to your main app file:
          </p>
          <CodeBlock lang="ts" label="main.ts">
{`import { inject } from "@vercel/analytics";

inject();`}
          </CodeBlock>
        </div>
      </section>

      {/* Deploy */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">Deploy your app to Vercel</h3>
        <p className="text-slate-700 dark:text-slate-300">
          Deploy your app using the following command:
        </p>
        <CodeBlock lang="bash" label="terminal">vercel deploy</CodeBlock>
        <p className="text-slate-700 dark:text-slate-300">
          If you haven't already, we also recommend{' '}
          <a href="https://vercel.com/docs/git" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            connecting your project's Git repository
          </a>, which will enable Vercel to deploy your latest commits to main without terminal commands.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Once your app is deployed, it will start tracking visitors and page views.
        </p>
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>💡 Note:</strong> If everything is set up properly, you should be able to see a Fetch/XHR request in your browser's Network tab from{' '}
            <code className="px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/50 rounded">/_vercel/insights/view</code> when you visit any page.
          </p>
        </div>
      </section>

      {/* View Data */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">View your data in the dashboard</h3>
        <p className="text-slate-700 dark:text-slate-300">
          Once your app is deployed, and users have visited your site, you can view your data in the dashboard.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          To do so, go to your dashboard, select your project, and click the <strong>Analytics</strong> tab.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          After a few days of visitors, you'll be able to start exploring your data by viewing and filtering the panels.
        </p>
        <p className="text-slate-700 dark:text-slate-300">
          Users on Pro and Enterprise plans can also add custom events to their data to track user interactions such as button clicks, form submissions, or purchases.
        </p>
      </section>

      {/* Privacy */}
      <section className="space-y-4">
        <p className="text-slate-700 dark:text-slate-300">
          Learn more about how Vercel supports{' '}
          <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
            privacy and data compliance standards
          </a>{' '}
          with Vercel Web Analytics.
        </p>
      </section>

      {/* Next Steps */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Next steps</h2>
        <p className="text-slate-700 dark:text-slate-300">
          Now that you have Vercel Web Analytics set up, you can explore the following topics to learn more:
        </p>
        <ul className="space-y-2 list-none">
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <a href="https://vercel.com/docs/analytics/package" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Learn how to use the @vercel/analytics package
            </a>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <a href="https://vercel.com/docs/analytics/custom-events" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Learn how to set update custom events
            </a>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <a href="https://vercel.com/docs/analytics/filtering" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Learn about filtering data
            </a>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Read about privacy and compliance
            </a>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <a href="https://vercel.com/docs/analytics/limits-and-pricing" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Explore pricing
            </a>
          </li>
          <li className="flex gap-3">
            <span className="text-indigo-600 dark:text-indigo-400 font-bold">•</span>
            <a href="https://vercel.com/docs/analytics/troubleshooting" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">
              Troubleshooting
            </a>
          </li>
        </ul>
      </section>
    </div>
  );
};

// Code block component for displaying code snippets
interface CodeBlockProps {
  children: string;
  lang: string;
  label?: string;
  highlight?: number[];
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, lang, label, highlight = [] }) => {
  const lines = children.split('\n');
  
  return (
    <div className="rounded-lg overflow-hidden border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">
      {label && (
        <div className="px-4 py-2 bg-slate-200 dark:bg-slate-800 border-b border-slate-300 dark:border-slate-700">
          <span className="text-xs font-mono text-slate-600 dark:text-slate-400">{label}</span>
        </div>
      )}
      <pre className="p-4 overflow-x-auto">
        <code className={`text-sm font-mono language-${lang}`}>
          {lines.map((line, i) => (
            <div
              key={i}
              className={`${
                highlight.includes(i + 1)
                  ? 'bg-indigo-100 dark:bg-indigo-900/30 -mx-4 px-4'
                  : ''
              }`}
            >
              {line}
            </div>
          ))}
        </code>
      </pre>
    </div>
  );
};

export default VercelAnalyticsGuide;
