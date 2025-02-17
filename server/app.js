import express from 'express';
import AuthRoute from './routes/auth.js';
import TodoRoute from './routes/todo.js';

const app = express();
app.set('port', process.env.PORT || 3000);

app.use('/api/user', AuthRoute);
app.use('/api/todos', TodoRoute);

app.get('/', (req, res, next) => {
    res.send('hello world');
});

app.listen(app.get('port'), () => {
    console.log(`listening on port ${app.get('port')}`);
});
