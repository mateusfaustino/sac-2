export default function SkeletonLoader({ type = 'table', rows = 5 }) {
    if (type === 'table') {
        return (
            <div className="animate-pulse">
                <div className="overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6 bg-white">
                        {/* Filter Section Skeleton */}
                        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i}>
                                        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                        <div className="h-10 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                                <div className="md:col-span-2 lg:col-span-3">
                                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                                    <div className="flex space-x-2">
                                        <div className="h-10 bg-gray-200 rounded flex-grow"></div>
                                        <div className="h-10 bg-gray-200 rounded w-24"></div>
                                        <div className="h-10 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons Skeleton */}
                        <div className="flex justify-between items-center mb-6">
                            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                            <div className="flex space-x-2">
                                <div className="h-10 bg-gray-200 rounded w-48"></div>
                                <div className="h-10 bg-gray-200 rounded w-40"></div>
                                <div className="h-10 bg-gray-200 rounded w-32"></div>
                            </div>
                        </div>

                        {/* Table Skeleton */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {[...Array(6)].map((_, i) => (
                                            <th key={i} className="px-6 py-3 text-left">
                                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {[...Array(rows)].map((_, rowIndex) => (
                                        <tr key={rowIndex} className="hover:bg-gray-50">
                                            {[...Array(6)].map((_, colIndex) => (
                                                <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                                                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Skeleton */}
                        <div className="mt-6 flex items-center justify-between">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="flex space-x-2">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-10 bg-gray-200 rounded w-24"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (type === 'card') {
        return (
            <div className="animate-pulse">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <div className="p-6">
                        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="space-y-4">
                            {[...Array(rows)].map((_, i) => (
                                <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
        </div>
    );
}