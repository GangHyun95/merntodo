import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minlength: 6,
    },
});

const User = mongoose.model('User', userSchema);

export default User;
