import { useAppStore } from '../../store/useAppStore';

export function MaterialsPanel() {
  const { building, updateBuilding } = useAppStore();

  const handleColorChange = (materialId: string, color: string) => {
    const newMaterials = building.materials.map(m =>
      m.id === materialId ? { ...m, color } : m
    );
    updateBuilding({ materials: newMaterials });
  };

  const handleRoughnessChange = (materialId: string, roughness: number) => {
    const newMaterials = building.materials.map(m =>
      m.id === materialId ? { ...m, roughness } : m
    );
    updateBuilding({ materials: newMaterials });
  };

  const handleMetalnessChange = (materialId: string, metalness: number) => {
    const newMaterials = building.materials.map(m =>
      m.id === materialId ? { ...m, metalness } : m
    );
    updateBuilding({ materials: newMaterials });
  };

  const handleOpacityChange = (materialId: string, opacity: number) => {
    const newMaterials = building.materials.map(m =>
      m.id === materialId ? { ...m, opacity } : m
    );
    updateBuilding({ materials: newMaterials });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Materials</h3>

      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
        {building.materials.map((mat) => (
          <div key={mat.id} className="bg-gray-700/50 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">{mat.name}</span>
              <input
                type="color"
                value={mat.color}
                onChange={(e) => handleColorChange(mat.id, e.target.value)}
                className="w-8 h-8 rounded cursor-pointer border border-gray-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Roughness</label>
                <span className="text-xs text-gray-400">{mat.roughness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={mat.roughness}
                onChange={(e) => handleRoughnessChange(mat.id, parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Metalness</label>
                <span className="text-xs text-gray-400">{mat.metalness.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={mat.metalness}
                onChange={(e) => handleMetalnessChange(mat.id, parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs text-gray-400">Opacity</label>
                <span className="text-xs text-gray-400">{mat.opacity.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={mat.opacity}
                onChange={(e) => handleOpacityChange(mat.id, parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
