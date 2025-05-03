import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Trash2 } from 'lucide-react';
import { Todo, useTodoStore } from '@/store/useTodoStore';
import EditTodo from './EditTodo';

export default function TodoItem({ _id, title, isCompleted }: Todo) {
    const { updateTodo, deleteTodo } = useTodoStore();
    return (
        <li className='flex items-center justify-between px-4 bg-slate-100 rounded-xl mb-2.5'>
            <Input
                type='checkbox'
                id={_id}
                checked={isCompleted}
                onChange={() =>
                    updateTodo({ _id, title, isCompleted: !isCompleted })
                }
                className='hidden peer'
            />
            <Label
                htmlFor={_id}
                className='custom-checkbox peer-checked:bg-primary'
            >
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    height='24px'
                    viewBox='0 -960 960 960'
                    width='24px'
                    fill='#5f6368'
                >
                    <path d='M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z' />
                </svg>
            </Label>
            <Label htmlFor={_id} className='p-4 pr-0 flex-1'>
                {title}
            </Label>
            <div className='flex gap-2 px-3'>
                <button>
                    <EditTodo
                        id={_id as string}
                        title={title}
                        isCompleted={isCompleted}
                    />
                </button>
                <button onClick={() => deleteTodo(_id as string)}>
                    <Trash2 className='fill-transparent hover:fill-red-400 transition-colors duration-200 cursor-pointer' />
                </button>
            </div>
        </li>
    );
}
