import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, GizmoHelper, GizmoViewport, Environment, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import { BuildingModel } from './BuildingModel';
import { useAppStore } from '../store/useAppStore';

export function Scene() {
  const { viewSettings, editor } = useAppStore();
  const controlsRef = useRef<any>(null);

  return (
    <Canvas
      shadows
      gl={{ preserveDrawingBuffer: true, antialias: true }}
      style={{ background: viewSettings.backgroundColor }}
    >
      <PerspectiveCamera makeDefault position={[20, 15, 20]} fov={50} />

      {/* Lighting */}
      <ambientLight intensity={viewSettings.ambientLightIntensity} />
      <directionalLight
        position={[15, 20, 10]}
        intensity={viewSettings.directionalLightIntensity}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
      <directionalLight position={[-10, 10, -10]} intensity={0.3} />

      {/* Environment */}
      <Environment preset="city" />

      {/* Building Model */}
      <BuildingModel wireframe={viewSettings.wireframe || editor.wireframe} />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#2d5a27" roughness={0.9} />
      </mesh>

      {/* Grid */}
      {viewSettings.showGrid && (
        <Grid
          args={[50, 50]}
          position={[0, 0.01, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#4a4a4a"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#6a6a6a"
          fadeDistance={50}
          fadeStrength={1}
          followCamera={false}
        />
      )}

      {/* Axes */}
      {viewSettings.showAxes && (
        <GizmoHelper alignment="bottom-left" margin={[80, 80]}>
          <GizmoViewport axisColors={['#ff0000', '#00ff00', '#0000ff']} labelColor="white" />
        </GizmoHelper>
      )}

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        minDistance={5}
        maxDistance={100}
        maxPolarAngle={Math.PI / 2.05}
      />
    </Canvas>
  );
}
