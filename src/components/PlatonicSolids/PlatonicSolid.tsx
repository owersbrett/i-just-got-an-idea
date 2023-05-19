import React from 'react';
import Cube from './Cube';
import DodecahedronComponent from './Dodecahedron';
import IcosahedronComponent from './Icosahedron';
import OctohedronComponent from './Octahedron';
import { Sphere, Tetrahedron } from '@react-three/drei';

interface PlatonicSolidsProps {
  shape: 'Cube' | 'Dodecahedron' | 'Icosahedron' | 'Octahedron' | 'Sphere' | 'Tetrahedron';
}

const PlatonicSolids: React.FC<PlatonicSolidsProps> = ({ shape }) => {
  const renderShape = () => {
    switch (shape) {
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
            <IcosahedronComponent size={0} />
        );
      case 'Octahedron':
        return (
            <OctohedronComponent size={0} />
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

  return <div>{renderShape()}</div>;
};

export default PlatonicSolids;
