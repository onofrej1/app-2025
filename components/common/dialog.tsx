"use client";
import { useDialog } from "@/state";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  //DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function DialogModal() {
  const { isOpen, onClose, trigger, title, description, content } = useDialog();  

  return (
    <Dialog open={isOpen} onOpenChange={onClose} defaultOpen={isOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (<DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>)}
        </DialogHeader>
        {content}
        {/*<DialogFooter></DialogFooter>*/}
      </DialogContent>
    </Dialog>
  );
}
