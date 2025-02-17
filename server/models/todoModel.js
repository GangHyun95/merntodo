import mongoose from 'mongoose';

const todoSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: [true, '로그인이 필요합니다.'],
    },
    title: {
        type: String,
        required: [true, '제목을 입력해주세요.'],
    },
    isCompleted: {
        type: Boolean,
        default: false,
    },
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;
