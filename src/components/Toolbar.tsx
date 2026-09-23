import { useAppStore } from '../store/useAppStore';

export function Toolbar() {
  const { editor, setEditorState, viewSettings, setViewSettings, undo, redo, historyIndex, history } = useAppStore();

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900/95 border-b border-gray-700 backdrop-blur-sm">
      {/* Left: Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">3D</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-sm leading-none">Building3D Studio</h1>
            <p className="text-gray-400 text-xs">3D Building Modeler</p>
          </div>
        </div>
      </div>

      {/* Center: Tools */}
      <div className="flex items-center gap-1">
        {/* Undo/Redo */}
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-2 rounded hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Undo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-2 rounded hover:bg-gray-700 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Redo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H11a8 8 0 00-8 8v2m18-10l-6 6m6-6l-6-6" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* View Controls */}
        <button
          onClick={() => setViewSettings({ wireframe: !viewSettings.wireframe })}
          className={`p-2 rounded transition-colors ${viewSettings.wireframe ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          title="Wireframe Mode"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 12h16M12 4v16" />
          </svg>
        </button>

        <button
          onClick={() => setViewSettings({ showGrid: !viewSettings.showGrid })}
          className={`p-2 rounded transition-colors ${viewSettings.showGrid ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          title="Toggle Grid"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4h16v16H4z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 9h16M4 14h16M9 4v16M14 4v16" />
          </svg>
        </button>

        <button
          onClick={() => setViewSettings({ showAxes: !viewSettings.showAxes })}
          className={`p-2 rounded transition-colors ${viewSettings.showAxes ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          title="Toggle Axes"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 20l8-8m0 0l8-8m-8 8V4m0 16l-4-4m4 4l4-4" />
          </svg>
        </button>

        <div className="w-px h-6 bg-gray-700 mx-2" />

        {/* Editor Modes */}
        {(['select', 'move', 'rotate', 'scale'] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setEditorState({ mode })}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors capitalize ${
              editor.mode === mode
                ? 'bg-blue-600 text-white'
                : 'hover:bg-gray-700 text-gray-300'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Right: Lighting */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400">☀️</span>
          <input
            type="range"
            min={0}
            max={2}
            step={0.1}
            value={viewSettings.directionalLightIntensity}
            onChange={(e) => setViewSettings({ directionalLightIntensity: parseFloat(e.target.value) })}
            className="w-16 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            title="Light Intensity"
          />
        </div>
      </div>
    </div>
  );
}
