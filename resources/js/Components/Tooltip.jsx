import React, { useState } from 'react';

const Tooltip = ({ children, content, position = 'top', className = '' }) => {
    const [isVisible, setIsVisible] = useState(false);

    const positionClasses = {
        top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
    };

    const tooltipClasses = `
        absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-sm
        ${positionClasses[position]}
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        transition-opacity duration-200 ease-in-out
    `;

    return (
        <div 
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            {children}
            <div className={tooltipClasses} role="tooltip">
                <div className="relative">
                    {content}
                    <div 
                        className={`
                            absolute w-2 h-2 bg-gray-900 transform rotate-45
                            ${position === 'top' ? 'top-full left-1/2 -translate-x-1/2 -mt-1' : ''}
                            ${position === 'bottom' ? 'bottom-full left-1/2 -translate-x-1/2 -mb-1' : ''}
                            ${position === 'left' ? 'left-full top-1/2 -translate-y-1/2 -ml-1' : ''}
                            ${position === 'right' ? 'right-full top-1/2 -translate-y-1/2 -mr-1' : ''}
                        `}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default Tooltip;