
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PluginView from './pages/PluginView';
import ClassView from './pages/ClassView';

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="plugin/:pluginName" element={<PluginView />} />
          <Route path="plugin/:pluginName/v/:versionId" element={<PluginView />} />
          <Route path="plugin/:pluginName/class/:className" element={<ClassView />} />
          <Route path="plugin/:pluginName/class/:className/v/:versionId" element={<ClassView />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
