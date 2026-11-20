import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Layout from './components/Layout';
import Home from './pages/Home';
import McpPage from './pages/McpPage';
import PluginView from './pages/PluginView';
import ClassView from './pages/ClassView';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="mcp" element={<McpPage />} />
          <Route path="plugin/:pluginName" element={<PluginView />} />
          <Route path="plugin/:pluginName/v/:versionId" element={<PluginView />} />
          <Route path="plugin/:pluginName/class/:className" element={<ClassView />} />
          <Route path="plugin/:pluginName/class/:className/v/:versionId" element={<ClassView />} />
        </Route>
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;
