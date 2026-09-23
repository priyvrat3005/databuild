import { useAppStore } from '../store/useAppStore';
import { BuildingPanel } from './panels/BuildingPanel';
import { MaterialsPanel } from './panels/MaterialsPanel';
import { FloorsPanel } from './panels/FloorsPanel';
import { ExportPanel } from './panels/ExportPanel';
import { AIPanel } from './panels/AIPanel';

type PanelType = 'building' | 'materials' | 'export' | 'ai' | 'floors';

const tabs: { id: PanelType; label: string; icon: string }[] = [
  { id: 'building', label: 'Building', icon: '🏢' },
  { id: 'ai', label: 'AI Gen', icon: '🤖' },
  { id: 'floors', label: 'Floors', icon: '📐' },
  { id: 'materials', label: 'Materials', icon: '🎨' },
  { id: 'export', label: 'Export', icon: '📤' },
];

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, activePanel, setActivePanel } = useAppStore();

  if (!sidebarOpen) {
    return (
      <div className="flex flex-col items-center py-2 px-1 bg-gray-900/95 border-r border-gray-700">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 rounded hover:bg-gray-700 text-gray-300 transition-colors mb-2"
          title="Open Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActivePanel(tab.id); setSidebarOpen(true); }}
            className="p-2 rounded hover:bg-gray-700 text-lg transition-colors"
            title={tab.label}
          >
            {tab.icon}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex bg-gray-900/95 border-r border-gray-700 backdrop-blur-sm">
      {/* Tab Icons */}
      <div className="flex flex-col items-center py-2 px-1 border-r border-gray-700">
        <button
          onClick={() => setSidebarOpen(false)}
          className="p-2 rounded hover:bg-gray-700 text-gray-300 transition-colors mb-2"
          title="Close Sidebar"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActivePanel(tab.id)}
            className={`p-2 rounded transition-colors mb-1 ${
              activePanel === tab.id
                ? 'bg-blue-600/30 text-white'
                : 'hover:bg-gray-700 text-gray-400'
            }`}
            title={tab.label}
          >
            <span className="text-lg">{tab.icon}</span>
          </button>
        ))}
      </div>

      {/* Panel Content */}
      <div className="w-72 overflow-y-auto p-4">
        {activePanel === 'building' && <BuildingPanel />}
        {activePanel === 'ai' && <AIPanel />}
        {activePanel === 'floors' && <FloorsPanel />}
        {activePanel === 'materials' && <MaterialsPanel />}
        {activePanel === 'export' && <ExportPanel />}
      </div>
    </div>
  );
}
