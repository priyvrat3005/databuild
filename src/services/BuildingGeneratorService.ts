import { v4 as uuidv4 } from 'uuid';
import {
  BuildingSpec,
  Floor,
  Wall,
  Door,
  Window,
  Room,
  Stairs,
  Balcony,
  Roof,
  Material,
} from '../types';

const DEFAULT_MATERIALS: Material[] = [
  { id: 'mat-concrete', name: 'Concrete', color: '#a0a0a0', roughness: 0.9, metalness: 0.1, opacity: 1 },
  { id: 'mat-brick', name: 'Brick', color: '#8B4513', roughness: 0.8, metalness: 0.05, opacity: 1 },
  { id: 'mat-wood', name: 'Wood', color: '#DEB887', roughness: 0.7, metalness: 0.0, opacity: 1 },
  { id: 'mat-glass', name: 'Glass', color: '#87CEEB', roughness: 0.1, metalness: 0.3, opacity: 0.4 },
  { id: 'mat-metal', name: 'Metal', color: '#708090', roughness: 0.3, metalness: 0.9, opacity: 1 },
  { id: 'mat-white', name: 'White Plaster', color: '#F5F5F5', roughness: 0.6, metalness: 0.0, opacity: 1 },
  { id: 'mat-roof', name: 'Roof Tile', color: '#4A4A4A', roughness: 0.8, metalness: 0.1, opacity: 1 },
  { id: 'mat-door', name: 'Door Wood', color: '#654321', roughness: 0.6, metalness: 0.0, opacity: 1 },
];

export class BuildingGeneratorService {
  static generateDefault(): BuildingSpec {
    return this.generateBuilding({
      name: 'My Building',
      description: 'A default building',
      numberOfFloors: 2,
      floorHeight: 3,
      width: 12,
      depth: 10,
      wallThickness: 0.3,
      roomsPerFloor: 3,
      roofType: 'gable' as const,
      hasBalconies: false,
    });
  }

