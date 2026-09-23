import { useAppStore } from '../../store/useAppStore';

export function FloorsPanel() {
  const { building, updateBuilding } = useAppStore();

  const toggleFloorVisibility = (floorId: string) => {
    const newFloors = building.floors.map(f =>
      f.id === floorId ? { ...f, visible: !f.visible } : f
    );
    updateBuilding({ floors: newFloors });
  };

  const showAllFloors = () => {
    const newFloors = building.floors.map(f => ({ ...f, visible: true }));
    updateBuilding({ floors: newFloors });
  };

  const hideAllFloors = () => {
    const newFloors = building.floors.map(f => ({ ...f, visible: false }));
    updateBuilding({ floors: newFloors });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Floor Controls</h3>

      <div className="flex gap-2">
        <button
          onClick={showAllFloors}
          className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm transition-colors"
        >
          Show All
        </button>
        <button
          onClick={hideAllFloors}
          className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
        >
          Hide All
        </button>
      </div>

      <div className="space-y-2">
        {building.floors.map((floor) => (
          <div
            key={floor.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-colors ${
              floor.visible
                ? 'bg-blue-900/30 border-blue-500/50'
                : 'bg-gray-800/50 border-gray-600/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${floor.visible ? 'bg-blue-400' : 'bg-gray-500'}`} />
              <div>
                <p className="text-sm font-medium text-white">
                  Floor {floor.level === 0 ? 'Ground' : floor.level}
                </p>
                <p className="text-xs text-gray-400">
                  Height: {floor.height}m | Y: {(floor.level * building.floorHeight).toFixed(1)}m
                </p>
              </div>
            </div>
            <button
              onClick={() => toggleFloorVisibility(floor.id)}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                floor.visible
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-600 hover:bg-gray-500 text-gray-200'
              }`}
            >
              {floor.visible ? 'Visible' : 'Hidden'}
            </button>
          </div>
        ))}
      </div>

      <div className="bg-gray-700/30 rounded-lg p-3">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Building Stats</h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-gray-400">Total Floors:</div>
          <div className="text-white">{building.numberOfFloors}</div>
          <div className="text-gray-400">Total Height:</div>
          <div className="text-white">{(building.numberOfFloors * building.floorHeight).toFixed(1)}m</div>
          <div className="text-gray-400">Total Walls:</div>
          <div className="text-white">{building.walls.length}</div>
          <div className="text-gray-400">Total Windows:</div>
          <div className="text-white">{building.windows.length}</div>
          <div className="text-gray-400">Total Doors:</div>
          <div className="text-white">{building.doors.length}</div>
          <div className="text-gray-400">Total Rooms:</div>
          <div className="text-white">{building.rooms.length}</div>
        </div>
      </div>
    </div>
  );
}
