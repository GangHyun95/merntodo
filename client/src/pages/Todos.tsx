import AuthInitializer from '@/components/AuthInitalizer';
import EditTodo from '@/components/EditTodo';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/store/authStore';
import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { Todo } from '@/utils/types';
import { CheckCheck, CircleUserRound, Plus, Trash2 } from 'lucide-react';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

const fetcher = (url:string, options: RequestInit = {}) => {
    return fetchWithAuth(url, {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        mode: 'cors',
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
        console.log({ title, id });
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
        <div className='mx-auto mt-20 max-w-lg px-4 w-full flex flex-col gap-6'>
            <AuthInitializer />
            <div>
                <CircleUserRound />
            </div>
            <h1 className='bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 font-bold text-4xl text-center mb-4 text-transparent bg-clip-text'>
                Todo App
            </h1>
            <form onSubmit={handleAddTodo} className='flex gap-4 items-center'>
                <Input
                    type='text'
                    placeholder='Enter todo'
                    name='title'
                    id='title'
                    required
                    className='shadow-md'
                />
                <button className='h-9 rounded-md border border-input bg-transparent px-4 text-base shadow-md flex items-center hover:bg-primary transition ease-linear group'>
                    <Plus
                        size={20}
                        className='transition ease-linear group-hover:stroke-white'
                    />
                </button>
            </form>
            {data?.length ? (
                <div className='shadow-md border-2 border-input bg-transparent flex flex-col rounded'>
                    {data.map((todo, index: number) => (
                        <div
                            key={index}
                            className={`flex h-10 items-center w-full ${
                                index === data.length - 1
                                    ? 'border-b-0'
                                    : 'border-b-2'
                            }`}
                        >
                            <span
                                className={`flex-1 px-3 ${
                                    todo.isCompleted &&
                                    'line-through text-[#63657b]'
                                }`}
                            >
                                {todo.title}
                            </span>
                            <div className='px-3 flex gap-2'>
                                <CheckCheck
                                    onClick={() =>
                                        handleComplete(
                                            todo._id,
                                            todo.isCompleted
                                        )
                                    }
                                    className={`transition ease-in-out hover:cursor-pointer ${
                                        todo.isCompleted
                                            ? 'text-primary'
                                            : 'text-slate-300'
                                    }`}
                                />
                                <Trash2
                                    className='iconHover'
                                    onClick={() => deleteTodo(todo._id)}
                                />
                                <EditTodo
                                    handleUpdate={handleUpdate}
                                    id={todo._id}
                                    title={todo.title}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <span>등록된 할 일이 없습니다</span>
            )}
        </div>
    );
}
