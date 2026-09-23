import * as THREE from 'three';
import { BuildingSpec, Wall, Door, Window, Room, Stairs, Balcony, Roof, Material } from '../types';

export class BuildingMeshBuilder {
  static buildScene(building: BuildingSpec): THREE.Group {
    const group = new THREE.Group();
    group.name = 'building';

    // Build floor slabs
    building.floors.forEach((floor) => {
      if (!floor.visible) return;
      const floorSlab = this.buildFloorSlab(building, floor.level, floor.height);
      floorSlab.name = `floor-${floor.level}`;
      group.add(floorSlab);
    });

    // Build walls
    building.walls.forEach((wall) => {
      const floor = building.floors.find(f => f.id === wall.floorId);
      if (floor && !floor.visible) return;
      const wallMesh = this.buildWall(wall, building.materials);
      group.add(wallMesh);
    });

    // Build doors
    building.doors.forEach((door) => {
      const floor = building.floors.find(f => f.id === door.floorId);
      if (floor && !floor.visible) return;
      const doorMesh = this.buildDoor(door, building.materials);
      group.add(doorMesh);
    });

    // Build windows
    building.windows.forEach((win) => {
      const floor = building.floors.find(f => f.id === win.floorId);
      if (floor && !floor.visible) return;
      const windowMesh = this.buildWindow(win, building.materials);
      group.add(windowMesh);
    });

    // Build rooms (floor coloring)
    building.rooms.forEach((room) => {
      const floor = building.floors.find(f => f.id === room.floorId);
      if (floor && !floor.visible) return;
      const roomMesh = this.buildRoom(room);
      group.add(roomMesh);
    });

    // Build stairs
    building.stairs.forEach((stair) => {
      const stairGroup = this.buildStairs(stair, building.materials);
      group.add(stairGroup);
    });

    // Build balconies
    building.balconies.forEach((balcony) => {
      const floor = building.floors.find(f => f.id === balcony.floorId);
      if (floor && !floor.visible) return;
      const balconyMesh = this.buildBalcony(balcony, building.materials);
      group.add(balconyMesh);
    });

    // Build roof
    const roofMesh = this.buildRoof(building.roof, building.dimensions, building.numberOfFloors * building.floorHeight, building.materials);
    group.add(roofMesh);

    return group;
  }

  private static getMaterial(materials: Material[], materialId: string): THREE.MeshStandardMaterial {
    const mat = materials.find(m => m.id === materialId);
    if (!mat) return new THREE.MeshStandardMaterial({ color: '#cccccc' });
    return new THREE.MeshStandardMaterial({
      color: mat.color,
      roughness: mat.roughness,
      metalness: mat.metalness,
      transparent: mat.opacity < 1,
      opacity: mat.opacity,
    });
  }