  static generateBuilding(config: {
    name: string;
    description: string;
    numberOfFloors: number;
    floorHeight: number;
    width: number;
    depth: number;
    wallThickness: number;
    roomsPerFloor: number;
    roofType: 'flat' | 'gable' | 'hip' | 'shed' | 'mansard';
    hasBalconies: boolean;
  }): BuildingSpec {
    const { name, description, numberOfFloors, floorHeight, width, depth, wallThickness, roomsPerFloor, roofType, hasBalconies } = config;

    const floors: Floor[] = [];
    const walls: Wall[] = [];
    const doors: Door[] = [];
    const windows: Window[] = [];
    const rooms: Room[] = [];
    const stairs: Stairs[] = [];
    const balconies: Balcony[] = [];

    // Generate floors
    for (let i = 0; i < numberOfFloors; i++) {
      floors.push({
        id: uuidv4(),
        level: i,
        height: floorHeight,
        rooms: [],
        visible: true,
      });
    }

    // Generate walls for each floor
    for (let i = 0; i < numberOfFloors; i++) {
      const baseY = i * floorHeight;
      const floorId = floors[i].id;

      // Front wall
      walls.push({
        id: uuidv4(),
        position: { x: 0, y: baseY + floorHeight / 2, z: depth / 2 },
        dimensions: { width: width, height: floorHeight, thickness: wallThickness },
        rotation: 0,
        materialId: 'mat-white',
        floorId,
      });

      // Back wall
      walls.push({
        id: uuidv4(),
        position: { x: 0, y: baseY + floorHeight / 2, z: -depth / 2 },
        dimensions: { width: width, height: floorHeight, thickness: wallThickness },
        rotation: 0,
        materialId: 'mat-white',
        floorId,
      });

      // Left wall
      walls.push({
        id: uuidv4(),
        position: { x: -width / 2, y: baseY + floorHeight / 2, z: 0 },
        dimensions: { width: depth, height: floorHeight, thickness: wallThickness },
        rotation: Math.PI / 2,
        materialId: 'mat-white',
        floorId,
      });

      // Right wall
      walls.push({
        id: uuidv4(),
        position: { x: width / 2, y: baseY + floorHeight / 2, z: 0 },
        dimensions: { width: depth, height: floorHeight, thickness: wallThickness },
        rotation: Math.PI / 2,
        materialId: 'mat-white',
        floorId,
      });

      // Generate rooms for this floor
      const roomWidth = width / Math.ceil(Math.sqrt(roomsPerFloor));
      const roomDepth = depth / Math.ceil(roomsPerFloor / Math.ceil(Math.sqrt(roomsPerFloor)));
      const cols = Math.ceil(Math.sqrt(roomsPerFloor));
      const rows = Math.ceil(roomsPerFloor / cols);

      const roomNames = ['Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'Office', 'Dining Room', 'Hallway', 'Storage'];

      for (let r = 0; r < roomsPerFloor; r++) {
        const col = r % cols;
        const row = Math.floor(r / cols);
        const roomX = -width / 2 + roomWidth / 2 + col * roomWidth;
        const roomZ = -depth / 2 + roomDepth / 2 + row * roomDepth;

        const room: Room = {
          id: uuidv4(),
          name: roomNames[r % roomNames.length],
          position: { x: roomX, y: baseY + 0.05, z: roomZ },
          dimensions: { width: roomWidth - wallThickness, depth: roomDepth - wallThickness, height: floorHeight },
          floorId,
          color: `hsl(${(r * 60 + i * 120) % 360}, 30%, 85%)`,
        };
        rooms.push(room);
      }

      // Generate doors (one per floor for entrance/internal)
      if (i === 0) {
        doors.push({
          id: uuidv4(),
          position: { x: 0, y: baseY + 1.1, z: depth / 2 + 0.01 },
          dimensions: { width: 1.0, height: 2.2 },
          rotation: 0,
          materialId: 'mat-door',
          wallId: walls[walls.length - 4].id,
          floorId,
        });
      }

      // Internal doors between rooms
      if (roomsPerFloor > 1) {
        for (let r = 1; r < Math.min(roomsPerFloor, 3); r++) {
          doors.push({
            id: uuidv4(),
            position: { x: -width / 2 + (r * width) / roomsPerFloor, y: baseY + 1.1, z: 0 },
            dimensions: { width: 0.9, height: 2.1 },
            rotation: Math.PI / 2,
            materialId: 'mat-door',
            wallId: walls[walls.length - 1].id,
            floorId,
          });
        }
      }

      // Generate windows on front and back walls
      const windowCount = Math.max(2, Math.floor(width / 4));
      for (let w = 0; w < windowCount; w++) {
        const windowX = -width / 2 + (w + 1) * (width / (windowCount + 1));

        // Front windows
        windows.push({
          id: uuidv4(),
          position: { x: windowX, y: baseY + floorHeight * 0.6, z: depth / 2 + 0.01 },
          dimensions: { width: 1.2, height: 1.4 },
          rotation: 0,
          materialId: 'mat-glass',
          wallId: walls[walls.length - 4].id,
          floorId,
        });

        // Back windows
        windows.push({
          id: uuidv4(),
          position: { x: windowX, y: baseY + floorHeight * 0.6, z: -depth / 2 - 0.01 },
          dimensions: { width: 1.2, height: 1.4 },
          rotation: 0,
          materialId: 'mat-glass',
          wallId: walls[walls.length - 3].id,
          floorId,
        });
      }

      // Side windows
      const sideWindowCount = Math.max(1, Math.floor(depth / 5));
      for (let w = 0; w < sideWindowCount; w++) {
        const windowZ = -depth / 2 + (w + 1) * (depth / (sideWindowCount + 1));

        windows.push({
          id: uuidv4(),
          position: { x: -width / 2 - 0.01, y: baseY + floorHeight * 0.6, z: windowZ },
          dimensions: { width: 1.0, height: 1.2 },
          rotation: Math.PI / 2,
          materialId: 'mat-glass',
          wallId: walls[walls.length - 2].id,
          floorId,
        });

        windows.push({
          id: uuidv4(),
          position: { x: width / 2 + 0.01, y: baseY + floorHeight * 0.6, z: windowZ },
          dimensions: { width: 1.0, height: 1.2 },
          rotation: Math.PI / 2,
          materialId: 'mat-glass',
          wallId: walls[walls.length - 1].id,
          floorId,
        });
      }
    }

    // Generate stairs
    if (numberOfFloors > 1) {
      stairs.push({
        id: uuidv4(),
        position: { x: width / 2 - 1.5, y: 0, z: -depth / 2 + 1.5 },
        steps: numberOfFloors * 10,
        stepHeight: floorHeight / 10,
        stepWidth: 1.2,
        stepDepth: 0.28,
        rotation: 0,
        materialId: 'mat-wood',
        fromFloor: 0,
        toFloor: numberOfFloors - 1,
      });
    }

    // Generate balconies
    if (hasBalconies && numberOfFloors > 1) {
      for (let i = 1; i < numberOfFloors; i++) {
        balconies.push({
          id: uuidv4(),
          position: { x: 0, y: i * floorHeight, z: depth / 2 + 1 },
          dimensions: { width: 4, depth: 2, height: 0.15 },
          rotation: 0,
          materialId: 'mat-concrete',
          floorId: floors[i].id,
          hasRailing: true,
        });
      }
    }

    // Generate roof
    const roof: Roof = {
      id: uuidv4(),
      type: roofType,
      height: roofType === 'flat' ? 0.3 : 3,
      materialId: 'mat-roof',
      overhang: 0.5,
    };

    return {
      name,
      description,
      dimensions: { width, depth, height: numberOfFloors * floorHeight },
      numberOfFloors,
      floorHeight,
      wallThickness,
      floors,
      walls,
      doors,
      windows,
      rooms,
      stairs,
      balconies,
      roof,
      materials: [...DEFAULT_MATERIALS],
    };
  }
}
