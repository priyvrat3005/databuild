import { useState, useCallback } from 'react';
import { Dashboard } from './pages/Dashboard';
import { Editor } from './pages/Editor';
import { useAppStore } from './store/useAppStore';

type Page = 'dashboard' | 'editor';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { loadProject } = useAppStore();

  const handleOpenEditor = useCallback(() => {
    setCurrentPage('editor');
  }, []);

  const handleBackToDashboard = useCallback(() => {
    setCurrentPage('dashboard');
  }, []);

  const handleLoadProject = useCallback((id: string) => {
    loadProject(id);
  }, [loadProject]);

  if (currentPage === 'editor') {
    return <Editor onBack={handleBackToDashboard} />;
  }

  return (
    <Dashboard
      onOpenEditor={handleOpenEditor}
      onLoadProject={handleLoadProject}
    />
  );
}

export default App;
