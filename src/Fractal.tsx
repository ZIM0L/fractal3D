import  { useMemo } from 'react';
import { RigidBody } from '@react-three/rapier';
import { Vector3 } from '@react-three/fiber';

// Typy dla propsów komponentu Fractal
interface FractalProps {
  shape: string;
  depth: number;
  position: number[];
  angle: number;
  size: number;
  isPhysicsEnabled: boolean;
  spacing: number;
  fractalType: string;
  color: string;
}

export const Fractal = ({
  shape,
  depth,
  position,
  angle,
  size,
  isPhysicsEnabled,
  spacing,
  fractalType,
  color,
}: FractalProps) => {
  const baseSize = size;
  const trunkHeight = size;

  // Nowa pozycja dla kolejnych gałęzi
  const newPosition = useMemo(
    () => [
      position[0] + Math.cos(angle) * trunkHeight * spacing,
      position[1] + Math.sin(angle) * trunkHeight * spacing,
      position[2],
    ],
    [position, angle, trunkHeight, spacing]
  );

  // Wybór kształtu na podstawie typu
  const shapeComponent = useMemo(() => {
    switch (shape) {
      case 'Cube':
        return <boxGeometry args={[baseSize, baseSize, baseSize]} />;
      case 'Cone':
        return <coneGeometry args={[baseSize, baseSize * 2, 4]} />;
      case 'Sphere':
        return <sphereGeometry args={[baseSize * 0.6, 16, 16]} />;
      case 'Cylinder':
        return <cylinderGeometry args={[baseSize * 0.6, baseSize * 0.6, baseSize, 12]} />;
      default:
        return null;
    }
  }, [shape, baseSize]);

  // Określenie typu kolizji
  const getColliderType = () => {
    switch (shape) {
      case 'Cube':
        return 'cuboid';
      case 'Cone':
      case 'Cylinder':
        return 'hull';
      case 'Sphere':
        return 'ball';
      default:
        return 'ball';
    }
  };

  const colliderType = getColliderType();

  // Rekurencja dla gałęzi
  const getBranches = () => {
    if (depth <= 0) return null;

    // Generowanie losowego koloru dla każdej gałęzi
    const nextColor = `hsl(${Math.random() * 360}, 100%, 50%)`;

    switch (fractalType) {
      case 'Branching Tree':
        return (
          <>
            {/* Lewa gałąź */}
            <Fractal
              shape={shape}
              depth={depth - 1}
              position={[
                newPosition[0] - size * 0.7,
                newPosition[1] + size * 0.8,
                newPosition[2],
              ]}
              angle={angle - Math.PI / 4}
              size={size * 0.84}
              isPhysicsEnabled={isPhysicsEnabled}
              spacing={spacing}
              fractalType={fractalType}
              color={nextColor}
            />
            {/* Prawa gałąź */}
            <Fractal
              shape={shape}
              depth={depth - 1}
              position={[
                newPosition[0] + size * 0.7,
                newPosition[1] + size * 0.8,
                newPosition[2],
              ]}
              angle={angle + Math.PI / 4}
              size={size * 0.84}
              isPhysicsEnabled={isPhysicsEnabled}
              spacing={spacing}
              fractalType={fractalType}
              color={nextColor}
            />
          </>
        );
      case 'Python Tree':
        return (
          <Fractal
            shape={shape}
            depth={depth - 1}
            position={newPosition}
            angle={angle + Math.sin(depth * 0.1) * Math.PI / 6}
            size={baseSize * 0.9}
            isPhysicsEnabled={isPhysicsEnabled}
            spacing={spacing}
            fractalType={fractalType}
            color={nextColor}
          />
        );
      case 'Cantor Set':
        return (
          <>
            {/* Lewy segment */}
            <Fractal
              shape={shape}
              depth={depth - 1}
              position={[newPosition[0] - 3, newPosition[1], newPosition[2]]}
              angle={angle}
              size={baseSize * 0.83}
              isPhysicsEnabled={isPhysicsEnabled}
              spacing={spacing}
              fractalType={fractalType}
              color={nextColor}
            />
            {/* Prawy segment */}
            <Fractal
              shape={shape}
              depth={depth - 1}
              position={[newPosition[0] + 3, newPosition[1], newPosition[2]]}
              angle={angle}
              size={baseSize * 0.83}
              isPhysicsEnabled={isPhysicsEnabled}
              spacing={spacing}
              fractalType={fractalType}
              color={nextColor}
            />
          </>
        );
      default:
        return null;
    }
  };

  const branches = getBranches();

  // Główny segment drzewa (pień)
  const trunk = (
    <RigidBody
      type={isPhysicsEnabled ? 'dynamic' : 'fixed'}
      colliders={colliderType}
      canSleep
      restitution={0.4}
      friction={1}
    >
      <mesh position={position as Vector3} castShadow receiveShadow scale={[size, size, size]}>
        {shapeComponent}
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
      </mesh>
    </RigidBody>
  );

  return (
    <>
      {trunk}
      {branches}
    </>
  );
};
