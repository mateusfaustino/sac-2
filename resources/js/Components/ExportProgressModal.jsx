import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import ExportProgressIndicator from './ExportProgressIndicator';

const ExportProgressModal = ({ 
    show, 
    jobId, 
    type, 
    onClose, 
    onDownload,
    onCancel 
}) => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('preparing');
    const [estimatedTime, setEstimatedTime] = useState(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [isCompleted, setIsCompleted] = useState(false);

    // Reset state when modal opens
    useEffect(() => {
        if (show) {
            setProgress(0);
            setStatus('preparing');
            setEstimatedTime(null);
            setElapsedTime(0);
            setIsCompleted(false);
        }
    }, [show]);

    // Simulate progress
    useEffect(() => {
        if (!show) return;
        
        if (status === 'processing') {
            const interval = setInterval(() => {
                setProgress(prev => {
                    const newProgress = Math.min(prev + Math.floor(Math.random() * 8) + 2, 95);
                    return newProgress;
                });
            }, 800);

            // Update elapsed time
            const timeInterval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);

            return () => {
                clearInterval(interval);
                clearInterval(timeInterval);
            };
        }
    }, [status, show]);

    // Calculate estimated time
    useEffect(() => {
        if (progress > 0 && elapsedTime > 0) {
            const rate = progress / elapsedTime; // percentage per second
            const remaining = (100 - progress) / rate; // seconds remaining
            setEstimatedTime(Math.max(1, Math.round(remaining)));
        }
    }, [progress, elapsedTime]);

    const handleStartProcessing = () => {
        setStatus('processing');
    };

    const handleComplete = () => {
        setStatus('completed');
        setProgress(100);
        setIsCompleted(true);
    };

    const handleFail = () => {
        setStatus('failed');
    };

    const handleDownload = () => {
        if (onDownload) {
            onDownload();
        }
        onClose();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        onClose();
    };

    return (
        <Modal show={show} onClose={onClose} maxWidth="md">
            <div className="p-6">
                <ExportProgressIndicator
                    jobId={jobId}
                    type={type}
                    progress={progress}
                    status={status}
                    estimatedTime={estimatedTime}
                    elapsedTime={elapsedTime}
                    onStartProcessing={handleStartProcessing}
                    onComplete={handleComplete}
                    onFail={handleFail}
                    onDownload={handleDownload}
                    onCancel={handleCancel}
                    isCompleted={isCompleted}
                />
                
                <div className="mt-4 flex justify-end space-x-2">
                    {status !== 'completed' && status !== 'failed' && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Cancelar
                        </button>
                    )}
                    
                    {status === 'completed' && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Fechar
                        </button>
                    )}
                    
                    {status === 'failed' && (
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Fechar
                        </button>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ExportProgressModal;