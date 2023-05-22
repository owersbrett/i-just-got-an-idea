import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { DodecahedronGeometry } from 'three';
import { IntervalConfig } from '@/common/intervalConfig';

interface DodecahedronComponentProps {
    size: number;
}
const DodecahedronComponent = (props: DodecahedronComponentProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [color, setColor] = useState('red');


  // Change color every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    }, IntervalConfig.second);
    return () => clearInterval(intervalId);
  }, []);



  useEffect(() => {
    mesh.current.rotation.x = mesh.current.rotation.y = 0.5;
  }, []);

  useFrame(() => {
    if (mesh.current) {
      mesh.current.rotation.x += 0.01;
      mesh.current.rotation.y += 0.01;
    }
  });

  return (
    <mesh ref={mesh} scale={props.size} >
      <dodecahedronGeometry args={[1, 1]}  />
      <meshBasicMaterial color={color} wireframe  />
    </mesh>
  );
};

export default DodecahedronComponent;
