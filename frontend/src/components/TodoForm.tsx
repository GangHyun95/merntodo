import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function TodoForm() {
    const [title, setTitle] = useState('');
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };
    
    return (
        <form onSubmit={handleSubmit} className='relative mb-3'>
            <Input
                type='text'
                placeholder='Enter todo'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                name='title'
                id='title'
                required
                autoComplete='off'
                className='p-6 w-full bg-transparent border-2 border-gray-200 rounded-full caret-primary !text-lg'
            />
            <Button className='absolute top-0 right-0 bg-primary text-white h-full px-8 rounded-full font-semibold cursor-pointer'>
                ADD
            </Button>
        </form>
    );
}
