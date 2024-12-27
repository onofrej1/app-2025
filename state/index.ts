import { JSX } from 'react';
import { create } from 'zustand';

type CallbackFunction = (...args: any[]) => void;

interface DialogProps {
    isOpen: boolean;
    open: () => void;
    onClose: () => void;
    title: string;
    description: string;
    cancelLabel: string;
    confirmLabel: string;
    trigger: JSX.Element;
    action: CallbackFunction;
    setAction: (CallbackFunction) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setCancelLabel: (cancelLabel: string) => void;
    setConfirmLabel: (confirmLabel: string) => void;
}

export const useDialog = create<DialogProps>((set) => ({
    isOpen: false,
    open: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
    title: '',
    setTitle: (title) => set({ title }),
    description: '',
    setDescription: (description) => set({ description }),
    cancelLabel: 'Cancel',
    setCancelLabel: (cancelLabel) => set({ cancelLabel }),
    confirmLabel: 'Confirm',
    setConfirmLabel: (confirmLabel) => set({ confirmLabel }),
    action: () => {},
    setAction: (action: CallbackFunction) => set({ action }),
    trigger: null,
    setTrigger: (trigger) => set({ trigger })
}));