import React, { useMemo } from 'react';
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

export default function CompositeShape3D({ data }) {
  const composition = data?.composition || [];
  
  // Calculate bounding box to dynamically adjust camera
  const boundingRadius = useMemo(() => {
    let maxDist = 10;
    composition.forEach(item => {
      const pos = item.position || [0, 0, 0];
      const dist = Math.sqrt(pos[0]*pos[0] + pos[1]*pos[1] + pos[2]*pos[2]);
      if (dist > maxDist) maxDist = dist;
    });
    return maxDist + 5; // padding
  }, [composition]);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <div 
        className="w-full relative cursor-grab active:cursor-grabbing bg-slate-50 rounded-3xl border-2 border-slate-200 overflow-hidden"
        style={{ height: 400 }}
      >
        <Canvas camera={{ 
          position: data?.isometric ? [boundingRadius, boundingRadius * 0.8, boundingRadius] : [boundingRadius * 0.8, boundingRadius * 0.6, boundingRadius], 
          fov: data?.isometric ? 35 : 45 
        }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight position={[-10, -10, -10]} intensity={0.8} />
          
          <group position={[0, -2, 0]}> {/* Center slightly lower for better framing */}
            {composition.map((item, idx) => {
              const shapeType = item.shape?.toLowerCase() || 'cube';
              const color = item.color || '#3b82f6';
              const pos = item.position || [0, 0, 0];
              const rot = item.rotation || [0, 0, 0];
              const scale = item.scale || [1, 1, 1];
              
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
                <group key={idx} position={pos} rotation={rot} scale={scale}>
                  {renderShape()}
                </group>
              );
            })}
          </group>
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            autoRotate={data?.autoRotate !== false}
            autoRotateSpeed={1.0}
            minDistance={5}
            maxDistance={50}
          />
        </Canvas>
      </div>
      
      <div className="text-xs text-slate-400 mt-2">
        (Drag to rotate the 3D model)
      </div>
    </div>
  );
}
