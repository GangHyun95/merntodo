import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FormEvent, useState } from 'react';
import { EditIcon } from 'lucide-react';
import { useTodoStore } from '@/store/useTodoStore';

export default function EditTodo({
    id,
    title,
    isCompleted,
}: {
    id: string;
    title: string;
    isCompleted: boolean;
}) {
    const updateTodo = useTodoStore((state) => state.updateTodo);
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [isOpen, setIsOpen] = useState(false);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsOpen(false);
        updateTodo({ _id: id, title: updatedTitle, isCompleted: isCompleted });
    };
    return (
        <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
            <DialogTrigger asChild>
                <EditIcon
                    className='fill-transparent hover:fill-green-400 transition-colors duration-200 cursor-pointer'
                    onClick={() => setIsOpen(true)}
                />
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
                <DialogHeader>
                    <DialogTitle>Todo 수정</DialogTitle>
                    <DialogDescription>
                        todo를 수정하세요. 변경이 완료되면 저장 버튼을
                        눌러주세요.
                    </DialogDescription>
                </DialogHeader>
                <form className='flex flex-col gap-2' onSubmit={handleSubmit}>
                    <Label htmlFor='title'>기존 todo</Label>
                    <Input
                        id='title'
                        name='title'
                        value={updatedTitle}
                        onChange={(e) => setUpdatedTitle(e.target.value)}
                        className='col-span-3'
                    />
                    <DialogFooter>
                        <Button>저장</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
