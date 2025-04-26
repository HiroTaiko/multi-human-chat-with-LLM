import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import chatRouter from './routes/chat';

dotenv.config();
const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());

// API ルート
app.use('/api/chat', chatRouter);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let chatHistory: { sender: string; text: string; timestamp: string }[] = [];
const AI_NAME = process.env.AI_NAME || 'sora';

io.on('connection', socket => {
  console.log(`User connected: ${socket.id}`);
  socket.emit('history', chatHistory);

  socket.on('message', async (data: { user: string; text: string }) => {
    const timestamp = new Date().toISOString();
    chatHistory.push({ sender: data.user, text: data.text, timestamp });
    io.emit('message', { sender: data.user, text: data.text, timestamp });

    // AI呼びかけ判定
    if (!data.text.includes(`@${AI_NAME}`)) return;

    // OpenAI へ問い合わせ
    const prompt = chatHistory
      .map(m => `${m.sender}: ${m.text}`)
      .join('\n') + `\n${AI_NAME}: `;

    try {
      const { OpenAIApi, Configuration } = await import('openai');
      const config = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
      const openai = new OpenAIApi(config);
      const res = await openai.createCompletion({
        model: process.env.OPENAI_MODEL || 'text-davinci-003',
        prompt,
        max_tokens: 150,
        temperature: 0.7,
        stop: ['\n']
      });

      const aiText = res.data.choices[0].text?.trim() || '';
      const aiTimestamp = new Date().toISOString();
      chatHistory.push({ sender: AI_NAME, text: aiText, timestamp: aiTimestamp });
      io.emit('message', { sender: AI_NAME, text: aiText, timestamp: aiTimestamp });
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
});

const PORT = parseInt(process.env.PORT || '3001', 10);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

