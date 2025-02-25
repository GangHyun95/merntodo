import { FormEvent, useState } from 'react';

type Props = {
    handleAddTodo: (title: string) => void;
};
export default function AddTodoForm({ handleAddTodo }: Props) {
    const [title, setTitle] = useState('');

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleAddTodo(title);
        setTitle('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type='text'
                placeholder='Enter todo'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name='title'
                id='title'
                required
                autoComplete='off'
                className='todo-input'
            />
            <button className='add-button'>ADD</button>
        </form>
    );
}
