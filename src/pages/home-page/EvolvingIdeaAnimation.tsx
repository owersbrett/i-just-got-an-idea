
import IcosahedronComponent from "@/components/PlatonicSolids/Icosahedron";
import React from "react";
import { Canvas } from "react-three-fiber";

interface EvolvingIdeaAnimationProps {
    steps: number
  }
const EvolvingIdeaAnimation: React.FC<EvolvingIdeaAnimationProps> = ({steps}): React.JSX.Element => {
    console.log(steps);
    return (
        <>
            <div className='bg-white  vw-100'>
                <Canvas >
                    <IcosahedronComponent size={2} />
                </Canvas>
            </div>
        </>
    );
};

export default EvolvingIdeaAnimation;
