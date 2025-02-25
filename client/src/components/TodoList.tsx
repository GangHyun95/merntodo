import TodoItem from './TodoItem';
import { Todo } from '@/utils/types';

type Props = {
    data: Todo[] | undefined;
    handleComplete: (id: string, isCompleted: boolean) => Promise<void>;
    handleUpdate: (id: string, title: string) => Promise<void>;
    deleteTodo: (id: string) => Promise<void>;
};

export default function TodoList({
    data,
    handleComplete,
    handleUpdate,
    deleteTodo,
}: Props) {
    return data?.length ? (
        <ul>
            {data.map((todo) => (
                <TodoItem
                    key={todo._id}
                    todo={todo}
                    handleComplete={handleComplete}
                    handleUpdate={handleUpdate}
                    deleteTodo={deleteTodo}
                />
            ))}
        </ul>
    ) : (
        <p className='mt-10 text-3xl text-center'>새로운 할 일을 추가하세요!</p>
    );
}
