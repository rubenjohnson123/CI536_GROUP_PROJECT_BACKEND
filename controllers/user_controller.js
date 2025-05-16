import User from "../models/User.js";
import Item from "../models/Item.js";

export const getUsers = async (req, res) => {
    try {
        const query = req.query.q || '';
        const users = await User.find({username: {$regex: query, $options: 'i'}});
        res.json(users); 
    } catch (error) {
        res.status(500).json({ message: err.message });  
    }
};

export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
        return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const saveItem = async (req, res) => {
    const { userId } = req.params;
    const { itemId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { $addToSet: { savedItems: itemId } });
        res.json({ message: "Item saved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to save item" });
    }
};

export const removeItem = async (req,res) => {
    const { userId } = req.params;
    const { itemId } = req.body;

    try {
        await User.findByIdAndUpdate(userId, { $pull: { savedItems: itemId } });
        res.json({ message: "Item unsaved successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to unsave item" });
    }
}

export const getItems = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
    
        if (!user || !user.savedItems) {
            return res.status(404).json({ message: 'No saved items found' });
        }

        const items = await Item.find({ _id: { $in: user.savedItems } });

        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err });
    }
};

/*
export const updateDetails = async (req, res) => {
    try {
        
    } catch (error) {
        
    }
}*/

