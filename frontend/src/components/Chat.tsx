import React, { useEffect, useState } from 'react';
import { useChat } from '../hooks/useChat';
import Message from './Message';

const Chat: React.FC = () => {
  const { user, setUser, init, send, messages } = useChat();
  const [input, setInput] = useState('');

  useEffect(() => init(), []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <input
          placeholder="Enter your name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && setUser(input)}
          className="border p-2 rounded"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <Message key={i} message={m} isOwn={m.sender === user} />
        ))}
      </div>
      <div className="p-4 flex">
        <input
          className="flex-1 border rounded p-2"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (send(input), setInput(''))}
        />
        <button
          onClick={() => {
            send(input);
            setInput('');
          }}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;

