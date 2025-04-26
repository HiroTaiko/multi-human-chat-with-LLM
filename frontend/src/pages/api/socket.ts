import { Server as NetServer } from 'http';
import { NextApiRequest } from 'next';
import { Server as SocketIOServer } from 'socket.io';
import OpenAI from 'openai'

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHandler = (req: NextApiRequest, res: any) => {
  if (!res.socket.server.io) {
    console.log('New Socket.IO server...');
    const httpServer: NetServer = res.socket.server as any;
    const io = new SocketIOServer(httpServer, {
      path: '/api/socket',
      cors: {
        origin: '*',
      },
    });

    // OpenAI準備
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    io.on('connection', (socket) => {
      console.log('User connected:', socket.id);

      socket.on('message', async (data) => {
        console.log('Received message:', data);

        // 全員にユーザーメッセージをまずブロードキャスト
        io.emit('message', {
          sender: data.user,
          text: data.text,
          timestamp: new Date().toISOString(),
        });

        // @AI が含まれているかチェック
        if (data.text.includes('@AI')) {
          try {
            const prompt = `${data.text}`;

            const response = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',  // または 'gpt-4'
                messages: [
                  { role: 'user', content: prompt }
                ],
              });
            const aiReply = response.choices[0]?.message?.content?.trim() || '（AIからの応答なし）';

            io.emit('message', {
              sender: 'AI',
              text: aiReply,
              timestamp: new Date().toISOString(),
            });

            console.log('AI replied with:', aiReply);
          } catch (error) {
            console.error('AI error:', error);
          }
        }
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }
  res.end();
};

export default ioHandler;