
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import THREE, { IcosahedronGeometry } from 'three';
import { PlatonicSolidsProps } from './PlatonicSolid';
import { IntervalConfig } from '@/common/intervalConfig';
const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'];


const IcosahedronComponent: React.FC<PlatonicSolidsProps> = (props) => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setHovered] = useState(false);

  const [color, setColor] = useState('red');

  function getRandomIndex(list: any[]): number {
    const length = list.length;
    const randomIndex = Math.floor(Math.random() * length);
    return randomIndex;
  }

  // Change color every second
  useEffect(() => {
    const intervalId = setInterval(() => {

      setColor(colors[getRandomIndex(colors)]);
    }, IntervalConfig.second);
    return () => clearInterval(intervalId);
  }, []);



  useEffect(() => {

    boxRef.current.rotation.x = boxRef.current.rotation.y = 0.5;
  }, []);
  const getScale = () => props.selected ? 2.2 : isHovered ? 2 : 1.5;
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.scale.set(getScale(), getScale(), getScale());

      boxRef.current.rotation.x += 0.01;
      boxRef.current.rotation.y += 0.01;
    }
  });
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  // const isTransparent = () => ;

  return (
    <mesh ref={boxRef} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}  >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={ color}  wireframe={!props.selected}/>
    </mesh>
  );
};

export default IcosahedronComponent;
