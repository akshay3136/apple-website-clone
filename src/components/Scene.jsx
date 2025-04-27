import { Canvas } from '@react-three/fiber';
import Model from './Model';

function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Model item={{ color: ["#FF0000"], img: "/textures/iphone-texture.jpg" }} />
    </Canvas>
  );
}

export default Scene;