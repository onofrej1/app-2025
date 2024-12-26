"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDialog } from "@/state";

export default function Alert() {
  const {
    isOpen,
    onClose,
    trigger,
    title,
    description,
    cancelLabel,
    confirmLabel,
    action,
  } = useDialog();

  const confirm = () => {
    action();
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose} defaultOpen={isOpen}>
      <AlertDialogTrigger>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        {(cancelLabel || confirmLabel) && (
          <AlertDialogFooter>
            {cancelLabel && (
              <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
            )}
            {confirmLabel && (
              <AlertDialogAction onClick={confirm}>
                {confirmLabel}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        )}
      </AlertDialogContent>
    </AlertDialog>
  );
}
