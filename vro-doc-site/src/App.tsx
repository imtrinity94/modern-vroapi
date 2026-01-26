
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PluginView from './pages/PluginView';
import ClassView from './pages/ClassView';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="plugin/:pluginName" element={<PluginView />} />
          <Route path="plugin/:pluginName/class/:className" element={<ClassView />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}

export default App;
