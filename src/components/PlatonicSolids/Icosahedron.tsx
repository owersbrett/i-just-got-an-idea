import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { IcosahedronGeometry } from 'three';

interface IcosahedronComponentProps {
    size: number;
}
const IcosahedronComponent = (props: IcosahedronComponentProps) => {
  const mesh = useRef<THREE.Mesh>(null!);
  const [color, setColor] = useState('red');


  // Change color every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    }, 1000);
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
      <icosahedronGeometry args={[1, 0]}  />
      <meshBasicMaterial color={color} wireframe transparent opacity={.50} />
    </mesh>
  );
};

export default IcosahedronComponent;