  private static buildFloorSlab(building: BuildingSpec, level: number, height: number): THREE.Mesh {
    const geometry = new THREE.BoxGeometry(
      building.dimensions.width,
      0.2,
      building.dimensions.depth
    );
    const material = new THREE.MeshStandardMaterial({
      color: '#e0e0e0',
      roughness: 0.8,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, level * height, 0);
    mesh.receiveShadow = true;
    mesh.name = `floor-slab-${level}`;
    return mesh;
  }

  private static buildWall(wall: Wall, materials: Material[]): THREE.Mesh {
    const { width, height, thickness } = wall.dimensions;
    const geometry = new THREE.BoxGeometry(width, height, thickness);
    const material = this.getMaterial(materials, wall.materialId);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(wall.position.x, wall.position.y, wall.position.z);
    mesh.rotation.y = wall.rotation;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.name = `wall-${wall.id}`;
    return mesh;
  }

  private static buildDoor(door: Door, materials: Material[]): THREE.Mesh {
    const { width, height } = door.dimensions;
    const geometry = new THREE.BoxGeometry(width, height, 0.08);
    const material = this.getMaterial(materials, door.materialId);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(door.position.x, door.position.y, door.position.z);
    mesh.rotation.y = door.rotation;
    mesh.castShadow = true;
    mesh.name = `door-${door.id}`;
    return mesh;
  }

  private static buildWindow(win: Window, materials: Material[]): THREE.Mesh {
    const { width, height } = win.dimensions;
    const geometry = new THREE.BoxGeometry(width, height, 0.05);
    const material = this.getMaterial(materials, win.materialId);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(win.position.x, win.position.y, win.position.z);
    mesh.rotation.y = win.rotation;
    mesh.name = `window-${win.id}`;

    // Add window frame
    const frameGroup = new THREE.Group();
    frameGroup.add(mesh);

    const frameMat = new THREE.MeshStandardMaterial({ color: '#333333', roughness: 0.5 });
    const frameThickness = 0.05;

    // Top frame
    const topFrame = new THREE.Mesh(
      new THREE.BoxGeometry(width + frameThickness * 2, frameThickness, 0.08),
      frameMat
    );
    topFrame.position.set(0, height / 2, 0);
    frameGroup.add(topFrame);

    // Bottom frame
    const bottomFrame = topFrame.clone();
    bottomFrame.position.set(0, -height / 2, 0);
    frameGroup.add(bottomFrame);

    frameGroup.position.copy(mesh.position);
    frameGroup.rotation.y = win.rotation;
    mesh.position.set(0, 0, 0);

    return frameGroup as unknown as THREE.Mesh;
  }

  private static buildRoom(room: Room): THREE.Mesh {
    const geometry = new THREE.PlaneGeometry(room.dimensions.width, room.dimensions.depth);
    const material = new THREE.MeshStandardMaterial({
      color: room.color,
      roughness: 0.9,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.set(room.position.x, room.position.y, room.position.z);
    mesh.receiveShadow = true;
    mesh.name = `room-${room.id}`;
    return mesh;
  }

  private static buildStairs(stairs: Stairs, materials: Material[]): THREE.Group {
    const group = new THREE.Group();
    const material = this.getMaterial(materials, stairs.materialId);

    for (let i = 0; i < stairs.steps; i++) {
      const stepGeometry = new THREE.BoxGeometry(stairs.stepWidth, stairs.stepHeight, stairs.stepDepth);
      const step = new THREE.Mesh(stepGeometry, material);
      step.position.set(
        stairs.position.x,
        stairs.position.y + i * stairs.stepHeight + stairs.stepHeight / 2,
        stairs.position.z + i * stairs.stepDepth
      );
      step.castShadow = true;
      step.receiveShadow = true;
      group.add(step);
    }

    group.rotation.y = stairs.rotation;
    group.name = `stairs-${stairs.id}`;
    return group;
  }

  private static buildBalcony(balcony: Balcony, materials: Material[]): THREE.Group {
    const group = new THREE.Group();
    const material = this.getMaterial(materials, balcony.materialId);

    // Floor slab
    const floorGeom = new THREE.BoxGeometry(
      balcony.dimensions.width,
      balcony.dimensions.height,
      balcony.dimensions.depth
    );
    const floor = new THREE.Mesh(floorGeom, material);
    floor.position.set(0, 0, 0);
    floor.castShadow = true;
    floor.receiveShadow = true;
    group.add(floor);

    // Railing
    if (balcony.hasRailing) {
      const railMat = new THREE.MeshStandardMaterial({ color: '#444444', metalness: 0.8, roughness: 0.3 });
      const railHeight = 1.0;
      const railThickness = 0.05;

      // Front railing
      const frontRail = new THREE.Mesh(
        new THREE.BoxGeometry(balcony.dimensions.width, railThickness, railThickness),
        railMat
      );
      frontRail.position.set(0, railHeight, balcony.dimensions.depth / 2);
      group.add(frontRail);

      // Side railings
      const leftRail = new THREE.Mesh(
        new THREE.BoxGeometry(railThickness, railThickness, balcony.dimensions.depth),
        railMat
      );
      leftRail.position.set(-balcony.dimensions.width / 2, railHeight, 0);
      group.add(leftRail);

      const rightRail = leftRail.clone();
      rightRail.position.set(balcony.dimensions.width / 2, railHeight, 0);
      group.add(rightRail);

      // Vertical posts
      const postCount = Math.floor(balcony.dimensions.width / 0.5);
      for (let i = 0; i <= postCount; i++) {
        const post = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, railHeight, 8),
          railMat
        );
        post.position.set(
          -balcony.dimensions.width / 2 + i * (balcony.dimensions.width / postCount),
          railHeight / 2,
          balcony.dimensions.depth / 2
        );
        group.add(post);
      }
    }

    group.position.set(balcony.position.x, balcony.position.y, balcony.position.z);
    group.rotation.y = balcony.rotation;
    group.name = `balcony-${balcony.id}`;
    return group;
  }

  private static buildRoof(roof: Roof, dimensions: { width: number; depth: number; height: number }, buildingHeight: number, materials: Material[]): THREE.Group {
    const group = new THREE.Group();
    const material = this.getMaterial(materials, roof.materialId);
    const overhang = roof.overhang;

    switch (roof.type) {
      case 'flat': {
        const geom = new THREE.BoxGeometry(
          dimensions.width + overhang * 2,
          roof.height,
          dimensions.depth + overhang * 2
        );
        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set(0, buildingHeight + roof.height / 2, 0);
        mesh.castShadow = true;
        group.add(mesh);
        break;
      }
      case 'gable': {
        const shape = new THREE.Shape();
        const hw = (dimensions.width + overhang * 2) / 2;
        shape.moveTo(-hw, 0);
        shape.lineTo(0, roof.height);
        shape.lineTo(hw, 0);
        shape.lineTo(-hw, 0);

        const extrudeSettings = {
          depth: dimensions.depth + overhang * 2,
          bevelEnabled: false,
        };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set(0, buildingHeight, -(dimensions.depth + overhang * 2) / 2);
        mesh.castShadow = true;
        group.add(mesh);
        break;
      }
      case 'hip': {
        // Simplified hip roof using a cone-like shape
        const geom = new THREE.ConeGeometry(
          Math.max(dimensions.width, dimensions.depth) / 2 + overhang,
          roof.height,
          4
        );
        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set(0, buildingHeight + roof.height / 2, 0);
        mesh.rotation.y = Math.PI / 4;
        mesh.castShadow = true;
        group.add(mesh);
        break;
      }
      case 'shed': {
        const shape = new THREE.Shape();
        const hw = (dimensions.width + overhang * 2) / 2;
        shape.moveTo(-hw, 0);
        shape.lineTo(hw, roof.height);
        shape.lineTo(hw, 0);
        shape.lineTo(-hw, 0);

        const extrudeSettings = {
          depth: dimensions.depth + overhang * 2,
          bevelEnabled: false,
        };
        const geom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mesh = new THREE.Mesh(geom, material);
        mesh.position.set(0, buildingHeight, -(dimensions.depth + overhang * 2) / 2);
        mesh.castShadow = true;
        group.add(mesh);
        break;
      }
      case 'mansard': {
        // Lower steep part + upper flat part
        const lowerHeight = roof.height * 0.7;
        const upperHeight = roof.height * 0.3;

        const lowerGeom = new THREE.BoxGeometry(
          dimensions.width + overhang * 2,
          lowerHeight,
          dimensions.depth + overhang * 2
        );
        const lower = new THREE.Mesh(lowerGeom, material);
        lower.position.set(0, buildingHeight + lowerHeight / 2, 0);
        lower.castShadow = true;
        group.add(lower);

        const upperGeom = new THREE.BoxGeometry(
          dimensions.width * 0.7,
          upperHeight,
          dimensions.depth * 0.7
        );
        const upper = new THREE.Mesh(upperGeom, material);
        upper.position.set(0, buildingHeight + lowerHeight + upperHeight / 2, 0);
        upper.castShadow = true;
        group.add(upper);
        break;
      }
    }

    group.name = `roof-${roof.id}`;
    return group;
  }
}
