import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAppStore } from './stores/appStore';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Assets } from './pages/Assets';
import { AssetDetail } from './pages/AssetDetail';
import { Research } from './pages/Research';
import { Workspace } from './pages/Workspace';
import { Settings } from './pages/Settings';
import { Launch } from './pages/Launch';
import { WorkLauncher } from './pages/WorkLauncher';
import { Analyze } from './pages/Analyze';
import { Contracts } from './pages/Contracts';
import { Library } from './pages/Library';
import { Projects } from './pages/Projects';
import { HEORModelBuilder } from './pages/HEOR';
import { DataCatalog } from './pages/DataCatalog';
import { AuditLog } from './pages/AuditLog';
import { Billing } from './pages/Billing';
import { Onboarding } from './pages/Onboarding';
import { MarketResearch } from './pages/MarketResearch';
import { APIDocumentation } from './pages/APIDocs';
import { MobileApp } from './pages/MobileApp';
import { Placeholder } from './pages/Placeholder';
import { ProjectDetail } from './pages/ProjectDetail';

function App() {
  const { settings } = useAppStore();

  useEffect(() => {
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="assets" element={<Assets />} />
          <Route path="assets/:id" element={<AssetDetail />} />
          <Route path="research" element={<Research />} />
          <Route path="workspace" element={<Workspace />} />
          <Route path="settings" element={<Settings />} />
          <Route path="work" element={<WorkLauncher />} />
          <Route path="launch" element={<Launch />} />
          <Route path="analyze" element={<Analyze />} />
          <Route path="contracts" element={<Contracts />} />
          <Route path="library" element={<Library />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="heor" element={<HEORModelBuilder />} />
          <Route path="data" element={<DataCatalog />} />
          <Route path="audit" element={<AuditLog />} />
          <Route path="billing" element={<Billing />} />
          <Route path="onboarding" element={<Onboarding />} />
          <Route path="market-research" element={<MarketResearch />} />
          <Route path="api" element={<APIDocumentation />} />
          <Route path="mobile" element={<MobileApp />} />
          <Route path="*" element={<Placeholder title="Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
