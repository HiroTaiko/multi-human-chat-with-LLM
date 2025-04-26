import create from 'zustand';
import { io, Socket } from 'socket.io-client';

type Message = { sender: string; text: string; timestamp: string };

interface ChatState {
  user: string;
  setUser: (name: string) => void;
  messages: Message[];
  socket: Socket | null;
  init: () => void;
  send: (text: string) => void;
}

export const useChat = create<ChatState>((set, get) => ({
  user: '',
  setUser: user => set({ user }),
  messages: [],
  socket: null,
  init: () => {
    if (get().socket) return;
    const socket = io({
        path: '/api/socket', 
      });
    socket.on('history', (history: Message[]) => set({ messages: history }));
    socket.on('message', msg => set(state => ({ messages: [...state.messages, msg] })));
    set({ socket });
  },
  send: text => {
    const { socket, user } = get();
    if (!socket) return;
    socket.emit('message', { user, text });
  }
}));