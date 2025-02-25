import { connectToDB } from '../utils/connect.js';
import Todo from '../models/todoModel.js';
import { createError } from '../utils/error.js';

export async function getAllTodos(req, res, next) {
    await connectToDB();
    const todos = await Todo.find({ userID: req.user.id });
    res.status(200).send(todos);
}

export async function addTodo(req, res, next) {
    if (!req.body || !req.body.title) {
        return next(createError(404, '내용을 입력해주세요.'));
    }

    await connectToDB();
    const newTodo = new Todo({ title: req.body.title, userID: req.user.id });
    await newTodo.save();
    res.status(201).json(newTodo);
}

export async function getTodo(req, res, next) {
    try {
        await connectToDB();
        const todo = await Todo.findById(req.params.id);
        if (!todo) return next(createError(404, '할 일을 찾을 수 없습니다.'));
        if (todo.userID.toString() !== req.user.id)
            return next(createError(404, '권한이 없습니다.'));
        res.status(200).send(todo);
    } catch (error) {
        next(createError(404, '할 일을 찾을 수 없습니다.'));
    }
}

export async function updateTodo(req, res, next) {
    const id = req.params.id;
    if (!req.body) return next(createError(404, '입력값이 없습니다.'));
    try {
        await connectToDB();
        const todo = await Todo.findById(id);
        if (todo.userID.toString() !== req.user.id)
            return next(createError(404, '권한이 없습니다.'));
        todo.title = req.body.title || todo.title;
        if (req.body.isCompleted !== undefined) {
            todo.isCompleted = req.body.isCompleted;
        }
        await todo.save();
        res.status(200).json({ message: '할 일이 수정되었습니다.' });
    } catch (error) {
        return next(createError(404, '할 일을 찾을 수 없습니다.'));
    }
}

export async function deleteTodo(req, res, next) {
    try {
        await connectToDB();
        const todo = await Todo.deleteOne({
            _id: req.params.id,
            userID: req.user.id,
        });
        if (!todo.deletedCount)
            return next(createError(400, '할 일을 찾을 수 없습니다.'));
        res.status(200).json({ message: '할 일이 삭제되었습니다.' });
    } catch (error) {
        next(createError(400, '할 일을 찾을 수 없습니다.'));
    }
}
