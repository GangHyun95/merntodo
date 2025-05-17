import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { useTodoStore } from '@/store/useTodoStore';

export default function TodoForm() {
    const [formData, setFormData] = useState({
        title: '',
        isCompleted: false,
    });

    const addTodo = useTodoStore((state) => state.addTodo);
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        addTodo(formData);
        setFormData({ title: '', isCompleted: false });
    };

    return (
        <form onSubmit={handleSubmit} className='relative mb-3'>
            <Input
                type='text'
                placeholder='Enter todo'
                value={formData.title}
                onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                }
                name='title'
                id='title'
                required
                autoComplete='off'
                className='p-6 w-full bg-transparent border-2 border-gray-200 rounded-full caret-primary !text-lg'
            />
            <Button className='static w-full mt-2.5 h-auto p-4 sm:h-full sm:mt-0 sm:w-auto sm:absolute sm:py-0 top-0 right-0 bg-primary text-white px-8 rounded-full font-semibold cursor-pointer'>
                ADD
            </Button>
        </form>
    );
}
