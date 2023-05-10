import React from 'react';

export interface IMessage {
  username: string;
  text: string;
}

interface IChatProps {
  messages: IMessage[];
}

function Chat({ messages }: IChatProps) {
  return (
    <div>
      {messages.map((message, index) => (
        <div key={index}>
          <strong>{message.username}:</strong> {message.text}
        </div>
      ))}
    </div>
  );
}

export default Chat;
