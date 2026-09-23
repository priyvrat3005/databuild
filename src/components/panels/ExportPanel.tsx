import { useAppStore } from '../../store/useAppStore';
import { ExportService } from '../../services/ExportService';
import { ExportFormat } from '../../types';
import { useState } from 'react';

export function ExportPanel() {
  const { building, saveProject } = useAppStore();
  const [projectName, setProjectName] = useState(building.name);
  const [exporting, setExporting] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setExporting(true);
    try {
      await ExportService.exportBuilding(building, format);
    } catch (err) {
      console.error('Export failed:', err);
    }
    setExporting(false);
  };

  const handleSave = () => {
    saveProject(projectName);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportOptions: { format: ExportFormat; label: string; icon: string; description: string }[] = [
    { format: 'glb', label: 'GLB', icon: '📦', description: 'Binary glTF - best for 3D viewers' },
    { format: 'gltf', label: 'GLTF', icon: '📄', description: 'JSON glTF - human readable' },
    { format: 'obj', label: 'OBJ', icon: '🔷', description: 'Wavefront OBJ - universal format' },
    { format: 'json', label: 'JSON', icon: '📋', description: 'Building specification data' },
    { format: 'png', label: 'PNG', icon: '🖼️', description: 'Screenshot of current view' },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Export & Save</h3>

      {/* Save Project */}
      <div className="bg-gray-700/50 rounded-lg p-3 space-y-2">
        <label className="text-sm text-gray-300">Project Name</label>
        <input
          type="text"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
        />
        <button
          onClick={handleSave}
          className={`w-full py-2 rounded font-medium text-sm transition-all ${
            saved
              ? 'bg-green-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {saved ? '✓ Saved!' : '💾 Save Project'}
        </button>
      </div>

      {/* Export Options */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-gray-300">Export Formats</h4>
        {exportOptions.map(({ format, label, icon, description }) => (
          <button
            key={format}
            onClick={() => handleExport(format)}
            disabled={exporting}
            className="w-full flex items-center gap-3 p-3 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600 rounded-lg transition-colors text-left disabled:opacity-50"
          >
            <span className="text-2xl">{icon}</span>
            <div>
              <p className="text-sm font-medium text-white">{label}</p>
              <p className="text-xs text-gray-400">{description}</p>
            </div>
          </button>
        ))}
      </div>

      {exporting && (
        <div className="text-center py-2">
          <div className="animate-spin w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full mx-auto" />
          <p className="text-xs text-gray-400 mt-1">Exporting...</p>
        </div>
      )}
    </div>
  );
}
