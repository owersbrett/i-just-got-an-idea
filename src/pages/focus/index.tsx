import Chat, { IMessage } from '@/components/Chat';
import React, { useState, useEffect } from 'react';



function FocusPage() {
  const [primaryField, setPrimaryField] = useState<string>('');
  const [secondaryField, setSecondaryField] = useState<string>('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);



  // Send a message over the WebSocket when the form is submitted
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  // Update the keywords state when the secondary field is updated
  const handleSecondaryFieldChange = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const newKeyword = event.currentTarget.value;
    if (newKeyword !== '' && event.keyCode === 13) {
      setKeywords((prevKeywords) => [...prevKeywords, newKeyword]);
      setSecondaryField('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Primary Field:
          <input
            type="text"
            value={primaryField}
            onChange={(event) => setPrimaryField(event.target.value)}
          />
        </label>
        <br />
        <label>
          Secondary Field:
          <input
            type="text"
            value={secondaryField}
            onChange={(event) => setSecondaryField(event.target.value)}
            onKeyDown={handleSecondaryFieldChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
      <Chat messages={messages} />
    </div>
  );
}

export default FocusPage;
