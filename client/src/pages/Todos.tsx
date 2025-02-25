import AuthInitializer from '@/components/AuthInitalizer';
import Profile from '@/components/Profile';
import useAuthStore from '@/store/authStore';
import '../styles/todo.scss';
import AddTodoForm from '@/components/AddTodoForm';
import TodoList from '@/components/TodoList';
import useTodos from '@/hooks/useTodos';

export default function Todos() {
    const { accessToken } = useAuthStore();

    const { todos, error, isLoading, addTodo, deleteTodo, toggleComplete, updateTodo } = useTodos(accessToken);
    if (error) return <h1 className='text-2xl py-2 text-center'>Something is wrong</h1>;
    if (isLoading) return <h1 className='text-2xl py-2 text-center'>Loading...</h1>;

    return (
        <section className='todo-container'>
            <AuthInitializer />
            <div className='header'>
                <h1>Todo App</h1>
                <Profile />
            </div>
            <div className='wrapper'>
                <AddTodoForm handleAddTodo={addTodo} />
                <TodoList
                    data={todos}
                    handleComplete={toggleComplete}
                    handleUpdate={updateTodo}
                    deleteTodo={deleteTodo}
                />
            </div>
        </section>
    );
}
