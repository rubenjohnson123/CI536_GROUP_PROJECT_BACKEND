// websocket.js
import { Server } from "socket.io";
import User from '../models/User.js';
import Message from '../models/Message.js';

export default function setupWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
    }
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('chat message', async (msg, callback) => {
      try {
        const sender = await User.findOne({ username: msg.from });
        const receiver = await User.findOne({ username: msg.to });

        if (!sender || !receiver) {
          return callback({ error: 'User not found' });
        }

        const newMessage = new Message({
          sender_id: sender._id,
          receiver_id: receiver._id,
          content: msg.content
        });

        await newMessage.save();

        io.emit('chat message', {
          from: msg.from,
          to: msg.to,
          text: msg.content,
          timestamp: newMessage.timestamp
        });

        callback({ message: 'Message saved successfully' });
      } catch (err) {
        console.error('WebSocket error:', err);
        callback({ error: 'Server error' });
      }
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}
