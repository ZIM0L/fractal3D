import  { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics, RigidBody } from '@react-three/rapier';
import { EffectComposer, Bloom, Glitch, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Fractal } from './Fractal';




const Floor = () => (
  <RigidBody type="fixed">
    <mesh position={[0, -15, 0]} receiveShadow>
      <boxGeometry args={[100, 1, 100]} />
      <meshStandardMaterial color="white" />
    </mesh>
  </RigidBody>
);

const App = () => {
  const [shape, setShape] = useState('Cube');
  const [depth, setDepth] = useState(2);
  const [size, setSize] = useState(4);
  const [spacing, setSpacing] = useState(5);
  const [isPhysicsEnabled, setIsPhysicsEnabled] = useState(false);
  const [isPostProcessingEnabled] = useState(true);
  const [fractalType, setFractalType] = useState('Branching Tree');

  // Post-processing effect states
  const [isBloomEnabled, setIsBloomEnabled] = useState(false);
  const [isGlitchEnabled, setIsGlitchEnabled] = useState(false);
  const [isNoiseEnabled, setIsNoiseEnabled] = useState(false);
  

  const resetScene = () => {
    setIsPhysicsEnabled(false);
    setDepth(2);
    setSize(4);
    setSpacing(5);
    setShape('Cube');
  };

  const selectFractal = (type : string) => {
    resetScene();
    setFractalType(type);
  };

  const fractalDescription = useMemo(() => {
    switch (fractalType) {
      case 'Branching Tree':
        return 'A classic tree-like fractal with branching arms and recursive depth.';
      case 'Python Tree':
        return 'A dynamic fractal inspired by the Python logo, with smooth curves.';
      case 'Cantor Set':
        return 'A recursive fractal where a single line expands into multiple smaller lines arranged vertically, creating a pattern that grows upward. ';
      default:
        return '';
    }
  }, [fractalType]);

  const fractalKey = `${shape}-${depth}-${size}-${spacing}-${isPhysicsEnabled}-${fractalType}`;

  return (
    <div style={{ height: '100vh' }}>
      <Canvas
        shadows="soft"
        style={{ backgroundColor: '#1a1a1a' }}
        camera={{ position: [20, 40, 30], fov: 70 }}
      >
        <ambientLight intensity={0.8} />
        <spotLight
          position={[5, 10, 5]}
          angle={Math.PI / 6}
          penumbra={0.5}
          intensity={2.5}
          castShadow 
          shadow-mapSize-width={1024} 
          shadow-mapSize-height={1024}
        />
        <directionalLight
          position={[-15, 25, 10]}
          intensity={1.3}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.001}
        />
        <Physics  >
              opacity={0.6}
              scale={
                (size) 
              }
              visible={true}
              rotation={[0, -Math.PI / 2, 0]}
              depthTest={false}
              lineWidth={1}
              anchor={[0, 0, 0]}
              <Fractal
                key={fractalKey}
                shape={shape}
                depth={depth}
                position={[0, 0, 0]}
                angle={Math.PI / 2}
                size={size * 0.87}
                isPhysicsEnabled={isPhysicsEnabled}
                spacing={spacing}
                fractalType={fractalType}
                color={`hsl(${Math.random() * 360}, 100%, 50%)`}
              />
            <Floor />
        </Physics>
        {isPostProcessingEnabled && (
            <EffectComposer>
              {isBloomEnabled ? (
                <Bloom
                  intensity={0.6}
                  kernelSize={3}
                  luminanceThreshold={0.3}
                  luminanceSmoothing={0.1}
                />
              ) : <></>}
              {isGlitchEnabled ? (
                <Glitch
                  delay={new THREE.Vector2(1.5, 2)}
                  strength={new THREE.Vector2(1.5, 2)}
                />
              ) : <></>}
              {isNoiseEnabled ? <Noise opacity={0.2} /> : <></>}
          </EffectComposer>
        )}
        <OrbitControls makeDefault />
      </Canvas>

      <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'white', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.7)', borderRadius: '8px', width: '300px' }}>
        <h3 style={{ textAlign: 'center' }}>Fractal Generator</h3>
        <div style={{ marginBottom: '10px' }}>
          <strong>Current Fractal Type:</strong> {fractalType}
        </div>
        <div style={{ marginBottom: '10px' }}>
          <strong>Description:</strong> {fractalDescription}
        </div>
        <div>
        <h4>Choose Fractal Algorithm:</h4>
          <button style={{ margin: '5px' }} onClick={() => selectFractal('Branching Tree')}>Branching Tree</button>
          <button style={{ margin: '5px' }} onClick={() => selectFractal('Python Tree')}>Python Tree</button>
          <button style={{ margin: '5px' }} onClick={() => selectFractal('Cantor Set')}>Cantor Set</button>
        </div>
        <hr style={{ margin: '10px 0' }} />
        <h4>Choose Shape:</h4>
        <button onClick={() => setShape('Cube')}>Cube</button>
        <button onClick={() => setShape('Cone')}>Cone</button>
        <button onClick={() => setShape('Sphere')}>Sphere</button>
        <button onClick={() => setShape('Cylinder')}>Cylinder</button>
        

        <h4>Parameters:</h4>
        <label>
          Depth:
          <input
            type="range"
            min="1"
            max="8"
            value={depth}
            onChange={(e) => setDepth(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Size:
          <input
            type="range"
            min="0.5"
            max="5"
            step="0.1"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
          />
        </label>
        <br />
        <label>
          Spacing:
          <input
            type="range"
            min="3"
            max="8"
            step="0.1"
            value={spacing}
            onChange={(e) => setSpacing(Number(e.target.value))}
          />
        </label>
        <h4>Physics:</h4>
        <button onClick={() => setIsPhysicsEnabled((prev) => !prev)}>
          {isPhysicsEnabled ? 'Disable Physics (Freeze)' : 'Enable Physics (Dynamic)'}
        </button>
        <br />
        <h4>Post-Processing:</h4>
        <button onClick={() => setIsBloomEnabled((prev) => !prev)}>
          {isBloomEnabled ? 'Disable Bloom' : 'Enable Bloom'}
        </button>
        <br />
        <button onClick={() => setIsGlitchEnabled((prev) => !prev)}>
          {isGlitchEnabled ? 'Disable Glitch' : 'Enable Glitch'}
        </button>
        <br />
        <button onClick={() => setIsNoiseEnabled((prev) => !prev)}>
          {isNoiseEnabled ? 'Disable Noise' : 'Enable Noise'}
        </button>
        <br />
        <h4>Reset:</h4>
        <button onClick={resetScene}>Reset to Defaults</button>
      </div>
    </div>
  );
};

export default App;
