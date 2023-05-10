import React, { useState, ChangeEvent, FormEvent } from "react";

function IdeaPage(): JSX.Element {
  const [idea, setIdea] = useState<string>("");
  const [keywords, setKeywords] = useState<string>("");

  const handleIdeaChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIdea(event.target.value);
  };

  const handleKeywordsChange = (event: ChangeEvent<HTMLInputElement>) => {
    setKeywords(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Send data to backend
  };

  return (
    <div>
      <h1>Idea Page</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Idea:
          <input type="text" value={idea} onChange={handleIdeaChange} />
        </label>
        <label>
          Keywords:
          <input type="text" value={keywords} onChange={handleKeywordsChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
