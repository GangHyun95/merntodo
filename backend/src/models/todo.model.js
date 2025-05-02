import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },

    isCompleted: {
        type: Boolean,
        default: false,
    },
});

const Todo = mongoose.models('Todo', todoSchema);

export default Todo;
