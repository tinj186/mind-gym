import React from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Edges, Text, Billboard } from '@react-three/drei';

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

function TextPlane({ text, color, anchorX }) {
  const texture = React.useMemo(() => {
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d');
    ctx.font = '900 80px sans-serif';
    const textWidth = ctx.measureText(text).width;
    
    c.width = textWidth + 60;
    c.height = 130;
    
    const ctx2 = c.getContext('2d');
    ctx2.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx2.fillRect(0, 0, c.width, c.height);
    
    ctx2.strokeStyle = color;
    ctx2.lineWidth = 10;
    ctx2.strokeRect(0, 0, c.width, c.height);
    
    ctx2.font = '900 80px sans-serif';
    ctx2.fillStyle = color;
    ctx2.textAlign = 'center';
    ctx2.textBaseline = 'middle';
    ctx2.fillText(text, c.width / 2, c.height / 2 + 6);
    
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [text, color]);

  const aspect = texture.image.width / texture.image.height;
  const height = 0.85; // Increased from 0.45 for much better readability
  const width = height * aspect;
  
  const xOffset = anchorX === 'left' ? width / 2 + 0.15 : -(width / 2 + 0.15);

  return (
    <group>
      <mesh position={[xOffset, 0, 0.01]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} side={THREE.FrontSide} transparent opacity={0.95} />
      </mesh>
      <mesh position={[xOffset, 0, -0.01]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[width, height]} />
        <meshBasicMaterial map={texture} side={THREE.FrontSide} transparent opacity={0.95} />
      </mesh>
    </group>
  );
}

function OrientationCompass({ position, shape }) {
  const shapeType = shape?.toLowerCase() || 'cube';

  const COMPASS_MAP = {
    cone: [
      { label: "UP", rot: [0, 0, 0], pos: [0, 1.2, 0], color: "#ef4444", textRot: [0, 0, Math.PI / 2], anchorX: "left" },
      { label: "DOWN", rot: [0, 0, 0], pos: [0, -1.2, 0], color: "#ef4444", textRot: [0, 0, Math.PI / 2], anchorX: "right" },
      { label: "RIGHT", rot: [0, 0, Math.PI / 2], pos: [1.2, 0, 0], color: "#3b82f6", textRot: [0, 0, 0], anchorX: "left" },
      { label: "LEFT", rot: [0, 0, Math.PI / 2], pos: [-1.2, 0, 0], color: "#3b82f6", textRot: [0, 0, 0], anchorX: "right" },
      { label: "FRONT", rot: [Math.PI / 2, 0, 0], pos: [0, 0, 1.2], color: "#10b981", textRot: [0, -Math.PI / 2, 0], anchorX: "left" },
      { label: "BACK", rot: [Math.PI / 2, 0, 0], pos: [0, 0, -1.2], color: "#10b981", textRot: [0, -Math.PI / 2, 0], anchorX: "right" }
    ],
    cylinder: [
      { label: "STANDING UP", rot: [0, 0, 0], pos: [0, 1.2, 0], color: "#ef4444", textRot: [0, 0, Math.PI / 2], anchorX: "left" },
      { label: "LYING LEFT-RIGHT", rot: [0, 0, Math.PI / 2], pos: [1.2, 0, 0], color: "#3b82f6", textRot: [0, 0, 0], anchorX: "left" },
      { label: "LYING FRONT-BACK", rot: [Math.PI / 2, 0, 0], pos: [0, 0, 1.2], color: "#10b981", textRot: [0, -Math.PI / 2, 0], anchorX: "left" }
    ],
    cuboid: [
      { label: "STANDING TALL", rot: [0, 0, 0], pos: [0, 1.2, 0], color: "#ef4444", textRot: [0, 0, Math.PI / 2], anchorX: "left" },
      { label: "LYING FLAT", rot: [0, 0, Math.PI / 2], pos: [1.2, 0, 0], color: "#3b82f6", textRot: [0, 0, 0], anchorX: "left" },
      { label: "LYING SIDEWAYS", rot: [Math.PI / 2, 0, 0], pos: [0, 0, 1.2], color: "#10b981", textRot: [0, -Math.PI / 2, 0], anchorX: "left" }
    ],
    cube: [
      { label: "SITTING STRAIGHT", rot: [0, 0, 0], pos: [0, 1.2, 0], color: "#ef4444", textRot: [0, 0, Math.PI / 2], anchorX: "left" },
      { label: "TILTED SIDEWAYS", rot: [0, 0, Math.PI / 4], pos: [0.85, 0.85, 0], color: "#3b82f6", textRot: [0, 0, Math.PI / 4], anchorX: "left" },
      { label: "TILTED FORWARD", rot: [Math.PI / 4, 0, 0], pos: [0, 0.85, 0.85], color: "#10b981", textGroupRot: [Math.PI / 4, 0, 0], textRot: [0, 0, Math.PI / 2], anchorX: "left" }
    ]
  };

  const axes = COMPASS_MAP[shapeType] || COMPASS_MAP['cube'];

  return (
    <group position={position} scale={1.3}>
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial color="#cbd5e1" />
      </mesh>
      
      {axes.map((axis, i) => (
        <group key={i}>
          <mesh rotation={axis.rot}>
            <cylinderGeometry args={[0.08, 0.08, 2]} />
            <meshBasicMaterial color={axis.color} />
          </mesh>
          <group position={axis.pos} rotation={axis.textGroupRot || [0, 0, 0]}>
            <group rotation={axis.textRot}>
              <TextPlane text={axis.label} color={axis.color} anchorX={axis.anchorX} />
            </group>
          </group>
        </group>
      ))}
    </group>
  );
}

export default function Shape3DPattern({ data }) {
  const sequence = data?.sequence || [];
  
  // Maintain a wide enough spacing so cuboids (width 4) do not overlap
  const spacing = 5.5;
  
  const showCompass = data?.showCompass === true;
  // +1 item for the compass at the end if shown
  const totalItems = showCompass ? sequence.length + 1 : sequence.length;
  const compassPadding = showCompass ? 2.5 : 0; // Extra padding
  const totalWidth = (totalItems - 1) * spacing + compassPadding;
  const startX = -totalWidth / 2;
  
  // Dynamically pull camera back based on total width so it always fits
  // A rough estimate: z = totalWidth * 0.8 + 10
  const cameraZ = Math.max(15, totalWidth * 0.9 + 5);

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full">
      <div 
        className="w-full relative cursor-grab active:cursor-grabbing"
        style={{ height: 350 }} // Fixed height, flexible width
      >
        <Canvas camera={{ position: [0, 5, cameraZ], fov: 45 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 10]} intensity={1.2} />
          <pointLight position={[-10, -10, -10]} intensity={0.8} />
          
          {sequence.map((item, idx) => {
            const xPos = startX + (idx * spacing);
            
            // If it's a placeholder
            if (item.isPlaceholder || item.componentToRender === "HTML_CONTENT") {
              return (
                <group key={idx} position={[xPos, 0, 0]}>
                  <Html center transform position={[0, 0, 0]}>
                    <div className="text-7xl font-black text-slate-900 pointer-events-none select-none">
                      ?
                    </div>
                  </Html>
                </group>
              );
            }
            
            // Otherwise render the 3D shape
            const itemData = item.componentData || {};
            const shapeType = itemData.shape?.toLowerCase() || 'cube';
            const color = itemData.color || '#3b82f6';
            const sizeScale = (itemData.size || 120) / 120; // Normalize size
            const rot = itemData.rotation || [0, 0, 0];
            
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
              <group key={idx} position={[xPos, 0, 0]} scale={[sizeScale, sizeScale, sizeScale]} rotation={rot}>
                {renderShape()}
              </group>
            );
          })}
          
          {/* Compass Helper placed at the end of the pattern */}
          {showCompass && (() => {
            const validShapeItem = sequence.find(item => item.componentToRender === "SHAPE_3D");
            const patternShape = validShapeItem ? validShapeItem.componentData?.shape : 'cube';
            return (
              <React.Suspense fallback={null}>
                <OrientationCompass 
                  position={[startX + (sequence.length * spacing) + compassPadding, 0, 0]} 
                  shape={patternShape}
                />
              </React.Suspense>
            );
          })()}
          
          <OrbitControls 
            enableZoom={true} 
            enablePan={false}
            autoRotate={false}
            minDistance={10}
            maxDistance={80}
          />
        </Canvas>
      </div>
      
      {/* Static interaction hint */}
      <div className="text-xs text-slate-400 mt-2">
        (Drag to rotate the entire pattern)
      </div>
    </div>
  );
}
