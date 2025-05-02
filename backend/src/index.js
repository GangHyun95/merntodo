import express from 'express';
import authRoutes from './routes/auth.route.js';
import todoRoutes from './routes/todo.route.js';

const app = express();

const PORT = process.env.PORT || 3000;

app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes)

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
