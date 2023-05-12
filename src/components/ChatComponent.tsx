import React, { useEffect, useState } from "react";

interface Message {
  id: number;
  content: string;
  sender: string;
}

interface ChatComponentProps {
  initialMessages: Message[];
  submitEntry: (inputValue: string) => void;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  initialMessages,
  submitEntry,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim() !== "") {
      const newMessage: Message = {
        id: messages.length + 1,
        content: inputValue,
        sender: "User",
      };

      setMessages([...messages, newMessage]);
      setInputValue("");

      // Call your submitEntry function here to commit the new message to the database
      submitEntry(inputValue);
    }
  };

  return (
    <div>
      <div>
        {messages.map((message) => (
          <div key={message.id}>
            <span>{message.sender}: </span>
            <span>{message.content}</span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatComponent;
