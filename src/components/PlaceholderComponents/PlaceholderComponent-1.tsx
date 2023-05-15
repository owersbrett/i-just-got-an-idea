import React, { useState } from "react";

import { Canvas } from "react-three-fiber";
import IcosahedronComponent from '../LoadingScreen/Icosahedron';

const Placeholder: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [idea, setIdea] = useState('');

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

  return (
    <>
      <Canvas>
        <IcosahedronComponent size={0} />
      </Canvas>
      <div style={{ position: 'fixed', top: '10px', left: '10px' }}>
        <h1 style={{ color: 'white', textShadow: '2px 2px 4px #000000' }}>I Just Got An Idea...</h1>
      </div>
      <div style={{ position: 'fixed', right: '10px', bottom: '10px', color: 'white' }}>
        {/* <form onSubmit={handleKeywordSubmit}>
          <label>
            Keyword:
            <input type="text" value={keyword} onChange={(e) => setKeyword(e.target.value)} style={{ color: 'black' }} />
          </label>
          <input type="submit" value="Submit" />
        </form> */}
        <form onSubmit={handleIdeaSubmit}>
          <label>
            Idea:
            <input type="text" value={idea} onChange={(e) => setIdea(e.target.value)} onSubmit={handleIdeaSubmit} style={{ color: 'black' }} />
          </label>
          {/* <input type="submit" value="Submit" /> */}
        </form>
      </div>
    </>
  );
};

export default Placeholder;
