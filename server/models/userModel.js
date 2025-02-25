import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    email: {
        type: String,
        required: [true, '이메일을 입력해주세요.'],
        unique: [true, '이미 사용 중인 이메일입니다.'],
    },
    password: {
        type: String,
        select: false,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
