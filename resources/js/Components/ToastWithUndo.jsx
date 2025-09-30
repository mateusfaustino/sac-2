import { useEffect, useState } from 'react';

export default function ToastWithUndo({ 
    message, 
    type = 'success', 
    onClose, 
    onUndo, 
    duration = 5000,
    showUndo = false 
}) {
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(duration / 1000);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        const countdown = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            clearTimeout(timer);
            clearInterval(countdown);
        };
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleUndo = () => {
        onUndo();
        handleClose();
    };

    const getTypeClasses = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    if (!isVisible) return null;

    return (
        <div className={`fixed top-4 right-4 z-50 rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out ${getTypeClasses()} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
            <div className="flex items-center">
                <span className="flex-1">{message}</span>
                {showUndo && (
                    <button 
                        onClick={handleUndo}
                        className="ml-4 px-3 py-1 bg-white bg-opacity-20 rounded hover:bg-opacity-30 focus:outline-none"
                    >
                        Desfazer
                    </button>
                )}
                <button 
                    onClick={handleClose}
                    className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            {showUndo && (
                <div className="mt-2 w-full bg-white bg-opacity-20 rounded-full h-1">
                    <div 
                        className="bg-white h-1 rounded-full transition-all duration-1000 ease-linear"
                        style={{ width: `${(timeLeft / (duration / 1000)) * 100}%` }}
                    ></div>
                </div>
            )}
        </div>
    );
}