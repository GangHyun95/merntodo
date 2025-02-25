import { fetchWithAuth } from '@/utils/fetchWithAuth';
import { Todo } from '@/utils/types';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import useSWR from 'swr';

const fetcher = (url: string, options: RequestInit = {}) => {
    return fetchWithAuth(url, {
        method: options.method || 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: options.body,
    });
};

export default function useTodos(accessToken: string | null) {
    const {
        data: todos,
        error,
        mutate,
        isLoading,
    } = useSWR<Todo[]>(
        accessToken ? 'http://localhost:3000/api/todos' : null,
        fetcher
    );

    useEffect(() => {
        if (accessToken && mutate) {
            mutate();
        }
    }, [accessToken]);

    function handleError(error: string | Error) {
        const errorMessage = error instanceof Error ? error.message : error;
        toast.error(errorMessage);
        throw new Error(errorMessage);
    }

    async function addTodo(title: string) {
        if (!title.trim().length) {
            toast.error('할 일을 입력해주세요!');
            return;
        }

        const newTodo = {
            title: `${title} adding...`,
            _id: Date.now().toString(),
            isCompleted: false,
        };

        await mutate(
            async () => {
                const response = await fetcher(
                    'http://localhost:3000/api/todos',
                    {
                        method: 'POST',
                        body: JSON.stringify({ title }),
                    }
                );

                if (response.error) {
                    handleError(response.error);
                }

                return [...(todos || []), response];
            },
            {
                optimisticData: [...(todos || []), newTodo],
                revalidate: true,
                rollbackOnError: true,
            }
        );
    }

    async function deleteTodo(id: string) {
        toast.success('Todo deleted!');

        await mutate(
            async () => {
                const response = await fetcher(
                    `http://localhost:3000/api/todos/${id}`,
                    { method: 'DELETE' }
                );

                if (response.error) {
                    handleError(response.error);
                }

                return todos?.filter((todo) => todo._id !== id);
            },
            {
                optimisticData: todos?.filter((todo) => todo._id !== id),
                rollbackOnError: true,
                revalidate: false,
            }
        );
    }

    async function toggleComplete(id: string, isCompleted: boolean) {
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

                return todos?.map((todo) =>
                    todo._id === id
                        ? { ...todo, isCompleted: !isCompleted }
                        : todo
                );
            },
            {
                optimisticData: todos?.map((todo) =>
                    todo._id === id
                        ? { ...todo, isCompleted: !isCompleted }
                        : todo
                ),
                rollbackOnError: true,
                revalidate: false,
            }
        );
    }

    async function updateTodo(id: string, title: string) {
        toast.success('Todo Updated!');

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

                return todos?.map((todo) =>
                    todo._id === id ? { ...todo, title } : todo
                );
            },
            {
                optimisticData: todos?.map((todo) =>
                    todo._id === id ? { ...todo, title } : todo
                ),
                rollbackOnError: true,
                revalidate: false,
            }
        );
    }

    return {
        todos,
        error,
        isLoading,
        addTodo,
        deleteTodo,
        toggleComplete,
        updateTodo,
    };
}
