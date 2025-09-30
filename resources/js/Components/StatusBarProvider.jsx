import { createContext, useContext, useState } from 'react';
import StatusBar from './StatusBar';

const StatusBarContext = createContext();

export function StatusBarProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (message, type = 'info', duration = 5000) => {
        const id = Date.now() + Math.random();
        const notification = { id, message, type, duration };
        
        setNotifications(prev => [...prev, notification]);
        
        // Auto remove notification after duration
        setTimeout(() => {
            removeNotification(id);
        }, duration);
    };

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    return (
        <StatusBarContext.Provider value={{ addNotification, removeNotification, clearAll, notifications }}>
            {children}
            <StatusBar notifications={notifications} onRemove={removeNotification} onClearAll={clearAll} />
        </StatusBarContext.Provider>
    );
}

export function useStatusBar() {
    const context = useContext(StatusBarContext);
    if (!context) {
        throw new Error('useStatusBar must be used within a StatusBarProvider');
    }
    return context;
}

// Standalone StatusBarDisplay component
function StatusBarDisplay({ notifications, onRemove, onClearAll }) {
    if (notifications.length === 0) return null;

    // Get icon based on notification type
    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                );
            case 'error':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                );
            case 'warning':
                return (
                    <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                );
            case 'processing':
                return (
                    <svg className="w-5 h-5 text-blue-500 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
        }
    };

    // Get background color based on notification type
    const getBgColor = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-100 border-green-400';
            case 'error':
                return 'bg-red-100 border-red-400';
            case 'warning':
                return 'bg-yellow-100 border-yellow-400';
            case 'processing':
                return 'bg-blue-100 border-blue-400';
            default:
                return 'bg-blue-100 border-blue-400';
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 space-y-2 max-w-md">
            {notifications.map((notification) => (
                <div 
                    key={notification.id}
                    className={`flex items-start p-4 rounded-lg border shadow-lg transform transition-all duration-300 ease-in-out ${getBgColor(notification.type)}`}
                >
                    <div className="flex-shrink-0 mt-0.5">
                        {getIcon(notification.type)}
                    </div>
                    <div className="ml-3 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                            {notification.message}
                        </p>
                        {notification.progress !== undefined && (
                            <div className="mt-2 w-full bg-white bg-opacity-50 rounded-full h-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${notification.progress}%` }}
                                ></div>
                            </div>
                        )}
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button
                            onClick={() => onRemove(notification.id)}
                            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            ))}
            
            {notifications.length > 1 && (
                <div className="flex justify-between items-center p-2 rounded-lg border shadow-lg bg-gray-50 border-gray-300">
                    <span className="text-sm text-gray-600">
                        {notifications.length} notificação{notifications.length > 1 ? 's' : ''}
                    </span>
                    <button
                        onClick={onClearAll}
                        className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                    >
                        Limpar tudo
                    </button>
                </div>
            )}
        </div>
    );
}

export default StatusBarProvider;