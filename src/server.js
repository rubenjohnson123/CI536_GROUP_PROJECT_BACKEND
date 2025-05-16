import dotenv from "dotenv";
dotenv.config();

import express, { json } from 'express';
import { connect } from 'mongoose';
import cors from 'cors';
import http from "http";
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(json()); // Allow JSON data

// MongoDB Connection
connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Routes
import itemRoutes from '../routes/items.js';
app.use('/api/items', itemRoutes);
import authRoutes from '../routes/auth.js';
app.use('/api/auth', authRoutes);
import userRoutes from '../routes/users.js';
app.use('/api/users', userRoutes);
import messageRoutes from '../routes/messages.js';
app.use('/api/messages', messageRoutes);
import setupWebSocket from './websocket.js';
setupWebSocket(server); 
app.use('/chat', createProxyMiddleware({
  target: 'http://localhost:5001',
  changeOrigin: true
}));

// Start Server
server.listen(5000, () => console.log("Server running on port 5000"));