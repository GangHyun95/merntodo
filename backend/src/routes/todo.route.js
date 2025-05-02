import express from 'express';
import { addTodo, deleteTodo, getAllTodos, getTodo, updateTodo } from '../controllers/todo.controller.js';

const router = express.Router();

router.get('/', getAllTodos);

router.post('/', addTodo);

router.put('/:id', updateTodo);

router.get('/:id', getTodo);

router.delete('/:id', deleteTodo);

export default router;
