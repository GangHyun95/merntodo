import TodoForm from '@/components/TodoForm';
import TodoItem from '@/components/TodoItem';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useTodoStore } from '@/store/useTodoStore';
import { ListTodo, Loader, User } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
    const { logout } = useAuthStore();
    const { todos, getTodos, gettingTodos } = useTodoStore();
    useEffect(() => {
        getTodos();
    }, [getTodos]);

    if (gettingTodos)
        return (
            <div className='flex items-center justify-center h-screen'>
                <Loader className='size-10 animate-spin' />
            </div>
        );

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
                    <Link
                        to='profile'
                        className='border rounded-full p-1 hover:border-primary cursor-pointer group transition-colors duration-300'
                    >
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
            {todos.length > 0 ? (
                <ul>
                    {todos.map((todo) => (
                        <TodoItem
                            key={todo._id}
                            _id={todo._id}
                            title={todo.title}
                            isCompleted={todo.isCompleted}
                        />
                    ))}
                </ul>
            ) : (
                <p className='mt-10 text-3xl text-center'>
                    새로운 할 일을 추가하세요!
                </p>
            )}
        </section>
    );
}
