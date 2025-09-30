import React, { useState } from 'react';

const CollapsibleFilterPanel = ({ title = 'Filtros', children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="mb-6 border border-gray-200 rounded-lg bg-white shadow-sm">
            <div 
                className="flex justify-between items-center p-3 bg-gray-50 rounded-t-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200"
                onClick={() => setIsOpen(!isOpen)}
            >
                <h3 className="text-md font-medium text-gray-700">{title}</h3>
                <div className="flex items-center">
                    <span className="text-xs text-gray-500 mr-2 hidden sm:inline">Clique para {isOpen ? 'fechar' : 'abrir'}</span>
                    <svg 
                        className={`h-4 w-4 text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>
            
            {isOpen && (
                <div className="p-4">
                    {children}
                </div>
            )}
        </div>
    );
};

export default CollapsibleFilterPanel;