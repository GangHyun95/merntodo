import { axiosInstance } from '@/lib/axios';
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';

type TodoState = {
    todos: Todo[];
    gettingTodos: boolean;
    addTodo: (todo: Todo) => Promise<void>;
    getTodos: () => Promise<void>;
    updateTodo: (todo: Todo) => Promise<void>;
    deleteTodo: (todoId: string) => Promise<void>;
};

export type Todo = {
    _id?: string;
    title: string;
    isCompleted: boolean;
};

export const useTodoStore = create<TodoState>((set) => ({
    todos: [],
    gettingTodos: true,

    addTodo: async (todo: Todo) => {
        const { accessToken } = useAuthStore.getState();
        try {
            const res = await axiosInstance.post('/todo', todo, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            toast.success('할 일이 추가되었습니다.');
            set((state) => ({
                todos: [...state.todos, res.data.newTodo],
            }));
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
    },

    getTodos: async () => {
        set({ gettingTodos: true });
        const { accessToken } = useAuthStore.getState();
        try {
            const res = await axiosInstance.get('/todo', {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            set({ todos: res.data.todos });
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        } finally {
            set({ gettingTodos: false });
        }
    },

    updateTodo: async (todo: Todo) => {
        const { accessToken } = useAuthStore.getState();
        try {
            await axiosInstance.put(`/todo/${todo._id}`, todo, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            set((state) => ({
                todos: state.todos.map((t) =>
                    t._id === todo._id ? { ...t, ...todo } : t
                ),
            }));
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
    },

    deleteTodo: async (todoId) => {
        const { accessToken } = useAuthStore.getState();
        try {
            const res = await axiosInstance.delete(`/todo/${todoId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (res.status === 200) {
                set((state) => ({
                    todos: state.todos.filter((todo) => todo._id !== todoId),
                }));
                toast.success('할 일이 삭제되었습니다.');
            }
        } catch (error) {
            const err = error as AxiosError<{ message: string }>;
            const errorMessage =
                err.response?.data?.message || 'Unknown error occurred';
            toast.error(errorMessage);
        }
    },
}));
