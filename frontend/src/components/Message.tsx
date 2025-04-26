import React from 'react';

type Props = {
  message: { sender: string; text: string; timestamp: string };
  isOwn: boolean;
};

const Message: React.FC<Props> = ({ message, isOwn }) => (
  <div className={isOwn ? 'text-right' : 'text-left'}>
    <div className="text-xs text-gray-500">
      {message.sender} @ {new Date(message.timestamp).toLocaleTimeString()}
    </div>
    <div className={`inline-block p-2 rounded ${isOwn ? 'bg-blue-200' : 'bg-gray-200'}`}>
      {message.text}
    </div>
  </div>
);

export default Message;