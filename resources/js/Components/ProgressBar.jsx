import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function ProgressBar() {
    const [progress, setProgress] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleStart = () => {
            setIsVisible(true);
            setProgress(0);
        };

        const handleProgress = (progress) => {
            setProgress(progress);
        };

        const handleFinish = () => {
            setProgress(100);
            setTimeout(() => setIsVisible(false), 300);
        };

        router.on('start', handleStart);
        router.on('progress', handleProgress);
        router.on('finish', handleFinish);

        // In Inertia.js v2, there's no off method, so we just return a cleanup function
        return () => {
            // Cleanup will happen automatically when component unmounts
        };
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-1 bg-blue-500 z-50 transition-all duration-300 ease-out">
            <div 
                className="h-full bg-blue-600 transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
}