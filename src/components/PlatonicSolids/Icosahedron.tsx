
import { useEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import THREE, { IcosahedronGeometry } from 'three';
import { PlatonicSolidsProps } from './PlatonicSolid';
import { IntervalConfig } from '@/common/intervalConfig';
import { ColorHexcodes } from '../../../functions/functions/src/types/idea';



const IcosahedronComponent: React.FC<PlatonicSolidsProps> = (props) => {
  const boxRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setHovered] = useState(false);
  const baseSize = props.scale;

  const [colorHex, setColorHex] = useState(props.color);




  useEffect(() => {

    boxRef.current.rotation.x = boxRef.current.rotation.y = 0.5;
  }, []);
  const getScale = () => (props.selected ? 2.2 : isHovered ? 2 : 1.5) *baseSize;
  useFrame(() => {
    if (boxRef.current) {
      boxRef.current.scale.set(getScale(), getScale(), getScale());

      boxRef.current.rotation.x += 0.01*baseSize;
      boxRef.current.rotation.y += 0.01 *baseSize;
    }
  });
  const handlePointerOver = () => setHovered(true);
  const handlePointerOut = () => setHovered(false);
  // const isTransparent = () => ;

  return (
    <mesh ref={boxRef} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}  >
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color={ colorHex }  wireframe={!props.selected}/>
    </mesh>
  );
};

export default IcosahedronComponent;
