import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { ListTodo, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    const { logout } = useAuthStore();
    return (
        <section className='p-4 md:p-8 max-w-3xl mx-auto'>
            {/* header */}
            <header className='flex items-center justify-between mb-12'>
                <div className='flex items-center justify-center flex-1 gap-2'>
                    <ListTodo className='size-10 text-primary' />
                    <h2 className='text-primary text-4xl font-bold'>
                        TODO APP
                    </h2>
                </div>
                <div className='flex items-center gap-4'>
                    <Link to='profile' className='border rounded-full p-1 hover:border-primary cursor-pointer group transition-colors duration-300'>
                        <User className='size-6 group-hover:text-primary transition-colors duration-300' />
                    </Link>
                    <Button
                        className='bg-primary/90 rounded-full hover:bg-primary cursor-pointer'
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </div>
            </header>
            {/* body */}
            <TodoForm />
            <ul>
                <TodoItem />
            </ul>
        </section>
    );
}
