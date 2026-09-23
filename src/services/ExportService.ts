import * as THREE from 'three';
import { BuildingSpec, ExportFormat } from '../types';
import { BuildingMeshBuilder } from './BuildingMeshBuilder';

export class ExportService {
  static async exportBuilding(building: BuildingSpec, format: ExportFormat): Promise<void> {
    switch (format) {
      case 'json':
        this.exportJSON(building);
        break;
      case 'png':
        this.exportPNG(building);
        break;
      case 'gltf':
      case 'glb':
        await this.exportGLTF(building, format);
        break;
      case 'obj':
        this.exportOBJ(building);
        break;
    }
  }

  private static exportJSON(building: BuildingSpec): void {
    const json = JSON.stringify(building, null, 2);
    this.downloadFile(json, `${building.name}.json`, 'application/json');
  }

  private static async exportGLTF(building: BuildingSpec, format: 'gltf' | 'glb'): Promise<void> {
    const { GLTFExporter } = await import('three/examples/jsm/exporters/GLTFExporter.js');
    const scene = BuildingMeshBuilder.buildScene(building);
    const exporter = new GLTFExporter();

    exporter.parse(
      scene,
      (result) => {
        if (format === 'glb') {
          const output = result instanceof ArrayBuffer
            ? new Blob([result], { type: 'application/octet-stream' })
            : new Blob([JSON.stringify(result)], { type: 'application/json' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(output);
          link.download = `${building.name}.${format}`;
          link.click();
        } else {
          const output = JSON.stringify(result, null, 2);
          this.downloadFile(output, `${building.name}.gltf`, 'model/gltf+json');
        }
      },
      (error) => {
        console.error('Export error:', error);
      },
      { binary: format === 'glb' }
    );
  }

  private static exportOBJ(building: BuildingSpec): void {
    const scene = BuildingMeshBuilder.buildScene(building);
    let objContent = '# Building3D Studio OBJ Export\n';
    let vertexOffset = 0;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mesh = child;
        const geometry = mesh.geometry;
        const position = geometry.getAttribute('position');
        const normal = geometry.getAttribute('normal');
        const index = geometry.getIndex();

        objContent += `o ${mesh.name || 'object'}\n`;

        // Vertices
        const worldMatrix = mesh.matrixWorld;
        for (let i = 0; i < position.count; i++) {
          const vertex = new THREE.Vector3(
            position.getX(i),
            position.getY(i),
            position.getZ(i)
          );
          vertex.applyMatrix4(worldMatrix);
          objContent += `v ${vertex.x.toFixed(6)} ${vertex.y.toFixed(6)} ${vertex.z.toFixed(6)}\n`;
        }

        // Normals
        if (normal) {
          const normalMatrix = new THREE.Matrix3().getNormalMatrix(worldMatrix);
          for (let i = 0; i < normal.count; i++) {
            const n = new THREE.Vector3(
              normal.getX(i),
              normal.getY(i),
              normal.getZ(i)
            );
            n.applyMatrix3(normalMatrix).normalize();
            objContent += `vn ${n.x.toFixed(6)} ${n.y.toFixed(6)} ${n.z.toFixed(6)}\n`;
          }
        }

        // Faces
        if (index) {
          for (let i = 0; i < index.count; i += 3) {
            const a = index.getX(i) + 1 + vertexOffset;
            const b = index.getX(i + 1) + 1 + vertexOffset;
            const c = index.getX(i + 2) + 1 + vertexOffset;
            objContent += `f ${a}//${a} ${b}//${b} ${c}//${c}\n`;
          }
        } else {
          for (let i = 0; i < position.count; i += 3) {
            const a = i + 1 + vertexOffset;
            const b = i + 2 + vertexOffset;
            const c = i + 3 + vertexOffset;
            objContent += `f ${a}//${a} ${b}//${b} ${c}//${c}\n`;
          }
        }

        vertexOffset += position.count;
      }
    });

    this.downloadFile(objContent, `${building.name}.obj`, 'text/plain');
  }

  private static exportPNG(building: BuildingSpec): void {
    // Trigger screenshot from the canvas
    const canvas = document.querySelector('canvas');
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${building.name}.png`;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      }, 'image/png');
    }
  }

  private static downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href);
  }
}
