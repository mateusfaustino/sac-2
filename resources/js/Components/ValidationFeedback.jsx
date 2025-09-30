import React from 'react';

const ValidationFeedback = ({ isValid, message, type = 'info' }) => {
    if (!message) return null;

    const getIcon = () => {
        if (type === 'error') {
            return (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            );
        } else if (type === 'success') {
            return (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            );
        } else {
            return (
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            );
        }
    };

    const getColorClasses = () => {
        if (type === 'error') {
            return 'bg-red-50 text-red-800 border-red-200';
        } else if (type === 'success') {
            return 'bg-green-50 text-green-800 border-green-200';
        } else {
            return 'bg-blue-50 text-blue-800 border-blue-200';
        }
    };

    return (
        <div className={`flex items-start p-3 rounded-lg border ${getColorClasses()} mt-1`}>
            <div className="flex-shrink-0">
                {getIcon()}
            </div>
            <div className="ml-3">
                <p className="text-sm">{message}</p>
            </div>
        </div>
    );
};

export default ValidationFeedback;