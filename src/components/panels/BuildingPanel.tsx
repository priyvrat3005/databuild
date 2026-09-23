import { useAppStore } from '../../store/useAppStore';
import { BuildingGeneratorService } from '../../services/BuildingGeneratorService';
import { useState } from 'react';

export function BuildingPanel() {
  const { building, updateBuilding, pushHistory } = useAppStore();
  const [localConfig, setLocalConfig] = useState({
    name: building.name,
    numberOfFloors: building.numberOfFloors,
    floorHeight: building.floorHeight,
    width: building.dimensions.width,
    depth: building.dimensions.depth,
    wallThickness: building.wallThickness,
    roomsPerFloor: Math.max(1, Math.round(building.rooms.length / building.numberOfFloors)),
    roofType: building.roof.type,
    hasBalconies: building.balconies.length > 0,
  });

  const handleRegenerate = () => {
    pushHistory();
    const newBuilding = BuildingGeneratorService.generateBuilding({
      ...localConfig,
      description: building.description,
    });
    updateBuilding(newBuilding);
  };

  const handleChange = (field: string, value: any) => {
    setLocalConfig(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Building Configuration</h3>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Name</label>
        <input
          type="text"
          value={localConfig.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Floors</label>
          <input
            type="number"
            min={1}
            max={20}
            value={localConfig.numberOfFloors}
            onChange={(e) => handleChange('numberOfFloors', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Floor Height</label>
          <input
            type="number"
            min={2}
            max={6}
            step={0.5}
            value={localConfig.floorHeight}
            onChange={(e) => handleChange('floorHeight', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Width (m)</label>
          <input
            type="number"
            min={3}
            max={50}
            value={localConfig.width}
            onChange={(e) => handleChange('width', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Depth (m)</label>
          <input
            type="number"
            min={3}
            max={50}
            value={localConfig.depth}
            onChange={(e) => handleChange('depth', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-300 mb-1">Wall Thickness</label>
          <input
            type="number"
            min={0.1}
            max={1}
            step={0.05}
            value={localConfig.wallThickness}
            onChange={(e) => handleChange('wallThickness', parseFloat(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Rooms/Floor</label>
          <input
            type="number"
            min={1}
            max={8}
            value={localConfig.roomsPerFloor}
            onChange={(e) => handleChange('roomsPerFloor', parseInt(e.target.value))}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-300 mb-1">Roof Type</label>
        <select
          value={localConfig.roofType}
          onChange={(e) => handleChange('roofType', e.target.value)}
          className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white text-sm"
        >
          <option value="flat">Flat</option>
          <option value="gable">Gable</option>
          <option value="hip">Hip</option>
          <option value="shed">Shed</option>
          <option value="mansard">Mansard</option>
        </select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="balconies"
          checked={localConfig.hasBalconies}
          onChange={(e) => handleChange('hasBalconies', e.target.checked)}
          className="rounded"
        />
        <label htmlFor="balconies" className="text-sm text-gray-300">Add Balconies</label>
      </div>

      <button
        onClick={handleRegenerate}
        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-medium transition-colors"
      >
        Regenerate Building
      </button>
    </div>
  );
}
