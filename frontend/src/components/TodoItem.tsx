import { Label } from '@radix-ui/react-label';
import { Input } from './ui/input';
import { Edit, Trash2 } from 'lucide-react';

export default function TodoItem() {
    return (
        <li className='flex items-center justify-between px-4 bg-slate-100 rounded-xl mb-2.5'>
            <Input type='checkbox' className='hidden' checked />
            <Label className='custom-checkbox'>
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
            <Label className='p-4 pr-0 flex-1'>타이틀</Label>
            <div className='flex gap-2 px-3'>
                <button>
                    <Edit className='fill-transparent hover:fill-green-400 transition-colors duration-200' />
                </button>
                <button>
                    <Trash2 className='fill-transparent hover:fill-red-400 transition-colors duration-200' />
                </button>
            </div>
        </li>
    );
}
