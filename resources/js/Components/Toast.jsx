import { useEffect, useState } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 5000 }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            handleClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
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
                <button 
                    onClick={handleClose}
                    className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    );
}