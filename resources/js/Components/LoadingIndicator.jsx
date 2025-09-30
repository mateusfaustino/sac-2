import React from 'react';

const LoadingIndicator = ({ message = "Carregando...", showEstimatedTime = false, estimatedTime = null }) => {
    return (
        <div className="flex flex-col items-center justify-center py-8">
            <div className="flex items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-lg font-medium text-gray-700">{message}</span>
            </div>
            
            {showEstimatedTime && estimatedTime && (
                <div className="mt-2 text-sm text-gray-500">
                    Tempo estimado: {estimatedTime} segundos
                </div>
            )}
            
            <div className="mt-4 w-64 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
        </div>
    );
};

export default LoadingIndicator;