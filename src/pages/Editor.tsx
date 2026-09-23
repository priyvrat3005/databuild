import { Scene } from '../components/Scene';
import { Toolbar } from '../components/Toolbar';
import { Sidebar } from '../components/Sidebar';

interface EditorProps {
  onBack: () => void;
}

export function Editor({ onBack }: EditorProps) {
  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      {/* Top Toolbar */}
      <div className="flex items-center">
        <button
          onClick={onBack}
          className="p-2 px-3 hover:bg-gray-700 text-gray-300 transition-colors flex items-center gap-1"
          title="Back to Dashboard"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm hidden sm:inline">Dashboard</span>
        </button>
        <div className="flex-1">
          <Toolbar />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* 3D Viewport */}
        <div className="flex-1 relative">
          <Scene />

          {/* Viewport Info Overlay */}
          <div className="absolute bottom-4 left-4 bg-gray-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-gray-700/50">
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>🖱️ Orbit: Left Click</span>
              <span>📏 Pan: Right Click</span>
              <span>🔍 Zoom: Scroll</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
