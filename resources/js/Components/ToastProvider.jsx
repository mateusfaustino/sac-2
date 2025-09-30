import { createContext, useContext, useState } from 'react';
import Toast from './Toast';
import ToastWithUndo from './ToastWithUndo';

const ToastContext = createContext();

let toastId = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = (message, type = 'success', duration = 5000, onUndo = null) => {
        const id = toastId++;
        const newToast = { 
            id, 
            message, 
            type, 
            duration,
            onUndo,
            showUndo: !!onUndo
        };
        
        setToasts(prev => [...prev, newToast]);
        
        // Auto remove toast after duration
        if (!onUndo) {
            setTimeout(() => {
                removeToast(id);
            }, duration);
        }
    };

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const handleUndo = (id, onUndoCallback) => {
        onUndoCallback();
        removeToast(id);
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
                {toasts.map(toast => (
                    toast.showUndo ? (
                        <ToastWithUndo
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            showUndo={toast.showUndo}
                            onClose={() => removeToast(toast.id)}
                            onUndo={() => handleUndo(toast.id, toast.onUndo)}
                        />
                    ) : (
                        <Toast
                            key={toast.id}
                            message={toast.message}
                            type={toast.type}
                            duration={toast.duration}
                            onClose={() => removeToast(toast.id)}
                        />
                    )
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}