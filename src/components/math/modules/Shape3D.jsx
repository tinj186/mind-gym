import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';

function SphereMesh({ color }) {
  return (
    <mesh>
      <sphereGeometry args={[2, 32, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      <Edges scale={1} threshold={15} color="#0f172a" opacity={0.6} transparent />
    </mesh>
  );
}

function CylinderMesh({ color }) {
  return (
    <mesh>
      <cylinderGeometry args={[1.5, 1.5, 4, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      <Edges scale={1} threshold={15} color="#0f172a" opacity={0.6} transparent />
    </mesh>
  );
}

function ConeMesh({ color }) {
  return (
    <mesh position={[0, -1, 0]}>
      <coneGeometry args={[2, 4, 32]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      <Edges scale={1} threshold={15} color="#0f172a" opacity={0.6} transparent />
    </mesh>
  );
}

function CubeMesh({ color }) {
  return (
    <mesh>
      <boxGeometry args={[3, 3, 3]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      <Edges scale={1} threshold={15} color="#0f172a" opacity={0.6} transparent />
    </mesh>
  );
}

function CuboidMesh({ color }) {
  return (
    <mesh>
      <boxGeometry args={[4, 2.5, 2.5]} />
      <meshStandardMaterial color={color} roughness={0.3} metalness={0.1} />
      <Edges scale={1} threshold={15} color="#0f172a" opacity={0.6} transparent />
    </mesh>
  );
}

function FlashlightMesh({ direction }) {
  const isTop = direction === 'TOP';
  // Position the flashlight further away so it doesn't overlap
  const pos = isTop ? [0, 6, 0] : [6, 0, 0];
  // Rotate the group so the flashlight points TOWARDS the center (0,0,0)
  // If top, point down (rotate X by Math.PI/2)
  // If side (right), point left (rotate Z by Math.PI/2)
  const rot = isTop ? [0, 0, Math.PI] : [0, 0, Math.PI/2];

  return (
    <group position={pos} rotation={rot}>
      {/* Flashlight Body */}
      <mesh position={[0, -1, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 2, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      {/* Flashlight Head */}
      <mesh position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.3, 0.8, 16]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      {/* Light bulb / lens */}
      <mesh position={[0, 0.81, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.1, 16]} />
        <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={1} />
      </mesh>
      {/* Light Beam */}
      <mesh position={[0, 3.5, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[2.5, 5, 32]} />
        <meshStandardMaterial color="#fef08a" transparent opacity={0.25} depthWrite={false} />
      </mesh>
    </group>
  );
}

export default function Shape3D({ data }) {
  const { shape, color = '#3b82f6', size = 200, rotation = [0, 0, 0], flashlightDirection } = data || {};
  const shapeType = shape?.toLowerCase() || 'cube';
  
  const renderShape = () => {
    switch (shapeType) {
      case 'sphere': return <SphereMesh color={color} />;
      case 'cylinder': return <CylinderMesh color={color} />;
      case 'cone': return <ConeMesh color={color} />;
      case 'cube': return <CubeMesh color={color} />;
      case 'cuboid': return <CuboidMesh color={color} />;
      default: return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4">
      <div 
        className="flex flex-col items-center justify-center relative cursor-grab active:cursor-grabbing"
        style={{ width: size, height: size }}
      >
        <Canvas camera={{ position: [7, 7, 7], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.2} />
          <pointLight position={[-10, -10, -10]} intensity={0.8} />
          
          <group rotation={rotation}>
            {renderShape()}
            {flashlightDirection && <FlashlightMesh direction={flashlightDirection} />}
          </group>
          
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            autoRotate={false}
          />
        </Canvas>
      </div>
      
      {/* Static interaction hint */}
      <div className="text-xs text-slate-400 -mt-2">
        (Drag to rotate)
      </div>

      {data?.label && (
        <span className="text-sm font-black uppercase tracking-widest text-slate-500">{data.label}</span>
      )}
    </div>
  );
}
