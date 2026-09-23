import { useMemo } from 'react';
import * as THREE from 'three';
import { useAppStore } from '../store/useAppStore';
import { BuildingSpec, Material as BuildingMaterial } from '../types';

function getMaterial(materials: BuildingMaterial[], materialId: string, wireframe: boolean): THREE.MeshStandardMaterial {
  const mat = materials.find(m => m.id === materialId);
  if (!mat) return new THREE.MeshStandardMaterial({ color: '#cccccc', wireframe });
  return new THREE.MeshStandardMaterial({
    color: mat.color,
    roughness: mat.roughness,
    metalness: mat.metalness,
    transparent: mat.opacity < 1,
    opacity: mat.opacity,
    wireframe,
    side: THREE.DoubleSide,
  });
}

interface BuildingModelProps {
  wireframe: boolean;
}

export function BuildingModel({ wireframe }: BuildingModelProps) {
  const building = useAppStore((s) => s.building);
  const editor = useAppStore((s) => s.editor);

  const visibleFloors = useMemo(() => {
    return building.floors.filter(f => f.visible);
  }, [building.floors]);

  const visibleFloorIds = useMemo(() => {
    return new Set(visibleFloors.map(f => f.id));
  }, [visibleFloors]);

  return (
    <group>
      {/* Floor Slabs */}
      {building.floors.map((floor) => (
        floor.visible && (
          <mesh
            key={`floor-${floor.id}`}
            position={[0, floor.level * building.floorHeight, 0]}
            receiveShadow
            castShadow
          >
            <boxGeometry args={[building.dimensions.width, 0.2, building.dimensions.depth]} />
            <meshStandardMaterial color="#e0e0e0" roughness={0.8} wireframe={wireframe} />
          </mesh>
        )
      ))}

      {/* Walls */}
      {building.walls
        .filter(w => visibleFloorIds.has(w.floorId))
        .map((wall) => (
          <mesh
            key={`wall-${wall.id}`}
            position={[wall.position.x, wall.position.y, wall.position.z]}
            rotation={[0, wall.rotation, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[wall.dimensions.width, wall.dimensions.height, wall.dimensions.thickness]} />
            <meshStandardMaterial
              {...getMaterial(building.materials, wall.materialId, wireframe)}
            />
          </mesh>
        ))}

      {/* Doors */}
      {building.doors
        .filter(d => visibleFloorIds.has(d.floorId))
        .map((door) => (
          <mesh
            key={`door-${door.id}`}
            position={[door.position.x, door.position.y, door.position.z]}
            rotation={[0, door.rotation, 0]}
            castShadow
          >
            <boxGeometry args={[door.dimensions.width, door.dimensions.height, 0.08]} />
            <meshStandardMaterial color="#654321" roughness={0.6} wireframe={wireframe} />
          </mesh>
        ))}

      {/* Windows */}
      {building.windows
        .filter(w => visibleFloorIds.has(w.floorId))
        .map((win) => (
          <group
            key={`window-${win.id}`}
            position={[win.position.x, win.position.y, win.position.z]}
            rotation={[0, win.rotation, 0]}
          >
            {/* Glass */}
            <mesh>
              <boxGeometry args={[win.dimensions.width, win.dimensions.height, 0.03]} />
              <meshStandardMaterial
                color="#87CEEB"
                transparent
                opacity={0.4}
                roughness={0.1}
                metalness={0.3}
                wireframe={wireframe}
              />
            </mesh>
            {/* Frame */}
            <mesh position={[0, win.dimensions.height / 2, 0]}>
              <boxGeometry args={[win.dimensions.width + 0.06, 0.04, 0.06]} />
              <meshStandardMaterial color="#333" wireframe={wireframe} />
            </mesh>
            <mesh position={[0, -win.dimensions.height / 2, 0]}>
              <boxGeometry args={[win.dimensions.width + 0.06, 0.04, 0.06]} />
              <meshStandardMaterial color="#333" wireframe={wireframe} />
            </mesh>
            <mesh position={[-win.dimensions.width / 2, 0, 0]}>
              <boxGeometry args={[0.04, win.dimensions.height, 0.06]} />
              <meshStandardMaterial color="#333" wireframe={wireframe} />
            </mesh>
            <mesh position={[win.dimensions.width / 2, 0, 0]}>
              <boxGeometry args={[0.04, win.dimensions.height, 0.06]} />
              <meshStandardMaterial color="#333" wireframe={wireframe} />
            </mesh>
          </group>
        ))}

      {/* Rooms (floor planes) */}
      {building.rooms
        .filter(r => visibleFloorIds.has(r.floorId))
        .map((room) => (
          <mesh
            key={`room-${room.id}`}
            position={[room.position.x, room.position.y, room.position.z]}
            rotation={[-Math.PI / 2, 0, 0]}
            receiveShadow
          >
            <planeGeometry args={[room.dimensions.width, room.dimensions.depth]} />
            <meshStandardMaterial color={room.color} roughness={0.9} wireframe={wireframe} side={THREE.DoubleSide} />
          </mesh>
        ))}

      {/* Stairs */}
      {building.stairs.map((stair) => (
        <group key={`stairs-${stair.id}`}>
          {Array.from({ length: stair.steps }).map((_, i) => (
            <mesh
              key={`step-${i}`}
              position={[
                stair.position.x,
                stair.position.y + i * stair.stepHeight + stair.stepHeight / 2,
                stair.position.z + i * stair.stepDepth,
              ]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[stair.stepWidth, stair.stepHeight, stair.stepDepth]} />
              <meshStandardMaterial color="#DEB887" roughness={0.7} wireframe={wireframe} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Balconies */}
      {building.balconies
        .filter(b => visibleFloorIds.has(b.floorId))
        .map((balcony) => (
          <group
            key={`balcony-${balcony.id}`}
            position={[balcony.position.x, balcony.position.y, balcony.position.z]}
          >
            {/* Floor */}
            <mesh castShadow receiveShadow>
              <boxGeometry args={[balcony.dimensions.width, balcony.dimensions.height, balcony.dimensions.depth]} />
              <meshStandardMaterial color="#a0a0a0" roughness={0.8} wireframe={wireframe} />
            </mesh>
            {/* Railing */}
            {balcony.hasRailing && (
              <>
                {/* Front rail */}
                <mesh position={[0, 0.5, balcony.dimensions.depth / 2]}>
                  <boxGeometry args={[balcony.dimensions.width, 0.05, 0.05]} />
                  <meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} wireframe={wireframe} />
                </mesh>
                {/* Posts */}
                {Array.from({ length: Math.floor(balcony.dimensions.width / 0.4) + 1 }).map((_, i) => (
                  <mesh
                    key={`post-${i}`}
                    position={[
                      -balcony.dimensions.width / 2 + i * (balcony.dimensions.width / Math.floor(balcony.dimensions.width / 0.4)),
                      0.25,
                      balcony.dimensions.depth / 2,
                    ]}
                  >
                    <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
                    <meshStandardMaterial color="#444" metalness={0.8} roughness={0.3} wireframe={wireframe} />
                  </mesh>
                ))}
              </>
            )}
          </group>
        ))}

      {/* Roof */}
      <RoofComponent building={building} wireframe={wireframe} />

      {/* Selection highlight */}
      {editor.selectedObjectId && (
        <SelectionHighlight building={building} selectedId={editor.selectedObjectId} />
      )}
    </group>
  );
}

function RoofComponent({ building, wireframe }: { building: BuildingSpec; wireframe: boolean }) {
  const roof = building.roof;
  const buildingHeight = building.numberOfFloors * building.floorHeight;
  const mat = building.materials.find(m => m.id === roof.materialId);
  const color = mat?.color || '#4A4A4A';

  switch (roof.type) {
    case 'flat':
      return (
        <mesh position={[0, buildingHeight + roof.height / 2, 0]} castShadow>
          <boxGeometry args={[
            building.dimensions.width + roof.overhang * 2,
            roof.height,
            building.dimensions.depth + roof.overhang * 2
          ]} />
          <meshStandardMaterial color={color} roughness={0.8} wireframe={wireframe} />
        </mesh>
      );
    case 'gable':
      return <GableRoof building={building} wireframe={wireframe} color={color} />;
    case 'hip':
      return (
        <mesh position={[0, buildingHeight + roof.height / 2, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[
            Math.max(building.dimensions.width, building.dimensions.depth) / 2 + roof.overhang,
            roof.height,
            4
          ]} />
          <meshStandardMaterial color={color} roughness={0.8} wireframe={wireframe} />
        </mesh>
      );
    case 'shed':
      return <ShedRoof building={building} wireframe={wireframe} color={color} />;
    case 'mansard':
      return <MansardRoof building={building} wireframe={wireframe} color={color} />;
    default:
      return null;
  }
}

function GableRoof({ building, wireframe, color }: { building: BuildingSpec; wireframe: boolean; color: string }) {
  const roof = building.roof;
  const buildingHeight = building.numberOfFloors * building.floorHeight;
  const hw = (building.dimensions.width + roof.overhang * 2) / 2;
  const depth = building.dimensions.depth + roof.overhang * 2;

  const shape = new THREE.Shape();
  shape.moveTo(-hw, 0);
  shape.lineTo(0, roof.height);
  shape.lineTo(hw, 0);
  shape.lineTo(-hw, 0);

  const extrudeSettings = { depth, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  return (
    <mesh geometry={geometry} position={[0, buildingHeight, -depth / 2]} castShadow>
      <meshStandardMaterial color={color} roughness={0.8} wireframe={wireframe} />
    </mesh>
  );
}

function ShedRoof({ building, wireframe, color }: { building: BuildingSpec; wireframe: boolean; color: string }) {
  const roof = building.roof;
  const buildingHeight = building.numberOfFloors * building.floorHeight;
  const hw = (building.dimensions.width + roof.overhang * 2) / 2;
  const depth = building.dimensions.depth + roof.overhang * 2;

  const shape = new THREE.Shape();
  shape.moveTo(-hw, 0);
  shape.lineTo(hw, roof.height);
  shape.lineTo(hw, 0);
  shape.lineTo(-hw, 0);

  const extrudeSettings = { depth, bevelEnabled: false };
  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

  return (
    <mesh geometry={geometry} position={[0, buildingHeight, -depth / 2]} castShadow>
      <meshStandardMaterial color={color} roughness={0.8} wireframe={wireframe} />
    </mesh>
  );
}

function MansardRoof({ building, wireframe, color }: { building: BuildingSpec; wireframe: boolean; color: string }) {
  const roof = building.roof;
  const buildingHeight = building.numberOfFloors * building.floorHeight;
  const lowerH = roof.height * 0.7;
  const upperH = roof.height * 0.3;

  return (
    <group>
      <mesh position={[0, buildingHeight + lowerH / 2, 0]} castShadow>
        <boxGeometry args={[
          building.dimensions.width + roof.overhang * 2,
          lowerH,
          building.dimensions.depth + roof.overhang * 2
        ]} />
        <meshStandardMaterial color={color} roughness={0.8} wireframe={wireframe} />
      </mesh>
      <mesh position={[0, buildingHeight + lowerH + upperH / 2, 0]} castShadow>
        <boxGeometry args={[
          building.dimensions.width * 0.7,
          upperH,
          building.dimensions.depth * 0.7
        ]} />
        <meshStandardMaterial color={color} roughness={0.8} wireframe={wireframe} />
      </mesh>
    </group>
  );
}

function SelectionHighlight({ building, selectedId }: { building: BuildingSpec; selectedId: string }) {
  // Find the object and show a highlight box
  const wall = building.walls.find(w => w.id === selectedId);
  const door = building.doors.find(d => d.id === selectedId);
  const win = building.windows.find(w => w.id === selectedId);

  let position: [number, number, number] | null = null;
  let size: [number, number, number] | null = null;

  if (wall) {
    position = [wall.position.x, wall.position.y, wall.position.z];
    size = [wall.dimensions.width + 0.1, wall.dimensions.height + 0.1, wall.dimensions.thickness + 0.1];
  } else if (door) {
    position = [door.position.x, door.position.y, door.position.z];
    size = [door.dimensions.width + 0.1, door.dimensions.height + 0.1, 0.2];
  } else if (win) {
    position = [win.position.x, win.position.y, win.position.z];
    size = [win.dimensions.width + 0.1, win.dimensions.height + 0.1, 0.2];
  }

  if (!position || !size) return null;

  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshBasicMaterial color="#00ffff" transparent opacity={0.3} wireframe />
    </mesh>
  );
}
