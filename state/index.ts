import { JSX } from 'react';
import { create } from 'zustand';

type CallbackFunction = (...args: any[]) => void;

interface AlertProps {
    isOpen: boolean;
    open: () => void;
    onClose: () => void;
    title: string;
    description: string;
    cancelLabel: string;
    confirmLabel: string;
    trigger: string | JSX.Element;
    action: CallbackFunction;
    setAction: (arg: CallbackFunction) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setCancelLabel: (cancelLabel: string) => void;
    setConfirmLabel: (confirmLabel: string) => void;
}

export const useAlert = create<AlertProps>((set) => ({
    isOpen: false,    
    title: '',    
    description: '',
    action: () => {},    
    cancelLabel: 'Cancel',    
    confirmLabel: 'Confirm',    
    trigger: '',
    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setCancelLabel: (cancelLabel) => set({ cancelLabel }),
    setConfirmLabel: (confirmLabel) => set({ confirmLabel }),        
    setTrigger: (trigger: string | JSX.Element) => set({ trigger }),
    setAction: (action: CallbackFunction) => set({ action }),
    open: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));

interface DialogProps {
    isOpen: boolean;
    open: () => void;
    onClose: () => void;
    title: string;
    description: string,    
    content: string | JSX.Element;
    trigger: string | JSX.Element;
    action: CallbackFunction;
    setAction: (arg: CallbackFunction) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setContent: (content: string | JSX.Element) => void;
}

export const useDialog = create<DialogProps>((set) => ({
    isOpen: false,
    title: '',    
    description: '',        
    content: '',
    trigger: '',
    action: () => {},
    setTitle: (title) => set({ title }),    
    setDescription: (description) => set({ description }),
    setContent: (content) => set({ content }),    
    setAction: (action: CallbackFunction) => set({ action }),    
    setTrigger: (trigger: string | JSX.Element) => set({ trigger }),
    open: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
}));