import { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

const usePagination = (initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [loadingPage, setLoadingPage] = useState(null);
    const [estimatedTime, setEstimatedTime] = useState(null);

    // Calculate estimated time based on data size
    const calculateEstimatedTime = (totalItems) => {
        // Rough estimation: 0.01 seconds per item
        const time = Math.round((totalItems * 0.01) * 100) / 100;
        return Math.max(0.5, time); // Minimum 0.5 seconds
    };

    const fetchPage = (url, page = null) => {
        if (!url) return;

        setLoading(true);
        setLoadingPage(page);

        // Calculate estimated time if we have data
        if (data && data.total) {
            const estimated = calculateEstimatedTime(data.total);
            setEstimatedTime(estimated);
        }

        router.visit(url, {
            preserveState: true,
            preserveScroll: true,
            onSuccess: (page) => {
                setData(page.props);
                setLoading(false);
                setLoadingPage(null);
                setEstimatedTime(null);
            },
            onError: () => {
                setLoading(false);
                setLoadingPage(null);
                setEstimatedTime(null);
            }
        });
    };

    const goToPage = (url) => {
        fetchPage(url);
    };

    const nextPage = (paginationData) => {
        if (paginationData && paginationData.next_page_url) {
            fetchPage(paginationData.next_page_url, 'next');
        }
    };

    const previousPage = (paginationData) => {
        if (paginationData && paginationData.prev_page_url) {
            fetchPage(paginationData.prev_page_url, 'previous');
        }
    };

    return {
        data,
        loading,
        loadingPage,
        estimatedTime,
        goToPage,
        nextPage,
        previousPage,
        setData
    };
};

export default usePagination;