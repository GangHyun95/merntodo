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

export default function EditTodo({
    title,
    id,
    handleUpdate,
}: {
    title: string;
    id: string;
    handleUpdate: (id: string, title: string) => Promise<void>;
}) {
    const [updatedTitle, setUpdatedTitle] = useState(title);
    const [isOpen, setIsOpen] = useState(false);
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await handleUpdate(id, updatedTitle);
        setIsOpen(false);
    };
    return (
        <Dialog open={isOpen}>
            <DialogTrigger asChild>
                <EditIcon
                    className='iconHover'
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
