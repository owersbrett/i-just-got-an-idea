import '../styles/TerminalInput.css'; // Import the CSS file
import React, { useState, useEffect } from "react";
import IcosahedronComponent from "./LoadingScreen/Icosahedron";
import { Canvas } from "react-three-fiber";

const Placeholder: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [idea, setIdea] = useState('');
  const [helperText, setHelperText] = useState('I want to build a website that...');

  const handleKeywordSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("add keyword: " + keyword);
    setKeyword('');
  };

  const handleIdeaSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("input idea: " + idea);
    setIdea('');
  };

  useEffect(() => {
    const helperTexts = [
      'I want to build a website that accepts Ideas as input and processes them through AI with a list of custom prompts...',
      'I want to build an app that sends Notifications to Users based on Topics they\'ve subscribed to...',
      'I want to go to a coding bootcamp, and then get a job as a Software Engineer...',
      'I want to program a phone number that allows people to text it to ask questions from the perspective of an ancient mystic named...',
      'I want to create a website using three.js that allows users to create their own 3D models...',
      'I want to store ideas and keywords to contextualize the AI generated responses...',
      'I want to an app that will break up the Lord\'s prayer in his native tongue of Aramaic and transliterate it in push notifications...',
    ];

    let currentTextIndex = 0;
    const intervalId = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % helperTexts.length;
      setHelperText(helperTexts[currentTextIndex]);
    }, 5000); // Change every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  let getSize = () => {
    let size = 10;
    if (idea.length >= 101){
      return .101;
    } else {
      size = 10 - (idea.length / 10);
      if (size < .101){
        return .101;
      }
      return size;
    }

  }

  return (
    <>
      <Canvas>
        <IcosahedronComponent size={getSize()} />
      </Canvas>
      <div style={{ position: 'fixed', top: '10px', left: '10px' }}>
        <h1 style={{ color: 'white', textShadow: '2px 2px 4px #000000' }}>{helperText}</h1>
      </div>
      <div style={{ position: 'fixed', padding: '10px', bottom: '10px', color: 'white' }}>

     
        <form className="terminal-input" onSubmit={handleIdeaSubmit}>
          <span className="terminal-prompt">$</span>
          <input
            type="text"
            className="terminal-text-input"
            value={idea}
            onChange={(e)=>setIdea(e.target.value)}
            autoFocus
          />
        </form>
      </div>



    </>
  );
};

export default Placeholder;
