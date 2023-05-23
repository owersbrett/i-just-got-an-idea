'use-client';
import IcosahedronComponent from "@/components/PlatonicSolids/Icosahedron";
import React, { useContext, useEffect } from "react";
import { Canvas } from "react-three-fiber";
import '../../../src/styles/idea.css';

import { useState } from 'react';
import { Idea } from "@/common/types/idea";
import { UserContext } from "@/pages/auth-page/UserContext";
import axios, { AxiosError, AxiosResponse } from "axios";
import { API, ErrorCallback, SuccessCallback } from '../../pages/api/api';
import { TemplateConfiguration } from "@/common/types/templateConfiguration";
import TemplateConfigurationDropdown from "../Dropdown/templateConfigurationDropdown";
import { Entry } from "@/common/types/entry";
import { SessionContext } from "@/pages/auth-page/SessionContext";


interface RevolvingIdeaAnimationProps {
  ideas: Idea[];
  templateConfigurations: TemplateConfiguration[];
  onSelectIdea: (idea: Idea | null) => void;
}

const areEqual = (prevProps: RevolvingIdeaAnimationProps, nextProps: RevolvingIdeaAnimationProps) => {
  if (prevProps.ideas.length != nextProps.ideas.length) return false;

  const sortedA = [...prevProps.ideas].sort((a, b) => {

    return a.updatedAt.seconds - b.updatedAt.seconds;
  });
  const sortedB = [...nextProps.ideas].sort((a, b) => {
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


const fetchTemplates = () => {
  axios.get(`/api/template`)
}

const RevolvingIdeaAnimation: React.FC<RevolvingIdeaAnimationProps> = (props: RevolvingIdeaAnimationProps): React.JSX.Element => {

  const { user } = useContext(UserContext);
  const { session } = useContext(SessionContext);
  const [selectedIdea, selectIdea] = useState<Idea | null>(null);


  const handleIdeaClick = (idea: Idea) => {
    console.log("Clicked idea")
    console.log(idea)
    var previouslyExpandedContent = document.getElementById(selectedIdea?.ideaId ?? "");
    var expandedContent = document.getElementById(idea.ideaId);
    if (previouslyExpandedContent) {
      previouslyExpandedContent.classList.toggle("focused-idea");
    }
    if (expandedContent) {
      expandedContent.classList.toggle("focused-idea");
    }
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
    return (
      <li className="transparent" key={idea.ideaId} >
        <div>

          <div className={"idea"} id={idea.ideaId} onClick={() => handleIdeaClick(idea)}>

            <Canvas>
              <IcosahedronComponent shape={"Icosahedron"} selected={isExpanded} color={idea.colorHex} scale={1} />
            </Canvas>

          </div>
          {isExpanded && expandedIdea()}
        </div>
      </li>
    );
  }

  const expandedIdea = () => {
    return (
      <div className="flex flex-row">
        <form className="text-black p-4 vw-50">
          <p key={"index"}>Index: {selectedIdea?.index}</p>
          <p key={"idea"}>Idea: {selectedIdea?.idea}</p>
          <p key={"keywords"}>Keywords:</p>
          {selectedIdea?.keywords.map((keyword, index) => <p key={keyword + index}>&nbsp;&nbsp;{keyword}</p>)}
          <p key={`ideaId:${selectedIdea?.ideaId}`}>IdeaId: {selectedIdea?.ideaId}</p>
        </form>
        <section className="vw-50 text-black">
          <TemplateConfigurationDropdown templateConfigurations={props.templateConfigurations} onSelectTemplateConfiguration={(templateConfigurationId) => {
            console.log(templateConfigurationId);
          }} selectedIdea={selectedIdea} onExecute={function (templateConfigurationId: string): void {
            let entry: Entry = Entry.default(templateConfigurationId, selectedIdea?.ideaId ?? "", user?.uid ?? "", session.sessionId);
            entry.type = "templateConfiguration";
            entry.content = templateConfigurationId;
            API.post(`/api/entries`, entry, "Error setting template configuration: ");
          }} />
        </section>
      </div>
    )
  };
  return (
    <>
      <div className="flex flex-col bg-white">

        <div className=' vw-100 flex overflow-x-auto max-w-screen flex-col align-top'>
          <ul className="flex whitespace-nowrap  align-top">
            {props.ideas.map((idea) => {
              const isExpanded = selectedIdea === idea;
              return (
                <li className="transparent" key={idea.ideaId} >
                  <div>

                    <div className={"idea"} id={idea.ideaId} onClick={() => handleIdeaClick(idea)}>

                      <Canvas>
                        <IcosahedronComponent shape={"Icosahedron"} selected={isExpanded} color={idea.colorHex} scale={1} />
                      </Canvas>

                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {selectedIdea && expandedIdea()}
        </div>
      </div>
    </>
  );
};



export default React.memo(RevolvingIdeaAnimation, areEqual);
