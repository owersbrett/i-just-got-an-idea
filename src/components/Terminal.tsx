import '../styles/TerminalInput.css'; // Import the CSS file
import React, { useState, useEffect, useRef } from "react";
import { Canvas } from "react-three-fiber";

const Terminal: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [idea, setIdea] = useState('');
  const [helperText, setHelperText] = useState('I just got an idea...');

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
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);


  useEffect(() => {
    const helperTexts = [
      'I just got an idea...',
      // 'I want to build an app that sends Notifications to Users based on Topics they\'ve subscribed to...',
      // 'I want to go to a coding bootcamp, and then get a job as a Software Engineer...',
      // 'I want to program a phone number that allows people to text it to ask questions from the perspective of an ancient mystic named...',
      // 'I want to create a website using three.js that allows users to create their own 3D models...',
      // 'I want to store ideas and keywords to contextualize the AI generated responses...',
      // 'I want to an app that will break up the Lord\'s prayer in his native tongue of Aramaic and transliterate it in push notifications...',
    ];

    let currentTextIndex = 0;
    const intervalId = setInterval(() => {
      currentTextIndex = (currentTextIndex + 1) % helperTexts.length;
      setHelperText(helperTexts[currentTextIndex]);
    }, 10000); // Change every 5 seconds

    return () => clearInterval(intervalId);
  }, []);

  let getSize = () => {
    let baseSize = 2.5;
    if (idea.length > 0){
      baseSize = baseSize - idea.length / 10;
    }
    if (baseSize < 0.333){
      baseSize = 0.333;
    }
      return baseSize;
  }
  const I_JUST_GOT_AN_IDEA = 'i-just-got-an-idea$ ';
  let getValue = () => {
    if (idea.length > 0){
      return I_JUST_GOT_AN_IDEA + idea;
    } else {
      return I_JUST_GOT_AN_IDEA;
    }
  }


  const handleTerminalInput = (input: string) => {
    if (idea){
      setKeyword(input);
    } else {
      setIdea(input);
    }
  }
  return (
    <>
     


    </>
  );
};

export default Terminal;
