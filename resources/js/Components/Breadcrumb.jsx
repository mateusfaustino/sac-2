import { Link } from '@inertiajs/react';

export default function Breadcrumb({ breadcrumbs }) {
    if (!breadcrumbs || breadcrumbs.length === 0) {
        return null;
    }

    return (
        <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-2 rounded-lg">
                {breadcrumbs.map((breadcrumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    
                    return (
                        <li key={index} className="inline-flex items-center">
                            {index > 0 && (
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            )}
                            
                            {isLast ? (
                                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                                    {breadcrumb.label}
                                </span>
                            ) : (
                                <Link 
                                    href={breadcrumb.href} 
                                    className="ml-1 text-sm font-medium text-blue-600 hover:text-blue-800 md:ml-2"
                                >
                                    {breadcrumb.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}