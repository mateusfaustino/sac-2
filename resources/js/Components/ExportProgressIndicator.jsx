import React, { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

const ExportProgressIndicator = ({ 
    jobId, 
    type, 
    progress = 0,
    status = 'preparing',
    estimatedTime = null,
    elapsedTime = 0,
    onStartProcessing,
    onComplete,
    onFail,
    onDownload,
    onCancel,
    isCompleted = false
}) => {
    const getStatusMessage = () => {
        switch (status) {
            case 'preparing':
                return `Preparando exportação de ${type}...`;
            case 'processing':
                return `Exportando ${type}...`;
            case 'completed':
                return `Exportação de ${type} concluída!`;
            case 'failed':
                return `Falha na exportação de ${type}`;
            default:
                return `Processando ${type}...`;
        }
    };

    const getStatusIcon = () => {
        switch (status) {
            case 'preparing':
                return (
                    <svg className="w-5 h-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                );
            case 'processing':
                return <LoadingSpinner size="sm" />;
            case 'completed':
                return (
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                );
            case 'failed':
                return (
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                );
            default:
                return <LoadingSpinner size="sm" />;
        }
    };

    return (
        <div className="w-full">
            <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                    {getStatusIcon()}
                </div>
                <div className="ml-3 w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                        {getStatusMessage()}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                        ID: {jobId}
                    </p>
                    
                    {(status === 'processing' || status === 'preparing') && (
                        <div className="mt-3">
                            <div className="flex justify-between text-sm text-gray-500 mb-1">
                                <span>Progresso</span>
                                <span>{progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            
                            {estimatedTime && (
                                <div className="mt-2 text-xs text-gray-500">
                                    Tempo estimado: {estimatedTime} segundo{estimatedTime !== 1 ? 's' : ''}
                                </div>
                            )}
                            
                            <div className="mt-2 text-xs text-gray-500">
                                Tempo decorrido: {elapsedTime} segundo{elapsedTime !== 1 ? 's' : ''}
                            </div>
                        </div>
                    )}
                    
                    {status === 'completed' && (
                        <div className="mt-3">
                            <button
                                onClick={onDownload}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                <svg className="mr-2 -ml-0.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                                </svg>
                                Baixar Arquivo
                            </button>
                        </div>
                    )}
                    
                    {status === 'failed' && (
                        <div className="mt-3 text-sm text-red-600">
                            Ocorreu um erro durante a exportação. Por favor, tente novamente.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExportProgressIndicator;