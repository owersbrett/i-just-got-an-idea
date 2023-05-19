
import { Idea } from "@/common/types";
import IcosahedronComponent from "@/components/PlatonicSolids/Icosahedron";
import React from "react";
import { Canvas } from "react-three-fiber";
import '../styles/idea.css';
import { useState } from 'react';

interface RevolvingIdeaAnimationProps {
    ideas: Idea[]
  }
const RevolvingIdeaAnimation: React.FC<RevolvingIdeaAnimationProps> = ({ideas}): React.JSX.Element => {
    const [expandedIdea, setExpandedIdea] = useState<Idea | null>(null);
    const handleIdeaClick = (idea: Idea) => {
        setExpandedIdea(idea);
      };
    
      const handleIdeaHover = () => {
        // Add your hover effect logic here, e.g., apply a CSS class to make the solid glow
      };
    
      const renderIdea = (idea: Idea) => {
        const isExpanded = expandedIdea === idea;
        const classNames = `idea $isExpanded ? 'expanded' : '' `;
        return (
            <div className="transparent">

            <div className={classNames} onClick={() => handleIdeaClick(idea)} onMouseEnter={handleIdeaHover}>
                <Canvas  >
                    <IcosahedronComponent size={2} />
                </Canvas>
            </div>
            </div>
          );
      }

    return (
        <>
            <div className='bg-white  vw-100 flex'>
                {ideas.map((idea) => renderIdea(idea))}
            </div>
        </>
    );
};

export default RevolvingIdeaAnimation;
