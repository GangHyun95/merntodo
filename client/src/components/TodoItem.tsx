import { Trash2 } from 'lucide-react';
import EditTodo from './EditTodo';
import { Todo } from '@/utils/types';

type Props = {
    todo: Todo;
    handleComplete: (id: string, isCompleted: boolean) => Promise<void>;
    handleUpdate: (id: string, title: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
};

export default function TodoItem({
    todo,
    handleComplete,
    handleUpdate,
    deleteTodo,
}: Props) {
    return (
        <li className='todo'>
            <input
                type='checkbox'
                id={`todo-${todo._id}`}
                checked={todo.isCompleted}
                onChange={() => handleComplete(todo._id, todo.isCompleted)}
            />
            <label htmlFor={`todo-${todo._id}`} className='custom-checkbox'>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='24px'
                    viewBox='0 -960 960 960'
                    width='24px'
                    fill='#5f6368'
                >
                    <path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z' />
                </svg>
            </label>
            <label htmlFor={`todo-${todo._id}`} className='todo-text'>
                {todo.title}
            </label>
            <div className='btn-wrap'>
                <button className='edit-button'>
                    <EditTodo
                        handleUpdate={handleUpdate}
                        id={todo._id}
                        title={todo.title}
                    />
                </button>
                <button
                    className='delete-button'
                    onClick={() => deleteTodo(todo._id)}
                >
                    <Trash2 />
                </button>
            </div>
        </li>
    );
}
