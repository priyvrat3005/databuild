// Domain types for Building3D Studio

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Dimensions {
  width: number;
  depth: number;
  height: number;
}

export interface Material {
  id: string;
  name: string;
  color: string;
  roughness: number;
  metalness: number;
  opacity: number;
}

export interface Wall {
  id: string;
  position: Vector3;
  dimensions: { width: number; height: number; thickness: number };
  rotation: number;
  materialId: string;
  floorId: string;
}

export interface Door {
  id: string;
  position: Vector3;
  dimensions: { width: number; height: number };
  rotation: number;
  materialId: string;
  wallId: string;
  floorId: string;
}

export interface Window {
  id: string;
  position: Vector3;
  dimensions: { width: number; height: number };
  rotation: number;
  materialId: string;
  wallId: string;
  floorId: string;
}

export interface Room {
  id: string;
  name: string;
  position: Vector3;
  dimensions: { width: number; depth: number; height: number };
  floorId: string;
  color: string;
}

export interface Stairs {
  id: string;
  position: Vector3;
  steps: number;
  stepHeight: number;
  stepWidth: number;
  stepDepth: number;
  rotation: number;
  materialId: string;
  fromFloor: number;
  toFloor: number;
}

export interface Balcony {
  id: string;
  position: Vector3;
  dimensions: { width: number; depth: number; height: number };
  rotation: number;
  materialId: string;
  floorId: string;
  hasRailing: boolean;
}

export interface Roof {
  id: string;
  type: 'flat' | 'gable' | 'hip' | 'shed' | 'mansard';
  height: number;
  materialId: string;
  overhang: number;
}

export interface Floor {
  id: string;
  level: number;
  height: number;
  rooms: Room[];
  visible: boolean;
}

export interface BuildingSpec {
  name: string;
  description: string;
  dimensions: Dimensions;
  numberOfFloors: number;
  floorHeight: number;
  wallThickness: number;
  floors: Floor[];
  walls: Wall[];
  doors: Door[];
  windows: Window[];
  rooms: Room[];
  stairs: Stairs[];
  balconies: Balcony[];
  roof: Roof;
  materials: Material[];
}

export interface Project {
  id: string;
  name: string;
  building: BuildingSpec;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
}

export interface EditorState {
  selectedObjectId: string | null;
  selectedObjectType: string | null;
  mode: 'select' | 'move' | 'rotate' | 'scale';
  wireframe: boolean;
  showGrid: boolean;
  showAxes: boolean;
  snapToGrid: boolean;
  gridSize: number;
  cameraMode: 'orbit' | 'first-person';
}

export interface ViewSettings {
  showGrid: boolean;
  showAxes: boolean;
  wireframe: boolean;
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  backgroundColor: string;
}

export type ExportFormat = 'gltf' | 'glb' | 'json' | 'obj' | 'png';
