"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { CheckCircle, XCircle, AlertCircle, X } from "lucide-react";

type ToastType = "success" | "error" | "warning";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType = "success") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
}

function ToastContainer({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) {
    return (
        <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: "bg-emerald-50 dark:bg-emerald-900 border-emerald-200 dark:border-emerald-500 text-emerald-800 dark:text-emerald-300",
        error: "bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-500 text-red-800 dark:text-red-300",
        warning: "bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-500 text-amber-800 dark:text-amber-300",
    };

    const icons = {
        success: <CheckCircle size={20} className="text-emerald-500" />,
        error: <XCircle size={20} className="text-red-500" />,
        warning: <AlertCircle size={20} className="text-amber-500" />,
    };

    return (
        <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg animate-in slide-in-from-right fade-in duration-300 ${styles[toast.type]}`}
        >
            {icons[toast.type]}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button
                onClick={onClose}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
}
