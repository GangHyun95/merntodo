import AuthInitializer from '@/components/AuthInitalizer';
import EditTodo from '@/components/EditTodo';
import Profile from '@/components/Profile';
import useAuthStore from '@/store/authStore';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { Todo } from '@/utils/types';
import { Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';
import '../styles/todo.scss';

const fetcher = (url: string, options: RequestInit = {}) => {
    return fetchWithAuth(url, {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: options.body,
    });
};

export default function Todos() {
    const { accessToken } = useAuthStore();

    const { data, error, mutate, isLoading } = useSWR<Todo[]>(
        accessToken ? 'http://localhost:3000/api/todos' : null,
        fetcher
    );

    useEffect(() => {
        if (accessToken && mutate) {
            mutate();
        }
    }, [accessToken]);
    if (error) {
        return (
            <h1 className='text-2xl py-2 text-center'>Something is wrong</h1>
        );
    }

    if (isLoading) {
        return <h1 className='text-2xl py-2 text-center'>Loading...</h1>;
    }

    function handleError(error: string | Error) {
        const errorMessage = error instanceof Error ? error.message : error;
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }

    const handleAddTodo = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const title = formData.get('title') as string;

        if (!title.trim().length) {
            toast.error('할 일을 입력해주세요!');
            return;
        }

        const newTodo = {
            title: `${title} adding...`,
            _id: Date.now().toString(),
            isCompleted: false,
        };

        async function addTodo() {
            const response = await fetcher('http://localhost:3000/api/todos', {
                method: 'POST',
                body: JSON.stringify({ title }),
            });
            if (response.error) {
                handleError(response.error);
            }
            return [...(data || []), response];
        }

        await mutate(addTodo(), {
            optimisticData: [...(data || []), newTodo],
            revalidate: true,
            rollbackOnError: true,
        });

        form.reset();
    };

    async function deleteTodo(id: string) {
        toast.success('Todo deleted!');
        await mutate(
            async () => {
                const response = await fetcher(
                    `http://localhost:3000/api/todos/${id}`,
                    {
                        method: 'DELETE',
                    }
                );
                if (response.error) {
                    handleError(response.error);
                }

                return data?.filter((todo) => todo._id !== id);
            },
            {
                optimisticData: data?.filter((todo) => todo._id !== id),
                rollbackOnError: true,
                revalidate: false,
            }
        );
    }

    async function handleComplete(id: string, isCompleted: boolean) {
        await mutate(
            async () => {
                const response = await fetcher(
                    `http://localhost:3000/api/todos/${id}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify({ isCompleted: !isCompleted }),
                    }
                );
                if (response.error) {
                    handleError(response.error);
                }

                return data?.map((todo) => {
                    if (todo._id === id) {
                        return { ...todo, isCompleted: !isCompleted };
                    }
                    return todo;
                });
            },
            {
                optimisticData: data?.map((todo) => {
                    if (todo._id === id) {
                        return { ...todo, isCompleted: !isCompleted };
                    }
                    return todo;
                }),
                rollbackOnError: true,
                revalidate: false,
            }
        );
    }

    async function handleUpdate(formData: FormData) {
        toast.success('Todo Updated!');
        const title = formData.get('title') as string;
        const id = formData.get('id');
        await mutate(
            async () => {
                const response = await fetcher(
                    `http://localhost:3000/api/todos/${id}`,
                    {
                        method: 'PUT',
                        body: JSON.stringify({ title }),
                    }
                );
                if (response.error) {
                    handleError(response.error);
                }
                return data?.map((todo) => {
                    if (todo._id === id) {
                        return { ...todo, title };
                    }
                    return todo;
                });
            },
            {
                optimisticData: data?.map((todo) => {
                    if (todo._id === id) {
                        return { ...todo, title };
                    }
                    return todo;
                }),
                rollbackOnError: true,
                revalidate: false,
            }
        );
    }

    return (
        <section className='todo-container'>
            <AuthInitializer />

            <div className='header'>
                <h1>Todo App</h1>
                <Profile />
            </div>
            <div className='wrapper'>
                <form onSubmit={handleAddTodo}>
                    <input
                        type='text'
                        placeholder='Enter todo'
                        name='title'
                        id='title'
                        required
                        autoComplete='off'
                        className='todo-input'
                    />
                    <button className='add-button'>ADD</button>
                </form>
                {data?.length ? (
                    <ul>
                        {data.map((todo, index: number) => (
                            <li key={index} className='todo'>
                                <input
                                    type='checkbox'
                                    id={`todo-${todo._id}`}
                                    checked={todo.isCompleted}
                                    onChange={() =>
                                        handleComplete(
                                            todo._id,
                                            todo.isCompleted
                                        )
                                    }
                                />
                                <label
                                    htmlFor={`todo-${todo._id}`}
                                    className='custom-checkbox'
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
                                </label>
                                <label
                                    htmlFor={`todo-${todo._id}`}
                                    className='todo-text'
                                >
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
                        ))}
                    </ul>
                ) : (
                    <div>새로운 할 일을 추가하세요!</div>
                )}
            </div>
        </section>
    );
}
