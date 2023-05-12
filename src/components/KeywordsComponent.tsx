import React, { useEffect, useState } from "react";

interface KeywordsComponentProps {
  keywordHandler: (keywords: string[]) => void;
  initialKeywords: string[];
}

const KeywordsComponent: React.FC<KeywordsComponentProps> = ({ keywordHandler, initialKeywords }) => {
  const [keywordInput, setKeywordInput] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleKeywordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeywordInput(e.target.value);
  };

  useEffect(() => {
    setKeywords(initialKeywords);
    }, [initialKeywords]);

  const addKeyword = (e: React.FormEvent) => {
    e.preventDefault();
    if (keywordInput.trim() !== "") {
      const updatedKeywords = [...keywords, keywordInput];
      setKeywords(updatedKeywords);
      keywordHandler(updatedKeywords);
      setKeywordInput("");
    }
  };

  return (
    <div>
      <ul>
        {keywords.map((keyword, index) => (
          <li key={index}>{keyword}</li>
        ))}
      </ul>
      <form onSubmit={addKeyword}>
        <input type="text" value={keywordInput} onChange={handleKeywordInput} />
        <button type="submit">Add Keyword</button>
      </form>
    </div>
  );
};

export default KeywordsComponent;
