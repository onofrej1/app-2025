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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && (<DialogDescription>
            {description}
          </DialogDescription>)}
        </DialogHeader>
        {content}
        {/*<DialogFooter></DialogFooter>*/}
      </DialogContent>
    </Dialog>
  );
}
