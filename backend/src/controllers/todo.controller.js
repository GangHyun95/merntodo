import Todo from '../models/todo.model.js';

export const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find({ userId: req.user._id });

        if (!todos) {
            return res.status(404).json({
                message: '할 일 목록 가져오기 오류',
            });
        }
        res.status(200).json({
            message: '할 일 목록을 가져왔습니다.',
            todos,
        });
    } catch (error) {
        console.error('할 일 목록 가져오기 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const addTodo = async (req, res) => {
    const { title } = req.body;
    try {
        if (!title) {
            return res.status(400).json({
                message: '내용을 입력해 주세요.',
            });
        }

        const newTodo = new Todo({
            userId: req.user._id,
            title,
        });

        await newTodo.save();
        res.status(201).json({
            message: '할 일이 추가되었습니다.',
            newTodo,
        });
    } catch (error) {
        console.error('할 일 추가 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const updateTodo = async (req, res) => {
    const { id } = req.params;
    const { title, isCompleted } = req.body;

    try {
        const todo = await Todo.findById(id);
        if (todo.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                message: '권한이 없습니다.',
            });
        }
        todo.title = title || todo.title;
        if (isCompleted !== undefined) {
            todo.isCompleted = isCompleted;
        }
        await todo.save();

        res.status(200).json({
            message: '할 일이 업데이트 되었습니다.',
        });
    } catch (error) {
        console.error('할 일 업데이트 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};

export const deleteTodo = async (req, res) => {
    const { id } = req.params;

    try {
        const todo = await Todo.deleteOne({
            _id: id,
            userId: req.user._id,
        });

        if (!todo) {
            return res.status(404).json({
                message: '할 일을 찾을 수 없습니다.',
            });
        }
        res.status(200).json({
            message: '할 일이 삭제되었습니다.',
        });
    } catch (error) {
        console.error('할 일 삭제 오류:', error);
        res.status(500).json({
            message: '서버 오류가 발생했습니다.',
        });
    }
};
