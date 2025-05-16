import Item from '../models/Item.js';

export const getItems = async (_req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const getItem = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
        return res.status(404).json({ error: 'Item not found' });
        }
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
};

export const addItem = async (req, res) => {
    console.log("Received data:", req.body); 
    const valid_categories = ["Academic & Study Materials", "Books", "Electronics and Gadgets", "Fashion and Clothing", "Food and Groceries", 
    "Gaming", "Health and Beauty", "Home & Accommodation Essentials", "Miscellaneous", "Sports & Outdoor"];

    const newItem = new Item({
        seller: req.body.seller,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        imageUrl: req.body.imageUrl,
        location: req.body.location,
        category: req.body.category
    });

    if (!(valid_categories.includes(newItem.category))) {
        console.error("Error saving item: Invalid category");
        res.status(400).json({ message: "Invalid category" });
    } 

    try {
        const savedItem = await newItem.save();
        console.log("Saved item:", savedItem);
        res.status(201).json(savedItem);
    } catch (err) {
        console.error("Error saving item:", err);
        res.status(400).json({ message: err.message });
    }
};

export const updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true }); 
        res.json(updatedItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

export const deleteItem = async (req, res) => {
    try {
        await findByIdAndDelete(req.params.id);
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};