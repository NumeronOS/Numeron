import { useState } from 'react';
import Chat from './Chat';

interface ChatCardProps {
  isVisible: boolean;
  onClose: () => void;
}

export function ChatCard({ isVisible, onClose }: ChatCardProps) {
  if (!isVisible) return null;

  return (
    <div className="chat-card">
      <div className="chat-card-header">
        <h3 className="chat-card-title">NPC Chat</h3>
        <button onClick={onClose} className="chat-card-close">
          ×
        </button>
      </div>
      <div className="chat-card-body">
        <Chat />
      </div>
    </div>
  );
}
