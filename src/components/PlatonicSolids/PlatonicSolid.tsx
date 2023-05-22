import React from 'react';
import Cube from './Cube';
import DodecahedronComponent from './Dodecahedron';
import IcosahedronComponent from './Icosahedron';
import OctohedronComponent from './Octahedron';
import { Sphere, Tetrahedron } from '@react-three/drei';

export interface PlatonicSolidsProps {
  shape: 'Cube' | 'Dodecahedron' | 'Icosahedron' | 'Octahedron' | 'Sphere' | 'Tetrahedron';
  selected: boolean;
}

const PlatonicSolids: React.FC<PlatonicSolidsProps> = (props) => {
  const renderShape = () => {
    switch (props.shape) {
      case 'Cube':
        return (
            <Cube size={0} />
        );
      case 'Dodecahedron':
        return (
            <DodecahedronComponent size={0} />
        );
      case 'Icosahedron':
        return (
            <IcosahedronComponent shape={'Icosahedron'} selected={props.selected}  />
        );
      case 'Octahedron':
        return (
            <OctohedronComponent size={1} />
        );

      case 'Sphere':
        return (
            <Sphere args={[1, 0, 0]} />
        );
      case 'Tetrahedron':
        return (
            <Tetrahedron args={[1, 0]} />
        );
      default:
        return null;
    }
  };

  return <>{renderShape()}</>;
};

export default PlatonicSolids;
