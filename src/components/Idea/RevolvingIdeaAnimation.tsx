'use-client';
import IcosahedronComponent from "@/components/PlatonicSolids/Icosahedron";
import React, { useContext, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import '../../../src/styles/idea.css';

import { useState } from 'react';
import { Idea } from "@/common/types/idea";
import { UserContext } from "@/pages/auth-page/UserContext";
import { AxiosError, AxiosResponse } from "axios";
import { API, ErrorCallback, SuccessCallback } from '../../pages/api/api';


interface RevolvingIdeaAnimationProps {
    ideas: Idea[]
    onSelectIdea: (idea: Idea | null) => void;
  }

const areEqual = (prevProps: RevolvingIdeaAnimationProps, nextProps: RevolvingIdeaAnimationProps) => {
  if (prevProps.ideas.length != nextProps.ideas.length) return false;

  const sortedA = [...prevProps.ideas].sort((a,b)=> {

    return a.updatedAt.seconds - b.updatedAt.seconds;
  });
  const sortedB = [...nextProps.ideas].sort((a,b)=> {
    return a.updatedAt.seconds - b.updatedAt.seconds;
  });
  for (let i = 0; i < prevProps.ideas.length; i++) {
    console.log(sortedA[i].updatedAt.seconds != sortedB[i].updatedAt.seconds)
    if (sortedA[i].updatedAt.seconds != sortedB[i].updatedAt.seconds) {
      return false;
    }
  }
  return true;
}


const RevolvingIdeaAnimation: React.FC<RevolvingIdeaAnimationProps> = (props: RevolvingIdeaAnimationProps): React.JSX.Element => {

  const { user } = useContext(UserContext);
  const [selectedIdea, selectIdea] = useState<Idea | null>(null);
  

  const handleIdeaClick = (idea: Idea) => {
    console.log("Clicked idea")
    console.log(idea)
    if (selectedIdea === idea) {
      selectIdea(null);
      props.onSelectIdea(null);
    } else {
      selectIdea(idea);
      props.onSelectIdea(idea);
    }
  };



  const renderIdea = (idea: Idea) => {
    const isExpanded = selectedIdea === idea;
    const classNames = `idea`;
    return (
      <li className="transparent" key={idea.ideaId} >
        <div className={classNames} onClick={() => handleIdeaClick(idea)}>
          <Canvas>

            <IcosahedronComponent shape={"Icosahedron"} selected={isExpanded} />
          </Canvas>
        </div>
      </li>
    );
  }

  const expandedIdea = () => {
    return (<form className="text-black p-4">
      <p key={"index"}>Index: {selectedIdea?.index}</p>
      <p key={"idea"}>Idea: {selectedIdea?.idea}</p>
      <p key={"keywords"}>Keywords:</p>
      {selectedIdea?.keywords.map((keyword, index) => <p key={keyword + index}>&nbsp;&nbsp;{keyword}</p>)}
      <p key={`ideaId:${selectedIdea?.ideaId}`}>IdeaId: {selectedIdea?.ideaId}</p>

    </form>)
  };
  return (
    <>
      <div className="flex flex-col bg-white">

        <div className=' vw-100 flex overflow-x-auto max-w-screen flex-col'>
          <ul className="flex whitespace-nowrap">

            {props.ideas.map((idea) => renderIdea(idea))}
          </ul>
        </div>
        {selectedIdea && expandedIdea()}
      </div>
    </>
  );
};



export default React.memo(RevolvingIdeaAnimation, areEqual);
