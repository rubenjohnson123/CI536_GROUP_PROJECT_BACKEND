import User from "../models/User.js";
import Message from "../models/Message.js";

export const getMessages = async (req, res) => {
    const { from, to } = req.query;
    const messages = await Message.find({
        $or: [
            { from, to },
            { from: to, to: from }
        ]
    });
    res.json(messages);
};

export const sendMessage = async (req, res) => {
    const { from, to, content } = req.body;

    try {
        const sender = await User.findOne({ username: from });
        const receiver = await User.findOne({ username: to });

        if (!sender || !receiver) {
            return res.status(404).json({ error: 'Sender or receiver not found' });
        }

        const newMessage = new Message({
            sender_id: sender._id,
            receiver_id: receiver._id,
            content
        });

        await newMessage.save();

        res.status(201).json({ message: 'Message saved', data: newMessage });
    } catch (err) {
        console.error('Error saving message:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

