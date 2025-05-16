import { Router } from 'express';
import { getItems, addItem, deleteItem, updateItem, getItem } from '../controllers/item_controller.js';

const router = Router();

router.get('/', getItems);  

router.get('/:id', getItem);

router.post('/', addItem);

router.put('/:id', updateItem);

router.delete('/:id', deleteItem);

export default router;
